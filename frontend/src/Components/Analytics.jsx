// src/components/Analytics.jsx - WITH MULTILANGUAGE SUPPORT
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Activity, Droplets, Leaf, AlertTriangle, TrendingUp, 
  RefreshCw, CheckCircle2, Eye, Zap, Target, Award,
  ArrowUp, ArrowDown, AlertCircle, BarChart3,
  PieChart as PieIcon, Filter, Download, Share2, 
  FileText, ExternalLink, Bell, Clock, Calendar,
  MapPin, ThermometerSun, Wind, CloudRain, Sun, Cloud,
  Flower2, CircleDashed, Sprout
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Analytics = () => {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState(null);
  const [filteredAnalytics, setFilteredAnalytics] = useState(null);
  const [previousAnalytics, setPreviousAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [timeRange, setTimeRange] = useState('week');
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(() => {
      if (isMonitoring) {
        fetchAnalytics();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isMonitoring]);

  useEffect(() => {
    if (analytics) {
      applyFilters();
    }
  }, [selectedMetric, analytics]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:5000/api/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (analytics) {
        setPreviousAnalytics(analytics);
      }

      setAnalytics(response.data);
      setFilteredAnalytics(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || t('analytics.errors.fetchFailed'));
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTrend = (current, previous) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous * 100);
    return {
      value: Math.abs(change).toFixed(1),
      isUp: change > 0
    };
  };

  const applyFilters = () => {
    if (!analytics) return;

    let filtered = { ...analytics };

    if (selectedMetric === 'moisture') {
      filtered.fields = analytics.fields.filter(f => f.moisture < 40 || f.moisture > 60);
      filtered.chartData = {
        moisture: analytics.chartData.moisture,
        npk: [],
        ph: []
      };
    } else if (selectedMetric === 'nutrients') {
      filtered.fields = analytics.fields.filter(f => f.N < 40 || f.P < 40 || f.K < 40);
      filtered.chartData = {
        moisture: [],
        npk: analytics.chartData.npk,
        ph: []
      };
    } else if (selectedMetric === 'ph') {
      filtered.fields = analytics.fields.filter(f => f.pH < 5.5 || f.pH > 8.0);
      filtered.chartData = {
        moisture: [],
        npk: [],
        ph: analytics.chartData.ph
      };
    }

    setFilteredAnalytics(filtered);
  };

  const handleExportPDF = () => {
    if (!analytics) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(34, 197, 94);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(t('analytics.pdf.title'), pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`${t('analytics.pdf.generated')}: ${new Date().toLocaleString()}`, pageWidth / 2, 30, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(t('analytics.pdf.executiveSummary'), 14, 55);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`${t('analytics.pdf.totalFields')}: ${analytics.totalFields}`, 14, 65);
    doc.text(`${t('analytics.pdf.totalZones')}: ${analytics.totalZones || analytics.totalFields}`, 14, 72);
    doc.text(`${t('analytics.pdf.activeRiskAlerts')}: ${analytics.risks.length}`, 14, 79);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(t('analytics.pdf.averageMetrics'), 14, 95);

    const metricsData = [
      [t('analytics.table.metric'), t('analytics.table.value'), t('analytics.table.status')],
      [t('analytics.metrics.moisture'), `${analytics.averages.moisture}%`, analytics.averages.moisture >= 40 && analytics.averages.moisture <= 60 ? t('analytics.status.optimal') : t('analytics.status.check')],
      [t('analytics.metrics.nitrogen'), analytics.averages.nitrogen, analytics.averages.nitrogen >= 60 ? t('analytics.status.good') : t('analytics.status.low')],
      [t('analytics.metrics.phosphorus'), analytics.averages.phosphorus, analytics.averages.phosphorus >= 60 ? t('analytics.status.good') : t('analytics.status.low')],
      [t('analytics.metrics.potassium'), analytics.averages.potassium, analytics.averages.potassium >= 60 ? t('analytics.status.good') : t('analytics.status.low')],
      [t('analytics.metrics.phLevel'), analytics.averages.ph, analytics.averages.ph >= 6.0 && analytics.averages.ph <= 7.5 ? t('analytics.status.optimal') : t('analytics.status.check')]
    ];

    doc.autoTable({
      startY: 100,
      head: [metricsData[0]],
      body: metricsData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 253, 244] },
    });

    if (analytics.risks.length > 0) {
      doc.addPage();
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(t('analytics.pdf.riskAlerts'), 14, 20);

      const risksData = analytics.risks.map((risk, index) => [
        index + 1,
        risk.fieldName,
        risk.issue
      ]);

      doc.autoTable({
        startY: 30,
        head: [['#', t('analytics.table.fieldZone'), t('analytics.table.issue')]],
        body: risksData,
        theme: 'grid',
        headStyles: { fillColor: [239, 68, 68], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [254, 242, 242] },
      });
    }

    doc.addPage();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(t('analytics.pdf.fieldPerformance'), 14, 20);

    const fieldData = analytics.fields.map(field => [
      field.fieldName,
      field.cropType,
      field.moisture,
      field.N,
      field.P,
      field.K,
      field.pH,
      field.healthScore
    ]);

    doc.autoTable({
      startY: 30,
      head: [[t('analytics.table.field'), t('analytics.table.crop'), t('analytics.table.moisture'), 'N', 'P', 'K', t('analytics.table.ph'), t('analytics.table.health')]],
      body: fieldData,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      styles: { fontSize: 9 }
    });

    doc.addPage();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(t('analytics.pdf.aiHealthSummary'), 14, 20);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const splitText = doc.splitTextToSize(analytics.healthSummary, pageWidth - 28);
    doc.text(splitText, 14, 35);

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(
        `${t('analytics.pdf.page')} ${i} ${t('analytics.pdf.of')} ${totalPages} | ${t('analytics.pdf.farmAnalyticsDashboard')}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`Farm-Analytics-Report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleShare = () => {
    if (!analytics) return;

    const message = `🌾 *${t('analytics.share.title')}*\n\n` +
      `📊 *${t('analytics.share.summary')}*\n` +
      `• ${t('analytics.share.totalFields')}: ${analytics.totalFields}\n` +
      `• ${t('analytics.share.riskAlerts')}: ${analytics.risks.length}\n` +
      `• ${t('analytics.share.avgMoisture')}: ${analytics.averages.moisture}%\n` +
      `• ${t('analytics.share.avgPh')}: ${analytics.averages.ph}\n\n` +
      `🔬 *${t('analytics.share.npkLevels')}*\n` +
      `• ${t('analytics.share.nitrogen')}: ${analytics.averages.nitrogen}\n` +
      `• ${t('analytics.share.phosphorus')}: ${analytics.averages.phosphorus}\n` +
      `• ${t('analytics.share.potassium')}: ${analytics.averages.potassium}\n\n` +
      `💡 *${t('analytics.share.healthSummary')}*\n${analytics.healthSummary}\n\n` +
      `${t('analytics.share.generated')}: ${new Date().toLocaleString()}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="w-24 h-24 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <BarChart3 className="w-10 h-10 text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">{t('analytics.loading.title')}</h3>
          <p className="text-gray-500">{t('analytics.loading.description')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white border-2 border-red-200 rounded-2xl p-10 max-w-md text-center shadow-2xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-red-800 mb-3">{t('analytics.error.title')}</h3>
          <p className="text-red-600 mb-6 text-lg">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            {t('analytics.error.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-gray-500 text-xl">{t('analytics.noData')}</p>
        </div>
      </div>
    );
  }

  const displayData = filteredAnalytics || analytics;

  const fieldsTrend = previousAnalytics ? 
    calculateTrend(analytics.totalFields, previousAnalytics.totalFields) : null;
  const zonesTrend = previousAnalytics ? 
    calculateTrend(analytics.totalZones || analytics.totalFields, previousAnalytics.totalZones || previousAnalytics.totalFields) : null;
  const healthTrend = previousAnalytics && analytics.fields.length > 0 && previousAnalytics.fields.length > 0 ?
    calculateTrend(
      analytics.fields.reduce((sum, f) => sum + f.healthScore, 0) / analytics.fields.length,
      previousAnalytics.fields.reduce((sum, f) => sum + f.healthScore, 0) / previousAnalytics.fields.length
    ) : null;

  const healthDistribution = [
    { name: t('analytics.health.excellent'), value: analytics.fields.filter(f => f.healthScore >= 80).length, color: '#10b981' },
    { name: t('analytics.health.good'), value: analytics.fields.filter(f => f.healthScore >= 60 && f.healthScore < 80).length, color: '#fbbf24' },
    { name: t('analytics.health.fair'), value: analytics.fields.filter(f => f.healthScore >= 40 && f.healthScore < 60).length, color: '#f97316' },
    { name: t('analytics.health.poor'), value: analytics.fields.filter(f => f.healthScore < 40).length, color: '#ef4444' }
  ].filter(item => item.value > 0);

  return (
    <div className="min-h-screen relative pb-8">
      {/* Background Decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07]"></div>
        <Sun className="absolute -top-20 -right-20 text-yellow-400 opacity-10 w-96 h-96 animate-pulse-slow" />
        <Leaf className="absolute bottom-10 -left-10 text-emerald-600 opacity-5 w-80 h-80 rotate-45" />
        <Cloud className="absolute top-20 left-1/4 text-emerald-200 opacity-15 w-32 h-32" />
        <Cloud className="absolute top-40 right-1/4 text-emerald-200 opacity-15 w-24 h-24" />
        <CircleDashed className="absolute top-40 left-10 w-64 h-64 text-emerald-300 opacity-10 animate-spin-slow" />
        <Flower2 className="absolute bottom-20 right-10 w-96 h-96 text-emerald-200 opacity-10" />
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white px-4 md:px-8 py-6 md:py-10 mb-8 shadow-2xl relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse delay-75"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-4 md:mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tight mb-2">{t('analytics.title')}</h1>
                  <p className="text-emerald-100 text-lg font-semibold flex items-center gap-2">
                    <div className="h-1 w-8 bg-emerald-300 rounded-full"></div>
                    {t('analytics.subtitle')}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3">
              <button
                onClick={fetchAnalytics}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-5 py-3 rounded-xl transition-all duration-200 border border-white/30 hover:scale-105 font-bold shadow-lg"
                title={t('analytics.buttons.refresh')}
              >
                <RefreshCw className="w-5 h-5" />
                {t('analytics.buttons.refresh')}
              </button>
              <button 
                onClick={handleExportPDF}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-5 py-3 rounded-xl transition-all duration-200 border border-white/30 hover:scale-105 font-bold shadow-lg"
                title={t('analytics.buttons.exportPDF')}
              >
                <Download className="w-5 h-5" />
                {t('analytics.buttons.exportPDF')}
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-5 py-3 rounded-xl transition-all duration-200 border border-white/30 hover:scale-105 font-bold shadow-lg"
                title={t('analytics.buttons.share')}
              >
                <Share2 className="w-5 h-5" />
                {t('analytics.buttons.share')}
              </button>
            </div>
          </div>

          {/* Quick Stats with Real Trends */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <QuickStat 
              label={t('analytics.quickStats.totalFields')}
              value={analytics.totalFields} 
              icon={<Leaf className="w-6 h-6" />}
              trend={fieldsTrend}
            />
            <QuickStat 
              label={t('analytics.quickStats.totalZones')}
              value={analytics.totalZones || analytics.totalFields} 
              icon={<Target className="w-6 h-6" />}
              trend={zonesTrend}
            />
            <QuickStat 
              label={t('analytics.quickStats.riskAlerts')}
              value={analytics.risks.length} 
              icon={<AlertTriangle className="w-6 h-6" />}
              trend={{ value: analytics.risks.length > 0 ? t('analytics.quickStats.actionNeeded') : t('analytics.quickStats.allClear'), isUp: analytics.risks.length === 0 }}
            />
            <QuickStat 
              label={t('analytics.quickStats.avgHealth')}
              value={`${(analytics.fields.reduce((sum, f) => sum + f.healthScore, 0) / analytics.fields.length).toFixed(0)}%`}
              icon={<Award className="w-6 h-6" />}
              trend={healthTrend}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 mb-8 border border-emerald-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-emerald-950">{t('analytics.filters.title')}:</span>
              </div>

              <select 
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-4 py-2 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white font-bold text-emerald-900 shadow-sm hover:shadow-md transition-all"
              >
                <option value="all">{t('analytics.filters.allMetrics')}</option>
                <option value="moisture">{t('analytics.filters.moistureIssues')}</option>
                <option value="nutrients">{t('analytics.filters.nutrientDeficiency')}</option>
                <option value="ph">{t('analytics.filters.phImbalance')}</option>
              </select>

              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white font-bold text-emerald-900 shadow-sm hover:shadow-md transition-all"
              >
                <option value="week">{t('analytics.filters.lastWeek')}</option>
                <option value="month">{t('analytics.filters.lastMonth')}</option>
                <option value="quarter">{t('analytics.filters.lastQuarter')}</option>
                <option value="year">{t('analytics.filters.lastYear')}</option>
              </select>

              {selectedMetric !== 'all' && (
                <button
                  onClick={() => setSelectedMetric('all')}
                  className="px-4 py-2 bg-rose-100 text-rose-700 rounded-xl hover:bg-rose-200 transition-colors font-bold text-sm shadow-sm"
                >
                  {t('analytics.filters.clearFilter')}
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-md ${
                  isMonitoring 
                    ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300' 
                    : 'bg-slate-100 text-slate-600 border-2 border-slate-300'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>{isMonitoring ? t('analytics.monitoring.active') : t('analytics.monitoring.paused')}</span>
                <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
              </button>
              <div className="text-xs text-emerald-600 flex items-center gap-1 font-bold">
                <Clock className="w-3 h-3" />
                {t('analytics.monitoring.refreshInterval')}
              </div>
            </div>
          </div>

          {selectedMetric !== 'all' && (
            <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-500 rounded-r-xl shadow-sm">
              <p className="text-emerald-800 text-sm font-bold">
                🔍 {t('analytics.filters.showing')} {displayData.fields.length} {t('analytics.filters.fieldsWith')} {
                  selectedMetric === 'moisture' ? t('analytics.filters.moistureIssues') :
                  selectedMetric === 'nutrients' ? t('analytics.filters.nutrientDeficiency') :
                  t('analytics.filters.phImbalance')
                }
              </p>
            </div>
          )}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title={t('analytics.metricCards.avgMoisture')}
            value={`${analytics.averages.moisture}%`}
            icon={<Droplets className="w-8 h-8" />}
            color="blue"
            subtitle={t('analytics.metricCards.moistureOptimal')}
            status={analytics.averages.moisture >= 40 && analytics.averages.moisture <= 60 ? 'good' : 'warning'}
            t={t}
          />
          <MetricCard
            title={t('analytics.metricCards.avgNitrogen')}
            value={analytics.averages.nitrogen}
            icon={<Zap className="w-8 h-8" />}
            color="orange"
            subtitle={t('analytics.metricCards.nitrogenOptimal')}
            status={analytics.averages.nitrogen >= 60 ? 'good' : 'warning'}
            t={t}
          />
          <MetricCard
            title={t('analytics.metricCards.avgPh')}
            value={analytics.averages.ph}
            icon={<Activity className="w-8 h-8" />}
            color="cyan"
            subtitle={t('analytics.metricCards.phOptimal')}
            status={analytics.averages.ph >= 6.0 && analytics.averages.ph <= 7.5 ? 'good' : 'warning'}
            t={t}
          />
        </div>

        {/* NPK Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <NPKCard title={t('analytics.npk.phosphorus')} value={analytics.averages.phosphorus} color="purple" />
          <NPKCard title={t('analytics.npk.potassium')} value={analytics.averages.potassium} color="red" />
          <NPKCard 
            title={t('analytics.npk.balance')} 
            value={
              analytics.averages.nitrogen >= 60 && 
              analytics.averages.phosphorus >= 60 && 
              analytics.averages.potassium >= 60 ? t('analytics.status.good') : t('analytics.status.check')
            } 
            color="green" 
            status="balanced" 
          />
        </div>

        {/* Risk Alerts Section */}
        <div className="bg-gradient-to-br from-white/80 to-orange-50/30 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-8 border-2 border-orange-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                {analytics.risks.length > 0 && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-white text-xs font-bold">{analytics.risks.length}</span>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-3xl font-black text-emerald-950 mb-1 tracking-tight">{t('analytics.riskAssessment.title')}</h2>
                <p className="text-emerald-700 text-lg font-semibold">{t('analytics.riskAssessment.subtitle')}</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className={`px-6 py-3 rounded-full font-bold text-lg shadow-lg ${
                analytics.risks.length === 0 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' 
                  : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
              }`}>
                {analytics.risks.length} {t('analytics.riskAssessment.activeAlerts', { count: analytics.risks.length })}
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-bold">
                <Calendar className="w-4 h-4" />
                {t('analytics.riskAssessment.lastUpdated')}: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          {analytics.risks.length === 0 ? (
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-10 shadow-xl relative overflow-hidden">
              <Sprout className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10" />
              <div className="flex items-center justify-center gap-6 relative z-10">
                <div className="relative">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
                    <CheckCircle2 className="w-14 h-14 text-emerald-500" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-300 rounded-full animate-ping"></div>
                </div>
                <div className="text-white">
                  <h3 className="text-3xl font-black mb-2 tracking-tight">{t('analytics.riskAssessment.allSystemsOperational')}</h3>
                  <p className="text-xl text-emerald-100 font-semibold">{t('analytics.riskAssessment.noRisks')}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-bold">{t('analytics.riskAssessment.moistureOptimal')}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-bold">{t('analytics.riskAssessment.nutrientsBalanced')}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-bold">{t('analytics.riskAssessment.phNormal')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
                <RiskStat
                  label={t('analytics.riskStats.moistureIssues')}
                  count={analytics.risks.filter(r => r.issue.toLowerCase().includes('moisture')).length}
                  icon={<Droplets className="w-5 h-5" />}
                  color="blue"
                />
                <RiskStat
                  label={t('analytics.riskStats.nutrientDeficiency')}
                  count={analytics.risks.filter(r => 
                    r.issue.toLowerCase().includes('nitrogen') || 
                    r.issue.toLowerCase().includes('phosphorus') || 
                    r.issue.toLowerCase().includes('potassium')
                  ).length}
                  icon={<Zap className="w-5 h-5" />}
                  color="orange"
                />
                <RiskStat
                  label={t('analytics.riskStats.phImbalance')}
                  count={analytics.risks.filter(r => r.issue.toLowerCase().includes('ph')).length}
                  icon={<Activity className="w-5 h-5" />}
                  color="purple"
                />
                <RiskStat
                  label={t('analytics.riskStats.totalAffected')}
                  count={new Set(analytics.risks.map(r => r.fieldName)).size}
                  icon={<AlertTriangle className="w-5 h-5" />}
                  color="red"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {analytics.risks.map((risk, index) => (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-md border-2 border-orange-200 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                            !
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-emerald-600" />
                              <h4 className="font-black text-emerald-950 text-xl">{risk.fieldName}</h4>
                            </div>
                            <p className="text-emerald-800 text-base leading-relaxed mb-3 font-medium">{risk.issue}</p>

                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-black shadow-sm ${
                                risk.issue.toLowerCase().includes('moisture') ? 'bg-blue-100 text-blue-700' :
                                risk.issue.toLowerCase().includes('nitrogen') || risk.issue.toLowerCase().includes('phosphorus') || risk.issue.toLowerCase().includes('potassium') ? 'bg-orange-100 text-orange-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {risk.issue.toLowerCase().includes('moisture') ? `💧 ${t('analytics.riskTypes.moisture')}` :
                                 risk.issue.toLowerCase().includes('nitrogen') || risk.issue.toLowerCase().includes('phosphorus') || risk.issue.toLowerCase().includes('potassium') ? `🧪 ${t('analytics.riskTypes.nutrients')}` :
                                 `⚖️ ${t('analytics.riskTypes.phLevel')}`}
                              </span>
                              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-black shadow-sm">
                                🔴 {t('analytics.riskTypes.highPriority')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-emerald-200">
                        <button className="text-orange-600 hover:text-orange-700 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                          {t('analytics.buttons.viewDetails')} <ExternalLink className="w-4 h-4" />
                        </button>
                        <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105">
                          {t('analytics.buttons.takeAction')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Charts Section */}
        {(selectedMetric === 'all' || selectedMetric === 'moisture') && displayData.chartData.moisture.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ChartCard title={t('analytics.charts.moistureDistribution')} icon={<Droplets className="w-6 h-6" />}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={displayData.chartData.moisture}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #3b82f6', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="value" fill="url(#colorMoisture)" name={t('analytics.charts.moisturePercent')} radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title={t('analytics.charts.healthScoreDistribution')} icon={<PieIcon className="w-6 h-6" />}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={healthDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {healthDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        )}

        {(selectedMetric === 'all' || selectedMetric === 'nutrients') && displayData.chartData.npk.length > 0 && (
          <ChartCard title={t('analytics.charts.npkNutrientAnalysis')} icon={<Activity className="w-6 h-6" />} className="mb-8">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={displayData.chartData.npk}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '2px solid #10b981', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="nitrogen" fill="#f97316" name={t('analytics.charts.nitrogenN')} radius={[8, 8, 0, 0]} />
                <Bar dataKey="phosphorus" fill="#a855f7" name={t('analytics.charts.phosphorusP')} radius={[8, 8, 0, 0]} />
                <Bar dataKey="potassium" fill="#ef4444" name={t('analytics.charts.potassiumK')} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {(selectedMetric === 'all' || selectedMetric === 'ph') && displayData.chartData.ph.length > 0 && (
          <ChartCard title={t('analytics.charts.phLevelTrends')} icon={<TrendingUp className="w-6 h-6" />} className="mb-8">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={displayData.chartData.ph}>
                <defs>
                  <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis domain={[0, 14]} stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '2px solid #06b6d4', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} fill="url(#colorPh)" name={t('analytics.charts.phLevel')} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Field Performance Table */}
        <div className="bg-gradient-to-br from-white/80 to-emerald-50/30 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-8 border-2 border-emerald-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-emerald-950 mb-1 tracking-tight">{t('analytics.performanceMatrix.title')}</h2>
                <p className="text-emerald-700 text-lg font-semibold">{t('analytics.performanceMatrix.subtitle')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-black">
                {displayData.fields.length} {t('analytics.performanceMatrix.zones', { count: displayData.fields.length })}
              </div>
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-200 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md">
                <Download className="w-4 h-4" />
                {t('analytics.buttons.exportTable')}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-emerald-200 shadow-xl">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                  <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {t('analytics.table.fieldZone')}
                    </div>
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4" />
                      {t('analytics.table.cropType')}
                    </div>
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <Droplets className="w-4 h-4" />
                      {t('analytics.table.moisture')}
                    </div>
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">N</th>
                  <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">P</th>
                  <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">K</th>
                  <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <Activity className="w-4 h-4" />
                      {t('analytics.table.ph')}
                    </div>
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <Award className="w-4 h-4" />
                      {t('analytics.table.health')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y-2 divide-emerald-100">
                {displayData.fields.map((field, index) => (
                  <tr
                    key={index}
                    className="hover:bg-emerald-50 transition-all duration-200 group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                          {field.fieldName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-emerald-950">{field.fieldName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">
                        {field.cropType}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-bold text-gray-900">{field.moisture}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${
                              field.moisture >= 40 && field.moisture <= 60 
                                ? 'bg-emerald-500' 
                                : 'bg-orange-500'
                            }`}
                            style={{ width: `${Math.min(field.moisture, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center font-bold text-gray-900">{field.N}</td>
                    <td className="px-6 py-5 text-center font-bold text-gray-900">{field.P}</td>
                    <td className="px-6 py-5 text-center font-bold text-gray-900">{field.K}</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${
                        field.pH >= 6.0 && field.pH <= 7.5 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {field.pH}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-bold text-gray-900">{field.healthScore}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${
                              field.healthScore >= 80 ? 'bg-green-500' :
                              field.healthScore >= 60 ? 'bg-yellow-500' :
                              field.healthScore >= 40 ? 'bg-orange-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${field.healthScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.2; } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
};

// Component Helpers
const QuickStat = ({ label, value, icon, trend }) => (
  <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-lg hover:bg-white/30 transition-all">
    <div className="flex items-center justify-between mb-2">
      <span className="text-white/90 text-sm font-bold">{label}</span>
      <div className="text-white/90">{icon}</div>
    </div>
    <div className="text-3xl font-black text-white mb-1">{value}</div>
    {trend && (
      <div className="flex items-center gap-1 text-sm font-bold text-white/90">
        {trend.isUp ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
        <span>{typeof trend.value === 'string' ? trend.value : `${trend.value}%`}</span>
      </div>
    )}
  </div>
);

const MetricCard = ({ title, value, icon, color, subtitle, status, t }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    orange: 'from-orange-500 to-orange-600',
    cyan: 'from-cyan-500 to-cyan-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600'
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-100 hover:shadow-xl transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center text-white shadow-md`}>
          {icon}
        </div>
        {status && (
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            status === 'good' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {status === 'good' ? `✓ ${t('analytics.status.optimal')}` : `⚠ ${t('analytics.status.check')}`}
          </span>
        )}
      </div>
      <h3 className="text-sm text-gray-600 font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-black text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 font-medium">{subtitle}</p>}
    </div>
  );
};

const NPKCard = ({ title, value, color, status }) => {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600'
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-100 hover:shadow-xl transition-all">
      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center text-white shadow-md mb-4`}>
        <Activity className="w-6 h-6" />
      </div>
      <h3 className="text-sm text-gray-600 font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-black text-gray-900">{value}</p>
    </div>
  );
};

const RiskStat = ({ label, count, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    red: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <div className={`${colorClasses[color]} rounded-xl p-4 border-2`}>
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-3xl font-black">{count}</p>
    </div>
  );
};

const ChartCard = ({ title, icon, children, className = '' }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-100 ${className}`}>
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-md">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

export default Analytics;
