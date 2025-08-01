const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Settings = require('../models/Settings');
const { sendOrderConfirmationEmail } = require('../utils/email');

// Create Razorpay order
const createRazorpayOrder = async (req, res) => {
  try {
    const { items, shippingAddress, couponCode } = req.body;
    const userId = req.user._id;

    // Get payment settings
    const settings = await Settings.getSettings();
    if (!settings.paymentMethods.razorpay.enabled) {
      return res.status(400).json({
        success: false,
        message: 'Razorpay payment is currently disabled',
      });
    }

    // Validate items and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product not found or unavailable: ${item.productId}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      const itemTotal = product.discountedPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || '',
        price: product.price,
        discountedPrice: product.discountedPrice,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    // Apply coupon if provided
    let couponDiscount = 0;
    if (couponCode) {
      const Coupon = require('../models/Coupon');
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      
      if (coupon && coupon.canUserUse(userId)) {
        couponDiscount = coupon.calculateDiscount(subtotal);
      }
    }

    // Calculate shipping fee
    const shippingFee = subtotal >= settings.shipping.freeShippingThreshold ? 0 : settings.shipping.standardShippingFee;

    // Calculate tax
    let tax = 0;
    if (settings.tax.enabled) {
      const taxableAmount = settings.tax.inclusive ? subtotal : (subtotal - couponDiscount + shippingFee);
      tax = (taxableAmount * settings.tax.rate) / 100;
    }

    const total = subtotal - couponDiscount + shippingFee + tax;

    // Create Razorpay instance
    const razorpay = new Razorpay({
      key_id: settings.paymentMethods.razorpay.keyId,
      key_secret: settings.paymentMethods.razorpay.keySecret,
    });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // Amount in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
    });

    // Create order in database
    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress,
      paymentMethod: 'razorpay',
      paymentDetails: {
        razorpayOrderId: razorpayOrder.id,
      },
      subtotal,
      couponCode: couponCode || '',
      couponDiscount,
      shippingFee,
      tax,
      total,
    });

    res.json({
      success: true,
      data: {
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: settings.paymentMethods.razorpay.keyId,
      },
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message,
    });
  }
};

// Verify Razorpay payment
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Get payment settings
    const settings = await Settings.getSettings();
    
    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', settings.paymentMethods.razorpay.keySecret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    // Find and update order
    const order = await Order.findById(orderId).populate('user');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Update order with payment details
    order.paymentDetails.razorpayPaymentId = razorpay_payment_id;
    order.paymentDetails.razorpaySignature = razorpay_signature;
    order.paymentStatus = 'completed';
    order.orderStatus = 'confirmed';
    await order.save();

    // Update product stock and sold count
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.quantity,
          soldCount: item.quantity,
        },
      });
    }

    // Update coupon usage if used
    if (order.couponCode) {
      const Coupon = require('../models/Coupon');
      const coupon = await Coupon.findOne({ code: order.couponCode });
      if (coupon) {
        coupon.usedCount += 1;
        
        // Update user usage
        const userUsage = coupon.usedBy.find(usage => usage.user.toString() === order.user._id.toString());
        if (userUsage) {
          userUsage.usedCount += 1;
          userUsage.lastUsed = new Date();
        } else {
          coupon.usedBy.push({
            user: order.user._id,
            usedCount: 1,
          });
        }
        
        await coupon.save();
      }
    }

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(order.user, order);
    } catch (emailError) {
      console.error('Order confirmation email failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
      },
    });
  } catch (error) {
    console.error('Verify Razorpay payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
};

// Handle payment failure
const handlePaymentFailure = async (req, res) => {
  try {
    const { orderId, error } = req.body;

    const order = await Order.findById(orderId);
    if (order) {
      order.paymentStatus = 'failed';
      order.orderStatus = 'cancelled';
      order.notes = `Payment failed: ${error?.description || 'Unknown error'}`;
      await order.save();
    }

    res.json({
      success: true,
      message: 'Payment failure recorded',
    });
  } catch (error) {
    console.error('Handle payment failure error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to handle payment failure',
      error: error.message,
    });
  }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        total: order.total,
      },
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status',
      error: error.message,
    });
  }
};

// Webhook handler for Razorpay events
const handleWebhook = async (req, res) => {
  try {
    const { event, payload } = req.body;

    switch (event) {
      case 'payment.captured':
        // Handle successful payment
        const paymentId = payload.payment.entity.id;
        const orderId = payload.payment.entity.order_id;
        
        const order = await Order.findOne({
          'paymentDetails.razorpayOrderId': orderId,
        });
        
        if (order && order.paymentStatus === 'pending') {
          order.paymentStatus = 'completed';
          order.orderStatus = 'confirmed';
          order.paymentDetails.razorpayPaymentId = paymentId;
          await order.save();
        }
        break;

      case 'payment.failed':
        // Handle failed payment
        const failedOrderId = payload.payment.entity.order_id;
        const failedOrder = await Order.findOne({
          'paymentDetails.razorpayOrderId': failedOrderId,
        });
        
        if (failedOrder) {
          failedOrder.paymentStatus = 'failed';
          failedOrder.orderStatus = 'cancelled';
          await failedOrder.save();
        }
        break;

      default:
        console.log('Unhandled webhook event:', event);
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message,
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handlePaymentFailure,
  getPaymentStatus,
  handleWebhook,
};