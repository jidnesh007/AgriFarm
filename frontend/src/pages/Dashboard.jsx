import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Target,
  Sprout,
  Settings,
  LogOut,
  Bell,
  User,
  TrendingUp,
  Droplets,
  Leaf,
  Cloud,
  MapPin,
  ArrowUpRight,
  Sparkles,
  Activity,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [selectedField, setSelectedField] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFields();
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleFieldClick = (field) => {
    navigate(`/field/${field._id}`);
  };

  const handleFieldsNavigation = () => {
    navigate("/fields");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-emerald-200/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-teal-200/30 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Sidebar with Glassmorphism */}
      <aside className="w-72 backdrop-blur-xl bg-white/70 border-r border-white/20 shadow-2xl flex flex-col relative z-10">
        {/* Logo Section */}
        <div className="p-6 border-b border-white/30">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-3">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                AgriSync
              </span>
              <p className="text-xs text-gray-600 font-medium">
                Smart Farming Platform
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <BarChart3 className="w-5 h-5 relative z-10" />
            <span className="font-semibold relative z-10">Dashboard</span>
            <Sparkles className="w-4 h-4 ml-auto relative z-10 opacity-70" />
          </button>

          <button
            onClick={() => navigate("/ai-recommendation")}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-white/60 backdrop-blur-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group"
          >
            <Target className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span className="font-medium">AI Recommendations</span>
          </button>

          <button
            onClick={handleFieldsNavigation}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-white/60 backdrop-blur-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group"
          >
            <Sprout className="w-5 h-5 text-teal-600 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Fields</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-white/60 backdrop-blur-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group">
            <Activity className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Analytics</span>
          </button>

          <button
            onClick={() => navigate("/weather")}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-white/60 backdrop-blur-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group"
          >
            <Cloud className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Weather</span>
          </button>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-white/30 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 mb-3 border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Farmer</p>
                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Premium Account
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-700 hover:bg-red-50 backdrop-blur-sm border border-gray-200 hover:border-red-300 rounded-2xl transition-all duration-300 font-medium hover:shadow-md"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Top Header with Glassmorphism */}
        <header className="backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-2">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600 flex items-center gap-2 font-medium">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></span>
                Real-time farm monitoring & AI optimization
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-3 hover:bg-white/60 backdrop-blur-sm rounded-2xl transition-all duration-300 hover:shadow-md group">
                <Bell className="w-5 h-5 text-gray-700 group-hover:scale-110 transition-transform" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
              </button>
              <button className="p-3 hover:bg-white/60 backdrop-blur-sm rounded-2xl transition-all duration-300 hover:shadow-md group">
                <Settings className="w-5 h-5 text-gray-700 group-hover:rotate-90 transition-transform duration-300" />
              </button>
              <button className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <User className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section with Enhanced Gradients */}
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
                      Welcome to AgriSync
                    </h2>
                    <p className="text-base text-white/90 font-medium drop-shadow">
                      Empower your agriculture with real-time insights & AI
                      optimization
                    </p>
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

            {/* Field Selector with Glassmorphism */}
            <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></span>
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Select Field
                </label>
              </div>

              {loading ? (
                <div className="flex items-center gap-4 text-gray-600 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                  <div className="w-6 h-6 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-medium">Loading fields...</span>
                </div>
              ) : fields.length > 0 ? (
                <div className="flex gap-3 flex-wrap">
                  {fields.map((field) => (
                    <button
                      key={field._id}
                      onClick={() => handleFieldClick(field)}
                      className={`px-7 py-3.5 rounded-2xl font-semibold transition-all duration-300 border-2 shadow-md hover:shadow-xl transform hover:-translate-y-1 ${
                        selectedField?._id === field._id
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-600 shadow-emerald-200"
                          : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      {field.fieldName}
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
                    onClick={handleFieldsNavigation}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl font-semibold transform hover:-translate-y-1"
                  >
                    Create your first field
                  </button>
                </div>
              )}
            </div>

            {/* Info Banner with Enhanced Design */}
            {selectedField && (
              <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-7 shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

                <div className="relative flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-2xl flex-shrink-0 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2 text-xl drop-shadow-lg">
                      {selectedField.fieldName} Monitoring Active
                    </h3>
                    <p className="text-base text-white/95 font-medium drop-shadow mb-2">
                      {selectedField.location.village &&
                        `${selectedField.location.village}, `}
                      {selectedField.location.district} •{" "}
                      {selectedField.cropType} • {selectedField.fieldArea.value}{" "}
                      {selectedField.fieldArea.unit}
                    </p>
                    <p className="text-sm text-white/80 font-medium drop-shadow">
                      Click field name above to view detailed analytics and AI
                      recommendations
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Grid with Enhanced Glassmorphism */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Soil Moisture Card */}
              <div className="group backdrop-blur-xl bg-white/70 border border-white/20 hover:border-blue-300 rounded-3xl p-7 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <Droplets className="w-7 h-7 text-white" />
                    </div>
                    <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-300 shadow-sm">
                      +6%
                    </span>
                  </div>
                  <h3 className="text-gray-600 text-sm mb-3 font-bold uppercase tracking-wide">
                    Soil Moisture
                  </h3>
                  <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                    68%
                  </p>
                  <p className="text-xs text-gray-600 font-semibold">
                    Status: Optimal Range
                  </p>
                </div>
              </div>

              {/* Soil NPK Card */}
              <div className="group backdrop-blur-xl bg-white/70 border border-white/20 hover:border-orange-300 rounded-3xl p-7 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <Leaf className="w-7 h-7 text-white" />
                    </div>
                    <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-300 shadow-sm">
                      Balanced
                    </span>
                  </div>
                  <h3 className="text-gray-600 text-sm mb-3 font-bold uppercase tracking-wide">
                    Soil NPK
                  </h3>
                  <p className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                    7.2
                  </p>
                  <p className="text-xs text-gray-600 font-semibold">
                    N:P:K Ratio
                  </p>
                </div>
              </div>

              {/* Field Health Card */}
              <div className="group backdrop-blur-xl bg-white/70 border border-white/20 hover:border-emerald-300 rounded-3xl p-7 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
                  <p className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                    {selectedField?.overallHealth?.score || 89}%
                  </p>
                  <p className="text-xs text-gray-600 font-semibold">
                    NDVI Score
                  </p>
                </div>
              </div>

              {/* Optimization Card */}
              <div className="group backdrop-blur-xl bg-white/70 border border-white/20 hover:border-purple-300 rounded-3xl p-7 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-400 via-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <Target className="w-7 h-7 text-white" />
                    </div>
                    <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-300 shadow-sm">
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

            {/* Quick Actions with Enhanced Design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => navigate("/weather")}
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
                    View real-time weather & crop stress indicators
                  </p>
                </div>
              </button>

              <button
                onClick={handleFieldsNavigation}
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
                    Add new fields or update existing ones
                  </p>
                </div>
              </button>

              <button className="backdrop-blur-xl bg-white/70 border border-white/20 hover:border-purple-400 rounded-3xl p-8 text-left transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-5 group-hover:bg-gradient-to-br group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-6 shadow-md">
                    <Target className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-gray-900 font-bold mb-2 text-xl">
                    AI Recommendations
                  </h3>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    Get intelligent irrigation & fertilizer advice
                  </p>
                </div>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
