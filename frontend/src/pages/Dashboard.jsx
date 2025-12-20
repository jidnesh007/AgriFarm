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
  LineChart,
  Map,
  Brain,
  Menu,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axios from "axios";

// Import your existing component files
import DashboardContent from "../components/DashboardContent";
import FieldsContent from "../pages/FieldList";
import AIRecommendationsContent from "../components/AiRecommendation";
import WeatherContent from "../components/Weather";
import DiseaseDetectionContent from "../components/DiseaseDetection";
import Analytics from "../components/Analytics";
import LanguageSelector from "../components/LanguageSelector";

function Dashboard() {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const getHeaderTitle = () => {
    const titleMap = {
      "dashboard": t('header.farmOverview'),
      "field-map": t('header.fieldManagement'),
      "ai-assistant": t('header.smartAdvisory'),
      "crop-health": t('header.plantHealthCheck'),
      "analytics": t('header.analyticsDashboard'),
      "weather": t('header.weatherStation'),
      "notifications": t('header.allNotifications'),
      "settings": t('nav.settings')
    };
    return titleMap[currentView] || t('header.farmOverview');
  };

  return (
    <div className="flex h-screen bg-[#F0FDF4] relative overflow-hidden font-sans">
      {/* --- NATURE BACKGROUND PATTERN --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07]"></div>
        <Sun className="absolute -top-20 -right-20 text-yellow-400 opacity-10 w-96 h-96 animate-pulse-slow" />
        <Leaf className="absolute bottom-10 -left-10 text-emerald-600 opacity-5 w-80 h-80 rotate-45" />
        <Sprout className="absolute bottom-40 left-20 text-emerald-400 opacity-10 w-40 h-40 -rotate-12" />
        <Cloud className="absolute top-20 left-1/4 text-emerald-200 opacity-20 w-32 h-32" />
        <Cloud className="absolute top-40 right-1/4 text-emerald-200 opacity-20 w-24 h-24" />
      </div>

      {/* --- SIDEBAR --- */}
      <aside className={`${isSidebarCollapsed ? "w-20" : "w-72"} bg-emerald-900 text-white shadow-2xl flex flex-col relative z-20 rounded-r-3xl my-4 ml-4 h-[calc(100vh-2rem)] transition-all duration-300 ease-in-out`}>
        {/* Decorative Circles on Sidebar */}
        {!isSidebarCollapsed && (
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-r-3xl pointer-events-none opacity-10">
            <CircleDashed className="absolute -top-10 -left-10 w-40 h-40 text-white" />
            <Flower2 className="absolute bottom-10 right-0 w-48 h-48 text-white translate-x-1/2" />
          </div>
        )}

        {/* Logo & Toggle Section */}
        <div className={`p-5 relative z-10 flex items-center ${isSidebarCollapsed ? "flex-col gap-4" : "justify-between"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg">
              <Leaf className="w-6 h-6 text-emerald-700 fill-emerald-700" />
            </div>
            {!isSidebarCollapsed && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="text-2xl font-bold tracking-tight block">Sigro</span>
                <p className="text-[10px] text-emerald-300 uppercase tracking-widest">Agri AI</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={toggleSidebar} 
            className="p-2 hover:bg-emerald-800 rounded-lg transition-colors"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <Menu size={22} /> : <ChevronLeft size={22} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-2 overflow-y-auto relative z-10 py-4 scrollbar-thin scrollbar-thumb-emerald-700 scrollbar-track-transparent">
          <NavItem
            icon={<BarChart3 className="w-5 h-5" />}
            label={t('nav.dashboard')}
            active={currentView === "dashboard"}
            onClick={() => switchView("dashboard")}
            isCollapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<Map className="w-5 h-5" />}
            label={t('nav.myFields')}
            active={currentView === "field-map"}
            onClick={() => switchView("field-map")}
            isCollapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<Brain className="w-5 h-5" />}
            label={t('nav.aiAssistant')}
            active={currentView === "ai-assistant"}
            onClick={() => switchView("ai-assistant")}
            isCollapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<Cloud className="w-5 h-5" />}
            label={t('nav.weather')}
            active={currentView === "weather"}
            onClick={() => switchView("weather")}
            isCollapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<Camera className="w-5 h-5" />}
            label={t('nav.cropHealth')}
            active={currentView === "crop-health"}
            onClick={() => switchView("crop-health")}
            isCollapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<LineChart className="w-5 h-5" />}
            label={t('nav.analytics')}
            active={currentView === "analytics"}
            onClick={() => switchView("analytics")}
            isCollapsed={isSidebarCollapsed}
          />

          <div className="py-3 px-2">
            <div className="h-px bg-emerald-800/50"></div>
          </div>

          <NavItem
            icon={<Bell className="w-5 h-5" />}
            label={t('nav.notifications')}
            active={currentView === "notifications"}
            onClick={() => switchView("notifications")}
            badge={isSidebarCollapsed ? null : 3}
            isCollapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<Settings className="w-5 h-5" />}
            label={t('nav.settings')}
            active={currentView === "settings"}
            onClick={() => switchView("settings")}
            isCollapsed={isSidebarCollapsed}
          />
        </nav>

        {/* User Profile Section */}
        <div className={`p-4 mt-auto border-t border-emerald-800/50 relative z-10 bg-emerald-950/30 rounded-br-3xl`}>
          <div className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"} mb-4`}>
            <div className="w-10 h-10 rounded-full bg-emerald-200 flex-shrink-0 flex items-center justify-center border-2 border-white">
              <User className="w-5 h-5 text-emerald-800" />
            </div>
            {!isSidebarCollapsed && (
              <div className="whitespace-nowrap animate-in fade-in duration-300">
                <p className="text-sm font-bold text-white">
                  {localStorage.getItem("userName") || "Farmer"}
                </p>
                <p className="text-xs text-emerald-300 flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current" /> {t('user.premium')}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 ${isSidebarCollapsed ? "p-2.5" : "px-4 py-2.5"} bg-emerald-800 hover:bg-red-500/80 hover:text-white text-emerald-100 rounded-lg transition-all duration-300 text-sm font-medium`}
            title={isSidebarCollapsed ? t('nav.logout') : ""}
          >
            <LogOut className="w-4 h-4" />
            {!isSidebarCollapsed && <span>{t('nav.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <header className="px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">
              {getHeaderTitle()}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1 w-8 bg-emerald-500 rounded-full"></div>
              <p className="text-sm text-emerald-600 font-medium tracking-wide">{t('header.liveMonitoring')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSelector />
            <button className="p-3 bg-white/60 hover:bg-white backdrop-blur-md rounded-full shadow-sm text-emerald-900 transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            <button onClick={() => switchView("settings")} className="p-3 bg-white/60 hover:bg-white backdrop-blur-md rounded-full shadow-sm text-emerald-900 transition-all hover:rotate-90 duration-500">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 pb-8 scrollbar-thin scrollbar-thumb-emerald-400 scrollbar-track-transparent">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                  <Sprout className="w-8 h-8 text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <p className="text-gray-700 font-semibold text-lg">{t('loading.farmData')}</p>
              </div>
            </div>
          ) : (
            <>
              {currentView === "dashboard" && <DashboardContent fields={fields} selectedField={selectedField} statistics={statistics} fetchFields={fetchFields} handleFieldClick={handleFieldClick} getHealthColor={getHealthColor} getHealthBgColor={getHealthBgColor} switchView={switchView} />}
              {currentView === "field-map" && <FieldsContent fields={fields} fetchFields={fetchFields} handleFieldClick={handleFieldClick} switchView={switchView} />}
              {currentView === "crop-health" && <DiseaseDetectionContent fields={fields} fetchFields={fetchFields} handleFieldClick={handleFieldClick} />}
              {currentView === "weather" && <WeatherContent fields={fields} selectedField={selectedField} />}
              {currentView === "ai-assistant" && <AIRecommendationsContent />}
              {currentView === "analytics" && <Analytics />}
              {currentView === "notifications" && <PlaceholderView title={t('header.allNotifications')} />}
              {currentView === "settings" && <PlaceholderView title={t('nav.settings')} />}
            </>
          )}
        </main>
      </div>

      <style jsx>{`
        @keyframes pulse-slow { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } }
        .animate-pulse-slow { animation: pulse-slow 5s ease-in-out infinite; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; height: 6px; }
        .scrollbar-thumb-emerald-700::-webkit-scrollbar-thumb { background-color: rgb(4 120 87); border-radius: 3px; }
        .scrollbar-track-transparent::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
}

const NavItem = ({ icon, label, active, onClick, badge, isCollapsed }) => (
  <button
    onClick={onClick}
    title={isCollapsed ? label : ""}
    className={`w-full flex items-center ${isCollapsed ? "justify-center" : "justify-between"} gap-3 px-4 py-4 rounded-xl transition-all duration-300 group relative ${
      active ? "bg-emerald-50 text-emerald-900 shadow-lg" : "text-emerald-100 hover:bg-emerald-800/50 hover:text-white"
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`${active ? "fill-current" : ""}`}>{icon}</div>
      {!isCollapsed && <span className="font-semibold whitespace-nowrap animate-in fade-in duration-300">{label}</span>}
    </div>
    
    {!isCollapsed && active && <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>}
    {!isCollapsed && badge && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">{badge}</span>}
    {isCollapsed && active && <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full shadow-[0_0_8px_white]"></div>}
  </button>
);

const PlaceholderView = ({ title }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <Brain className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-emerald-900 mb-2">{title}</h2>
        <p className="text-gray-500 mb-6">{t('placeholder.comingSoon')}</p>
      </div>
    </div>
  );
};

export default Dashboard;
