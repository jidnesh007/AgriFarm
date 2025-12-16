// src/components/DashboardContent.jsx
import React from "react";
import {
  Sprout,
  MapPin,
  ArrowUpRight,
  TrendingUp,
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
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 rounded-3xl p-8 shadow-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-2xl border border-white/30 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                Welcome to Sigro
              </h2>
              <p className="text-base text-white/90 font-medium drop-shadow">
                Empower your agriculture with real-time insights & AI
                optimization
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2 text-white/90">
                  <Sprout className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    {statistics.totalFields} Fields
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    {statistics.avgHealth}% Avg Health
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={fetchFields}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 text-white rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl font-semibold transform hover:-translate-y-1"
          >
            <span className="text-sm">Refresh Data</span>
            <ArrowUpRight
              size={18}
              className="group-hover:rotate-45 transition-transform"
            />
          </button>
        </div>
      </div>

      {/* Farm Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <Sprout className="w-8 h-8 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Total
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {statistics.totalFields}
          </p>
          <p className="text-xs text-gray-600 font-medium">Active Fields</p>
        </div>

        <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <MapPin className="w-8 h-8 text-blue-600" />
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Area
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {statistics.totalArea}
          </p>
          <p className="text-xs text-gray-600 font-medium">Total Acres</p>
        </div>

        <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
              Health
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {statistics.avgHealth}%
          </p>
          <p className="text-xs text-gray-600 font-medium">Average Score</p>
        </div>

        <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-purple-600" />
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              Active
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {statistics.activeFields}
          </p>
          <p className="text-xs text-gray-600 font-medium">Monitoring Now</p>
        </div>
      </div>

      {/* Field Selector with Glassmorphism */}
      <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></span>
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Select Field
          </label>
        </div>

        {fields.length > 0 ? (
          <div className="flex gap-3 flex-wrap">
            {fields.map((field) => (
              <button
                key={field._id}
                onClick={() => handleFieldClick(field)}
                className="px-7 py-3.5 rounded-2xl font-semibold transition-all duration-300 border-2 shadow-md hover:shadow-xl transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border-gray-200 hover:border-emerald-300"
              >
                <div className="flex items-center gap-2">
                  <Sprout className="w-4 h-4" />
                  <span>{field.fieldName}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-emerald-50 rounded-2xl p-10 text-center border-2 border-dashed border-gray-300">
            <Sprout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 mb-5 font-semibold text-lg">
              No fields found
            </p>
            <button
              onClick={() => switchView("fields")}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl font-semibold transform hover:-translate-y-1"
            >
              Create your first field
            </button>
          </div>
        )}
      </div>

      {/* Selected Field Info Banner */}
      {selectedField && (
        <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-7 shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

          <div className="relative flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-2xl flex-shrink-0 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold mb-2 text-xl drop-shadow-lg">
                {selectedField.fieldName} - Active Monitoring
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div className="flex items-center gap-2 text-white/95">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {selectedField.location?.village &&
                      `${selectedField.location.village}, `}
                    {selectedField.location?.district}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/95">
                  <Sprout className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {selectedField.cropType}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/95">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {selectedField.fieldArea?.value}{" "}
                    {selectedField.fieldArea?.unit}
                  </span>
                </div>
              </div>
              <p className="text-sm text-white/80 font-medium drop-shadow">
                Click field name to view detailed analytics, AI recommendations,
                and real-time monitoring data
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid with Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Soil Moisture Card */}
        <div className="group backdrop-blur-xl bg-white/70 border border-white/20 hover:border-blue-300 rounded-3xl p-7 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <Droplets className="w-7 h-7 text-white" />
              </div>
              <span className="px-4 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-300 shadow-sm">
                Optimal
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-3 font-bold uppercase tracking-wide">
              Soil Moisture
            </h3>
            <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              {selectedField?.soilData?.moisture || "68"}%
            </p>
            <p className="text-xs text-gray-600 font-semibold">
              {selectedField?.soilData?.moisture > 50
                ? "Optimal Range"
                : "Needs Attention"}
            </p>
          </div>
        </div>

        {/* Temperature Card */}
        <div className="group backdrop-blur-xl bg-white/70 border border-white/20 hover:border-orange-300 rounded-3xl p-7 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <ThermometerSun className="w-7 h-7 text-white" />
              </div>
              <span className="px-4 py-1.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full border border-orange-300 shadow-sm">
                Moderate
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-3 font-bold uppercase tracking-wide">
              Temperature
            </h3>
            <p className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
              {selectedField?.weatherData?.temperature || "28"}°C
            </p>
            <p className="text-xs text-gray-600 font-semibold">
              Current Condition
            </p>
          </div>
        </div>

        {/* Field Health Card */}
        <div className="group backdrop-blur-xl bg-white/70 border border-white/20 hover:border-emerald-300 rounded-3xl p-7 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${getHealthBgColor(
              selectedField?.overallHealth?.score || 89
            )} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          ></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-300 shadow-sm">
                +3%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-3 font-bold uppercase tracking-wide">
              Field Health
            </h3>
            <p
              className={`text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 ${getHealthColor(
                selectedField?.overallHealth?.score || 89
              )}`}
            >
              {selectedField?.overallHealth?.score || 89}%
            </p>
            <p className="text-xs text-gray-600 font-semibold">
              {selectedField?.overallHealth?.status || "NDVI Score"}
            </p>
          </div>
        </div>

        {/* AI Optimization Card */}
        <div className="group backdrop-blur-xl bg-white/70 border border-white/20 hover:border-purple-300 rounded-3xl p-7 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 via-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <Target className="w-7 h-7 text-white" />
              </div>
              <span className="px-4 py-1.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full border border-purple-300 shadow-sm">
                Active
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-3 font-bold uppercase tracking-wide">
              AI Optimization
            </h3>
            <p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              94%
            </p>
            <p className="text-xs text-gray-600 font-semibold">
              Efficiency Score
            </p>
          </div>
        </div>
      </div>

      {/* Weather Conditions (if available) */}
      {selectedField && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                <Wind className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">
                  Wind Speed
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {selectedField.weatherData?.windSpeed || "12"} km/h
                </p>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center">
                <Sun className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">Humidity</p>
                <p className="text-lg font-bold text-gray-900">
                  {selectedField.weatherData?.humidity || "65"}%
                </p>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <CloudRain className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">Rainfall</p>
                <p className="text-lg font-bold text-gray-900">
                  {selectedField.weatherData?.rainfall || "0"} mm
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions with Enhanced Design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => switchView("weather")}
          className="backdrop-blur-xl bg-white/70 border border-white/20 hover:border-blue-400 rounded-3xl p-8 text-left transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-5 group-hover:bg-gradient-to-br group-hover:from-blue-200 group-hover:to-cyan-200 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-6 shadow-md">
              <Cloud className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-gray-900 font-bold mb-2 text-xl">
              Weather Intelligence
            </h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              View real-time weather forecasts & crop stress indicators for your
              fields
            </p>
          </div>
        </button>

        <button
          onClick={() => switchView("fields")}
          className="backdrop-blur-xl bg-white/70 border border-white/20 hover:border-emerald-400 rounded-3xl p-8 text-left transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-5 group-hover:bg-gradient-to-br group-hover:from-emerald-200 group-hover:to-teal-200 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-6 shadow-md">
              <Sprout className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-gray-900 font-bold mb-2 text-xl">
              Manage Fields
            </h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Add new fields, update existing ones, or view detailed field
              information
            </p>
          </div>
        </button>

        <button
          onClick={() => switchView("ai-recommendations")}
          className="backdrop-blur-xl bg-white/70 border border-white/20 hover:border-purple-400 rounded-3xl p-8 text-left transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-5 group-hover:bg-gradient-to-br group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-6 shadow-md">
              <Target className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-gray-900 font-bold mb-2 text-xl">
              AI Recommendations
            </h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Get intelligent irrigation, fertilizer, and crop management advice
            </p>
          </div>
        </button>
      </div>

      {/* Alerts Section (if any issues) */}
      {selectedField && selectedField.soilData?.moisture < 40 && (
        <div className="backdrop-blur-xl bg-red-50/70 border border-red-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-red-900 font-bold mb-2 text-lg">
                Irrigation Alert
              </h3>
              <p className="text-red-700 text-sm font-medium">
                Soil moisture levels are below optimal range for{" "}
                <strong>{selectedField.fieldName}</strong>. Consider scheduling
                irrigation to maintain crop health.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
