import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
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
  CircleDashed,
  Flower2,
  Zap,
  ThermometerSun,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const Weather = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchFields();
  }, []);

  useEffect(() => {
    if (selectedField?._id) {
      fetchWeatherData();
    }
  }, [selectedField]);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (type, messageKey, params = {}) => {
    setNotification({
      type,
      message: t(messageKey, params)
    });
  };

  const fetchFields = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/fields", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFields(response.data.fields || []);
      if (response.data.fields.length > 0) {
        setSelectedField(response.data.fields[0]);
      }
    } catch (error) {
      console.error("Error fetching fields:", error);
      showNotification('error', 'weather.notifications.fetchFieldsError');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherData = async () => {
    if (!selectedField?._id) return;
    setRefreshing(true);
    showNotification('info', 'weather.notifications.fetchingWeather');
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/weather/${selectedField._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWeatherData(response.data);
      showNotification('success', 'weather.notifications.weatherUpdated');
    } catch (error) {
      console.error("Error fetching weather:", error);
      showNotification('error', 'weather.notifications.fetchWeatherError');
    } finally {
      setRefreshing(false);
    }
  };

  const getWeatherIcon = (main) => {
    const props = { className: "w-12 h-12" };
    const iconMap = {
      Clear: <Sun {...props} className="text-yellow-400" />,
      Clouds: <Cloud {...props} className="text-emerald-200" />,
      Rain: <CloudRain {...props} className="text-blue-400" />,
      Drizzle: <CloudDrizzle {...props} className="text-sky-400" />,
      Thunderstorm: <Zap {...props} className="text-purple-400" />,
    };
    return iconMap[main] || <Cloud {...props} className="text-emerald-200" />;
  };

  const getRiskColor = (level) => {
    const colors = {
      Low: "bg-emerald-100 text-emerald-700 border-emerald-200",
      Medium: "bg-amber-100 text-amber-700 border-amber-200",
      High: "bg-rose-100 text-rose-700 border-rose-200",
    };
    return colors[level] || "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getNotificationStyles = (type) => {
    switch(type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-500 text-emerald-900';
      case 'error':
        return 'bg-red-50 border-red-500 text-red-900';
      case 'warning':
        return 'bg-amber-50 border-amber-500 text-amber-900';
      case 'info':
        return 'bg-blue-50 border-blue-500 text-blue-900';
      default:
        return 'bg-gray-50 border-gray-500 text-gray-900';
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'info':
        return <Cloud className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <Cloud className="w-6 h-6 text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-emerald-900 font-medium">{t('weather.loading')}</p>
        </div>
      </div>
    );
  }

  const hasLocationInfo = 
    selectedField?.location?.village ||
    selectedField?.location?.district ||
    (selectedField?.location?.coordinates?.latitude && 
     selectedField?.location?.coordinates?.longitude);

  if (!hasLocationInfo) {
    return (
      <div className="relative p-6 space-y-6">
         <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-emerald-800 font-bold hover:text-emerald-600 transition-all group">
            <div className="p-2 bg-emerald-100 rounded-xl group-hover:-translate-x-1 transition-transform">
              <ArrowLeft size={18} />
            </div>
            {t('weather.navigation.backToDashboard')}
          </button>
          <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-20 text-center border-2 border-dashed border-emerald-200">
            <MapPin size={64} className="mx-auto text-emerald-200 mb-4" />
            <h3 className="text-2xl font-bold text-emerald-900 mb-2">{t('weather.noLocation.title')}</h3>
            <p className="text-emerald-600 mb-8 max-w-sm mx-auto">{t('weather.noLocation.description')}</p>
            <button onClick={() => navigate("/fields")} className="bg-emerald-900 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl transition-all hover:bg-emerald-800">{t('weather.noLocation.button')}</button>
          </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-6 animate-in fade-in duration-500">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right duration-300">
          <div className={`${getNotificationStyles(notification.type)} border-l-4 rounded-xl p-4 shadow-2xl backdrop-blur-sm max-w-md flex items-start gap-3`}>
            {getNotificationIcon(notification.type)}
            <div className="flex-1">
              <p className="text-sm font-semibold">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* --- THEME BACKGROUND DECORATIONS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <CircleDashed className="absolute top-10 left-10 w-64 h-64 text-emerald-900 animate-spin-slow" />
        <Flower2 className="absolute bottom-20 right-10 w-96 h-96 text-emerald-900" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Navigation & Refresh */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-emerald-800 font-bold hover:text-emerald-600 transition-all group"
          >
            <div className="p-2 bg-emerald-100 rounded-xl group-hover:-translate-x-1 transition-transform">
              <ArrowLeft size={18} />
            </div>
            {t('weather.navigation.backToDashboard')}
          </button>

          <button
            onClick={fetchWeatherData}
            disabled={refreshing}
            className="bg-emerald-900 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all active:scale-95 font-bold"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? t('weather.navigation.updating') : t('weather.navigation.manualSync')}
          </button>
        </div>

        {/* Header Insight Card */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-900 p-3 rounded-2xl shadow-lg">
              <Cloud className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-emerald-950 tracking-tight">{t('weather.header.title')}</h1>
              <p className="text-emerald-700/70 text-sm font-medium">{t('weather.header.subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Field Selector */}
        <div className="bg-white/40 backdrop-blur-sm p-2 rounded-2xl border border-emerald-50 flex gap-2 overflow-x-auto no-scrollbar">
          {fields.map((field) => (
            <button
              key={field._id}
              onClick={() => setSelectedField(field)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                selectedField?._id === field._id
                  ? "bg-emerald-900 text-white shadow-md"
                  : "text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              {field.fieldName}
            </button>
          ))}
        </div>

        {weatherData ? (
          <>
            {/* Main Weather Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Weather Card (Hero) */}
              <div className="lg:col-span-2 bg-emerald-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
                <Flower2 className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 group-hover:rotate-12 transition-transform duration-1000" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-emerald-300 font-bold uppercase tracking-widest text-xs">
                        <MapPin size={14} />
                        {weatherData.current.location.name}
                      </div>
                      <div className="flex items-baseline gap-4">
                        <h2 className="text-8xl font-black tracking-tighter">
                          {Math.round(weatherData.current.weather.temperature)}°
                        </h2>
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-emerald-200 capitalize leading-none">{weatherData.current.weather.description}</p>
                          <p className="text-sm font-medium text-emerald-400 opacity-80">{t('weather.current.feelsLike', { temp: Math.round(weatherData.current.weather.feelsLike) })}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-8 bg-white/10 backdrop-blur-xl rounded-[40px] border border-white/20 shadow-inner group-hover:scale-105 transition-transform">
                      {getWeatherIcon(weatherData.current.weather.main)}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-12 pt-6 border-t border-white/10">
                    {[
                      { icon: <Droplets size={18}/>, label: t('weather.current.humidity'), val: `${weatherData.current.weather.humidity}%` },
                      { icon: <Wind size={18}/>, label: t('weather.current.windSpeed'), val: `${weatherData.current.weather.windSpeed.toFixed(1)} m/s` },
                      { icon: <Cloud size={18}/>, label: t('weather.current.cloudCover'), val: `${weatherData.current.weather.cloudCover}%` }
                    ].map((stat, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center gap-2 text-emerald-400 font-black uppercase tracking-tighter text-[10px]">{stat.icon} {stat.label}</div>
                        <p className="text-xl font-bold">{stat.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Weather Info */}
              <div className="bg-white rounded-[32px] p-8 shadow-xl border border-emerald-50 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-900 rounded-xl flex items-center justify-center shadow-lg">
                    <CloudRain className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950">{t('weather.additional.title')}</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">{t('weather.additional.precipitation')}</p>
                    <p className="text-xl font-bold text-emerald-950">{weatherData.current.weather.rainStatus}</p>
                    {weatherData.current.weather.rainfall > 0 && (
                      <p className="text-sm font-bold text-blue-600 mt-1">{t('weather.additional.rainfall', { amount: weatherData.current.weather.rainfall })}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-2 text-slate-400 mb-1"><Gauge size={14}/> <span className="text-[10px] font-bold">{t('weather.additional.pressure')}</span></div>
                      <p className="text-lg font-black text-slate-800">{weatherData.current.weather.pressure}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-2 text-slate-400 mb-1"><Eye size={14}/> <span className="text-[10px] font-bold">{t('weather.additional.visibility')}</span></div>
                      <p className="text-lg font-black text-slate-800">{weatherData.current.weather.visibility}km</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 24-48 Hour Forecast */}
            <div className="bg-white/80 backdrop-blur-sm rounded-[32px] p-8 shadow-xl border border-emerald-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-900 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-emerald-950">{t('weather.forecast.title')}</h3>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {weatherData.forecast.hourly.map((item, index) => (
                  <div key={index} className="flex-none w-32 bg-white border border-emerald-50 rounded-2xl p-5 text-center hover:shadow-lg transition-all hover:-translate-y-1 group">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-4">{item.time}</p>
                    <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                      {getWeatherIcon(item.weather)}
                    </div>
                    <p className="text-2xl font-black text-emerald-900">{Math.round(item.temperature)}°</p>
                    <p className="text-[10px] font-bold text-emerald-600 mt-1 mb-3 leading-tight">{item.description}</p>
                    {item.rainChance > 30 && (
                      <div className="flex items-center justify-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black">
                        <Droplets size={10} /> {item.rainChance}%
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Forecast Summary Tiles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {[
                  { label: t('weather.forecast.tempRange'), val: `${weatherData.forecast.summary.tempLow}° - ${weatherData.forecast.summary.tempHigh}°C`, color: "bg-orange-50 text-orange-700 border-orange-100" },
                  { label: t('weather.forecast.maxRainRisk'), val: `${weatherData.forecast.summary.maxRainChance}%`, color: "bg-blue-50 text-blue-700 border-blue-100" },
                  { label: t('weather.forecast.totalRainfall'), val: `${weatherData.forecast.summary.totalRainfall} mm`, color: "bg-emerald-50 text-emerald-700 border-emerald-100" }
                ].map((s, i) => (
                  <div key={i} className={`p-4 rounded-2xl border ${s.color}`}>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{s.label}</p>
                    <p className="text-xl font-black">{s.val}</p>
                  </div>
                ))}
              </div>

              {/* Alerts */}
              {weatherData.forecast.alerts.length > 0 && (
                <div className="mt-6 space-y-2">
                  {weatherData.forecast.alerts.map((alert, index) => (
                    <div key={index} className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-700">
                        <AlertTriangle className="flex-shrink-0" size={20} />
                        <p className="text-sm font-bold">{alert}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Decision Influence & Stress Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-emerald-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
                <Target className="absolute -left-4 -bottom-4 w-48 h-48 opacity-10" />
                <h3 className="text-xl font-black tracking-tight mb-6 flex items-center gap-3 relative z-10">
                   <Zap className="text-emerald-400 fill-emerald-400" size={24} />
                   {t('weather.aiInfluence.title')}
                </h3>
                <div className="space-y-3 relative z-10">
                  {weatherData.farmImpact.map((impact, index) => (
                    <div key={index} className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/5 hover:bg-white/20 transition-all group">
                      <div className="p-2 bg-emerald-800 rounded-xl group-hover:scale-110 transition-transform">
                        {impact.icon === "rain" ? <CloudRain size={18}/> : <Thermometer size={18}/>}
                      </div>
                      <p className="text-sm font-medium text-emerald-50">{impact.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[32px] p-8 shadow-xl border border-emerald-50">
                <h3 className="text-xl font-bold text-emerald-950 mb-8 flex items-center gap-3">
                  <AlertTriangle className="text-rose-500" />
                  {t('weather.stressMatrix.title')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: t('weather.stressMatrix.heatStress'), key: "heatStress", icon: <ThermometerSun size={20} /> },
                    { label: t('weather.stressMatrix.coldStress'), key: "coldStress", icon: <Cloud size={20} /> },
                    { label: t('weather.stressMatrix.diseaseRisk'), key: "diseaseRisk", icon: <Droplets size={20} /> }
                  ].map((stress) => (
                    <div key={stress.label} className="p-5 rounded-3xl border border-slate-50 bg-slate-50/50 flex flex-col items-center text-center">
                      <div className="text-slate-300 mb-2">{stress.icon}</div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-3">{stress.label}</p>
                      <div className={`px-3 py-1 rounded-xl text-[10px] font-black border mb-3 ${getRiskColor(weatherData.stressIndicators[stress.key].level)}`}>
                        {weatherData.stressIndicators[stress.key].level}
                      </div>
                      <p className="text-[11px] font-medium text-slate-600 leading-tight">
                        {weatherData.stressIndicators[stress.key].message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Summary Footer */}
            {weatherData.aiRecommendations.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-3xl shadow-xl p-8 text-white">
                <h2 className="text-xl font-black mb-6 flex items-center gap-3 uppercase tracking-widest">
                  <TrendingUp size={24} />
                  {t('weather.aiSummary.title')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {weatherData.aiRecommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-4 bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                      <Sprout className="flex-shrink-0 text-emerald-300" size={20} />
                      <p className="text-sm font-medium leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center pt-8">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                {t('weather.footer.updated', { time: new Date(weatherData.lastUpdated).toLocaleTimeString() })}
              </p>
            </div>
          </>
        ) : (
          <div className="bg-white/60 backdrop-blur-md rounded-[40px] p-24 text-center border-2 border-dashed border-emerald-200">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <Cloud size={64} className="text-emerald-200 animate-bounce" />
              <div className="absolute inset-0 border-2 border-emerald-100 rounded-full animate-ping opacity-20"></div>
            </div>
            <h3 className="text-2xl font-bold text-emerald-900 mb-2">{t('weather.syncing.title')}</h3>
            <p className="text-emerald-600">{t('weather.syncing.description')}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 40s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Weather;
