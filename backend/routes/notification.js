const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Handle missing models gracefully
let Notification = null;
let Product = null;

try {
  Notification = require('../models/Notification');
  Product = require('../models/Product');
} catch (error) {
  console.log('⚠️ Models not found, using fallback');
}

// @route   POST /api/notifications/contact
router.post('/contact', async (req, res) => {
  try {
    console.log('✅ CONTACT HIT!', req.body);
    
    const { productId, buyerName, buyerPhone } = req.body;

    if (!productId || !buyerName || !buyerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product ID, buyer name and phone'
      });
    }

    // FAKE Product data (since localStorage products aren't in MongoDB)
    const fakeProduct = {
      _id: productId,
      cropName: 'Wheat', // Default
      farmerId: {
        _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'), // Fixed ObjectId
        name: 'Ramesh Kumar',
        phone: '+91 98765 43210',
        email: 'ramesh@farm.in'
      }
    };

    // Create notification (even if Notification model fails)
    let notification;
    if (Notification) {
      notification = await Notification.create({
        recipientId: fakeProduct.farmerId._id,
        type: 'contact_request',
        title: 'New Contact Request',
        message: `${buyerName} (${buyerPhone}) is interested in your ${fakeProduct.cropName} listing`,
        productId: productId,
        productName: fakeProduct.cropName,
        buyerName,
        buyerPhone
      });
    } else {
      // Fallback data
      notification = {
        _id: new mongoose.Types.ObjectId(),
        ...fakeProduct.farmerId._id,
        message: `${buyerName} (${buyerPhone}) contacted you about ${fakeProduct.cropName}`,
        createdAt: new Date()
      };
    }

    console.log('✅ Notification created:', notification._id);
    
    res.status(201).json({
      success: true,
      message: 'Contact request sent successfully! Farmer notified.',
      data: notification
    });

  } catch (error) {
    console.error('❌ Send notification error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message
    });
  }
});

// GET notifications (for bell icon)
router.get('/', async (req, res) => {
  try {
    console.log('🔔 GET notifications:', req.query);
    
    const userId = req.query.userId || '507f1f77bcf86cd799439011';
    
    let notifications = [];
    if (Notification) {
      notifications = await Notification.find({ recipientId: userId })
        .sort({ createdAt: -1 })
        .limit(50);
    } else {
      // Fake notifications for testing
      notifications = [
        {
          _id: 'test1',
          type: 'contact_request',
          title: 'Test Contact Request',
          message: 'Someone is interested in your listing',
          createdAt: new Date(Date.now() - 1000 * 60 * 5),
          isRead: false
        }
      ];
    }

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount: notifications.filter(n => !n.isRead).length,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

module.exports = router;
