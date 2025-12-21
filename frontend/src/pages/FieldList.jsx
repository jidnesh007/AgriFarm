import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { 
  Plus, 
  MapPin, 
  Sprout, 
  TrendingUp, 
  ChevronRight, 
  Activity, 
  Layers, 
  Calendar,
  CircleDashed,
  Flower2,
  X,
  Map as MapIcon,
  Navigation
} from "lucide-react";

const FieldList = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/fields", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFields(response.data.fields || []);
    } catch (error) {
      console.error("Error fetching fields:", error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (status) => {
    switch (status) {
      case "Good": return "text-emerald-700 bg-emerald-100 border-emerald-200";
      case "Fair": return "text-amber-700 bg-amber-100 border-amber-200";
      case "Poor": return "text-rose-700 bg-rose-100 border-rose-200";
      default: return "text-slate-600 bg-slate-100 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <Sprout className="w-6 h-6 text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-emerald-900 font-medium">{t('loadingEstates')}</p>
        </div>
      </div>
    );
  }

  return (
    <div key={i18n.language} className="relative min-h-screen animate-in fade-in duration-500">
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <CircleDashed className="absolute top-20 left-10 w-64 h-64 text-emerald-900 animate-spin-slow" />
        <Flower2 className="absolute bottom-40 right-10 w-96 h-96 text-emerald-900" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header Action Card */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-emerald-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-900 p-3 rounded-2xl shadow-lg">
              <MapIcon className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-emerald-950">{t('landManagement')}</h2>
              <p className="text-emerald-700/70 text-sm">{t('monitorPlots')}</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full md:w-auto bg-emerald-900 hover:bg-emerald-800 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-105 active:scale-95 font-bold"
          >
            <Plus size={20} />
            {t('registerNewField')}
          </button>
        </div>

        {/* Fields Grid */}
        {fields.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-20 text-center border-2 border-dashed border-emerald-200">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sprout size={40} className="text-emerald-300" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-900 mb-2">{t('startJourney')}</h3>
            <p className="text-emerald-600 mb-8 max-w-sm mx-auto">{t('noFieldsYet')}</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-emerald-900 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl transition-all hover:bg-emerald-800"
            >
              {t('addFirstField')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field) => (
              <div
                key={field._id}
                onClick={() => navigate(`/field/${field._id}`)}
                className="group bg-white rounded-[32px] shadow-sm border border-emerald-50 hover:border-emerald-200 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
              >
                {/* Card Top: Gradient & Name */}
                <div className="p-6 bg-gradient-to-br from-emerald-900 to-emerald-800 relative overflow-hidden">
                  <Flower2 className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12" />
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-white/10 px-2 py-1 rounded-md">
                        {field.cropType}
                      </span>
                      <h3 className="text-2xl font-bold text-white mt-2 group-hover:translate-x-1 transition-transform">
                        {field.fieldName}
                      </h3>
                    </div>
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-5 flex-1 bg-white">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <Navigation size={14} className="text-emerald-600" />
                      </div>
                      <span className="text-xs font-semibold truncate">
                        {field.location.village || t('regionalPlot')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <TrendingUp size={14} className="text-emerald-600" />
                      </div>
                      <span className="text-xs font-semibold">
                        {field.fieldArea.value} {field.fieldArea.unit}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-y border-slate-50">
                    <div className="flex items-center gap-2">
                      <Layers size={16} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-500">{field.numberOfZones} {t('subZones')}</span>
                    </div>
                    <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border ${getHealthColor(field.overallHealth.status)}`}>
                      {field.overallHealth.status}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar size={14} />
                      <span className="text-[10px] font-medium">
                        {t('synced')}: {new Date(field.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Activity size={16} className="text-emerald-500 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL OVERLAY --- */}
      {showCreateModal && (
        <CreateFieldModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchFields();
          }}
        />
      )}

      <style jsx>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 40s linear infinite; }
      `}</style>
    </div>
  );
};

// Create Field Modal with Matching Theme
const CreateFieldModal = ({ onClose, onSuccess }) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    fieldName: "", cropType: "", fieldArea: "",
    village: "", district: "", latitude: "",
    longitude: "", numberOfZones: 3,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cropTypes = ["Wheat", "Rice", "Cotton", "Corn", "Sugarcane", "Soybean", "Potato", "Tomato"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/fields", {
        fieldName: formData.fieldName,
        cropType: formData.cropType,
        fieldArea: parseFloat(formData.fieldArea),
        location: {
          village: formData.village, district: formData.district,
          coordinates: {
            latitude: formData.latitude ? parseFloat(formData.latitude) : null,
            longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          },
        },
        numberOfZones: parseInt(formData.numberOfZones),
      }, { headers: { Authorization: `Bearer ${token}` } });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || t('internalError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div key={i18n.language} className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-[40px] max-w-2xl w-full shadow-2xl overflow-hidden border border-emerald-100">
        {/* Modal Header */}
        <div className="bg-emerald-900 p-8 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Plus />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{t('registerLand')}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-bold border border-rose-100">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest ml-1">{t('fieldDesignation')}</label>
              <input
                type="text" required
                value={formData.fieldName}
                onChange={(e) => setFormData({ ...formData, fieldName: e.target.value })}
                className="w-full px-5 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-emerald-200"
                placeholder={t('fieldPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest ml-1">{t('cropVariety')}</label>
              <select
                required value={formData.cropType}
                onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                className="w-full px-5 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
              >
                <option value="">{t('selectType')}</option>
                {cropTypes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest ml-1">{t('totalArea')}</label>
              <input
                type="number" step="0.1" required
                value={formData.fieldArea}
                onChange={(e) => setFormData({ ...formData, fieldArea: e.target.value })}
                className="w-full px-5 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="5.0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest ml-1">{t('analysisZones')}</label>
              <input
                type="number" min="1" max="20" required
                value={formData.numberOfZones}
                onChange={(e) => setFormData({ ...formData, numberOfZones: e.target.value })}
                className="w-full px-5 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 py-2">
            <input
              type="text" placeholder={t('village')}
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none"
            />
            <input
              type="text" placeholder={t('district')}
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button" onClick={onClose}
              className="flex-1 px-6 py-4 border border-emerald-100 rounded-2xl text-emerald-900 font-bold hover:bg-emerald-50 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit" disabled={loading}
              className="flex-1 bg-emerald-900 text-white px-6 py-4 rounded-2xl font-bold shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 disabled:opacity-50"
            >
              {loading ? t('registering') : t('confirmEstate')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldList;
