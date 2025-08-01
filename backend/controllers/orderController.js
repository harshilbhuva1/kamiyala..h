const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Settings = require('../models/Settings');
const { sendOrderConfirmationEmail } = require('../utils/email');

// Create WhatsApp order
const createWhatsAppOrder = async (req, res) => {
  try {
    const { items, shippingAddress, couponCode } = req.body;
    const userId = req.user._id;

    // Get payment settings
    const settings = await Settings.getSettings();
    if (!settings.paymentMethods.whatsapp.enabled) {
      return res.status(400).json({
        success: false,
        message: 'WhatsApp order is currently disabled',
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

    // Create order in database
    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress,
      paymentMethod: 'whatsapp',
      paymentDetails: {
        whatsappOrderId: `WA_${Date.now()}`,
      },
      subtotal,
      couponCode: couponCode || '',
      couponDiscount,
      shippingFee,
      tax,
      total,
    });

    // Generate WhatsApp message
    const whatsappMessage = generateWhatsAppMessage(order, req.user);
    const whatsappUrl = `https://wa.me/${settings.paymentMethods.whatsapp.number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

    res.json({
      success: true,
      message: 'WhatsApp order created successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        whatsappUrl,
        total: order.total,
      },
    });
  } catch (error) {
    console.error('Create WhatsApp order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create WhatsApp order',
      error: error.message,
    });
  }
};

// Generate WhatsApp message
const generateWhatsAppMessage = (order, user) => {
  let message = `🛒 *New Order from Martok Store*\n\n`;
  message += `*Order Details:*\n`;
  message += `Order ID: ${order.orderNumber}\n`;
  message += `Customer: ${user.name}\n`;
  message += `Email: ${user.email}\n`;
  message += `Phone: ${user.phone || 'Not provided'}\n\n`;

  message += `*Products:*\n`;
  order.items.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `   Quantity: ${item.quantity}\n`;
    message += `   Price: ₹${item.discountedPrice} each\n`;
    message += `   Total: ₹${item.total}\n`;
    if (item.image) {
      message += `   Image: ${item.image}\n`;
    }
    message += `\n`;
  });

  message += `*Order Summary:*\n`;
  message += `Subtotal: ₹${order.subtotal}\n`;
  if (order.couponDiscount > 0) {
    message += `Coupon Discount: -₹${order.couponDiscount}\n`;
  }
  if (order.shippingFee > 0) {
    message += `Shipping: ₹${order.shippingFee}\n`;
  }
  if (order.tax > 0) {
    message += `Tax: ₹${order.tax}\n`;
  }
  message += `*Total: ₹${order.total}*\n\n`;

  message += `*Shipping Address:*\n`;
  message += `${order.shippingAddress.fullName}\n`;
  message += `${order.shippingAddress.address}\n`;
  message += `${order.shippingAddress.city}, ${order.shippingAddress.state}\n`;
  message += `${order.shippingAddress.pincode}, ${order.shippingAddress.country}\n\n`;

  message += `Please confirm this order and provide payment instructions.`;

  return message;
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build filter object
    const filter = { user: userId };

    if (status) {
      filter.orderStatus = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const orders = await Order.find(filter)
      .populate('items.product', 'name images')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalOrders: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit: Number(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images brand');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message,
    });
  }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentMethod,
      paymentStatus,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build filter object
    const filter = {};

    if (status) {
      filter.orderStatus = status;
    }

    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalOrders: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit: Number(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, trackingNumber, adminNotes } = req.body;

    const order = await Order.findById(id).populate('user');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Update order
    if (orderStatus) order.orderStatus = orderStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (adminNotes) order.adminNotes = adminNotes;

    // Set delivery date if status is delivered
    if (orderStatus === 'delivered' && !order.actualDelivery) {
      order.actualDelivery = new Date();
    }

    await order.save();

    // Send email notification for status changes
    // You can implement email notifications here

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order },
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage',
      });
    }

    // Update order status
    order.orderStatus = 'cancelled';
    order.notes = reason || 'Cancelled by user';
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: item.quantity,
          soldCount: -item.quantity,
        },
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message,
    });
  }
};

module.exports = {
  createWhatsAppOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};