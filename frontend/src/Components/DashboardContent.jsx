// src/components/DashboardContent.jsx - COMPLETE MOBILE RESPONSIVE CODE
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Sprout,
  MapPin,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Droplets,
  Leaf,
  Cloud,
  ThermometerSun,
  Target,
  Wind,
  Sun,
  CloudRain,
  AlertCircle,
  Activity,
  Gauge,
  Zap,
  Camera,
  FlaskConical,
  Clock,
  Bell,
  AlertTriangle,
  BarChart2,
  Eye,
  Lightbulb,
  ArrowDown,
  ArrowUp,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";

const DashboardContent = ({
  fields,
  selectedField,
  statistics,
  fetchFields,
  handleFieldClick,
  getHealthColor,
  getHealthBgColor,
  switchView,
  unreadCount: propUnreadCount,
  markAllRead: propMarkAllRead,
  markAsRead: propMarkAsRead,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");

  // ✅ FIX: Use local state for current field to prevent navigation
  const [currentField, setCurrentField] = useState(null);

  // Initialize current field
  useEffect(() => {
    if (selectedField) {
      setCurrentField(selectedField);
    } else if (fields && fields.length > 0) {
      setCurrentField(fields[0]);
    }
  }, [selectedField, fields]);

  // ✅ FIX: Handle field change without calling handleFieldClick
  const handleFieldChange = (fieldId) => {
    const field = fields.find((f) => f._id === fieldId);
    if (field) {
      setCurrentField(field);
      // Don't call handleFieldClick here - it causes navigation
    }
  };

  const field = currentField;

  // Get average zone data for selected field
  const getAverageZoneData = () => {
    if (!field || !field.zones || field.zones.length === 0) {
      return {
        moisture: 0,
        ph: 7.0,
        nitrogen: 0,
        phosphorus: 0,
        potassium: 0,
        health: 0,
      };
    }

    const totals = field.zones.reduce(
      (acc, zone) => ({
        moisture: acc.moisture + (zone.soilMoisture?.value || 0),
        ph: acc.ph + (zone.soilPH?.value || 0),
        nitrogen: acc.nitrogen + (zone.soilNutrients?.nitrogen || 0),
        phosphorus: acc.phosphorus + (zone.soilNutrients?.phosphorus || 0),
        potassium: acc.potassium + (zone.soilNutrients?.potassium || 0),
        health: acc.health + (zone.cropHealth?.score || 0),
        count: acc.count + 1,
      }),
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
      moisture:
        totals.count > 0 ? (totals.moisture / totals.count).toFixed(1) : 0,
      ph: totals.count > 0 ? (totals.ph / totals.count).toFixed(2) : 7.0,
      nitrogen:
        totals.count > 0 ? (totals.nitrogen / totals.count).toFixed(1) : 0,
      phosphorus:
        totals.count > 0 ? (totals.phosphorus / totals.count).toFixed(1) : 0,
      potassium:
        totals.count > 0 ? (totals.potassium / totals.count).toFixed(1) : 0,
      health: totals.count > 0 ? (totals.health / totals.count).toFixed(1) : 0,
    };
  };

  const avgData = getAverageZoneData();
  const weather = field?.weatherSummary || {};

  // KPI DATA FROM REAL FIELDS
  const kpiData = [
    {
      title: t("kpi.soilMoisture"),
      value: avgData.moisture,
      unit: "%",
      change: 5,
      status: "up",
      icon: <Droplets className="w-5 h-5" />,
      color: "emerald",
      label: t("kpi.vsYesterday"),
    },
    {
      title: t("kpi.temperature"),
      value: weather.temperature || 28,
      unit: "°C",
      change: 2,
      status: "down",
      icon: <ThermometerSun className="w-5 h-5" />,
      color: "emerald",
      label: t("kpi.vsYesterday"),
    },
    {
      title: t("kpi.cropHealth"),
      value:
        avgData.health > 70
          ? t("kpi.good")
          : avgData.health > 50
          ? t("kpi.fair")
          : t("kpi.poor"),
      unit: "",
      icon: <Leaf className="w-5 h-5" />,
      color: "emerald",
    },
    {
      title: t("kpi.systemPressure"),
      value: 85,
      unit: "PSI",
      icon: <Gauge className="w-5 h-5" />,
      color: "emerald",
    },
    {
      title: t("kpi.energyUsage"),
      value: 72,
      unit: "kWh",
      change: 8,
      status: "up",
      icon: <Zap className="w-5 h-5" />,
      color: "emerald",
      label: t("kpi.vsYesterday"),
    },
    {
      title: t("kpi.yieldForecast"),
      value: "+12",
      unit: "%",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "emerald",
    },
  ];

  const soilHealthData = {
    moisture: parseFloat(avgData.moisture) || 0,
    optimalRange: [40, 70],
    ph: parseFloat(avgData.ph) || 7.0,
    nutrients: {
      nitrogen: parseFloat(avgData.nitrogen) || 0,
      phosphorus: parseFloat(avgData.phosphorus) || 0,
      potassium: parseFloat(avgData.potassium) || 0,
    },
  };

  const aiRecommendations =
    field?.zones?.flatMap((zone, index) => {
      const recs = [];
      const rec = zone.recommendations;

      if (rec?.irrigation?.amount > 0) {
        recs.push({
          id: `irr-${field._id}-${index}`,
          type: "irrigation",
          title: `${t("recommendations.increaseIrrigation")} - Zone ${
            index + 1
          }`,
          zone: zone.zoneName || `Zone ${index + 1}`,
          crop: field.cropType,
          schedule: rec.irrigation.timing || t("recommendations.earlyMorning"),
          amount: `${rec.irrigation.amount}${rec.irrigation.unit}`,
          confidence: rec.irrigation.confidence || 94,
          badge: t("recommendations.scheduled"),
          reasons: [
            `Soil moisture: ${zone.soilMoisture?.value || 0}%`,
            rec.weatherInfluence || t("recommendations.noRain"),
            rec.explanation || t("recommendations.growthStage"),
          ],
          impact: t("recommendations.yieldImprovement"),
          icon: <Droplets className="w-5 h-5 text-emerald-600" />,
          bgColor: "from-emerald-50 to-green-50",
          badgeColor: "bg-orange-100 text-orange-700",
        });
      }

      if (rec?.fertilizer?.amount > 0) {
        recs.push({
          id: `fert-${field._id}-${index}`,
          type: "fertilizer",
          title: `Apply ${rec.fertilizer.type} - Zone ${index + 1}`,
          zone: zone.zoneName || `Zone ${index + 1}`,
          crop: field.cropType,
          schedule:
            rec.fertilizer.timing || t("recommendations.afterIrrigation"),
          amount: `${rec.fertilizer.amount}${rec.fertilizer.unit}`,
          confidence: rec.fertilizer.confidence || 89,
          badge: t("recommendations.scheduled"),
          reasons: [
            `Nitrogen: ${zone.soilNutrients?.nitrogen || 0} ppm`,
            `Phosphorus: ${zone.soilNutrients?.phosphorus || 0} ppm`,
            rec.explanation || "Nutrient deficiency detected",
          ],
          impact: t("recommendations.preventLoss"),
          icon: <FlaskConical className="w-5 h-5 text-emerald-600" />,
          bgColor: "from-green-50 to-emerald-50",
          badgeColor: "bg-orange-100 text-orange-700",
        });
      }

      return recs;
    }) || [];

  const cropHealthZones =
    field?.zones?.map((zone, index) => {
      const health = zone.cropHealth?.score || 0;
      const status =
        health >= 75 ? "excellent" : health >= 50 ? "good" : "moderate";
      const statusLabel =
        health >= 75
          ? t("status.excellent")
          : health >= 50
          ? t("status.good")
          : t("status.moderate");

      return {
        zone: zone.zoneName || `Zone ${index + 1}`,
        crop: field.cropType,
        ndvi: (health / 100).toFixed(2),
        status,
        statusLabel,
        alert: health < 50 ? `Low health: ${health}%` : null,
      };
    }) || [];

  const weatherData = {
    current: {
      temp: weather.temperature || 28,
      condition: weather.rainfall || t("weather.partlyCloudy"),
      humidity: weather.humidity || 65,
      wind: 12,
      icon: <Cloud className="w-16 h-16 text-gray-600" />,
    },
    forecast: [
      { day: t("weather.mon"), temp: 28, icon: "sunny", rain: null },
      { day: t("weather.tue"), temp: 30, icon: "sunny", rain: null },
      { day: t("weather.wed"), temp: 32, icon: "cloudy", rain: "10%" },
      { day: t("weather.thu"), temp: 35, icon: "sunny", rain: null },
      { day: t("weather.fri"), temp: 29, icon: "rainy", rain: "60%" },
    ],
    alert: weather.stressRisk || null,
  };

  const resourceUsageData = {
    waterSaved: 23,
    fertilizerSaved: 18,
    energySaved: 15,
    weeklyData: [
      { day: t("weather.mon"), water: 1400, fertilizer: 45 },
      { day: t("weather.tue"), water: 1050, fertilizer: 38 },
      { day: t("weather.wed"), water: 1300, fertilizer: 42 },
      { day: t("weather.thu"), water: 950, fertilizer: 40 },
      { day: t("weather.fri"), water: 1100, fertilizer: 44 },
      { day: t("weather.sat"), water: 900, fertilizer: 36 },
      { day: t("weather.sun"), water: 1000, fertilizer: 35 },
    ],
  };

  const notifications = [
    ...(avgData.moisture < 40
      ? [
          {
            id: `notif-moisture-${field?._id}`,
            type: "alert",
            message: `Low soil moisture detected: ${avgData.moisture}%`,
            time: t("notifications.tenMinAgo"),
            read: false,
          },
        ]
      : []),
    ...(avgData.nitrogen < 20
      ? [
          {
            id: `notif-nitrogen-${field?._id}`,
            type: "alert",
            message: t("notifications.nitrogenDeficiency"),
            time: t("notifications.oneHourAgo"),
            read: false,
          },
        ]
      : []),
    ...(weather.stressRisk
      ? [
          {
            id: `notif-weather-${field?._id}`,
            type: "info",
            message: `Weather alert: ${weather.stressRisk}`,
            time: t("notifications.twoHoursAgo"),
            read: true,
          },
        ]
      : []),
  ];

  const unreadCount = propUnreadCount !== undefined ? propUnreadCount : notifications.filter((n) => !n.read).length;
  const markAllRead = propMarkAllRead || (() => {});
  const markAsRead = propMarkAsRead || (() => {});

  const getWeatherIcon = (type) => {
    switch (type) {
      case "sunny":
        return <Sun className="w-7 h-7 text-yellow-500" />;
      case "cloudy":
        return <Cloud className="w-7 h-7 text-gray-500" />;
      case "rainy":
        return <CloudRain className="w-7 h-7 text-blue-500" />;
      default:
        return <Sun className="w-7 h-7 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-700 border-green-200";
      case "good":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "moderate":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Show message if no field selected
  if (!field) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center px-4">
        <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mb-3 md:mb-4" />
        <h3 className="text-lg md:text-xl font-bold text-gray-700 mb-2">
          No Field Available
        </h3>
        <p className="text-sm md:text-base text-gray-500">
          Please create a field to view dashboard data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 relative px-2 md:px-0">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-10 right-20 animate-float-gentle">
          <Leaf className="w-8 h-8 text-emerald-400/50" />
        </div>
        <div className="absolute bottom-32 left-10 animate-float-gentle-delay">
          <Sprout className="w-10 h-10 text-emerald-400/50" />
        </div>
        <div className="absolute top-64 right-1/3 animate-float-slow">
          <Leaf className="w-6 h-6 text-emerald-400/50" />
        </div>
      </div>

      {/* ✅ FIXED FIELD SELECTOR - No Navigation - RESPONSIVE */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border-2 border-emerald-100 p-3 md:p-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
              <Sprout className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wide">
                Selected Field
              </p>
              <h2 className="text-base md:text-xl font-bold text-gray-900 truncate max-w-[150px] md:max-w-none">
                {field.fieldName}
              </h2>
            </div>
          </div>

          {/* Field Dropdown Selector - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
            <div className="relative w-full sm:w-auto">
              <select
                value={field._id}
                onChange={(e) => handleFieldChange(e.target.value)}
                className="appearance-none w-full bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 text-gray-900 font-semibold rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 pr-8 md:pr-10 cursor-pointer hover:from-emerald-100 hover:to-green-100 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm md:text-base"
              >
                {fields &&
                  fields.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.fieldName} - {f.cropType} ({f.fieldArea?.value}{" "}
                      {f.fieldArea?.unit || "ha"})
                    </option>
                  ))}
              </select>
              <ChevronDown className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-emerald-600 pointer-events-none" />
            </div>

            {/* Field Stats Pills - Mobile Optimized */}
            <div className="flex items-center gap-2">
              <div className="bg-emerald-100 text-emerald-700 px-2 md:px-3 py-1.5 md:py-2 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold flex items-center gap-1 shadow-sm">
                <MapPin className="w-3 h-3" />
                <span className="hidden sm:inline">{field.location?.district || "Unknown"}</span>
                <span className="sm:hidden">{(field.location?.district || "Unknown").slice(0, 6)}</span>
              </div>
              <div className="bg-green-100 text-green-700 px-2 md:px-3 py-1.5 md:py-2 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold flex items-center gap-1 shadow-sm">
                <Activity className="w-3 h-3" />
                {field.numberOfZones} <span className="hidden sm:inline">Zones</span>
              </div>
            </div>
          </div>
        </div>

        {/* Field Info Row - Mobile Grid */}
        <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          <div className="flex items-center gap-1.5 md:gap-2">
            <Sprout className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs text-gray-500">Crop</p>
              <p className="text-xs md:text-sm font-bold text-gray-900 truncate">
                {field.cropType}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <Activity className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs text-gray-500">Area</p>
              <p className="text-xs md:text-sm font-bold text-gray-900 truncate">
                {field.fieldArea?.value} {field.fieldArea?.unit || "ha"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <Droplets className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs text-gray-500">Moisture</p>
              <p className="text-xs md:text-sm font-bold text-gray-900">
                {avgData.moisture}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <Leaf className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs text-gray-500">Health</p>
              <p className="text-xs md:text-sm font-bold text-gray-900">
                {avgData.health}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 1: KPI Cards Grid - Mobile Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
        {kpiData.map((kpi, index) => (
          <KPICard key={`${field._id}-kpi-${index}`} data={kpi} />
        ))}
      </div>

      {/* ROW 2: Main Content Grid - Responsive Stacking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* COLUMN 1: Soil Health Monitor - Mobile Optimized */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-md">
              <Leaf className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-gray-900">
                {t("soil.title")}
              </h3>
            </div>
          </div>

          {/* Moisture Level */}
          <div className="mb-4 md:mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-gray-700">
                  {t("soil.moistureLevel")}
                </span>
              </div>
              <span className="text-sm font-bold text-emerald-600">
                {soilHealthData.moisture}%
              </span>
            </div>
            <div className="relative w-full bg-emerald-100 rounded-full h-3 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full animate-pulse-gentle"
                style={{ width: `${Math.min(soilHealthData.moisture, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t("soil.optimal")}: {soilHealthData.optimalRange[0]}-
              {soilHealthData.optimalRange[1]}%
            </p>
          </div>

          {/* pH Level */}
          <div className="mb-4 md:mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-gray-700">
                  {t("soil.phLevel")}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {soilHealthData.ph}
              </span>
            </div>
            <div className="relative w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 rounded-full mb-2">
              <div
                className="absolute -top-1 w-4 h-4 bg-white border-2 border-emerald-700 rounded-full animate-bounce-subtle"
                style={{
                  left: `${Math.max(
                    0,
                    Math.min(100, ((soilHealthData.ph - 4) / 10) * 100)
                  )}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-red-600 font-medium">
                {t("soil.acidic")} (4)
              </span>
              <span className="text-yellow-600 font-medium">
                {t("soil.neutral")} (7)
              </span>
              <span className="text-emerald-600 font-medium">
                {t("soil.alkaline")} (14)
              </span>
            </div>
          </div>

          {/* NPK Nutrients */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              {t("soil.npkNutrients")}
            </p>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">
                    {t("soil.nitrogen")} (N)
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {soilHealthData.nutrients.nitrogen} ppm
                  </span>
                </div>
                <div className="w-full bg-emerald-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (soilHealthData.nutrients.nitrogen / 50) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">
                    {t("soil.phosphorus")} (P)
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {soilHealthData.nutrients.phosphorus} ppm
                  </span>
                </div>
                <div className="w-full bg-green-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (soilHealthData.nutrients.phosphorus / 50) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">
                    {t("soil.potassium")} (K)
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {soilHealthData.nutrients.potassium} ppm
                  </span>
                </div>
                <div className="w-full bg-lime-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-lime-500 to-lime-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (soilHealthData.nutrients.potassium / 200) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: AI Recommendations - Mobile Optimized */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-md">
                <Target className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-bold text-gray-900">
                  {t("recommendations.title")}
                </h3>
              </div>
            </div>
            <span className="text-[10px] md:text-xs bg-emerald-100 text-emerald-700 px-2 md:px-3 py-1 rounded-full font-semibold flex items-center gap-1 animate-pulse-gentle">
              <Zap className="w-3 h-3" />
              AI
            </span>
          </div>

          <div className="space-y-3 md:space-y-4 max-h-[400px] md:max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-300">
            {aiRecommendations.length > 0 ? (
              aiRecommendations.map((rec) => (
                <AIRecommendationCard key={rec.id} recommendation={rec} />
              ))
            ) : (
              <div className="text-center py-6 md:py-8 text-gray-500">
                <Target className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 text-gray-300" />
                <p className="text-xs md:text-sm">No recommendations available yet</p>
                <p className="text-[10px] md:text-xs mt-1">
                  AI will generate recommendations based on field data
                </p>
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 3: Weather Forecast - Mobile Optimized */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-md">
              <Cloud className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-gray-900">
                {t("weather.title")}
              </h3>
            </div>
          </div>

          {/* Current Weather - Mobile Optimized */}
          <div className="mb-4 md:mb-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-gray-900">
                  {weatherData.current.temp}°C
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  {weatherData.current.condition}
                </p>
              </div>
              <div className="scale-75 md:scale-100">
                {weatherData.current.icon}
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center gap-1.5 md:gap-2">
                <Droplets className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-600" />
                <span className="text-xs md:text-sm text-gray-600">
                  {weatherData.current.humidity}%
                </span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <Wind className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-600" />
                <span className="text-xs md:text-sm text-gray-600">
                  {weatherData.current.wind} km/h
                </span>
              </div>
            </div>
          </div>

          {/* 5-Day Forecast - Mobile Optimized */}
          <div className="grid grid-cols-5 gap-1 md:gap-2 mb-4 md:mb-6">
            {weatherData.forecast.map((day, index) => (
              <div
                key={index}
                className="text-center hover:bg-emerald-50 rounded-lg p-1.5 md:p-2 transition-colors"
              >
                <p className="text-[10px] md:text-xs text-gray-600 font-medium mb-1 md:mb-2">
                  {day.day}
                </p>
                <div className="flex justify-center mb-1 md:mb-2 scale-75 md:scale-100">
                  {getWeatherIcon(day.icon)}
                </div>
                <p className="text-xs md:text-sm font-bold text-gray-900">{day.temp}°</p>
                {day.rain && (
                  <p className="text-[10px] md:text-xs text-emerald-600 font-medium mt-0.5 md:mt-1">
                    {day.rain}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Weather Alert */}
          {weatherData.alert && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg md:rounded-xl p-3 md:p-4 animate-pulse-subtle">
              <div className="flex items-start gap-2 md:gap-3">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs md:text-sm text-amber-800 font-medium">
                  {weatherData.alert}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ROW 3: Crop Health Status - Mobile Responsive */}
      {cropHealthZones.length > 0 && (
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-md">
                <Leaf className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900">
                  {t("cropHealth.title")}
                </h3>
                <p className="text-[10px] md:text-xs text-gray-600">
                  {field.numberOfZones} zones monitored
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 bg-emerald-50 px-3 md:px-4 py-2 rounded-lg md:rounded-xl border border-emerald-200 shadow-sm">
              <span className="text-xs md:text-sm font-semibold text-gray-700">
                Avg Health
              </span>
              <span className="text-xl md:text-2xl font-bold text-emerald-600">
                {avgData.health}%
              </span>
            </div>
          </div>

          {/* Zone Grid - Mobile Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {cropHealthZones.map((zone, index) => (
              <div
                key={`${field._id}-zone-${index}`}
                className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-emerald-100 hover:shadow-lg transition-all hover:scale-105 duration-300"
              >
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <div>
                    <p className="text-xs md:text-sm font-bold text-gray-900">
                      {zone.zone}
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-600 truncate">{zone.crop}</p>
                  </div>
                  <span
                    className={`text-[10px] md:text-xs font-semibold px-2 md:px-3 py-1 rounded-full border ${getStatusColor(
                      zone.status
                    )}`}
                  >
                    {zone.statusLabel}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                  <Activity className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" />
                  <span className="text-[10px] md:text-xs text-gray-600">Health:</span>
                  <span className="text-xs md:text-sm font-bold text-gray-900">
                    {(parseFloat(zone.ndvi) * 100).toFixed(0)}%
                  </span>
                </div>
                {zone.alert && (
                  <div className="flex items-start gap-1.5 md:gap-2 mt-2 md:mt-3 bg-orange-50 rounded-lg p-2 border border-orange-200">
                    <AlertTriangle className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-[10px] md:text-xs text-orange-800 font-medium">
                      {zone.alert}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ROW 4: Resource Usage & Analytics - Mobile Responsive */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-md">
            <BarChart2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-gray-900">
              {t("resources.title")}
            </h3>
          </div>
        </div>

        {/* Tabs - Mobile Optimized */}
        <div className="flex gap-1 md:gap-2 mb-4 md:mb-6 border-b border-gray-200 overflow-x-auto scrollbar-thin">
          {["overview", "water", "fertilizer"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 md:px-4 py-2 text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t(`resources.${tab}`)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* KPI Cards - Mobile Optimized */}
          <div className="lg:col-span-1 grid grid-cols-3 lg:grid-cols-1 gap-3 md:gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-emerald-100 hover:scale-105 transition-transform">
              <div className="flex lg:flex-col items-start justify-between lg:justify-start mb-1 md:mb-2">
                <div className="flex items-center gap-1.5 md:gap-2 mb-0 lg:mb-2">
                  <Droplets className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                  <span className="text-[10px] md:text-sm text-gray-600 font-medium hidden lg:inline">
                    {t("resources.waterSaved")}
                  </span>
                  <span className="text-[10px] md:text-sm text-gray-600 font-medium lg:hidden">
                    Water
                  </span>
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-emerald-700 mb-0 md:mb-1">
                {resourceUsageData.waterSaved}%
              </p>
              <p className="text-[9px] md:text-xs text-gray-600 hidden md:block">
                {t("resources.vsLastMonth")}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-green-100 hover:scale-105 transition-transform">
              <div className="flex lg:flex-col items-start justify-between lg:justify-start mb-1 md:mb-2">
                <div className="flex items-center gap-1.5 md:gap-2 mb-0 lg:mb-2">
                  <FlaskConical className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  <span className="text-[10px] md:text-sm text-gray-600 font-medium hidden lg:inline">
                    {t("resources.fertilizerSaved")}
                  </span>
                  <span className="text-[10px] md:text-sm text-gray-600 font-medium lg:hidden">
                    Fertilizer
                  </span>
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-green-700 mb-0 md:mb-1">
                {resourceUsageData.fertilizerSaved}%
              </p>
              <p className="text-[9px] md:text-xs text-gray-600 hidden md:block">
                {t("resources.vsLastMonth")}
              </p>
            </div>

            <div className="bg-gradient-to-br from-lime-50 to-green-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-lime-100 hover:scale-105 transition-transform">
              <div className="flex lg:flex-col items-start justify-between lg:justify-start mb-1 md:mb-2">
                <div className="flex items-center gap-1.5 md:gap-2 mb-0 lg:mb-2">
                  <Zap className="w-4 h-4 md:w-5 md:h-5 text-lime-600" />
                  <span className="text-[10px] md:text-sm text-gray-600 font-medium hidden lg:inline">
                    {t("resources.energySaved")}
                  </span>
                  <span className="text-[10px] md:text-sm text-gray-600 font-medium lg:hidden">
                    Energy
                  </span>
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-lime-700 mb-0 md:mb-1">
                {resourceUsageData.energySaved}%
              </p>
              <p className="text-[9px] md:text-xs text-gray-600 hidden md:block">
                {t("resources.vsLastMonth")}
              </p>
            </div>
          </div>

          {/* Chart - Mobile Optimized */}
          <div className="lg:col-span-3 bg-gradient-to-br from-gray-50 to-white rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-100">
            <p className="text-xs md:text-sm font-semibold text-gray-700 mb-3 md:mb-4">
              {t("resources.weeklyComparison")}
            </p>
            <div className="flex items-end justify-between gap-1.5 md:gap-3 h-48 md:h-64 overflow-x-auto">
              {resourceUsageData.weeklyData.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center min-w-[40px] md:min-w-0">
                  <div className="flex flex-col items-center gap-0.5 md:gap-1 w-full">
                    {/* Water Bar */}
                    <div
                      className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all hover:from-emerald-600 hover:to-emerald-500 cursor-pointer relative group shadow-md"
                      style={{
                        height: `${(day.water / 1400) * 100}%`,
                        minHeight: "15px",
                      }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.water}L
                      </span>
                    </div>
                    {/* Fertilizer Bar */}
                    <div
                      className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all hover:from-green-600 hover:to-green-500 cursor-pointer relative group shadow-md"
                      style={{
                        height: `${(day.fertilizer / 50) * 100}%`,
                        minHeight: "10px",
                      }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.fertilizer}kg
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] md:text-xs text-gray-600 font-medium mt-1.5 md:mt-2">
                    {day.day.slice(0, 3)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-3 md:gap-6 mt-3 md:mt-4">
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-emerald-500 rounded"></div>
                <span className="text-[10px] md:text-xs text-gray-600">
                  {t("resources.waterL")}
                </span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded"></div>
                <span className="text-[10px] md:text-xs text-gray-600">
                  {t("resources.fertilizerKg")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    {/* ROW 5: REAL Notifications - Auto Updates */}
{notifications.length > 0 && (
  <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-md">
          <Bell className="w-4 h-4 md:w-5 md:h-5 text-white animate-pulse" />
        </div>
        <div>
          <h3 className="text-base md:text-lg font-bold text-gray-900">
            {unreadCount > 0 && (
              <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full mr-2">
                {unreadCount}
              </span>
            )}
            New Messages
          </h3>
        </div>
      </div>
      <button 
        onClick={() => markAllRead()}
        className="text-xs md:text-sm text-emerald-600 font-semibold hover:underline self-start sm:self-auto"
      >
        Mark All Read
      </button>
    </div>

    <div className="space-y-2 md:space-y-3 max-h-64 overflow-y-auto">
      {notifications.slice(0, 5).map((notif) => (  // Show latest 5
        <div
          key={notif.id}
          className={`flex items-start gap-2 md:gap-3 p-3 md:p-4 rounded-lg md:rounded-xl border transition-all hover:shadow-md cursor-pointer ${
            notif.read
              ? "bg-gray-50 border-gray-100"
              : "bg-emerald-50 border-emerald-100 shadow-md"
          }`}
          onClick={() => markAsRead(notif.id)}
        >
          <div
            className={`w-2 h-2 rounded-full mt-1.5 md:mt-2 flex-shrink-0 animate-pulse ${
              !notif.read ? "bg-emerald-500" : "bg-gray-400"
            }`}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm text-gray-900 font-medium line-clamp-2">
              {notif.message}
            </p>
            <p className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">
              {new Date(notif.time).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

      <style jsx>{`
        @keyframes float-gentle {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(3deg);
          }
        }
        @keyframes float-gentle-delay {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-3deg);
          }
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(2deg);
          }
        }
        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }
        @keyframes pulse-gentle {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.02);
          }
        }
        @keyframes pulse-subtle {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.9;
          }
        }
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-3deg);
          }
          75% {
            transform: rotate(3deg);
          }
        }

        .animate-float-gentle {
          animation: float-gentle 4s ease-in-out infinite;
        }
        .animate-float-gentle-delay {
          animation: float-gentle-delay 5s ease-in-out infinite 0.5s;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 4s ease-in-out infinite;
        }
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-emerald-300::-webkit-scrollbar-thumb {
          background-color: rgb(110 231 183);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

// KPI Card Component - Mobile Responsive
const KPICard = ({ data }) => {
  return (
    <div className="bg-emerald-900 rounded-2xl md:rounded-3xl p-3 md:p-5 shadow-2xl border border-emerald-800 hover:shadow-emerald-900/40 transition-all hover:-translate-y-1 duration-300 group overflow-hidden relative">
      <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:opacity-20 transition-opacity">
        {React.cloneElement(data.icon, { size: typeof window !== 'undefined' && window.innerWidth < 768 ? 48 : 64 })}
      </div>

      <div className="flex items-start justify-between mb-2 md:mb-4 relative z-10">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-800/80 rounded-lg md:rounded-xl flex items-center justify-center text-emerald-100 shadow-inner group-hover:scale-110 transition-transform">
          {React.cloneElement(data.icon, { className: "w-4 h-4 md:w-5 md:h-5" })}
        </div>
        {data.change !== undefined && (
          <div
            className={`flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md md:rounded-lg text-[9px] md:text-[10px] font-bold ${
              data.status === "up"
                ? "bg-emerald-800 text-emerald-400"
                : "bg-red-900/50 text-red-400"
            }`}
          >
            {data.status === "up" ? (
              <ArrowUp size={10} className="md:w-3 md:h-3" />
            ) : (
              <ArrowDown size={10} className="md:w-3 md:h-3" />
            )}
            {data.change}%
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-[9px] md:text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-0.5 md:mb-1 truncate">
          {data.title}
        </p>
        <p className="text-xl md:text-2xl font-bold text-white flex items-baseline gap-0.5 md:gap-1">
          {data.value}
          <span className="text-[10px] md:text-xs font-medium text-emerald-400/70">
            {data.unit}
          </span>
        </p>
        {data.label && (
          <p className="text-[9px] md:text-[10px] text-emerald-500/80 mt-0.5 md:mt-1 italic truncate">
            {data.label}
          </p>
        )}
      </div>
    </div>
  );
};

// AI Recommendation Card Component - Mobile Responsive
const AIRecommendationCard = ({ recommendation }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`bg-gradient-to-br ${recommendation.bgColor} rounded-xl md:rounded-2xl p-3 md:p-5 border border-emerald-200 hover:shadow-lg transition-all hover:scale-102 duration-300`}
    >
      <div className="flex items-start justify-between mb-2 md:mb-3 gap-2">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg md:rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
            {React.cloneElement(recommendation.icon, { className: "w-4 h-4 md:w-5 md:h-5" })}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs md:text-sm font-bold text-gray-900 truncate">
              {recommendation.title}
            </h4>
            <p className="text-[10px] md:text-xs text-gray-600 truncate">
              {recommendation.zone} - {recommendation.crop}
            </p>
          </div>
        </div>
        <span
          className={`text-[10px] md:text-xs font-semibold px-2 md:px-3 py-1 rounded-full ${recommendation.badgeColor} flex items-center gap-1 flex-shrink-0`}
        >
          <Clock className="w-3 h-3" />
          <span className="hidden sm:inline">{recommendation.badge}</span>
        </span>
      </div>

      <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
        <div className="flex items-center justify-between text-[10px] md:text-xs">
          <span className="text-gray-600">Amount:</span>
          <span className="font-semibold text-gray-900">
            {recommendation.amount}
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px] md:text-xs">
          <span className="text-gray-600">Schedule:</span>
          <span className="font-semibold text-gray-900 truncate ml-2">
            {recommendation.schedule}
          </span>
        </div>
      </div>

      <div className="bg-white/70 rounded-lg md:rounded-xl p-2 md:p-3 mb-2 md:mb-3">
        <div className="flex items-start gap-1.5 md:gap-2 mb-1.5 md:mb-2">
          <Lightbulb className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <p className="text-[10px] md:text-xs font-semibold text-gray-700">Why this?</p>
        </div>
        <ul className="space-y-1 md:space-y-1.5 ml-4 md:ml-6">
          {recommendation.reasons.map((reason, index) => (
            <li key={index} className="text-[10px] md:text-xs text-gray-600 flex items-start">
              <ChevronRight className="w-3 h-3 text-gray-400 mt-0.5 mr-1 flex-shrink-0" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 md:gap-2 text-emerald-700 bg-emerald-100 rounded-lg px-2 md:px-3 py-1.5 md:py-2 border border-emerald-200">
          <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
          <span className="text-[10px] md:text-xs font-semibold truncate">{recommendation.impact}</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 bg-white rounded-lg px-2 md:px-3 py-1.5 md:py-2 border border-gray-200">
          <span className="text-[10px] md:text-xs text-gray-600">Confidence:</span>
          <span className="text-xs md:text-sm font-bold text-gray-900">
            {recommendation.confidence}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;