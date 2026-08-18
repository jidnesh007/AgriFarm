const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  cropName: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true
  },
  quantity: {
    value: {
      type: Number,
      required: [true, 'Quantity value is required'],
      min: [0, 'Quantity must be positive']
    },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'ton'],
      required: true,
      default: 'kg'
    }
  },
  price: {
    expected: {
      type: Number,
      required: [true, 'Expected price is required'],
      min: [0, 'Price must be positive']
    },
    final: {
      type: Number,
      default: null
    }
  },
  qualityGrade: {
    type: String,
    enum: ['A', 'B', 'C'],
    default: 'B'
  },
  images: [{
    type: String // Store image URLs/paths
  }],
  location: {
    village: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    }
  },
  deliveryOption: {
    type: String,
    enum: ['Pickup', 'Delivery', 'Both'],
    default: 'Pickup'
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'expired'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);