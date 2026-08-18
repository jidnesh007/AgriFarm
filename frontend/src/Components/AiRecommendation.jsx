import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { BACKEND_URL } from "../config/api";
import {
  Brain,
  Droplets,
  Leaf,
  AlertCircle,
  Loader,
  ChevronRight,
  RefreshCw,
  Cloud,
  Sprout,
  Activity,
  Zap,
  CheckCircle2,
  Beaker,
  ThermometerSun,
  CircleDashed,
  Flower2,
  X,
  CheckCircle
} from "lucide-react";

const AiRecommendations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingForZone, setGeneratingForZone] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchFields();
  }, []);

  // Auto-hide notification after 5 seconds
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
      const response = await axios.get(`${BACKEND_URL}/api/fields`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFields(response.data.fields || []);
    } catch (error) {
      console.error("Error fetching fields:", error);
      showNotification('error', 'aiRecommendations.notifications.fetchError');
    } finally {
      setLoading(false);
    }
  };

  const generateAIRecommendation = async (fieldId, zoneId) => {
    setGeneratingForZone(zoneId);
    showNotification('info', 'aiRecommendations.notifications.generating');

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BACKEND_URL}/api/fields/${fieldId}/zone/${zoneId}/ai-recommendation`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchFields();
      showNotification('success', 'aiRecommendations.notifications.generateSuccess');
    } catch (error) {
      console.error("Error generating AI recommendation:", error);
      showNotification('error', 'aiRecommendations.notifications.generateError');
    } finally {
      setGeneratingForZone(null);
    }
  };

  const getHealthColor = (health) => {
    if (health >= 75) return "text-emerald-700 bg-emerald-100 border-emerald-200";
    if (health >= 50) return "text-amber-700 bg-amber-100 border-amber-200";
    return "text-rose-700 bg-rose-100 border-rose-200";
  };

  const getNotificationStyles = (type) => {
    switch (type) {
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
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />;
      case 'info':
        return <Brain className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 md:w-5 md:h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <div className="text-center">
          <div className="relative w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4">
            <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <Brain className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-sm md:text-base text-emerald-900 font-medium">{t('aiRecommendations.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-full space-y-4 md:space-y-6 animate-in fade-in duration-500 px-2 md:px-0">

      {/* Notification Toast - Mobile Responsive */}
      {notification && (
        <div className="fixed top-16 md:top-20 right-2 md:right-6 left-2 md:left-auto z-50 animate-in slide-in-from-right duration-300">
          <div className={`${getNotificationStyles(notification.type)} border-l-4 rounded-lg md:rounded-xl p-3 md:p-4 shadow-2xl backdrop-blur-sm max-w-md flex items-start gap-2 md:gap-3`}>
            {getNotificationIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-semibold break-words">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
      )}

      {/* --- THEME MATCHED DECORATIVE BACKGROUND - RESPONSIVE --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.05]">
        <CircleDashed className="absolute -top-10 -left-10 w-32 h-32 md:w-64 md:h-64 text-emerald-900 animate-spin-slow" />
        <Flower2 className="absolute bottom-10 right-0 w-40 h-40 md:w-80 md:h-80 text-emerald-900 translate-x-1/4" />
        <CircleDashed className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[500px] md:h-[500px] text-emerald-900 opacity-30" />
      </div>

      <div className="relative z-10 space-y-4 md:space-y-6">
        {/* Header Insight Card - Mobile Responsive */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-6 border border-emerald-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 md:p-4 opacity-10">
            <Brain size={60} className="md:w-[120px] md:h-[120px] text-emerald-900" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="bg-emerald-600 p-2 md:p-3 rounded-xl md:rounded-2xl shadow-lg shadow-emerald-200 flex-shrink-0">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-white fill-white" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-emerald-900">{t('aiRecommendations.header.title')}</h2>
                <p className="text-emerald-700/80 max-w-2xl text-xs md:text-sm leading-relaxed">
                  {t('aiRecommendations.header.description')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {fields.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-md rounded-2xl md:rounded-3xl p-8 md:p-12 text-center border-2 border-dashed border-emerald-200">
            <Sprout size={40} className="md:w-12 md:h-12 mx-auto text-emerald-300 mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl font-bold text-emerald-900 mb-2">{t('aiRecommendations.noFields.title')}</h3>
            <p className="text-sm md:text-base text-emerald-600 mb-4 md:mb-6">{t('aiRecommendations.noFields.description')}</p>
            <button
              onClick={() => navigate("/fields")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-200 text-sm md:text-base"
            >
              {t('aiRecommendations.noFields.button')}
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:gap-8">
            {fields.map((field) => (
              <div key={field._id} className="group">
                {/* Field Label - Mobile Responsive */}
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 px-1 md:px-2">
                  <div className="h-5 w-1 md:h-6 md:w-1.5 bg-emerald-500 rounded-full"></div>
                  <h3 className="text-base md:text-lg font-bold text-emerald-900 uppercase tracking-wider truncate">
                    {field.fieldName}
                  </h3>
                  <span className="text-[10px] md:text-xs font-medium px-1.5 md:px-2 py-0.5 md:py-1 bg-emerald-100 text-emerald-700 rounded-md md:rounded-lg whitespace-nowrap">
                    {field.cropType}
                  </span>
                </div>

                {/* Zones Grid - Mobile Responsive */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {field.zones.map((zone) => (
                    <div
                      key={zone._id}
                      className="bg-white/80 backdrop-blur-sm border border-emerald-50 rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 relative overflow-hidden border-b-4 border-b-emerald-500"
                    >
                      {/* Zone Top Bar - Mobile Responsive */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 md:mb-6 gap-2 sm:gap-0">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                            <Activity size={14} className="md:w-4 md:h-4 text-emerald-600" />
                          </div>
                          <span className="font-bold text-sm md:text-base text-emerald-950">{zone.zoneName}</span>
                        </div>
                        {zone.recommendations?.healthScore > 0 && (
                          <div className={`flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold border ${getHealthColor(zone.recommendations.healthScore)} self-start sm:self-auto`}>
                            <CheckCircle2 size={10} className="md:w-3 md:h-3" />
                            {zone.recommendations.healthScore.toFixed(0)}% {t('aiRecommendations.zone.health')}
                          </div>
                        )}
                      </div>

                      {/* Sensor Micro-Grid - Mobile Responsive */}
                      <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6">
                        <div className="bg-slate-50/50 rounded-xl md:rounded-2xl p-2 md:p-3 text-center">
                          <Droplets size={12} className="md:w-3.5 md:h-3.5 mx-auto text-blue-500 mb-0.5 md:mb-1" />
                          <p className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold">{t('aiRecommendations.zone.moisture')}</p>
                          <p className="text-xs md:text-sm font-bold text-slate-800">{zone.soilMoisture?.value || 0}%</p>
                        </div>
                        <div className="bg-slate-50/50 rounded-xl md:rounded-2xl p-2 md:p-3 text-center">
                          <Beaker size={12} className="md:w-3.5 md:h-3.5 mx-auto text-purple-500 mb-0.5 md:mb-1" />
                          <p className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold">{t('aiRecommendations.zone.ph')}</p>
                          <p className="text-xs md:text-sm font-bold text-slate-800">{zone.soilPH?.value || 0}</p>
                        </div>
                        <div className="bg-slate-50/50 rounded-xl md:rounded-2xl p-2 md:p-3 text-center">
                          <ThermometerSun size={12} className="md:w-3.5 md:h-3.5 mx-auto text-orange-500 mb-0.5 md:mb-1" />
                          <p className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold">{t('aiRecommendations.zone.nutrients')}</p>
                          <p className="text-xs md:text-sm font-bold text-slate-800">NPK</p>
                        </div>
                      </div>

                      {/* Recommendation Body - Mobile Responsive */}
                      {zone.recommendations && zone.recommendations.aiGenerated ? (
                        <div className="space-y-3 md:space-y-4">
                          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                            <div className="flex-1 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl md:rounded-2xl p-3 md:p-4">
                              <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                                <Droplets size={14} className="md:w-4 md:h-4 text-blue-600" />
                                <span className="text-[10px] md:text-xs font-bold text-blue-900 uppercase">{t('aiRecommendations.recommendation.watering')}</span>
                              </div>
                              <p className="text-lg md:text-xl font-black text-blue-700">{zone.recommendations.irrigation.amount}mm</p>
                              <p className="text-[9px] md:text-[10px] text-blue-600/80 font-medium leading-tight mt-1">
                                {zone.recommendations.irrigation.timing}
                              </p>
                            </div>
                            <div className="flex-1 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-xl md:rounded-2xl p-3 md:p-4">
                              <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                                <Leaf size={14} className="md:w-4 md:h-4 text-emerald-600" />
                                <span className="text-[10px] md:text-xs font-bold text-emerald-900 uppercase">{t('aiRecommendations.recommendation.nutrition')}</span>
                              </div>
                              <p className="text-lg md:text-xl font-black text-emerald-700">{zone.recommendations.fertilizer.amount}kg</p>
                              <p className="text-[9px] md:text-[10px] text-emerald-600/80 font-medium leading-tight mt-1">
                                {zone.recommendations.fertilizer.type}
                              </p>
                            </div>
                          </div>

                          {/* AI Explanation Box - Mobile Responsive */}
                          <div className="bg-emerald-900 text-emerald-50 rounded-xl md:rounded-2xl p-3 md:p-4 text-[10px] md:text-xs leading-relaxed relative overflow-hidden">
                            <Brain size={32} className="md:w-10 md:h-10 absolute -right-1 md:-right-2 -bottom-1 md:-bottom-2 text-white/10 rotate-12" />
                            <p className="relative z-10 font-medium italic">
                              "{zone.recommendations.explanation}"
                            </p>
                          </div>

                          {/* Footer Actions - Mobile Responsive */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 md:pt-2 border-t border-slate-100 gap-2 sm:gap-0">
                            <div className="flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] text-slate-400 font-medium">
                              <Cloud size={10} className="md:w-3 md:h-3" />
                              <span className="line-clamp-1">{zone.recommendations.weatherInfluence || t('aiRecommendations.recommendation.stableWeather')}</span>
                            </div>
                            <button
                              onClick={() => generateAIRecommendation(field._id, zone._id)}
                              disabled={generatingForZone === zone._id}
                              className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                            >
                              {generatingForZone === zone._id ? (
                                <Loader size={12} className="md:w-3.5 md:h-3.5 animate-spin" />
                              ) : (
                                <RefreshCw size={12} className="md:w-3.5 md:h-3.5" />
                              )}
                              {t('aiRecommendations.recommendation.syncAI')}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="py-6 md:py-8 text-center bg-slate-50/50 rounded-xl md:rounded-2xl border-2 border-dashed border-slate-200">
                          <Brain size={28} className="md:w-8 md:h-8 mx-auto text-slate-300 mb-2" />
                          <p className="text-[10px] md:text-xs text-slate-500 font-medium mb-3 md:mb-4 px-4 md:px-6">
                            {t('aiRecommendations.recommendation.pending')}
                          </p>
                          <button
                            onClick={() => generateAIRecommendation(field._id, zone._id)}
                            disabled={generatingForZone === zone._id}
                            className="bg-emerald-900 text-white px-4 md:px-5 py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold hover:bg-emerald-800 transition-all flex items-center gap-1.5 md:gap-2 mx-auto"
                          >
                            {generatingForZone === zone._id ? (
                              <Loader size={12} className="md:w-3.5 md:h-3.5 animate-spin" />
                            ) : (
                              <Brain size={12} className="md:w-3.5 md:h-3.5" />
                            )}
                            {t('aiRecommendations.recommendation.generateButton')}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AiRecommendations;