// src/components/DashboardContent.jsx
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
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
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data
  const kpiData = [
    {
      title: t('kpi.soilMoisture'),
      value: 58,
      unit: "%",
      change: 5,
      status: "up",
      icon: <Droplets className="w-5 h-5" />,
      color: "emerald",
      label: t('kpi.vsYesterday'),
    },
    {
      title: t('kpi.temperature'),
      value: 28,
      unit: "°C",
      change: 2,
      status: "down",
      icon: <ThermometerSun className="w-5 h-5" />,
      color: "emerald",
      label: t('kpi.vsYesterday'),
    },
    {
      title: t('kpi.cropHealth'),
      value: t('kpi.good'),
      unit: "",
      icon: <Leaf className="w-5 h-5" />,
      color: "emerald",
    },
    {
      title: t('kpi.systemPressure'),
      value: 85,
      unit: "PSI",
      icon: <Gauge className="w-5 h-5" />,
      color: "emerald",
    },
    {
      title: t('kpi.energyUsage'),
      value: 72,
      unit: "kWh",
      change: 8,
      status: "up",
      icon: <Zap className="w-5 h-5" />,
      color: "emerald",
      label: t('kpi.vsYesterday'),
    },
    {
      title: t('kpi.yieldForecast'),
      value: "+12",
      unit: "%",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "emerald",
    },
  ];

  const soilHealthData = {
    moisture: 58,
    optimalRange: [40, 70],
    ph: 6.8,
    nutrients: {
      nitrogen: 22,
      phosphorus: 15,
      potassium: 180,
    },
  };

  const aiRecommendations = [
    {
      id: 1,
      type: "irrigation",
      title: t('recommendations.increaseIrrigation'),
      zone: t('recommendations.zoneA'),
      crop: t('crops.wheat'),
      schedule: t('recommendations.earlyMorning'),
      amount: "15L per m²",
      confidence: 94,
      badge: t('recommendations.scheduled'),
      reasons: [
        t('recommendations.lowMoisture'),
        t('recommendations.noRain'),
        t('recommendations.growthStage'),
      ],
      impact: t('recommendations.yieldImprovement'),
      icon: <Droplets className="w-5 h-5 text-emerald-600" />,
      bgColor: "from-emerald-50 to-green-50",
      badgeColor: "bg-orange-100 text-orange-700",
    },
    {
      id: 2,
      type: "fertilizer",
      title: t('recommendations.applyNitrogen'),
      zone: t('recommendations.zoneC'),
      crop: t('crops.corn'),
      schedule: t('recommendations.afterIrrigation'),
      amount: "25 kg/hectare",
      confidence: 89,
      badge: t('recommendations.scheduled'),
      reasons: [
        t('recommendations.leafChlorosis'),
        t('recommendations.lowNitrogen'),
        t('recommendations.vegetativePhase'),
      ],
      impact: t('recommendations.preventLoss'),
      icon: <FlaskConical className="w-5 h-5 text-emerald-600" />,
      bgColor: "from-green-50 to-emerald-50",
      badgeColor: "bg-orange-100 text-orange-700",
    },
  ];

  const cropHealthZones = [
    {
      zone: t('recommendations.zoneA'),
      crop: t('crops.wheat'),
      ndvi: 0.72,
      status: "excellent",
      statusLabel: t('status.excellent'),
      alert: null,
    },
    {
      zone: t('recommendations.zoneB'),
      crop: t('crops.soybeans'),
      ndvi: 0.65,
      status: "good",
      statusLabel: t('status.good'),
      alert: null,
    },
    {
      zone: t('recommendations.zoneC'),
      crop: t('crops.corn'),
      ndvi: 0.54,
      status: "moderate",
      statusLabel: t('status.moderate'),
      alert: t('alerts.nitrogenDeficiency'),
    },
    {
      zone: t('recommendations.zoneD'),
      crop: t('crops.tomatoes'),
      ndvi: 0.78,
      status: "excellent",
      statusLabel: t('status.excellent'),
      alert: null,
    },
  ];

  const weatherData = {
    current: {
      temp: 28,
      condition: t('weather.partlyCloudy'),
      humidity: 65,
      wind: 12,
      icon: <Cloud className="w-16 h-16 text-gray-600" />,
    },
    forecast: [
      { day: t('weather.mon'), temp: 28, icon: "sunny", rain: null },
      { day: t('weather.tue'), temp: 30, icon: "sunny", rain: null },
      { day: t('weather.wed'), temp: 32, icon: "cloudy", rain: "10%" },
      { day: t('weather.thu'), temp: 35, icon: "sunny", rain: null },
      { day: t('weather.fri'), temp: 29, icon: "rainy", rain: "60%" },
    ],
    alert: t('weather.heatAdvisory'),
  };

  const resourceUsageData = {
    waterSaved: 23,
    fertilizerSaved: 18,
    energySaved: 15,
    weeklyData: [
      { day: t('weather.mon'), water: 1400, fertilizer: 45 },
      { day: t('weather.tue'), water: 1050, fertilizer: 38 },
      { day: t('weather.wed'), water: 1300, fertilizer: 42 },
      { day: t('weather.thu'), water: 950, fertilizer: 40 },
      { day: t('weather.fri'), water: 1100, fertilizer: 44 },
      { day: t('weather.sat'), water: 900, fertilizer: 36 },
      { day: t('weather.sun'), water: 1000, fertilizer: 35 },
    ],
  };

  const notifications = [
    {
      id: 1,
      type: "alert",
      message: t('notifications.nitrogenDeficiency'),
      time: t('notifications.tenMinAgo'),
      read: false,
    },
    {
      id: 2,
      type: "success",
      message: t('notifications.irrigationComplete'),
      time: t('notifications.oneHourAgo'),
      read: false,
    },
    {
      id: 3,
      type: "info",
      message: t('notifications.weatherAlert'),
      time: t('notifications.twoHoursAgo'),
      read: true,
    },
    {
      id: 4,
      type: "alert",
      message: t('notifications.lowMoisture'),
      time: t('notifications.threeHoursAgo'),
      read: true,
    },
  ];

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

  return (
    <div className="space-y-6 relative">
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

      {/* ROW 1: KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} data={kpi} />
        ))}
      </div>

      {/* ROW 2: Main Content Grid - 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMN 1: Soil Health Monitor */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {t('soil.title')}
              </h3>
            </div>
          </div>

          {/* Moisture Level */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-gray-700">
                  {t('soil.moistureLevel')}
                </span>
              </div>
              <span className="text-sm font-bold text-emerald-600">
                {soilHealthData.moisture}%
              </span>
            </div>
            <div className="relative w-full bg-emerald-100 rounded-full h-3 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full animate-pulse-gentle"
                style={{ width: `${soilHealthData.moisture}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t('soil.optimal')}: {soilHealthData.optimalRange[0]}-
              {soilHealthData.optimalRange[1]}%
            </p>
          </div>

          {/* pH Level */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-gray-700">
                  {t('soil.phLevel')}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {soilHealthData.ph}
              </span>
            </div>
            <div className="relative w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 rounded-full mb-2">
              <div
                className="absolute -top-1 w-4 h-4 bg-white border-2 border-emerald-700 rounded-full animate-bounce-subtle"
                style={{ left: `${((soilHealthData.ph - 4) / 10) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-red-600 font-medium">{t('soil.acidic')} (4)</span>
              <span className="text-yellow-600 font-medium">{t('soil.neutral')} (7)</span>
              <span className="text-emerald-600 font-medium">{t('soil.alkaline')} (14)</span>
            </div>
          </div>

          {/* NPK Nutrients */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              {t('soil.npkNutrients')}
            </p>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">{t('soil.nitrogen')} (N)</span>
                  <span className="text-sm font-bold text-gray-900">
                    {soilHealthData.nutrients.nitrogen} ppm
                  </span>
                </div>
                <div className="w-full bg-emerald-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(soilHealthData.nutrients.nitrogen / 50) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">{t('soil.phosphorus')} (P)</span>
                  <span className="text-sm font-bold text-gray-900">
                    {soilHealthData.nutrients.phosphorus} ppm
                  </span>
                </div>
                <div className="w-full bg-green-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(soilHealthData.nutrients.phosphorus / 50) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">{t('soil.potassium')} (K)</span>
                  <span className="text-sm font-bold text-gray-900">
                    {soilHealthData.nutrients.potassium} ppm
                  </span>
                </div>
                <div className="w-full bg-lime-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-lime-500 to-lime-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(soilHealthData.nutrients.potassium / 200) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: AI Recommendations */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {t('recommendations.title')}
                </h3>
              </div>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold flex items-center gap-1 animate-pulse-gentle">
              <Zap className="w-3 h-3" />
              {t('recommendations.drlOptimized')}
            </span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-300">
            {aiRecommendations.map((rec) => (
              <AIRecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        </div>

        {/* COLUMN 3: Weather Forecast */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {t('weather.title')}
              </h3>
            </div>
          </div>

          {/* Current Weather */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-4xl font-bold text-gray-900">
                  {weatherData.current.temp}°C
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {weatherData.current.condition}
                </p>
              </div>
              {weatherData.current.icon}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-gray-600">
                  {weatherData.current.humidity}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-gray-600">
                  {weatherData.current.wind} km/h
                </span>
              </div>
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {weatherData.forecast.map((day, index) => (
              <div key={index} className="text-center hover:bg-emerald-50 rounded-lg p-2 transition-colors">
                <p className="text-xs text-gray-600 font-medium mb-2">
                  {day.day}
                </p>
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(day.icon)}
                </div>
                <p className="text-sm font-bold text-gray-900">{day.temp}°</p>
                {day.rain && (
                  <p className="text-xs text-emerald-600 font-medium mt-1">
                    {day.rain}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Weather Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 animate-pulse-subtle">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800 font-medium">
                {weatherData.alert}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: Crop Health Status */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {t('cropHealth.title')}
              </h3>
              <p className="text-xs text-gray-600">
                <Camera className="w-3 h-3 inline mr-1" />
                {t('cropHealth.droneScan')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 shadow-sm">
            <span className="text-sm font-semibold text-gray-700">
              {t('cropHealth.averageNDVI')}
            </span>
            <span className="text-2xl font-bold text-emerald-600">0.67</span>
            <span className="flex items-center text-xs text-emerald-600 font-semibold">
              <TrendingUp className="w-3 h-3 mr-1" />
              +0.05
            </span>
          </div>
        </div>

        {/* NDVI Scale */}
        <div className="mb-6">
          <div className="relative w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 rounded-full mb-2"></div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>{t('cropHealth.bare')}</span>
            <span>{t('cropHealth.sparse')}</span>
            <span>{t('cropHealth.moderate')}</span>
            <span>{t('cropHealth.dense')}</span>
          </div>
        </div>

        {/* Zone Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cropHealthZones.map((zone, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-100 hover:shadow-lg transition-all hover:scale-105 duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">{zone.zone}</p>
                  <p className="text-xs text-gray-600">{zone.crop}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(
                    zone.status
                  )}`}
                >
                  {zone.statusLabel}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-gray-600" />
                <span className="text-xs text-gray-600">NDVI:</span>
                <span className="text-sm font-bold text-gray-900">
                  {zone.ndvi.toFixed(2)}
                </span>
              </div>
              {zone.alert && (
                <div className="flex items-start gap-2 mt-3 bg-orange-50 rounded-lg p-2 border border-orange-200">
                  <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-orange-800 font-medium">
                    {zone.alert}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Overall Health Badge */}
        <div className="mt-4 flex justify-center">
          <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-6 py-2 rounded-full font-semibold border border-emerald-200 shadow-sm">
            <CheckCircle className="w-5 h-5" />
            {t('cropHealth.goodOverall')}
            <span className="text-xs">({t('cropHealth.basedOnImagery')})</span>
          </span>
        </div>
      </div>

      {/* ROW 4: Resource Usage & Analytics */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {t('resources.title')}
            </h3>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {["overview", "water", "fertilizer"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t(`resources.${tab}`)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* KPI Cards */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm text-gray-600 font-medium">
                    {t('resources.waterSaved')}
                  </span>
                </div>
              </div>
              <p className="text-3xl font-bold text-emerald-700 mb-1">
                {resourceUsageData.waterSaved}%
              </p>
              <p className="text-xs text-gray-600">{t('resources.vsLastMonth')}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600 font-medium">
                    {t('resources.fertilizerSaved')}
                  </span>
                </div>
              </div>
              <p className="text-3xl font-bold text-green-700 mb-1">
                {resourceUsageData.fertilizerSaved}%
              </p>
              <p className="text-xs text-gray-600">{t('resources.vsLastMonth')}</p>
            </div>

            <div className="bg-gradient-to-br from-lime-50 to-green-50 rounded-xl p-4 border border-lime-100 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-lime-600" />
                  <span className="text-sm text-gray-600 font-medium">
                    {t('resources.energySaved')}
                  </span>
                </div>
              </div>
              <p className="text-3xl font-bold text-lime-700 mb-1">
                {resourceUsageData.energySaved}%
              </p>
              <p className="text-xs text-gray-600">{t('resources.vsLastMonth')}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-3 bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              {t('resources.weeklyComparison')}
            </p>
            <div className="flex items-end justify-between gap-3 h-64">
              {resourceUsageData.weeklyData.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="flex flex-col items-center gap-1 w-full">
                    {/* Water Bar */}
                    <div
                      className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all hover:from-emerald-600 hover:to-emerald-500 cursor-pointer relative group shadow-md"
                      style={{
                        height: `${(day.water / 1400) * 100}%`,
                        minHeight: "20px",
                      }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.water}L
                      </span>
                    </div>
                    {/* Fertilizer Bar */}
                    <div
                      className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all hover:from-green-600 hover:to-green-500 cursor-pointer relative group shadow-md"
                      style={{
                        height: `${(day.fertilizer / 50) * 100}%`,
                        minHeight: "15px",
                      }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.fertilizer}kg
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium mt-2">
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                <span className="text-xs text-gray-600">{t('resources.waterL')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-xs text-gray-600">{t('resources.fertilizerKg')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 5: Alerts & Notifications */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center shadow-md">
              <Bell className="w-5 h-5 text-white animate-wiggle" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {t('notifications.title')}
              </h3>
            </div>
          </div>
          <button className="text-sm text-emerald-600 font-semibold hover:underline">
            {t('notifications.markAllRead')}
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-3 p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer ${
                notif.read
                  ? "bg-gray-50 border-gray-100"
                  : "bg-emerald-50 border-emerald-100"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 animate-pulse ${
                  notif.type === "alert"
                    ? "bg-red-500"
                    : notif.type === "success"
                    ? "bg-green-500"
                    : "bg-emerald-500"
                }`}
              ></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium">
                  {notif.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float-gentle { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px) rotate(3deg); } }
        @keyframes float-gentle-delay { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-15px) rotate(-3deg); } }
        @keyframes float-slow { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(2deg); } }
        @keyframes bounce-subtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
        @keyframes pulse-gentle { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.02); } }
        @keyframes pulse-subtle { 0%, 100% { opacity: 1; } 50% { opacity: 0.9; } }
        @keyframes wiggle { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-3deg); } 75% { transform: rotate(3deg); } }
        
        .animate-float-gentle { animation: float-gentle 4s ease-in-out infinite; }
        .animate-float-gentle-delay { animation: float-gentle-delay 5s ease-in-out infinite 0.5s; }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
        .animate-pulse-gentle { animation: pulse-gentle 3s ease-in-out infinite; }
        .animate-pulse-subtle { animation: pulse-subtle 4s ease-in-out infinite; }
        .animate-wiggle { animation: wiggle 2s ease-in-out infinite; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thumb-emerald-300::-webkit-scrollbar-thumb { background-color: rgb(110 231 183); border-radius: 3px; }
      `}</style>
    </div>
  );
};

// KPI Card Component
const KPICard = ({ data }) => {
  return (
    <div className="bg-emerald-900 rounded-3xl p-5 shadow-2xl border border-emerald-800 hover:shadow-emerald-900/40 transition-all hover:-translate-y-1 duration-300 group overflow-hidden relative">
      <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:opacity-20 transition-opacity">
        {React.cloneElement(data.icon, { size: 64 })}
      </div>

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="w-10 h-10 bg-emerald-800/80 rounded-xl flex items-center justify-center text-emerald-100 shadow-inner group-hover:scale-110 transition-transform">
          {data.icon}
        </div>
        {data.change !== undefined && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${
              data.status === "up" ? "bg-emerald-800 text-emerald-400" : "bg-red-900/50 text-red-400"
            }`}
          >
            {data.status === "up" ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {data.change}%
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1">
          {data.title}
        </p>
        <p className="text-2xl font-bold text-white flex items-baseline gap-1">
          {data.value}
          <span className="text-xs font-medium text-emerald-400/70">{data.unit}</span>
        </p>
        {data.label && (
          <p className="text-[10px] text-emerald-500/80 mt-1 italic">{data.label}</p>
        )}
      </div>
    </div>
  );
};

// AI Recommendation Card Component
const AIRecommendationCard = ({ recommendation }) => {
  const { t } = useTranslation();
  
  return (
    <div className={`bg-gradient-to-br ${recommendation.bgColor} rounded-2xl p-5 border border-emerald-200 hover:shadow-lg transition-all hover:scale-102 duration-300`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
            {recommendation.icon}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              {recommendation.title}
            </h4>
            <p className="text-xs text-gray-600">
              {recommendation.zone} - {recommendation.crop}
            </p>
          </div>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${recommendation.badgeColor} flex items-center gap-1`}
        >
          <Clock className="w-3 h-3" />
          {recommendation.badge}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">{t('recommendations.amount')}:</span>
          <span className="font-semibold text-gray-900">
            {recommendation.amount}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">{t('recommendations.schedule')}:</span>
          <span className="font-semibold text-gray-900">
            {recommendation.schedule}
          </span>
        </div>
      </div>

      <div className="bg-white/70 rounded-xl p-3 mb-3">
        <div className="flex items-start gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs font-semibold text-gray-700">
            {t('recommendations.whyThis')}
          </p>
        </div>
        <ul className="space-y-1.5 ml-6">
          {recommendation.reasons.map((reason, index) => (
            <li
              key={index}
              className="text-xs text-gray-600 flex items-start"
            >
              <ChevronRight className="w-3 h-3 text-gray-400 mt-0.5 mr-1 flex-shrink-0" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-100 rounded-lg px-3 py-2 border border-emerald-200">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-semibold">{recommendation.impact}</span>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
          <span className="text-xs text-gray-600">{t('recommendations.confidence')}:</span>
          <span className="text-sm font-bold text-gray-900">
            {recommendation.confidence}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
