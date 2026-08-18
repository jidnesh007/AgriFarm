const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['contact_request', 'order', 'message'],
    default: 'contact_request'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  productId: {
    type: String  // Changed from ObjectId to String to handle numeric IDs
  },
  productName: {
    type: String
  },
  buyerName: {
    type: String
  },
  buyerPhone: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;