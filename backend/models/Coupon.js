const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
    default: 'percentage',
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative'],
  },
  minimumOrderAmount: {
    type: Number,
    default: 0,
    min: [0, 'Minimum order amount cannot be negative'],
  },
  maximumDiscountAmount: {
    type: Number,
    default: 0,
    min: [0, 'Maximum discount amount cannot be negative'],
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  usageLimit: {
    type: Number,
    default: 0, // 0 means unlimited
    min: [0, 'Usage limit cannot be negative'],
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  userUsageLimit: {
    type: Number,
    default: 1, // How many times a single user can use this coupon
    min: [1, 'User usage limit must be at least 1'],
  },
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }],
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  excludedCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }],
  excludedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    usedCount: {
      type: Number,
      default: 1,
    },
    lastUsed: {
      type: Date,
      default: Date.now,
    },
  }],
}, { timestamps: true });

// Check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  
  // Check if coupon is active
  if (!this.isActive) return false;
  
  // Check date validity
  if (now < this.startDate || now > this.endDate) return false;
  
  // Check usage limit
  if (this.usageLimit > 0 && this.usedCount >= this.usageLimit) return false;
  
  return true;
};

// Check if user can use this coupon
couponSchema.methods.canUserUse = function(userId) {
  if (!this.isValid()) return false;
  
  const userUsage = this.usedBy.find(usage => usage.user.toString() === userId.toString());
  
  if (userUsage && userUsage.usedCount >= this.userUsageLimit) {
    return false;
  }
  
  return true;
};

// Calculate discount amount
couponSchema.methods.calculateDiscount = function(orderAmount) {
  if (!this.isValid()) return 0;
  
  // Check minimum order amount
  if (orderAmount < this.minimumOrderAmount) return 0;
  
  let discount = 0;
  
  if (this.discountType === 'percentage') {
    discount = (orderAmount * this.discountValue) / 100;
    
    // Apply maximum discount limit if set
    if (this.maximumDiscountAmount > 0 && discount > this.maximumDiscountAmount) {
      discount = this.maximumDiscountAmount;
    }
  } else if (this.discountType === 'fixed') {
    discount = this.discountValue;
    
    // Discount cannot exceed order amount
    if (discount > orderAmount) {
      discount = orderAmount;
    }
  }
  
  return Math.round(discount * 100) / 100; // Round to 2 decimal places
};

// Index for efficient queries
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Coupon', couponSchema);