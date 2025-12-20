import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import {
  ArrowLeft,
  Droplets,
  Leaf,
  TrendingUp,
  AlertCircle,
  Cloud,
  Thermometer,
  CloudRain,
  Edit2,
  CheckCircle,
  X,
  Brain,
  Loader,
  CircleDashed,
  Flower2,
  MapPin,
  Activity,
  Beaker,
  ThermometerSun,
  Calendar,
  Cpu,
  Binary,
  Globe,
  Database,
  BarChart,
} from "lucide-react";

const FieldDetails = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);
  const [showSoilModal, setShowSoilModal] = useState(false);
  const [generatingRecs, setGeneratingRecs] = useState(false);

  useEffect(() => {
    fetchFieldDetails();
  }, [id]);

  const fetchFieldDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/fields/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setField(response.data.field);
      if (response.data.field.zones.length > 0) {
        setSelectedZone(response.data.field.zones[0]);
      }
    } catch (error) {
      console.error("Error fetching field:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Dry: "bg-rose-100 text-rose-700 border-rose-200",
      Optimal: "bg-emerald-100 text-emerald-700 border-emerald-200",
      Wet: "bg-blue-100 text-blue-700 border-blue-200",
      Healthy: "bg-emerald-100 text-emerald-700 border-emerald-200",
      Stress: "bg-amber-100 text-amber-700 border-amber-200",
      Critical: "bg-rose-100 text-rose-700 border-rose-200",
    };
    return colors[status] || "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getHealthColor = (health) => {
    if (health >= 75) return "text-emerald-700 bg-emerald-100 border-emerald-200";
    if (health >= 50) return "text-amber-700 bg-amber-100 border-amber-200";
    return "text-rose-700 bg-rose-100 border-rose-200";
  };

  const getHealthStatus = (health) => {
    if (health >= 75) return t('fieldDetails.excellent');
    if (health >= 50) return t('fieldDetails.moderate');
    return t('fieldDetails.poor');
  };

  const generateAIRecommendation = async (zoneId) => {
    setGeneratingRecs(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/fields/${id}/zone/${zoneId}/ai-recommendation`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchFieldDetails();

      const rec = response.data.recommendation;
      
      // Build translated alert message
      const alertMessage = `✅ ${t('fieldDetails.aiRecGenerated')}\n\n💧 ${t('fieldDetails.irrigation')}: ${rec.irrigation_mm}mm\n🌿 ${t('fieldDetails.fertilizer')}: ${rec.fertilizer_kg}kg/acre\n💚 ${t('fieldDetails.healthScore')}: ${rec.health_score.toFixed(1)}%\n\n${rec.explanation}`;
      
      alert(alertMessage);
    } catch (error) {
      console.error("Error generating AI recommendation:", error);
      alert(error.response?.data?.message || t('fieldDetails.aiRecFailed'));
    } finally {
      setGeneratingRecs(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative w-16 h-16">
          <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
          <Activity className="w-6 h-6 text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    );
  }

  if (!field) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-rose-500 mb-4" />
          <p className="text-emerald-900 font-bold">{t('fieldDetails.fieldNotFound')}</p>
          <button onClick={() => navigate("/fields")} className="mt-4 text-emerald-600 font-bold hover:underline">
            {t('fieldDetails.backToFields')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div key={i18n.language} className="relative space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <CircleDashed className="absolute top-20 left-10 w-64 h-64 text-emerald-900 animate-spin-slow" />
        <Flower2 className="absolute bottom-40 right-10 w-96 h-96 text-emerald-900" />
      </div>

      <div className="relative z-10 space-y-6">
        <button
          onClick={() => navigate("/Dashboard")}
          className="flex items-center gap-2 text-emerald-800 font-bold hover:text-emerald-600 transition-colors mb-4 group"
        >
          <div className="p-2 bg-emerald-100 rounded-xl group-hover:-translate-x-1 transition-transform">
            <ArrowLeft size={18} />
          </div>
          {t('fieldDetails.backToDashboard')}
        </button>

        <div className="bg-emerald-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
          <Flower2 className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2">
                {field.fieldName}
              </h1>
              <div className="flex items-center gap-4 text-emerald-200 font-medium">
                <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-md border border-white/10">
                  {field.cropType}
                </span>
                <span>•</span>
                <span>{field.fieldArea.value} {field.fieldArea.unit}</span>
              </div>
              <p className="text-sm text-emerald-300/80 mt-4 flex items-center gap-2">
                <MapPin size={14} />
                {field.location.village && `${field.location.village}, `}{field.location.district}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl text-right min-w-[200px]">
              <div className={`inline-block px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest ${getStatusColor(field.overallHealth.status)}`}>
                {field.overallHealth.status} {t('fieldDetails.status')}
              </div>
              <p className="text-[10px] text-emerald-300 mt-2 font-bold uppercase">
                {t('fieldDetails.lastSync')}: {new Date(field.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {field.weatherSummary && field.weatherSummary.lastUpdated && (
          <div className="bg-white/60 backdrop-blur-md rounded-[32px] p-6 border border-emerald-100 shadow-sm">
            <h2 className="text-lg font-bold text-emerald-950 mb-4 flex items-center gap-2">
              <Cloud size={20} className="text-emerald-600" />
              {t('fieldDetails.envIntelligence')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <Thermometer size={20} />, label: t('fieldDetails.temp'), val: `${field.weatherSummary.temperature}°C` },
                { icon: <Droplets size={20} />, label: t('fieldDetails.humidity'), val: `${field.weatherSummary.humidity}%` },
                { icon: <CloudRain size={20} />, label: t('fieldDetails.rain'), val: field.weatherSummary.rainfall },
                { icon: <AlertCircle size={20} />, label: t('fieldDetails.stressRisk'), val: field.weatherSummary.stressRisk }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-emerald-50 shadow-sm flex flex-col items-center">
                  <div className="text-emerald-600 mb-2">{item.icon}</div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                  <p className="text-lg font-bold text-emerald-950">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-[32px] p-2 border border-emerald-100 shadow-xl flex gap-2 overflow-x-auto no-scrollbar">
          {field.zones.map((zone) => (
            <button
              key={zone._id}
              onClick={() => setSelectedZone(zone)}
              className={`flex-1 min-w-[140px] py-4 rounded-2xl font-bold transition-all ${
                selectedZone?._id === zone._id
                  ? "bg-emerald-900 text-white shadow-lg"
                  : "text-emerald-800 hover:bg-emerald-50"
              }`}
            >
              {zone.zoneName}
            </button>
          ))}
        </div>

        {selectedZone && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[32px] p-8 shadow-lg border border-emerald-50 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-black text-emerald-950">
                    {selectedZone.zoneName} {t('fieldDetails.diagnostic')}
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">{t('fieldDetails.realtimeSensor')}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => generateAIRecommendation(selectedZone._id)}
                    disabled={generatingRecs}
                    className="bg-emerald-900 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-xl hover:bg-emerald-800 transition-all disabled:opacity-50"
                  >
                    {generatingRecs ? <Loader size={18} className="animate-spin" /> : <Brain size={18} />}
                    {t('fieldDetails.aiAdvisor')}
                  </button>
                  <button
                    onClick={() => setShowSoilModal(true)}
                    className="bg-emerald-50 text-emerald-700 px-5 py-3 rounded-2xl flex items-center gap-2 font-bold border border-emerald-100 hover:bg-emerald-100 transition-all"
                  >
                    <Edit2 size={18} />
                    {t('fieldDetails.updateSensors')}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-slate-50 rounded-[24px] p-5 border border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Droplets size={18} className="text-blue-500" />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('fieldDetails.moisture')}</span>
                  </div>
                  <p className="text-3xl font-black text-slate-900">{selectedZone.soilMoisture.value}%</p>
                  <div className={`mt-3 inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase ${getStatusColor(selectedZone.soilMoisture.status)}`}>
                    {selectedZone.soilMoisture.status}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-[24px] p-5 border border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Leaf size={18} className="text-emerald-500" />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('fieldDetails.nutrients')}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[['N', selectedZone.soilNutrients.nitrogen], ['P', selectedZone.soilNutrients.phosphorus], ['K', selectedZone.soilNutrients.potassium]].map(([l, v]) => (
                      <div key={l} className="text-center">
                        <span className="text-[10px] font-bold text-slate-400 block">{l}</span>
                        <span className="text-sm font-black text-emerald-700">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-[24px] p-5 border border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={18} className="text-purple-500" />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('fieldDetails.soilPH')}</span>
                  </div>
                  <p className="text-3xl font-black text-slate-900">{selectedZone.soilPH.value}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">
                    {selectedZone.soilPH.value < 6.5 ? t('fieldDetails.acidicEnv') : selectedZone.soilPH.value > 7.5 ? t('fieldDetails.alkalineEnv') : t('fieldDetails.neutralBalance')}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-[24px] p-5 border border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity size={18} className="text-orange-500" />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('fieldDetails.vitality')}</span>
                  </div>
                  <p className="text-3xl font-black text-slate-900">{selectedZone.cropHealth.score}%</p>
                  <div className={`mt-3 inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase ${getStatusColor(selectedZone.cropHealth.status)}`}>
                    {selectedZone.cropHealth.status}
                  </div>
                </div>
              </div>

              {selectedZone.recommendations && selectedZone.recommendations.lastGenerated ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-t border-slate-100 pt-8">
                    <h3 className="text-xl font-bold text-emerald-950 flex items-center gap-3">
                      <Brain className="text-emerald-600" />
                      {t('fieldDetails.aiDecisionIntel')}
                    </h3>
                    <span className="bg-emerald-900 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{t('fieldDetails.drlEngineActive')}</span>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 rounded-[24px] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-emerald-900">{t('fieldDetails.computedHealthIndex')}</span>
                      <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase border ${getHealthColor(selectedZone.recommendations.healthScore)}`}>
                        {getHealthStatus(selectedZone.recommendations.healthScore)}
                      </span>
                    </div>
                    <div className="flex items-end gap-4">
                       <span className="text-5xl font-black text-emerald-900">{selectedZone.recommendations.healthScore.toFixed(1)}%</span>
                       <div className="flex-1 pb-2">
                          <div className="w-full bg-emerald-200/50 rounded-full h-3 overflow-hidden">
                            <div className="h-full bg-emerald-600 rounded-full transition-all duration-1000" style={{ width: `${selectedZone.recommendations.healthScore}%` }}></div>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border-2 border-emerald-100 rounded-3xl p-6 hover:shadow-xl transition-all">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Droplets size={24}/></div>
                        <h4 className="font-black text-emerald-950 uppercase tracking-widest text-xs">{t('fieldDetails.irrigationStrategy')}</h4>
                      </div>
                      {selectedZone.recommendations.irrigation.amount > 0 ? (
                        <div className="space-y-4">
                          <p className="text-4xl font-black text-blue-600">{selectedZone.recommendations.irrigation.amount} <span className="text-lg uppercase">{selectedZone.recommendations.irrigation.unit}</span></p>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">{t('fieldDetails.timeline')}: {selectedZone.recommendations.irrigation.timing}</p>
                          <div className="flex items-center gap-2"><div className="flex-1 bg-slate-100 h-1.5 rounded-full"><div className="bg-blue-500 h-full rounded-full" style={{width: `${selectedZone.recommendations.irrigation.confidence}%`}}></div></div><span className="text-[10px] font-black text-slate-400">{selectedZone.recommendations.irrigation.confidence}% {t('fieldDetails.conf')}</span></div>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-emerald-600 font-bold text-sm">{t('fieldDetails.statusOptimal')}</div>
                      )}
                    </div>

                    <div className="bg-white border-2 border-emerald-100 rounded-3xl p-6 hover:shadow-xl transition-all">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><Leaf size={24}/></div>
                        <h4 className="font-black text-emerald-950 uppercase tracking-widest text-xs">{t('fieldDetails.nutrientStrategy')}</h4>
                      </div>
                      {selectedZone.recommendations.fertilizer.amount > 0 ? (
                        <div className="space-y-4">
                          <p className="text-4xl font-black text-emerald-600">{selectedZone.recommendations.fertilizer.amount} <span className="text-lg uppercase">{selectedZone.recommendations.fertilizer.unit}</span></p>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">{t('fieldDetails.variant')}: {selectedZone.recommendations.fertilizer.type}</p>
                          <div className="flex items-center gap-2"><div className="flex-1 bg-slate-100 h-1.5 rounded-full"><div className="bg-emerald-500 h-full rounded-full" style={{width: `${selectedZone.recommendations.fertilizer.confidence}%`}}></div></div><span className="text-[10px] font-black text-slate-400">{selectedZone.recommendations.fertilizer.confidence}% {t('fieldDetails.conf')}</span></div>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-emerald-600 font-bold text-sm">{t('fieldDetails.soilBalanced')}</div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-[24px] p-6 text-slate-300 text-sm italic leading-relaxed relative overflow-hidden">
                    <Brain size={48} className="absolute -right-4 -bottom-4 text-white/5 rotate-12" />
                    <span className="text-emerald-400 font-black block not-italic mb-2 text-xs uppercase tracking-[0.2em]">{t('fieldDetails.engineRationale')}</span>
                    "{selectedZone.recommendations.explanation}"
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] p-12 text-center">
                  <Brain size={48} className="mx-auto text-slate-200 mb-4" />
                  <h4 className="text-lg font-bold text-slate-800">{t('fieldDetails.pendingIntelSync')}</h4>
                  <p className="text-slate-500 mb-6 text-sm">{t('fieldDetails.runAiEngine')}</p>
                  <button onClick={() => generateAIRecommendation(selectedZone._id)} className="bg-emerald-900 text-white px-8 py-3 rounded-2xl font-bold shadow-xl">{t('fieldDetails.startScan')}</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showSoilModal && selectedZone && (
        <SoilUpdateModal
          fieldId={id}
          zone={selectedZone}
          onClose={() => setShowSoilModal(false)}
          onSuccess={() => {
            setShowSoilModal(false);
            fetchFieldDetails();
          }}
        />
      )}

      <style jsx>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 25s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

const SoilUpdateModal = ({ fieldId, zone, onClose, onSuccess }) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    soilMoisture: zone.soilMoisture.value || 0,
    nitrogen: zone.soilNutrients.nitrogen || 0,
    phosphorus: zone.soilNutrients.phosphorus || 0,
    potassium: zone.soilNutrients.potassium || 0,
    soilPH: zone.soilPH.value || 7.0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/fields/${fieldId}/zone/${zone._id}/soil`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess();
    } catch (err) {
      setError(t('fieldDetails.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div key={i18n.language} className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-[40px] max-w-md w-full shadow-2xl overflow-hidden border border-emerald-100">
        <div className="bg-emerald-900 p-8 flex justify-between items-center text-white">
          <h2 className="text-2xl font-black tracking-tight">{t('fieldDetails.sensorSync')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-[10px] font-bold border border-rose-100">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('fieldDetails.moisturePercent')}</label>
                <input 
                  type="number" 
                  value={formData.soilMoisture} 
                  onChange={(e) => setFormData({...formData, soilMoisture: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-xl text-emerald-900 outline-none focus:border-emerald-500 focus:bg-white transition-all" 
                />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('fieldDetails.acidityPH')}</label>
                <input 
                  type="number" 
                  step="0.1" 
                  value={formData.soilPH} 
                  onChange={(e) => setFormData({...formData, soilPH: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-xl text-emerald-900 outline-none focus:border-emerald-500 focus:bg-white transition-all" 
                />
             </div>
          </div>

          <div className="bg-emerald-50/50 p-6 rounded-[32px] space-y-4 border border-emerald-100/50">
             <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest ml-1">{t('fieldDetails.nutrientLevelsPPM')}</label>
             <div className="grid grid-cols-3 gap-3">
                {['nitrogen', 'phosphorus', 'potassium'].map(k => (
                  <div key={k} className="space-y-1">
                    <span className="text-[8px] font-black text-emerald-600 uppercase block text-center tracking-tighter">{t(`fieldDetails.${k}`)}</span>
                    <input 
                      type="number" 
                      value={formData[k]} 
                      onChange={(e) => setFormData({...formData, [k]: e.target.value})} 
                      className="w-full py-4 bg-white border-2 border-emerald-100 rounded-xl font-black text-xl text-center text-emerald-900 outline-none focus:border-emerald-500 transition-all shadow-sm" 
                    />
                  </div>
                ))}
             </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-emerald-900 text-white py-5 rounded-2xl font-black shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 disabled:opacity-50 uppercase tracking-widest text-xs transform active:scale-95 transition-all">
            {loading ? t('fieldDetails.syncing') : t('fieldDetails.updateLandVitals')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FieldDetails;
