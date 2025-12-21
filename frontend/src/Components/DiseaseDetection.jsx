import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import {
  Camera,
  Upload,
  AlertCircle,
  Loader,
  Leaf,
  TrendingUp,
  Activity,
  AlertTriangle,
  FileImage,
  Sparkles,
  CheckCircle2,
  Clock,
  Download,
  Share2,
  X,
  CircleDashed,
  Flower2,
  CheckCircle,
} from "lucide-react";

const DiseaseDetection = () => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);

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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError(t('diseaseDetection.errors.invalidFile'));
        showNotification('error', 'diseaseDetection.errors.invalidFile');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(t('diseaseDetection.errors.fileTooLarge'));
        showNotification('error', 'diseaseDetection.errors.fileTooLarge');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError("");
      showNotification('success', 'diseaseDetection.notifications.fileSelected', { fileName: file.name });
    }
  };

  const handleDetect = async () => {
    if (!selectedFile) {
      setError(t('diseaseDetection.errors.noImage'));
      showNotification('error', 'diseaseDetection.errors.noImage');
      return;
    }
    setDetecting(true);
    setError("");
    showNotification('info', 'diseaseDetection.notifications.analyzing');
    
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:8000/detect-disease",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 60000,
        }
      );
      setResult(response.data);
      showNotification('success', 'diseaseDetection.notifications.analysisComplete');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || t('diseaseDetection.errors.detectionFailed');
      setError(errorMsg);
      showNotification('error', 'diseaseDetection.errors.detectionFailed');
    } finally {
      setDetecting(false);
    }
  };

  const handleDownloadTreatment = () => {
    if (!result || !result.treatment_plan) return;
    const content = `${t('diseaseDetection.download.title')}\n${t('diseaseDetection.download.generated')}: ${new Date().toLocaleString()}\n${t('diseaseDetection.download.crop')}: ${result.crop_type}\n${t('diseaseDetection.download.disease')}: ${result.disease_name}\n${t('diseaseDetection.download.plan')}: ${result.treatment_plan}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.crop_type}_${t('diseaseDetection.download.filename')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotification('success', 'diseaseDetection.notifications.downloadSuccess');
  };

  const handleShareTreatment = async () => {
    if (!result || !result.treatment_plan) return;
    const shareText = `🌾 ${t('diseaseDetection.share.title')}\n${t('diseaseDetection.share.crop')}: ${result.crop_type}\n${t('diseaseDetection.share.disease')}: ${result.disease_name}\n${result.treatment_plan}`;
    if (navigator.share) {
      try { 
        await navigator.share({ title: t('diseaseDetection.share.shareTitle'), text: shareText });
        showNotification('success', 'diseaseDetection.notifications.shareSuccess');
      } 
      catch (err) { 
        console.log("Share failed", err); 
      }
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        showNotification('success', 'diseaseDetection.notifications.copiedToClipboard');
      });
    }
  };

  const getSeverityBadge = (level) => {
    const styles = {
      None: "bg-emerald-100 text-emerald-700 border-emerald-300",
      Low: "bg-amber-100 text-amber-700 border-amber-300",
      Moderate: "bg-orange-100 text-orange-700 border-orange-300",
      High: "bg-rose-100 text-rose-700 border-rose-300",
    };
    return styles[level] || "bg-slate-100 text-slate-700 border-slate-300";
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError("");
    showNotification('info', 'diseaseDetection.notifications.cleared');
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
        return <Activity className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="relative space-y-6 animate-in fade-in duration-500 pb-12">
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

      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <CircleDashed className="absolute top-10 left-10 w-64 h-64 text-emerald-900 animate-spin-slow" />
        <Flower2 className="absolute bottom-20 right-10 w-96 h-96 text-emerald-900" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header Action Card */}
        <div className="bg-white/60 backdrop-blur-md rounded-[32px] p-8 border border-emerald-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-emerald-900 p-4 rounded-2xl shadow-xl shadow-emerald-900/20">
              <Camera className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-emerald-950 tracking-tight flex items-center gap-2">
                {t('diseaseDetection.header.title')} <Sparkles className="text-amber-400 w-6 h-6" />
              </h1>
              <p className="text-emerald-700/70 font-medium">{t('diseaseDetection.header.subtitle')}</p>
            </div>
          </div>
          {(result || previewUrl) && (
            <button
              onClick={clearAll}
              className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl font-bold border border-emerald-100 hover:bg-emerald-100 transition-all flex items-center gap-2"
            >
              <X size={18} /> {t('diseaseDetection.buttons.clearAnalysis')}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-[32px] shadow-xl border border-emerald-50 p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-emerald-900 rounded-xl flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-emerald-950">{t('diseaseDetection.upload.title')}</h2>
            </div>

            <label className="block w-full flex-1 group cursor-pointer">
              <div className="relative h-full border-3 border-dashed border-emerald-100 rounded-[24px] p-8 text-center bg-emerald-50/30 group-hover:bg-emerald-50 group-hover:border-emerald-500 transition-all flex flex-col justify-center items-center">
                {previewUrl ? (
                  <div className="space-y-4 w-full">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-80 mx-auto rounded-3xl shadow-2xl border-4 border-white object-cover aspect-square"
                    />
                    <p className="text-xs font-black text-emerald-900/40 uppercase tracking-widest truncate max-w-xs mx-auto">
                      {selectedFile.name}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                       <FileImage className="w-10 h-10 text-emerald-200 group-hover:text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-emerald-900">{t('diseaseDetection.upload.dropzone')}</p>
                      <p className="text-sm text-emerald-600/60 font-medium">{t('diseaseDetection.upload.formats')}</p>
                    </div>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </div>
            </label>

            <button
              onClick={handleDetect}
              disabled={!selectedFile || detecting}
              className="mt-8 w-full bg-emerald-900 hover:bg-emerald-800 text-white font-black py-5 rounded-[20px] transition-all shadow-2xl shadow-emerald-900/20 disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
            >
              {detecting ? (
                <> <Loader className="animate-spin" /> {t('diseaseDetection.buttons.processing')} </>
              ) : (
                <> <Activity size={20} /> {t('diseaseDetection.buttons.runDiagnostic')} </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {error && (
              <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl animate-shake flex items-center gap-4 text-rose-700">
                <AlertCircle className="flex-shrink-0" />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            {!result && !detecting && (
              <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-16 text-center border-2 border-dashed border-emerald-200">
                <Leaf size={48} className="mx-auto text-emerald-100 mb-6" />
                <h3 className="text-xl font-bold text-emerald-900/40">{t('diseaseDetection.results.awaiting')}</h3>
                <p className="text-emerald-600/40 text-sm mt-2">{t('diseaseDetection.results.awaitingDesc')}</p>
              </div>
            )}

            {result && result.success && (
              <div className="space-y-6 animate-fadeIn">
                {/* Hero Result Card */}
                <div className={`bg-emerald-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Activity size={120} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px] mb-4">
                      <Sparkles size={14} /> {t('diseaseDetection.results.scanResults')}
                    </div>
                    <h2 className="text-3xl font-black mb-4 leading-tight">
                      {result.disease_name}
                    </h2>
                    <div className="p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl inline-block italic text-emerald-50">
                      "{result.quick_summary}"
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: <Leaf />, label: t('diseaseDetection.results.crop'), val: result.crop_type, color: "border-emerald-500" },
                    { icon: <TrendingUp />, label: t('diseaseDetection.results.confidence'), val: `${(result.confidence * 100).toFixed(1)}%`, color: "border-emerald-500" },
                  ].map((item, i) => (
                    <div key={i} className={`bg-white rounded-3xl shadow-sm border-l-4 ${item.color} p-6`}>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                       <p className="text-xl font-black text-emerald-950">{item.val}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-2xl"><Clock className="text-emerald-700" /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">{t('diseaseDetection.results.growthStage')}</p>
                      <p className="font-bold text-emerald-950">{result.growth_stage.stage}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase border ${getSeverityBadge(result.severity.level)}`}>
                    {result.severity.level} {t('diseaseDetection.results.severity')}
                  </div>
                </div>

                {/* Detailed Treatment Card */}
                <div className="bg-white rounded-[32px] shadow-2xl border border-emerald-50 overflow-hidden">
                  <div className="bg-emerald-900 p-6 flex justify-between items-center text-white">
                    <h3 className="font-black uppercase tracking-widest text-xs">{t('diseaseDetection.treatment.title')}</h3>
                    <div className="flex gap-2">
                       <button 
                         onClick={handleShareTreatment} 
                         className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                         title={t('diseaseDetection.buttons.share')}
                       >
                         <Share2 size={16}/>
                       </button>
                       <button 
                         onClick={handleDownloadTreatment} 
                         className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                         title={t('diseaseDetection.buttons.download')}
                       >
                         <Download size={16}/>
                       </button>
                    </div>
                  </div>
                  <div className="p-8">
                     <div className="bg-emerald-50/50 rounded-2xl p-6 text-sm text-emerald-950 font-medium leading-relaxed border border-emerald-100 whitespace-pre-wrap">
                        {result.treatment_plan}
                     </div>
                     <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <AlertTriangle className="text-amber-500 w-5 h-5 flex-shrink-0" />
                        <p className="text-[10px] font-bold text-amber-800 leading-tight">
                           {t('diseaseDetection.treatment.disclaimer')}
                        </p>
                     </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 40s linear infinite; }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default DiseaseDetection;
