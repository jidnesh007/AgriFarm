import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Camera,
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
  Wind,
  Sun,
  CloudRain,
  ThermometerSun,
  AlertCircle,
  CheckCircle,
  Plus,
  ArrowLeft,
  Brain,
  Loader,
  Edit2,
  X,
  RefreshCw,
  Thermometer,
  AlertTriangle,
  Clock,
  Eye,
  Gauge,
  CloudDrizzle,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Import your separate component files
import DashboardContent from "../components/DashboardContent";
import FieldsContent from "../pages/FieldList";
import AIRecommendationsContent from "../components/AiRecommendation";
import WeatherContent from "../components/Weather";
import DiseaseDetectionContent from "../components/DiseaseDetection";

function Dashboard() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedField, setSelectedField] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalFields: 0,
    totalArea: 0,
    avgHealth: 0,
    activeFields: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/fields", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fieldsData = response.data.fields || [];
      setFields(fieldsData);

      if (fieldsData.length > 0) {
        setSelectedField(fieldsData[0]);
        calculateStatistics(fieldsData);
      }
    } catch (error) {
      console.error("Error fetching fields:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (fieldsData) => {
    const totalFields = fieldsData.length;
    const totalArea = fieldsData.reduce(
      (sum, field) => sum + (parseFloat(field.fieldArea?.value) || 0),
      0
    );
    const avgHealth =
      fieldsData.reduce(
        (sum, field) => sum + (field.overallHealth?.score || 0),
        0
      ) / totalFields || 0;
    const activeFields = fieldsData.filter(
      (field) => field.isActive !== false
    ).length;

    setStatistics({
      totalFields,
      totalArea: totalArea.toFixed(2),
      avgHealth: avgHealth.toFixed(1),
      activeFields,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleFieldClick = (field) => {
    setSelectedField(field);
    navigate(`/field/${field._id}`);
  };

  const getHealthColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthBgColor = (score) => {
    if (score >= 80) return "from-green-50 to-emerald-50";
    if (score >= 60) return "from-yellow-50 to-orange-50";
    return "from-red-50 to-pink-50";
  };

  const switchView = (view) => {
    setCurrentView(view);
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
                Sigro
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
            onClick={() => switchView("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group ${
              currentView === "dashboard"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                : "text-gray-700 hover:bg-white/60 backdrop-blur-sm"
            }`}
          >
            {currentView === "dashboard" && (
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
            <BarChart3 className="w-5 h-5 relative z-10" />
            <span className="font-semibold relative z-10">Dashboard</span>
            {currentView === "dashboard" && (
              <Sparkles className="w-4 h-4 ml-auto relative z-10 opacity-70" />
            )}
          </button>

          <button
            onClick={() => switchView("ai-recommendations")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group ${
              currentView === "ai-recommendations"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                : "text-gray-700 hover:bg-white/60 backdrop-blur-sm"
            }`}
          >
            <Target
              className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                currentView === "ai-recommendations"
                  ? "text-white"
                  : "text-emerald-600"
              }`}
            />
            <span className="font-medium">AI Recommendations</span>
          </button>

          <button
            onClick={() => switchView("fields")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group ${
              currentView === "fields"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                : "text-gray-700 hover:bg-white/60 backdrop-blur-sm"
            }`}
          >
            <Sprout
              className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                currentView === "fields" ? "text-white" : "text-teal-600"
              }`}
            />
            <span className="font-medium">Fields</span>
          </button>

          <button
            onClick={() => navigate("/analytics")}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-white/60 backdrop-blur-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group"
          >
            <Activity className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Analytics</span>
          </button>

          <button
            onClick={() => switchView("weather")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group ${
              currentView === "weather"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                : "text-gray-700 hover:bg-white/60 backdrop-blur-sm"
            }`}
          >
            <Cloud
              className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                currentView === "weather" ? "text-white" : "text-blue-600"
              }`}
            />
            <span className="font-medium">Weather</span>
          </button>

          <button
            onClick={() => switchView("disease-detection")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group ${
              currentView === "disease-detection"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                : "text-gray-700 hover:bg-white/60 backdrop-blur-sm"
            }`}
          >
            <Camera
              className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                currentView === "disease-detection"
                  ? "text-white"
                  : "text-red-600"
              }`}
            />
            <span className="font-medium">Disease Detection</span>
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
                <p className="text-sm font-bold text-gray-900">
                  {localStorage.getItem("userName") || "Farmer"}
                </p>
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
                {currentView === "dashboard"
                  ? "Dashboard"
                  : currentView === "fields"
                  ? "My Fields"
                  : currentView === "ai-recommendations"
                  ? "AI Recommendations"
                  : currentView === "disease-detection"
                  ? "Disease Detection"
                  : "Weather Intelligence"}
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
              <button
                onClick={() => navigate("/settings")}
                className="p-3 hover:bg-white/60 backdrop-blur-sm rounded-2xl transition-all duration-300 hover:shadow-md group"
              >
                <Settings className="w-5 h-5 text-gray-700 group-hover:rotate-90 transition-transform duration-300" />
              </button>
              <button className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <User className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area - Renders based on currentView */}
        <main className="flex-1 overflow-y-auto p-8">
          {currentView === "dashboard" && (
            <DashboardContent
              fields={fields}
              selectedField={selectedField}
              statistics={statistics}
              fetchFields={fetchFields}
              handleFieldClick={handleFieldClick}
              getHealthColor={getHealthColor}
              getHealthBgColor={getHealthBgColor}
              switchView={switchView}
            />
          )}

          {currentView === "fields" && (
            <FieldsContent
              fields={fields}
              fetchFields={fetchFields}
              handleFieldClick={handleFieldClick}
              switchView={switchView}
            />
          )}

          {currentView === "ai-recommendations" && (
            <AIRecommendationsContent
              fields={fields}
              fetchFields={fetchFields}
              handleFieldClick={handleFieldClick}
            />
          )}

          {currentView === "weather" && (
            <WeatherContent fields={fields} selectedField={selectedField} />
          )}

          {currentView === "disease-detection" && <DiseaseDetectionContent />}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
