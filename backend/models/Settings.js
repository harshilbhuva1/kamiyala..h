const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  paymentMethods: {
    razorpay: {
      enabled: {
        type: Boolean,
        default: true,
      },
      keyId: {
        type: String,
        default: process.env.RAZORPAY_KEY_ID,
      },
      keySecret: {
        type: String,
        default: process.env.RAZORPAY_KEY_SECRET,
      },
    },
    whatsapp: {
      enabled: {
        type: Boolean,
        default: true,
      },
      number: {
        type: String,
        default: process.env.WHATSAPP_NUMBER,
      },
    },
    cod: {
      enabled: {
        type: Boolean,
        default: false,
      },
      minOrderAmount: {
        type: Number,
        default: 0,
      },
    },
  },
  globalDiscount: {
    enabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    value: {
      type: Number,
      default: 0,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    maxDiscountAmount: {
      type: Number,
      default: 0,
    },
    startDate: Date,
    endDate: Date,
    applicableCategories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    }],
    excludedCategories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    }],
  },
  shipping: {
    freeShippingThreshold: {
      type: Number,
      default: 500,
    },
    standardShippingFee: {
      type: Number,
      default: 50,
    },
    expressShippingFee: {
      type: Number,
      default: 100,
    },
    estimatedDeliveryDays: {
      type: Number,
      default: 7,
    },
  },
  tax: {
    enabled: {
      type: Boolean,
      default: false,
    },
    rate: {
      type: Number,
      default: 0,
    },
    inclusive: {
      type: Boolean,
      default: false,
    },
  },
  email: {
    enabled: {
      type: Boolean,
      default: true,
    },
    smtpHost: {
      type: String,
      default: 'smtp.gmail.com',
    },
    smtpPort: {
      type: Number,
      default: 587,
    },
    smtpUser: {
      type: String,
      default: process.env.EMAIL_USER,
    },
    smtpPass: {
      type: String,
      default: process.env.EMAIL_PASS,
    },
  },
  seo: {
    siteName: {
      type: String,
      default: 'Martok - Watch Store',
    },
    siteDescription: {
      type: String,
      default: 'Premium watches and accessories',
    },
    keywords: {
      type: String,
      default: 'watches, luxury watches, accessories',
    },
    logo: {
      type: String,
      default: '',
    },
    favicon: {
      type: String,
      default: '',
    },
  },
  maintenance: {
    enabled: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: 'We are currently under maintenance. Please check back later.',
    },
  },
}, { timestamps: true });

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);