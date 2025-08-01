const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Banner title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true,
    default: 'image',
  },
  media: {
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
  },
  mobileMedia: {
    url: {
      type: String,
      default: '',
    },
    publicId: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: '',
    },
  },
  link: {
    type: String,
    default: '',
  },
  linkText: {
    type: String,
    default: 'Learn More',
  },
  position: {
    type: String,
    enum: ['top', 'middle', 'bottom'],
    default: 'top',
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  showOnMobile: {
    type: Boolean,
    default: true,
  },
  showOnDesktop: {
    type: Boolean,
    default: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: null,
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Check if banner is currently active
bannerSchema.methods.isCurrentlyActive = function() {
  if (!this.isActive) return false;
  
  const now = new Date();
  if (now < this.startDate) return false;
  if (this.endDate && now > this.endDate) return false;
  
  return true;
};

// Index for efficient queries
bannerSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
bannerSchema.index({ position: 1, sortOrder: 1 });

module.exports = mongoose.model('Banner', bannerSchema);