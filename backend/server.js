const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const i18n = require("./middleware/i18nConfig");

const authRoutes = require("./routes/auth");
const fieldRoutes = require("./routes/field");
const weatherRoutes = require("./routes/weather"); // ADD THIS
const voiceAssistantRoutes = require("./routes/voiceAssistant");

const analyticsRoutes = require("./routes/analytics");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(i18n.init);

// Language middleware - extract language from header or body
app.use((req, res, next) => {
  const language =
    req.headers["accept-language"] ||
    req.query.lang ||
    req.body.language ||
    "en";
  i18n.setLocale(req, language);
  next();
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI) // ✅ FIXED: Added .env
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use('/api/voice-assistant', voiceAssistantRoutes);

// Example: Crop Analysis API with i18n
app.post("/api/crop-analysis", async (req, res) => {
  const { cropType, soilData, language } = req.body;

  if (language) {
    i18n.setLocale(req, language);
  }

  try {
    const analysis = {
      health: 85,
      riskLevel: "low",
      recommendations: [
        { type: "fertilizer", params: { amount: 50, type: "NPK" } },
        { type: "irrigation", params: { duration: 30, zone: "North" } },
      ],
    };

    res.json({
      success: true,
      message: i18n.__("analysis.complete"),
      data: {
        cropHealth: analysis.health,
        riskLevel: i18n.__(`risk.${analysis.riskLevel}`),
        recommendations: analysis.recommendations.map((rec) => ({
          type: rec.type,
          message: i18n.__(`recommendations.${rec.type}`, rec.params),
        })),
        voiceOutput: i18n.__("voice.analysisComplete", {
          cropType: i18n.__(`crops.${cropType}`),
        }),
      },
    });
  } catch (error) {
    console.error("Crop analysis error:", error);
    res.status(500).json({
      success: false,
      message: i18n.__("errors.analysisError"),
    });
  }
});

// Alerts API with i18n
app.post("/api/alerts", async (req, res) => {
  const { farmId, language } = req.body;

  if (language) {
    i18n.setLocale(req, language);
  }

  try {
    const alerts = [
      {
        id: "1",
        type: "pest",
        severity: "high",
        params: { pestName: "Aphids", sector: "A2" },
        timestamp: new Date(),
      },
      {
        id: "2",
        type: "water",
        severity: "medium",
        params: { zone: "South Field" },
        timestamp: new Date(),
      },
    ];

    const localizedAlerts = alerts.map((alert) => ({
      id: alert.id,
      severity: alert.severity,
      title: i18n.__(`alerts.${alert.type}.title`),
      message: i18n.__(`alerts.${alert.type}.message`, alert.params),
      voiceText: i18n.__(`alerts.${alert.type}.voice`, alert.params),
      timestamp: alert.timestamp,
    }));

    res.json({
      success: true,
      alerts: localizedAlerts,
    });
  } catch (error) {
    console.error("Alerts error:", error);
    res.status(500).json({
      success: false,
      message: i18n.__("errors.general"),
    });
  }
});

// AI Recommendations API with i18n
app.post("/api/ai-recommendations", async (req, res) => {
  const { fieldId, language } = req.body;

  if (language) {
    i18n.setLocale(req, language);
  }

  try {
    const recommendations = [
      {
        type: "fertilizer",
        priority: "high",
        params: { amount: 40, type: "Urea" },
      },
      {
        type: "pestControl",
        priority: "medium",
        params: { pesticide: "Neem Oil", pest: "Whitefly" },
      },
    ];

    const localizedRecommendations = recommendations.map((rec) => ({
      type: rec.type,
      priority: rec.priority,
      message: i18n.__(`recommendations.${rec.type}`, rec.params),
      voiceText: i18n.__(`voice.recommendation`, {
        message: i18n.__(`recommendations.${rec.type}`, rec.params),
      }),
    }));

    res.json({
      success: true,
      recommendations: localizedRecommendations,
    });
  } catch (error) {
    console.error("Recommendations error:", error);
    res.status(500).json({
      success: false,
      message: i18n.__("errors.general"),
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    language: i18n.getLocale(req),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
