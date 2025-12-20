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
  Activity,
  Zap,
  Cloud,
  Leaf,
  Sun,
  Wind,
  Flower2,
  CircleDashed,
  Mic,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Import your separate component files
import DashboardContent from "../components/DashboardContent";
import FieldsContent from "../pages/FieldList";
import AIRecommendationsContent from "../components/AiRecommendation";
import WeatherContent from "../components/Weather";
import DiseaseDetectionContent from "../components/DiseaseDetection";
import VoiceAssistant from "../components/VoiceAssistant";

function Dashboard() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedField, setSelectedField] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
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
      try {
        const response = await axios.get("http://localhost:5000/api/fields", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fieldsData = response.data.fields || [];
        setFields(fieldsData);
        if (fieldsData.length > 0) {
          setSelectedField(fieldsData[0]);
          calculateStatistics(fieldsData);
        }
      } catch (err) {
        console.log("API not reachable, using empty state or handle error");
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
    if (score >= 80) return "text-emerald-700";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthBgColor = (score) => {
    if (score >= 80) return "from-emerald-100 to-green-50";
    if (score >= 60) return "from-yellow-50 to-orange-50";
    return "from-red-50 to-pink-50";
  };

  const switchView = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="flex h-screen bg-[#F0FDF4] relative overflow-hidden font-sans">
      {/* --- NATURE BACKGROUND PATTERN --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Dotted Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07]"></div>

        {/* Giant Sun Top Right */}
        <Sun className="absolute -top-20 -right-20 text-yellow-400 opacity-10 w-96 h-96 animate-pulse-slow" />

        {/* Leaves Bottom Left */}
        <Leaf className="absolute bottom-10 -left-10 text-emerald-600 opacity-5 w-80 h-80 rotate-45" />
        <Sprout className="absolute bottom-40 left-20 text-emerald-400 opacity-10 w-40 h-40 -rotate-12" />

        {/* Floating Clouds */}
        <Cloud className="absolute top-20 left-1/4 text-emerald-200 opacity-20 w-32 h-32" />
        <Cloud className="absolute top-40 right-1/4 text-emerald-200 opacity-20 w-24 h-24" />
      </div>

      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-emerald-900 text-white shadow-2xl flex flex-col relative z-20 rounded-r-3xl my-4 ml-4 h-[calc(100vh-2rem)]">
        {/* Decorative Circles on Sidebar */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-r-3xl pointer-events-none opacity-10">
          <CircleDashed className="absolute -top-10 -left-10 w-40 h-40 text-white" />
          <Flower2 className="absolute bottom-10 right-0 w-48 h-48 text-white translate-x-1/2" />
        </div>

        {/* Logo Section */}
        <div className="p-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Leaf className="w-6 h-6 text-emerald-700 fill-emerald-700" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight">Sigro</span>
              <p className="text-[10px] text-emerald-300 uppercase tracking-widest">
                Agriculture AI
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto relative z-10 py-4">
          {[
            { id: "dashboard", icon: BarChart3, label: "Dashboard" },
            { id: "ai-recommendations", icon: Target, label: "AI Insights" },
            { id: "fields", icon: Sprout, label: "My Fields" },
            { id: "weather", icon: Cloud, label: "Weather" },
            { id: "disease-detection", icon: Camera, label: "Disease Cam" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => switchView(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-300 group ${
                currentView === item.id
                  ? "bg-emerald-50 text-emerald-900 shadow-lg translate-x-2"
                  : "text-emerald-100 hover:bg-emerald-800/50 hover:text-white"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${
                  currentView === item.id ? "fill-current" : ""
                }`}
              />
              <span className="font-semibold">{item.label}</span>
              {currentView === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
              )}
            </button>
          ))}

          <button
            onClick={() => navigate("/analytics")}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-xl text-emerald-100 hover:bg-emerald-800/50 hover:text-white transition-all duration-300"
          >
            <Activity className="w-5 h-5" />
            <span className="font-semibold">Analytics</span>
          </button>
        </nav>

        {/* User Profile Section */}
        <div className="p-6 mt-auto border-t border-emerald-800/50 relative z-10 bg-emerald-950/30 rounded-br-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center border-2 border-white">
              <User className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                {localStorage.getItem("userName") || "Farmer"}
              </p>
              <p className="text-xs text-emerald-300 flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current" /> Premium
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-red-500/80 hover:text-white text-emerald-100 rounded-lg transition-all duration-300 text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Top Header */}
        <header className="px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">
              {currentView === "dashboard"
                ? "Farm Overview"
                : currentView === "fields"
                ? "Field Management"
                : currentView === "ai-recommendations"
                ? "Smart Advisory"
                : currentView === "disease-detection"
                ? "Plant Health Check"
                : "Weather Station"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1 w-8 bg-emerald-500 rounded-full"></div>
              <p className="text-sm text-emerald-600 font-medium">
                Live Monitoring Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-3 bg-white/60 hover:bg-white backdrop-blur-md rounded-full shadow-sm text-emerald-900 transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="p-3 bg-white/60 hover:bg-white backdrop-blur-md rounded-full shadow-sm text-emerald-900 transition-all hover:rotate-90 duration-500"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-8 pb-8 scrollbar-hide">
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

      {/* 🎤 FLOATING VOICE ASSISTANT BUTTON */}
      {!showVoiceAssistant && (
        <button
          onClick={() => setShowVoiceAssistant(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 z-50 group"
          title="Voice Assistant - Ask me anything!"
        >
          <Mic className="w-8 h-8 text-white animate-pulse" />

          {/* Ripple Effect */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75 animate-ping"></span>

          {/* Tooltip */}
          <div className="absolute bottom-20 right-0 bg-emerald-900 text-white px-4 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            <p className="text-sm font-semibold">🎤 Voice Assistant</p>
            <p className="text-xs text-emerald-300">Click to ask questions</p>
            <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-emerald-900"></div>
          </div>
        </button>
      )}

      {/* 🤖 VOICE ASSISTANT COMPONENT */}
      {showVoiceAssistant && (
        <VoiceAssistant
          selectedField={selectedField}
          fields={fields}
          onClose={() => setShowVoiceAssistant(false)}
        />
      )}

      {/* Custom CSS for smooth animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.2;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
