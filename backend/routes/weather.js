const express = require("express");
const router = express.Router();
const Field = require("../models/Field");
const axios = require("axios");
const authMiddleware = require("../middleware/auth");

const OPENWEATHER_API_KEY = "b3b947aac91597e2a3495b9abd69d40e";

// Get comprehensive weather data for a field
router.get("/:fieldId", authMiddleware, async (req, res) => {
  try {
    const { fieldId } = req.params;

    // Fetch field data
    const field = await Field.findOne({
      _id: fieldId,
      userId: req.userId,
    });

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    // Build location query - prioritize village, then district, then coordinates
    let weatherUrl;
    let locationQuery;

    if (field.location.village && field.location.village.trim() !== "") {
      locationQuery = field.location.district 
        ? `${field.location.village},${field.location.district},IN`
        : `${field.location.village},IN`;
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        locationQuery
      )}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    } else if (field.location.district && field.location.district.trim() !== "") {
      locationQuery = `${field.location.district},IN`;
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        locationQuery
      )}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    } else if (
      field.location.coordinates?.latitude &&
      field.location.coordinates?.longitude
    ) {
      const { latitude, longitude } = field.location.coordinates;
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    } else {
      return res.status(400).json({
        message: "Please add village, district, or GPS coordinates to view weather data.",
      });
    }

    // Fetch current weather
    const currentWeatherResponse = await axios.get(weatherUrl);
    const currentWeather = currentWeatherResponse.data;

    // Extract coordinates from the response for forecast
    const latitude = currentWeather.coord.lat;
    const longitude = currentWeather.coord.lon;

    // Fetch forecast data using coordinates
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    const forecastData = forecastResponse.data;

    // Process current weather
    const current = {
      location: {
        name: currentWeather.name,
        village: field.location.village,
        district: field.location.district,
        country: currentWeather.sys.country,
        coordinates: { latitude, longitude },
      },
      weather: {
        main: currentWeather.weather[0].main,
        description: currentWeather.weather[0].description,
        temperature: currentWeather.main.temp,
        feelsLike: currentWeather.main.feels_like,
        humidity: currentWeather.main.humidity,
        pressure: currentWeather.main.pressure,
        windSpeed: currentWeather.wind.speed,
        cloudCover: currentWeather.clouds.all,
        visibility: (currentWeather.visibility / 1000).toFixed(1),
        rainStatus: currentWeather.weather[0].main.includes("Rain")
          ? "Raining"
          : "No Rain",
        rainfall: currentWeather.rain ? currentWeather.rain["1h"] || 0 : 0,
      },
    };

    // Process 24-48 hour forecast (next 16 readings = 48 hours)
    const hourlyForecast = forecastData.list.slice(0, 16).map((item) => {
      const date = new Date(item.dt * 1000);
      const hours = date.getHours();
      const day = date.getDate();

      return {
        time: `${day}/${hours}:00`,
        temperature: item.main.temp,
        weather: item.weather[0].main,
        description: item.weather[0].description,
        rainChance: Math.round(item.pop * 100),
        rainfall: item.rain ? item.rain["3h"] || 0 : 0,
      };
    });

    // Calculate forecast summary
    const temperatures = forecastData.list
      .slice(0, 16)
      .map((item) => item.main.temp);
    const rainChances = forecastData.list
      .slice(0, 16)
      .map((item) => item.pop * 100);
    const totalRainfall = forecastData.list
      .slice(0, 16)
      .reduce((sum, item) => sum + (item.rain?.["3h"] || 0), 0);

    const forecastSummary = {
      tempHigh: Math.round(Math.max(...temperatures)),
      tempLow: Math.round(Math.min(...temperatures)),
      maxRainChance: Math.round(Math.max(...rainChances)),
      totalRainfall: totalRainfall.toFixed(1),
    };

    // Generate alerts
    const alerts = [];
    if (forecastSummary.tempHigh > 35) {
      alerts.push("⚠️ Heatwave Alert: Temperatures may exceed 35°C");
    }
    if (forecastSummary.tempLow < 10) {
      alerts.push("❄️ Cold Alert: Temperatures may drop below 10°C");
    }
    if (forecastSummary.maxRainChance > 70) {
      alerts.push("🌧️ Heavy Rain Expected: High precipitation probability");
    }

    // Farm Impact Analysis
    const farmImpact = [];
    const temp = current.weather.temperature;
    const humidity = current.weather.humidity;
    const windSpeed = current.weather.windSpeed;
    const rainExpected = forecastSummary.maxRainChance > 50;

    if (rainExpected) {
      farmImpact.push({
        icon: "rain",
        type: "positive",
        message: `Rain expected (${forecastSummary.maxRainChance}% chance) → Reduce irrigation by 30-40%`,
      });
    }

    if (temp > 35) {
      farmImpact.push({
        icon: "temperature",
        type: "warning",
        message:
          "High temperature → Soil may dry faster. Monitor moisture closely and increase irrigation frequency.",
      });
    }

    if (windSpeed > 5) {
      farmImpact.push({
        icon: "wind",
        type: "warning",
        message: `Strong winds (${windSpeed.toFixed(
          1
        )} m/s) → Avoid fertilizer spraying. Risk of uneven distribution.`,
      });
    }

    if (humidity > 80) {
      farmImpact.push({
        icon: "humidity",
        type: "info",
        message:
          "High humidity (>80%) → Reduce irrigation frequency. Monitor for fungal diseases.",
      });
    } else if (humidity < 40) {
      farmImpact.push({
        icon: "humidity",
        type: "info",
        message:
          "Low humidity (<40%) → Increase irrigation slightly to compensate for faster evaporation.",
      });
    }

    if (temp > 25 && temp < 30 && !rainExpected && windSpeed < 5) {
      farmImpact.push({
        icon: "temperature",
        type: "positive",
        message: "Optimal conditions for fertilizer application and field work.",
      });
    }

    // Stress Indicators
    const stressIndicators = {
      heatStress: {
        level: temp > 35 ? "High" : temp > 30 ? "Medium" : "Low",
        message: `Current: ${Math.round(
          temp
        )}°C. Critical threshold: 35°C. ${
          temp > 35
            ? "Immediate action needed!"
            : temp > 30
            ? "Monitor closely."
            : "Safe levels."
        }`,
      },
      coldStress: {
        level: temp < 10 ? "High" : temp < 15 ? "Medium" : "Low",
        message: `Current: ${Math.round(
          temp
        )}°C. Critical threshold: <10°C. ${
          temp < 10
            ? "Protect sensitive crops!"
            : temp < 15
            ? "Monitor temperature."
            : "Safe levels."
        }`,
      },
      diseaseRisk: {
        level: humidity > 80 ? "High" : humidity > 65 ? "Medium" : "Low",
        message: `Humidity: ${humidity}%. High humidity (>80%) promotes fungal diseases. ${
          humidity > 80
            ? "Apply preventive measures!"
            : humidity > 65
            ? "Monitor crop health."
            : "Low risk."
        }`,
      },
    };

    // AI/DRL Recommendations
    const aiRecommendations = [];

    if (rainExpected) {
      const reduction = forecastSummary.maxRainChance > 70 ? 40 : 25;
      aiRecommendations.push(
        `🌧️ Irrigation schedule adjusted: Reduced by ${reduction}% due to expected rainfall (${forecastSummary.totalRainfall}mm) in next 48 hours.`
      );
    }

    if (windSpeed > 5) {
      aiRecommendations.push(
        `💨 Fertilizer application delayed: Wind speed (${windSpeed.toFixed(
          1
        )} m/s) above safe level (5 m/s). Reschedule for calmer conditions.`
      );
    }

    if (temp > 35) {
      aiRecommendations.push(
        `🌡️ Irrigation timing optimized: Scheduled for early morning (5-7 AM) and late evening (6-8 PM) to reduce evaporation losses by up to 30%.`
      );
    }

    if (temp > 30 && humidity < 50) {
      aiRecommendations.push(
        `💧 Water requirement increased by 15% due to high temperature and low humidity combination.`
      );
    }

    if (humidity > 80 && temp > 25) {
      aiRecommendations.push(
        `🦠 Disease monitoring activated: Weather conditions favor fungal growth. Consider preventive fungicide application.`
      );
    }

    // Prepare response
    const weatherResponse = {
      current,
      forecast: {
        hourly: hourlyForecast,
        summary: forecastSummary,
        alerts,
      },
      farmImpact,
      stressIndicators,
      aiRecommendations,
      lastUpdated: new Date(),
    };

    res.json(weatherResponse);
  } catch (error) {
    console.error("Weather API Error:", error.message);
    if (error.response) {
      if (error.response.status === 404) {
        return res.status(404).json({
          message: "Location not found. Please check village/district name or add GPS coordinates.",
        });
      }
      return res.status(error.response.status).json({
        message: "Weather API error",
        error: error.response.data.message,
      });
    }
    res.status(500).json({
      message: "Error fetching weather data",
      error: error.message,
    });
  }
});

module.exports = router;
