import React from "react";
import {
  Sprout,
  MapPin,
  ArrowUpRight,
  TrendingUp,
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
  Waves,
  Calendar,
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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* --- HERO BANNER (Matches the "Agriculture Company" top visual) --- */}
      <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
        {/* Background color & pattern */}
        <div className="absolute inset-0 bg-emerald-900">
          {/* Zig Zag pattern simulation */}
          <div className="absolute top-0 left-0 w-full h-4 bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%,rgba(255,255,255,0.1)_100%)] bg-[length:20px_20px] opacity-20"></div>
        </div>

        {/* Background Icons (Layered) */}
        <Sun className="absolute -top-10 -right-10 w-64 h-64 text-yellow-500 opacity-20 animate-spin-slow" />
        <Leaf className="absolute bottom-[-50px] left-20 w-48 h-48 text-emerald-800 opacity-30 rotate-12" />
        <Cloud className="absolute top-10 right-[20%] w-32 h-32 text-emerald-700 opacity-20" />

        <div className="relative z-10 p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/50 border border-emerald-700 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-emerald-300">
              <Sun className="w-3 h-3" /> Season 2025
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Organic <br /> Agriculture{" "}
              <span className="text-emerald-400">Company</span>
            </h2>
            <p className="text-emerald-100/80 text-lg font-medium">
              Monitor your {statistics.totalFields} fields with precision AI.
              Current average health is looking optimal.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-md border border-white/10">
                <Sprout className="w-5 h-5 text-emerald-300" />
                <span className="font-bold">{statistics.totalArea} Acres</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-md border border-white/10">
                <TrendingUp className="w-5 h-5 text-emerald-300" />
                <span className="font-bold">
                  +{statistics.avgHealth}% Yield
                </span>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <button
              onClick={fetchFields}
              className="relative flex items-center gap-3 px-8 py-4 bg-white text-emerald-900 rounded-full font-bold shadow-xl hover:scale-105 transition-transform"
            >
              <span>Update Data</span>
              <div className="w-8 h-8 bg-emerald-900 rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* --- STATISTICS CARDS (Clean White on Textured Background) --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Fields",
            value: statistics.totalFields,
            sub: "Active Plots",
            icon: Sprout,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Total Area",
            value: statistics.totalArea,
            sub: "Hectares",
            icon: MapPin,
            color: "text-teal-600",
            bg: "bg-teal-50",
          },
          {
            label: "Field Health",
            value: `${statistics.avgHealth}%`,
            sub: "Average Score",
            icon: Activity,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Alerts",
            value: "2",
            sub: "Require Action",
            icon: AlertCircle,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-emerald-100/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            {/* Background Decor */}
            <stat.icon
              className={`absolute -bottom-4 -right-4 w-24 h-24 ${stat.color} opacity-[0.05] group-hover:opacity-10 transition-opacity rotate-12`}
            />

            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-md text-gray-500 uppercase">
                Stat
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-500 font-medium text-sm mt-1">
                {stat.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* --- MAIN GRID: FIELD SELECTOR & INFO --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Field List (Looks like a menu) */}
        <div className="lg:col-span-1 bg-white rounded-[2rem] p-6 shadow-lg border border-emerald-50 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <Sprout className="w-5 h-5 text-emerald-600 fill-emerald-600" />
            <h3 className="font-bold text-lg text-gray-800">Your Fields</h3>
          </div>

          <div className="space-y-3">
            {fields.length > 0 ? (
              fields.map((field) => (
                <button
                  key={field._id}
                  onClick={() => handleFieldClick(field)}
                  className={`w-full text-left p-4 rounded-xl transition-all border-2 flex items-center justify-between group ${
                    selectedField?._id === field._id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-transparent bg-gray-50 hover:bg-white hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        field.overallHealth?.score > 70
                          ? "bg-green-500"
                          : "bg-orange-500"
                      }`}
                    ></div>
                    <div>
                      <p
                        className={`font-bold ${
                          selectedField?._id === field._id
                            ? "text-emerald-900"
                            : "text-gray-700"
                        }`}
                      >
                        {field.fieldName}
                      </p>
                      <p className="text-xs text-gray-400 font-medium">
                        {field.cropType}
                      </p>
                    </div>
                  </div>
                  {selectedField?._id === field._id && (
                    <Leaf className="w-4 h-4 text-emerald-600" />
                  )}
                </button>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
                No fields found
              </div>
            )}
            <button
              onClick={() => switchView("fields")}
              className="w-full py-3 mt-4 border-2 border-dashed border-emerald-200 text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-colors"
            >
              + Add New Field
            </button>
          </div>
        </div>

        {/* Right Col: Detailed View (The "Poster" style info card) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedField ? (
            <>
              {/* Field Hero Info */}
              <div className="bg-[#103125] text-white rounded-[2rem] p-8 relative overflow-hidden shadow-2xl">
                {/* Abstract Decor */}
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-emerald-800 to-transparent opacity-50"></div>
                <div className="absolute bottom-0 right-0 p-8 opacity-10">
                  <Sprout size={120} />
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-400 mb-2">
                        <MapPin size={16} />
                        <span className="text-sm font-bold tracking-wide uppercase">
                          {selectedField.location?.village},{" "}
                          {selectedField.location?.district}
                        </span>
                      </div>
                      <h2 className="text-4xl font-bold mb-4">
                        {selectedField.fieldName}
                      </h2>
                      <div className="flex gap-4">
                        <span className="px-4 py-1.5 rounded-full bg-white/20 text-sm backdrop-blur-md border border-white/10">
                          {selectedField.cropType}
                        </span>
                        <span className="px-4 py-1.5 rounded-full bg-emerald-600 text-sm shadow-lg">
                          Active Monitoring
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-emerald-300 mb-1">
                        Health Score
                      </p>
                      <div className="text-6xl font-bold text-white tracking-tighter">
                        {selectedField.overallHealth?.score || 89}
                        <span className="text-2xl text-emerald-400">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Soil Moisture */}
                <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-[2rem] relative overflow-hidden group hover:bg-blue-50 transition-colors">
                  <Waves className="absolute -right-4 -bottom-4 text-blue-200 w-32 h-32 opacity-50 group-hover:rotate-12 transition-transform" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                        <Droplets size={20} />
                      </div>
                      <span className="font-bold text-blue-900">
                        Soil Moisture
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-blue-900">
                        {selectedField.soilData?.moisture || "68"}%
                      </span>
                      <span className="text-sm text-blue-600 font-medium">
                        Optimal
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 h-2 rounded-full mt-4 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: "68%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Weather Info */}
                <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-[2rem] relative overflow-hidden group hover:bg-amber-50 transition-colors">
                  <Sun className="absolute -right-4 -bottom-4 text-amber-200 w-32 h-32 opacity-50 group-hover:rotate-12 transition-transform" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                        <ThermometerSun size={20} />
                      </div>
                      <span className="font-bold text-amber-900">
                        Temperature
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-amber-900">
                        {selectedField.weatherData?.temperature || "28"}°C
                      </span>
                      <span className="text-sm text-amber-600 font-medium">
                        Sunny
                      </span>
                    </div>
                    <div className="flex gap-4 mt-4 text-sm text-amber-800 font-medium">
                      <div className="flex items-center gap-1">
                        <Wind size={14} /> 12 km/h
                      </div>
                      <div className="flex items-center gap-1">
                        <CloudRain size={14} /> 0% Chance
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[1.5rem] p-1 shadow-lg">
                <div className="bg-white/95 backdrop-blur-sm rounded-[1.3rem] p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                      <Target size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        AI Recommendations Ready
                      </h4>
                      <p className="text-sm text-gray-500">
                        We have found 3 ways to optimize your yield.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => switchView("ai-recommendations")}
                    className="bg-emerald-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-colors"
                  >
                    View Insights
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-white rounded-[2rem] border-2 border-dashed border-gray-200 p-10 text-center opacity-70">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Sprout size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-600">
                Select a field to view details
              </h3>
              <p className="text-gray-400 mt-2">
                Click on a field from the list on the left to see live metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
