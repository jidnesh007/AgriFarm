const express = require("express");
const router = express.Router();
const Field = require("../models/Field");
const axios = require("axios");
const authMiddleware = require("../middleware/auth");

const OPENWEATHER_API_KEY = "";

// Get all fields for a user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const fields = await Field.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select("-zones.recommendations.explanation");

    res.json({ fields });
  } catch (error) {
    console.error("Error fetching fields:", error);
    res.status(500).json({ message: "Error fetching fields" });
  }
});

// Get single field with all details
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
    res.status(500).json({ message: "Error fetching field details" });
  }
});

// Create new field
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { fieldName, cropType, fieldArea, location, numberOfZones } =
      req.body;

    // Validation
    if (!fieldName || !cropType || !fieldArea || !numberOfZones) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (numberOfZones < 1 || numberOfZones > 20) {
      return res
        .status(400)
        .json({ message: "Number of zones must be between 1 and 20" });
    }

    // Generate zones automatically
    const zones = [];
    const zoneLabels = "ABCDEFGHIJKLMNOPQRST";

    for (let i = 0; i < numberOfZones; i++) {
      zones.push({
        zoneName: `Zone ${zoneLabels[i]}`,
        soilMoisture: {
          value: 0,
          status: "Optimal",
          lastUpdated: null,
        },
        soilNutrients: {
          nitrogen: 0,
          phosphorus: 0,
          potassium: 0,
          lastUpdated: null,
        },
        soilPH: {
          value: 7.0,
          lastUpdated: null,
        },
        cropHealth: {
          score: 75,
          status: "Healthy",
          lastUpdated: null,
        },
      });
    }

    const newField = new Field({
      userId: req.userId,
      fieldName,
      cropType,
      fieldArea: {
        value: fieldArea,
        unit: "hectares",
      },
      location,
      numberOfZones,
      zones,
    });

    await newField.save();

    res.status(201).json({
      message: "Field created successfully",
      field: newField,
    });
  } catch (error) {
    console.error("Error creating field:", error);
    res.status(500).json({ message: "Error creating field" });
  }
});

// Update zone soil data
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

    const now = new Date();

    // Update soil moisture
    if (soilMoisture !== undefined) {
      zone.soilMoisture.value = soilMoisture;
      zone.soilMoisture.status =
        soilMoisture < 20 ? "Dry" : soilMoisture > 60 ? "Wet" : "Optimal";
      zone.soilMoisture.lastUpdated = now;
    }

    // Update nutrients
    if (
      nitrogen !== undefined ||
      phosphorus !== undefined ||
      potassium !== undefined
    ) {
      if (nitrogen !== undefined) zone.soilNutrients.nitrogen = nitrogen;
      if (phosphorus !== undefined) zone.soilNutrients.phosphorus = phosphorus;
      if (potassium !== undefined) zone.soilNutrients.potassium = potassium;
      zone.soilNutrients.lastUpdated = now;
    }

    // Update pH
    if (soilPH !== undefined) {
      zone.soilPH.value = soilPH;
      zone.soilPH.lastUpdated = now;
    }

    // Calculate crop health based on soil conditions
    let healthScore = 100;
    if (zone.soilMoisture.status === "Dry") healthScore -= 20;
    if (zone.soilMoisture.status === "Wet") healthScore -= 10;
    if (zone.soilPH.value < 5.5 || zone.soilPH.value > 8.5) healthScore -= 15;
    if (zone.soilNutrients.nitrogen < 30) healthScore -= 10;

    zone.cropHealth.score = Math.max(0, healthScore);
    zone.cropHealth.status =
      healthScore >= 75 ? "Healthy" : healthScore >= 50 ? "Stress" : "Critical";
    zone.cropHealth.lastUpdated = now;

    await field.save();

    res.json({
      message: "Soil data updated successfully",
      zone,
    });
  } catch (error) {
    console.error("Error updating soil data:", error);
    res.status(500).json({ message: "Error updating soil data" });
  }
});

// Get weather and generate recommendations
router.post(
  "/:fieldId/zone/:zoneId/recommendations",
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

      // Fetch weather data
      let weatherData = null;
      let weatherInfluence = "";

      if (
        field.location.coordinates.latitude &&
        field.location.coordinates.longitude
      ) {
        try {
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${field.location.coordinates.latitude}&lon=${field.location.coordinates.longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
          );

          weatherData = weatherResponse.data;

          // Update field weather summary
          field.weatherSummary = {
            temperature: weatherData.main.temp,
            humidity: weatherData.main.humidity,
            rainfall: weatherData.rain ? "Rain expected" : "No rain expected",
            stressRisk:
              weatherData.main.temp > 35
                ? "Heat stress risk"
                : weatherData.main.temp < 10
                ? "Cold stress risk"
                : "No stress risk",
            lastUpdated: new Date(),
          };

          // Build weather influence text
          if (weatherData.rain) {
            weatherInfluence = "Rain is expected, reducing irrigation needs. ";
          } else {
            weatherInfluence =
              "No rain expected, regular irrigation recommended. ";
          }

          if (weatherData.main.temp > 35) {
            weatherInfluence +=
              "High temperatures increase water requirements.";
          } else if (weatherData.main.temp < 10) {
            weatherInfluence += "Cold weather may slow crop growth.";
          }
        } catch (error) {
          console.error("Weather API error:", error.message);
          weatherInfluence = "Weather data unavailable";
        }
      }

      // Generate recommendations based on soil data and weather
      const soilMoisture = zone.soilMoisture.value;
      const nitrogen = zone.soilNutrients.nitrogen;
      const cropType = field.cropType;

      // Irrigation recommendation
      let irrigationAmount = 0;
      let irrigationTiming = "";
      let irrigationConfidence = 0;

      if (soilMoisture < 20) {
        irrigationAmount = 25;
        irrigationTiming = "Urgent - Within 24 hours";
        irrigationConfidence = 95;
      } else if (soilMoisture < 40) {
        irrigationAmount = 15;
        irrigationTiming = "Within 2-3 days";
        irrigationConfidence = 85;
      } else if (soilMoisture < 60) {
        irrigationAmount = 5;
        irrigationTiming = "Monitor - not urgent";
        irrigationConfidence = 70;
      } else {
        irrigationAmount = 0;
        irrigationTiming = "Not needed";
        irrigationConfidence = 90;
      }

      // Adjust for rain
      if (weatherData?.rain) {
        irrigationAmount = Math.max(0, irrigationAmount - 10);
        irrigationConfidence -= 10;
      }

      // Fertilizer recommendation
      let fertilizerAmount = 0;
      let fertilizerType = "";
      let fertilizerTiming = "";
      let fertilizerConfidence = 0;

      if (nitrogen < 30) {
        fertilizerAmount = 50;
        fertilizerType = "Nitrogen-rich (Urea)";
        fertilizerTiming = "Within 1 week";
        fertilizerConfidence = 90;
      } else if (nitrogen < 50) {
        fertilizerAmount = 30;
        fertilizerType = "Balanced NPK";
        fertilizerTiming = "Within 2 weeks";
        fertilizerConfidence = 80;
      } else {
        fertilizerAmount = 0;
        fertilizerType = "Not needed";
        fertilizerTiming = "Monitor levels";
        fertilizerConfidence = 85;
      }

      // Generate explanation
      let explanation = `For ${cropType} in ${zone.zoneName}: `;

      if (soilMoisture < 40) {
        explanation += `Soil moisture is ${soilMoisture}%, which is below optimal levels. `;
      } else {
        explanation += `Soil moisture is adequate at ${soilMoisture}%. `;
      }

      if (nitrogen < 40) {
        explanation += `Nitrogen levels are low (${nitrogen} ppm), fertilization recommended. `;
      }

      explanation += weatherInfluence;

      // Save recommendations
      zone.recommendations = {
        irrigation: {
          amount: irrigationAmount,
          unit: "mm",
          timing: irrigationTiming,
          confidence: irrigationConfidence,
        },
        fertilizer: {
          amount: fertilizerAmount,
          unit: "kg/ha",
          type: fertilizerType,
          timing: fertilizerTiming,
          confidence: fertilizerConfidence,
        },
        explanation,
        weatherInfluence,
        lastGenerated: new Date(),
      };

      await field.save();

      res.json({
        message: "Recommendations generated successfully",
        recommendations: zone.recommendations,
        weatherSummary: field.weatherSummary,
      });
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ message: "Error generating recommendations" });
    }
  }
);

// Delete field
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const field = await Field.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    res.json({ message: "Field deleted successfully" });
  } catch (error) {
    console.error("Error deleting field:", error);
    res.status(500).json({ message: "Error deleting field" });
  }
});

module.exports = router;
