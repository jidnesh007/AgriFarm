const express = require("express");
const router = express.Router();
const Field = require("../models/Field");
const axios = require("axios");
const authMiddleware = require("../middleware/auth");

const OPENWEATHER_API_KEY = "b3b947aac91597e2a3495b9abd69d40e";
const DRL_API_URL = "http://localhost:8000/recommend";

// Get all fields for user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const fields = await Field.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json({ fields });
  } catch (error) {
    console.error("Error fetching fields:", error);
    res.status(500).json({ message: "Error fetching fields" });
  }
});

// Get single field
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const field = await Field.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    res.json({ field });
  } catch (error) {
    console.error("Error fetching field:", error);
    res.status(500).json({ message: "Error fetching field" });
  }
});

// Create new field
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { fieldName, cropType, fieldArea, location, numberOfZones } =
      req.body;

    // Create zones
    const zones = [];
    for (let i = 1; i <= numberOfZones; i++) {
      zones.push({
        zoneName: `Zone ${i}`,
        soilMoisture: { value: 50, status: "Optimal" },
        soilNutrients: { nitrogen: 80, phosphorus: 50, potassium: 60 },
        soilPH: { value: 6.8 },
        cropHealth: { score: 75, status: "Healthy" },
      });
    }

    const field = new Field({
      userId: req.userId,
      fieldName,
      cropType,
      fieldArea: { value: fieldArea, unit: "hectares" },
      location,
      numberOfZones,
      zones,
      overallHealth: { status: "Healthy" },
    });

    await field.save();
    res.status(201).json({ field });
  } catch (error) {
    console.error("Error creating field:", error);
    res.status(500).json({ message: "Error creating field" });
  }
});

// Update soil data for a zone
router.put("/:fieldId/zone/:zoneId/soil", authMiddleware, async (req, res) => {
  try {
    const { fieldId, zoneId } = req.params;
    const { soilMoisture, nitrogen, phosphorus, potassium, soilPH } = req.body;

    const field = await Field.findOne({ _id: fieldId, userId: req.userId });

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    const zone = field.zones.id(zoneId);

    if (!zone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    // Update zone data
    zone.soilMoisture.value = soilMoisture;
    zone.soilMoisture.lastUpdated = new Date();
    zone.soilMoisture.status =
      soilMoisture < 40 ? "Dry" : soilMoisture > 70 ? "Wet" : "Optimal";

    zone.soilNutrients.nitrogen = nitrogen;
    zone.soilNutrients.phosphorus = phosphorus;
    zone.soilNutrients.potassium = potassium;
    zone.soilNutrients.lastUpdated = new Date();

    zone.soilPH.value = soilPH;
    zone.soilPH.lastUpdated = new Date();

    await field.save();

    res.json({ message: "Soil data updated successfully", zone });
  } catch (error) {
    console.error("Error updating soil data:", error);
    res.status(500).json({ message: "Error updating soil data" });
  }
});

// Generate AI DRL Recommendation for a zone
router.post(
  "/:fieldId/zone/:zoneId/ai-recommendation",
  authMiddleware,
  async (req, res) => {
    try {
      const { fieldId, zoneId } = req.params;

      const field = await Field.findOne({ _id: fieldId, userId: req.userId });

      if (!field) {
        return res.status(404).json({ message: "Field not found" });
      }

      const zone = field.zones.id(zoneId);

      if (!zone) {
        return res.status(404).json({ message: "Zone not found" });
      }

      // Check if we have soil data
      if (!zone.soilMoisture.lastUpdated) {
        return res.status(400).json({
          message:
            "Please update soil data first before getting AI recommendations",
        });
      }

      // Fetch weather data
      let temperature = 25;
      let humidity = 60;
      let rain_prob = 0.3;

      if (
        field.location.coordinates &&
        field.location.coordinates.latitude &&
        field.location.coordinates.longitude
      ) {
        try {
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${field.location.coordinates.latitude}&lon=${field.location.coordinates.longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
          );

          const weatherData = weatherResponse.data;
          temperature = weatherData.main.temp;
          humidity = weatherData.main.humidity;
          rain_prob = weatherData.clouds ? weatherData.clouds.all / 100 : 0.2;

          // Check for rain in response
          if (weatherData.rain) {
            rain_prob = 0.8;
          }
        } catch (error) {
          console.log("Using default weather values");
        }
      }

      // Prepare data for DRL model
      const drlInput = {
        moisture: zone.soilMoisture.value,
        nitrogen: zone.soilNutrients.nitrogen,
        phosphorus: zone.soilNutrients.phosphorus,
        potassium: zone.soilNutrients.potassium,
        ph: zone.soilPH.value,
        growth: 0.5, // Default growth stage
        temp: temperature,
        humidity: humidity,
        rain_prob: rain_prob,
      };

      // Call Python DRL API
      let aiRecommendation;
      try {
        const drlResponse = await axios.post(DRL_API_URL, drlInput, {
          timeout: 10000,
        });
        aiRecommendation = drlResponse.data;
      } catch (error) {
        console.error("DRL API error:", error.message);
        return res.status(503).json({
          message:
            "AI service unavailable. Please make sure the Python server is running on port 8000.",
          error: error.message,
        });
      }

      // Generate explanation
      let explanation = "";

      if (zone.soilMoisture.value < 40) {
        explanation += `Soil moisture is low at ${zone.soilMoisture.value}%. `;
      } else if (zone.soilMoisture.value > 70) {
        explanation += `Soil moisture is high at ${zone.soilMoisture.value}%. `;
      } else {
        explanation += `Soil moisture is optimal at ${zone.soilMoisture.value}%. `;
      }

      if (zone.soilNutrients.nitrogen < 50) {
        explanation += `Nitrogen levels are low (${zone.soilNutrients.nitrogen} ppm). `;
      }

      if (rain_prob > 0.6) {
        explanation += `High rain probability (${(rain_prob * 100).toFixed(
          0
        )}%), irrigation reduced. `;
      }

      if (temperature > 35) {
        explanation += `High temperature (${temperature}°C) increases water requirements. `;
      }

      explanation += `The AI model recommends ${aiRecommendation.irrigation_mm}mm of water and ${aiRecommendation.fertilizer_kg}kg/acre of fertilizer for optimal crop health.`;

      // Store AI recommendation in zone
      zone.recommendations = {
        irrigation: {
          amount: aiRecommendation.irrigation_mm,
          unit: "mm",
          timing:
            aiRecommendation.irrigation_mm > 0
              ? "Within 24-48 hours"
              : "Not needed",
          confidence: 90,
        },
        fertilizer: {
          amount: aiRecommendation.fertilizer_kg,
          unit: "kg/acre",
          type:
            aiRecommendation.fertilizer_kg > 0 ? "NPK Balanced" : "Not needed",
          timing:
            aiRecommendation.fertilizer_kg > 0 ? "Within 1 week" : "Not needed",
          confidence: 90,
        },
        explanation: explanation.trim(),
        weatherInfluence: `Temp: ${temperature.toFixed(
          1
        )}°C, Humidity: ${humidity}%, Rain: ${(rain_prob * 100).toFixed(0)}%`,
        lastGenerated: new Date(),
        aiGenerated: true,
        healthScore: aiRecommendation.health,
      };

      await field.save();

      res.json({
        message: "AI recommendation generated successfully",
        recommendation: {
          irrigation_mm: aiRecommendation.irrigation_mm,
          fertilizer_kg: aiRecommendation.fertilizer_kg,
          health_score: aiRecommendation.health,
          explanation: explanation.trim(),
          weatherData: {
            temperature,
            humidity,
            rain_probability: rain_prob,
          },
        },
      });
    } catch (error) {
      console.error("Error generating AI recommendation:", error);
      res.status(500).json({ message: "Error generating AI recommendation" });
    }
  }
);

module.exports = router;
