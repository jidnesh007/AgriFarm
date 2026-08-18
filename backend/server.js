const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const i18n = require("./middleware/i18nConfig");

const authRoutes = require("./routes/auth");
const fieldRoutes = require("./routes/field");
const weatherRoutes = require("./routes/weather");
const voiceAssistantRoutes = require("./routes/voiceAssistant");
const analyticsRoutes = require("./routes/analytics");
const marketplaceRoutes = require("./routes/marketplace");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(i18n.init);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  const language = req.headers["accept-language"] || req.query.lang || req.body.language || "en";
  i18n.setLocale(req, language);
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/farm")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// 🔥 NOTIFICATION MODEL
const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: String,
    default: '507f1f77bcf86cd799439011' // Fixed farmer ID for testing
  },
  type: { type: String, default: 'contact_request' },
  title: String,
  message: String,
  productId: String,
  productName: String,
  buyerName: String,
  buyerPhone: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

// 🔥 REAL NOTIFICATION ROUTES - SAVES TO MONGODB
app.post("/api/notifications/contact", async (req, res) => {
  try {
    console.log('✅ CONTACT HIT!', req.body);
    const { productId, buyerName, buyerPhone } = req.body;

    if (!productId || !buyerName || !buyerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product ID, buyer name and phone'
      });
    }

    // ✅ SAVE TO REAL DATABASE
    const notification = await Notification.create({
      recipientId: '507f1f77bcf86cd799439011', // Fixed farmer
      type: 'contact_request',
      title: '🔔 New Buyer Contact',
      message: `${buyerName} (${buyerPhone}) wants to buy your product`,
      productId,
      productName: 'Marketplace Listing',
      buyerName,
      buyerPhone,
      isRead: false
    });

    console.log('✅ SAVED NOTIFICATION:', notification._id);

    res.status(201).json({
      success: true,
      message: 'Contact request sent successfully! Farmer notified.',
      data: {
        notificationId: notification._id,
        productId,
        buyerName,
        buyerPhone
      }
    });
  } catch (error) {
    console.error('❌ Contact error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 🔥 GET REAL NOTIFICATIONS
app.get("/api/notifications", async (req, res) => {
  try {
    console.log('🔔 GET notifications:', req.query);

    const notifications = await Notification.find({
      recipientId: '507f1f77bcf86cd799439011'
    })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipientId: '507f1f77bcf86cd799439011',
      isRead: false
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications.map(n => ({
        id: n._id.toString(),
        type: n.type,
        title: n.title,
        message: n.message,
        time: n.createdAt.toLocaleDateString(),
        read: n.isRead
      }))
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

// 🔥 MARK SINGLE NOTIFICATION READ
app.put("/api/notifications/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, data: notification });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 🔥 MARK ALL READ
app.put("/api/notifications/mark-all-read", async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientId: '507f1f77bcf86cd799439011', isRead: false },
      { isRead: true }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Other routes
app.use("/api/auth", authRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/voice-assistant", voiceAssistantRoutes);
app.use("/api/marketplace", marketplaceRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running ✅",
    notifications: "Real MongoDB storage ACTIVE!"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Test notifications: http://localhost:${PORT}/api/notifications`);
  console.log(`🔔 MongoDB Notifications: ACTIVE`);
});
