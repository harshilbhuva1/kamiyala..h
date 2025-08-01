const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  shortDescription: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  originalPrice: {
    type: Number,
    default: 0,
  },
  discount: {
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    amount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required'],
  },
  images: [{
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: '',
    },
  }],
  brand: {
    type: String,
    default: '',
  },
  model: {
    type: String,
    default: '',
  },
  specifications: [{
    key: String,
    value: String,
  }],
  features: [String],
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
  },
  weight: {
    type: Number,
    default: 0,
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  colors: [String],
  sizes: [String],
  tags: [String],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isOnSale: {
    type: Boolean,
    default: false,
  },
  saleStartDate: Date,
  saleEndDate: Date,
  viewCount: {
    type: Number,
    default: 0,
  },
  soldCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Calculate discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (!this.discount.isActive) return this.price;
  
  if (this.discount.percentage > 0) {
    return this.price - (this.price * this.discount.percentage / 100);
  }
  
  if (this.discount.amount > 0) {
    return Math.max(0, this.price - this.discount.amount);
  }
  
  return this.price;
});

// Update original price when price changes
productSchema.pre('save', function(next) {
  if (this.isModified('price') && !this.originalPrice) {
    this.originalPrice = this.price;
  }
  next();
});

// Index for search and filtering
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);