import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Cloud,
  Droplets,
  Wind,
  Thermometer,
  CloudRain,
  AlertTriangle,
  RefreshCw,
  Sun,
  CloudDrizzle,
  Sprout,
  Target,
  TrendingUp,
  Clock,
  MapPin,
  Eye,
  Gauge,
} from "lucide-react";

const Weather = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchFields();
  }, []);

  useEffect(() => {
    if (selectedField?._id) {
      fetchWeatherData();
    }
  }, [selectedField]);

  const fetchFields = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/fields", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFields(response.data.fields);
      if (response.data.fields.length > 0) {
        setSelectedField(response.data.fields[0]);
      }
    } catch (error) {
      console.error("Error fetching fields:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherData = async () => {
    if (!selectedField?._id) return;

    setRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/weather/${selectedField._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("Failed to fetch weather data. Please check field location information.");
    } finally {
      setRefreshing(false);
    }
  };

  const getWeatherIcon = (main) => {
    const iconMap = {
      Clear: <Sun className="w-12 h-12 text-yellow-400" />,
      Clouds: <Cloud className="w-12 h-12 text-gray-400" />,
      Rain: <CloudRain className="w-12 h-12 text-blue-500" />,
      Drizzle: <CloudDrizzle className="w-12 h-12 text-blue-400" />,
      Thunderstorm: <CloudRain className="w-12 h-12 text-purple-500" />,
      Snow: <Cloud className="w-12 h-12 text-blue-200" />,
    };
    return iconMap[main] || <Cloud className="w-12 h-12 text-gray-400" />;
  };

  const getRiskColor = (level) => {
    const colors = {
      Low: "bg-green-100 text-green-700 border-green-300",
      Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
      High: "bg-red-100 text-red-700 border-red-300",
    };
    return colors[level] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading weather data...</p>
        </div>
      </div>
    );
  }

  // Check if location info exists (village, district, or coordinates)
  const hasLocationInfo = 
    selectedField?.location?.village ||
    selectedField?.location?.district ||
    (selectedField?.location?.coordinates?.latitude && 
     selectedField?.location?.coordinates?.longitude);

  if (!hasLocationInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Cloud size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Location Data Available
            </h3>
            <p className="text-gray-600 mb-4">
              Please add village, district, or GPS coordinates to your field to view weather information
            </p>
            <button
              onClick={() => navigate("/fields")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              Go to Fields
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Cloud className="text-blue-600" size={32} />
                Weather Intelligence
              </h1>
              <p className="text-gray-600 mt-1">
                Real-time weather data and agricultural insights
              </p>
            </div>
            <button
              onClick={fetchWeatherData}
              disabled={refreshing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition"
            >
              <RefreshCw
                size={18}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Field Selector */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Select Field
          </label>
          <div className="flex gap-2 flex-wrap">
            {fields.map((field) => (
              <button
                key={field._id}
                onClick={() => setSelectedField(field)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedField?._id === field._id
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {field.fieldName}
              </button>
            ))}
          </div>
        </div>

        {weatherData ? (
          <>
            {/* Current Weather Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Main Weather Card */}
              <div className="lg:col-span-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg p-8 text-white">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      Current Weather
                    </h2>
                    <div className="flex items-center gap-2 text-blue-100">
                      <MapPin size={16} />
                      <p>
                        {weatherData.current.location.name}
                        {weatherData.current.location.village && `, ${weatherData.current.location.village}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-blue-100">
                    {getWeatherIcon(weatherData.current.weather.main)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-6xl font-bold mb-2">
                      {Math.round(weatherData.current.weather.temperature)}°C
                    </div>
                    <p className="text-xl text-blue-100 capitalize">
                      {weatherData.current.weather.description}
                    </p>
                    <p className="text-sm text-blue-200 mt-2">
                      Feels like{" "}
                      {Math.round(weatherData.current.weather.feelsLike)}°C
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Droplets size={20} />
                      <div>
                        <p className="text-sm text-blue-200">Humidity</p>
                        <p className="text-lg font-semibold">
                          {weatherData.current.weather.humidity}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Wind size={20} />
                      <div>
                        <p className="text-sm text-blue-200">Wind Speed</p>
                        <p className="text-lg font-semibold">
                          {weatherData.current.weather.windSpeed.toFixed(1)} m/s
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Cloud size={20} />
                      <div>
                        <p className="text-sm text-blue-200">Cloud Cover</p>
                        <p className="text-lg font-semibold">
                          {weatherData.current.weather.cloudCover}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Weather Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CloudRain className="text-blue-600" size={28} />
                  <h3 className="text-xl font-bold text-gray-800">
                    Additional Info
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Rain Status</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {weatherData.current.weather.rainStatus}
                    </p>
                  </div>

                  {weatherData.current.weather.rainfall > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Rainfall</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {weatherData.current.weather.rainfall} mm
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pressure</p>
                    <div className="flex items-center gap-2">
                      <Gauge size={18} className="text-gray-600" />
                      <p className="text-lg font-semibold text-gray-700">
                        {weatherData.current.weather.pressure} hPa
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Visibility</p>
                    <div className="flex items-center gap-2">
                      <Eye size={18} className="text-gray-600" />
                      <p className="text-lg font-semibold text-gray-700">
                        {weatherData.current.weather.visibility} km
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 24-Hour Forecast */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="text-green-600" size={24} />
                24-48 Hour Forecast
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
                {weatherData.forecast.hourly.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200"
                  >
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      {item.time}
                    </p>
                    <div className="flex flex-col items-center mb-2">
                      {getWeatherIcon(item.weather)}
                      <p className="text-2xl font-bold text-gray-800 mt-2">
                        {Math.round(item.temperature)}°
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 mb-1 text-center">
                      {item.description}
                    </p>
                    {item.rainChance > 30 && (
                      <div className="flex items-center justify-center gap-1 text-blue-600 mt-2">
                        <Droplets size={14} />
                        <p className="text-xs font-semibold">
                          {item.rainChance}%
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Forecast Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">
                    Temperature Range
                  </p>
                  <p className="text-xl font-bold text-orange-700">
                    {weatherData.forecast.summary.tempLow}° -{" "}
                    {weatherData.forecast.summary.tempHigh}°C
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Max Rain Chance</p>
                  <p className="text-xl font-bold text-blue-700">
                    {weatherData.forecast.summary.maxRainChance}%
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">
                    Expected Rainfall
                  </p>
                  <p className="text-xl font-bold text-green-700">
                    {weatherData.forecast.summary.totalRainfall} mm
                  </p>
                </div>
              </div>

              {/* Alerts */}
              {weatherData.forecast.alerts.length > 0 && (
                <div className="mt-4 space-y-2">
                  {weatherData.forecast.alerts.map((alert, index) => (
                    <div
                      key={index}
                      className="bg-red-50 border-l-4 border-red-500 p-4 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="text-red-600" size={20} />
                        <p className="font-semibold text-red-800">{alert}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Weather Impact on Decisions */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="text-purple-600" size={24} />
                Weather Impact on Farm Decisions
              </h2>

              <div className="space-y-3">
                {weatherData.farmImpact.map((impact, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-4 rounded-lg border ${
                      impact.type === "positive"
                        ? "bg-green-50 border-green-200"
                        : impact.type === "warning"
                        ? "bg-orange-50 border-orange-200"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div
                      className={`mt-0.5 ${
                        impact.type === "positive"
                          ? "text-green-600"
                          : impact.type === "warning"
                          ? "text-orange-600"
                          : "text-blue-600"
                      }`}
                    >
                      {impact.icon === "rain" && <CloudRain size={20} />}
                      {impact.icon === "temperature" && (
                        <Thermometer size={20} />
                      )}
                      {impact.icon === "wind" && <Wind size={20} />}
                      {impact.icon === "humidity" && <Droplets size={20} />}
                    </div>
                    <p className="text-gray-700 font-medium">{impact.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Crop Stress Indicators */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="text-red-600" size={24} />
                Crop Stress Indicators
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border-2 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-700">
                      Heat Stress
                    </h3>
                    <Thermometer className="text-red-500" size={24} />
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getRiskColor(
                      weatherData.stressIndicators.heatStress.level
                    )}`}
                  >
                    {weatherData.stressIndicators.heatStress.level} Risk
                  </span>
                  <p className="text-sm text-gray-600 mt-2">
                    {weatherData.stressIndicators.heatStress.message}
                  </p>
                </div>

                <div className="border-2 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-700">
                      Cold Stress
                    </h3>
                    <Cloud className="text-blue-500" size={24} />
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getRiskColor(
                      weatherData.stressIndicators.coldStress.level
                    )}`}
                  >
                    {weatherData.stressIndicators.coldStress.level} Risk
                  </span>
                  <p className="text-sm text-gray-600 mt-2">
                    {weatherData.stressIndicators.coldStress.message}
                  </p>
                </div>

                <div className="border-2 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-700">
                      Disease Risk
                    </h3>
                    <Droplets className="text-purple-500" size={24} />
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getRiskColor(
                      weatherData.stressIndicators.diseaseRisk.level
                    )}`}
                  >
                    {weatherData.stressIndicators.diseaseRisk.level} Risk
                  </span>
                  <p className="text-sm text-gray-600 mt-2">
                    {weatherData.stressIndicators.diseaseRisk.message}
                  </p>
                </div>
              </div>
            </div>

            {/* AI/DRL Optimization Summary */}
            {weatherData.aiRecommendations.length > 0 && (
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-6 mb-6 text-white">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp size={24} />
                  AI Optimization Summary
                </h2>

                <div className="space-y-3">
                  {weatherData.aiRecommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-white bg-opacity-20 rounded-lg p-4"
                    >
                      <Sprout className="flex-shrink-0 mt-0.5" size={20} />
                      <p className="text-green-50">{rec}</p>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-green-100 mt-4">
                  The system continuously monitors weather patterns and adjusts
                  recommendations to optimize crop health and resource usage.
                </p>
              </div>
            )}

            {/* Last Updated */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Last updated: {new Date(weatherData.lastUpdated).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Weather data updates every 10 minutes
              </p>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Cloud size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Loading Weather Data...
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch the latest weather information
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
