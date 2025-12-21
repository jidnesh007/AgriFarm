// backend/routes/voiceAssistant.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
const Field = require("../models/Field");
const auth = require("../middleware/auth");

const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

// Helper: compute average zone data
const getAverageZoneData = (zones) => {
  if (!zones || zones.length === 0) {
    return {
      soilMoisture: null,
      soilPH: null,
      soilNitrogen: null,
      soilPhosphorus: null,
      soilPotassium: null,
      healthScore: null,
    };
  }

  const totals = zones.reduce(
    (acc, zone) => {
      return {
        moisture: acc.moisture + (zone.soilMoisture?.value || 0),
        ph: acc.ph + (zone.soilPH?.value || 0),
        nitrogen: acc.nitrogen + (zone.soilNutrients?.nitrogen || 0),
        phosphorus: acc.phosphorus + (zone.soilNutrients?.phosphorus || 0),
        potassium: acc.potassium + (zone.soilNutrients?.potassium || 0),
        health: acc.health + (zone.cropHealth?.score || 0),
        count: acc.count + 1,
      };
    },
    {
      moisture: 0,
      ph: 0,
      nitrogen: 0,
      phosphorus: 0,
      potassium: 0,
      health: 0,
      count: 0,
    }
  );

  return {
    soilMoisture:
      totals.count > 0 ? (totals.moisture / totals.count).toFixed(1) : null,
    soilPH: totals.count > 0 ? (totals.ph / totals.count).toFixed(2) : null,
    soilNitrogen:
      totals.count > 0 ? (totals.nitrogen / totals.count).toFixed(1) : null,
    soilPhosphorus:
      totals.count > 0 ? (totals.phosphorus / totals.count).toFixed(1) : null,
    soilPotassium:
      totals.count > 0 ? (totals.potassium / totals.count).toFixed(1) : null,
    healthScore:
      totals.count > 0 ? (totals.health / totals.count).toFixed(1) : null,
  };
};

// Helper: get last watering timing text from zones
const getLastWateredDate = (zones) => {
  if (!zones || zones.length === 0) return null;

  const lastWateredDates = zones
    .map((zone) => zone.recommendations?.irrigation?.timing)
    .filter((timing) => timing && timing !== "Not needed");

  if (lastWateredDates.length === 0) return null;
  return lastWateredDates[0];
};

// GET /api/voice-assistant/field-context/:fieldId
router.get("/field-context/:fieldId", auth, async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const field = await Field.findOne({
      _id: req.params.fieldId,
      userId: userId,
    });

    if (!field) {
      return res.status(404).json({
        success: false,
        message: "Field not found",
      });
    }

    const zoneData = getAverageZoneData(field.zones);

    const context = {
      fieldName: field.fieldName,
      cropType: field.cropType,
      area: `${field.fieldArea.value} ${field.fieldArea.unit}`,
      location: field.location?.district
        ? `${field.location.village || "Unknown"}, ${field.location.district}`
        : "Unknown location",

      // Soil / weather
      soilMoisture: zoneData.soilMoisture,
      soilPH: zoneData.soilPH,
      soilNitrogen: zoneData.soilNitrogen,
      soilPhosphorus: zoneData.soilPhosphorus,
      soilPotassium: zoneData.soilPotassium,
      temperature: field.weatherSummary?.temperature || null,
      humidity: field.weatherSummary?.humidity || null,
      rainfall: field.weatherSummary?.rainfall || null,

      // Irrigation
      lastWatered: getLastWateredDate(field.zones) || "Unknown",
      wateringSchedule:
        field.zones?.[0]?.recommendations?.irrigation?.timing || "Not set",

      // Health
      healthScore: zoneData.healthScore,
      healthStatus: field.overallHealth?.status || "Unknown",

      // AI recommendations per zone
      aiRecommendations:
        field.zones
          ?.map((zone, index) => {
            const rec = zone.recommendations;
            if (!rec) return null;

            const recommendations = [];

            if (rec.irrigation?.amount > 0) {
              recommendations.push(
                `Zone ${index + 1}: Water ${rec.irrigation.amount}${
                  rec.irrigation.unit
                } - ${rec.irrigation.timing}`
              );
            }

            if (rec.fertilizer?.amount > 0) {
              recommendations.push(
                `Zone ${index + 1}: Apply ${rec.fertilizer.amount}${
                  rec.fertilizer.unit
                } of ${rec.fertilizer.type}`
              );
            }

            return recommendations.length > 0
              ? recommendations.join(", ")
              : null;
          })
          .filter((rec) => rec !== null) || [],
    };

    console.log("Field context built successfully:", context);

    res.json({
      success: true,
      context,
    });
  } catch (error) {
    console.error("Error fetching field context:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// GET /api/voice-assistant/all-fields-summary
router.get("/all-fields-summary", auth, async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const fields = await Field.find({ userId: userId });

    const summary = {
      totalFields: fields.length,
      fields: fields.map((f) => {
        const zoneData = getAverageZoneData(f.zones);

        return {
          id: f._id,
          name: f.fieldName,
          crop: f.cropType,
          health: zoneData.healthScore || 0,
          soilMoisture: zoneData.soilMoisture || 0,
          needsWater: parseFloat(zoneData.soilMoisture || 0) < 40,
        };
      }),
    };

    res.json({ success: true, summary });
  } catch (error) {
    console.error("Error fetching fields summary:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// POST /api/voice-assistant/ask
router.post("/ask", auth, async (req, res) => {
  try {
    const { question, fieldContext, language } = req.body;

    console.log("Forwarding to FastAPI:", {
      question,
      language,
      hasContext: !!fieldContext,
    });

    const response = await axios.post(
      `${FASTAPI_URL}/voice-assistant/ask`,
      {
        question,
        fieldContext,
        language,
      },
      { timeout: 30000 }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error calling FastAPI:", error.message);

    if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
      return res.json({
        success: true,
        answer:
          "I'm having trouble connecting to my AI brain right now. Please make sure the Python FastAPI server is running on port 8000.",
        fieldUsed: fieldContext?.fieldName || "General",
        language: language || "English",
        timestamp: Date.now(),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to process voice question",
      error: error.message,
    });
  }
});

// POST /api/voice-assistant/analyze-field
router.post("/analyze-field", auth, async (req, res) => {
  try {
    const { fieldContext } = req.body;

    const response = await axios.post(
      `${FASTAPI_URL}/voice-assistant/analyze-field`,
      fieldContext,
      { timeout: 15000 }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error analyzing field:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to analyze field",
      error: error.message,
    });
  }
});

module.exports = router;
