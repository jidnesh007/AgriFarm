import React, { useState, useEffect } from 'react';
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
  const [analytics, setAnalytics] = useState(null);
  const [filteredAnalytics, setFilteredAnalytics] = useState(null);
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
      setAnalytics(response.data);
      setFilteredAnalytics(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics data');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
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
    doc.text('Farm Analytics Report', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 30, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Executive Summary', 14, 55);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Fields: ${analytics.totalFields}`, 14, 65);
    doc.text(`Total Zones: ${analytics.totalZones || analytics.totalFields}`, 14, 72);
    doc.text(`Active Risk Alerts: ${analytics.risks.length}`, 14, 79);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Average Metrics', 14, 95);
    
    const metricsData = [
      ['Metric', 'Value', 'Status'],
      ['Moisture', `${analytics.averages.moisture}%`, analytics.averages.moisture >= 40 && analytics.averages.moisture <= 60 ? 'Optimal' : 'Check'],
      ['Nitrogen (N)', analytics.averages.nitrogen, analytics.averages.nitrogen >= 60 ? 'Good' : 'Low'],
      ['Phosphorus (P)', analytics.averages.phosphorus, analytics.averages.phosphorus >= 60 ? 'Good' : 'Low'],
      ['Potassium (K)', analytics.averages.potassium, analytics.averages.potassium >= 60 ? 'Good' : 'Low'],
      ['pH Level', analytics.averages.ph, analytics.averages.ph >= 6.0 && analytics.averages.ph <= 7.5 ? 'Optimal' : 'Check']
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
      doc.text('Risk Alerts', 14, 20);
      
      const risksData = analytics.risks.map((risk, index) => [
        index + 1,
        risk.fieldName,
        risk.issue
      ]);

      doc.autoTable({
        startY: 30,
        head: [['#', 'Field/Zone', 'Issue']],
        body: risksData,
        theme: 'grid',
        headStyles: { fillColor: [239, 68, 68], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [254, 242, 242] },
      });
    }

    doc.addPage();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Field Performance Details', 14, 20);

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
      head: [['Field', 'Crop', 'Moisture', 'N', 'P', 'K', 'pH', 'Health']],
      body: fieldData,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      styles: { fontSize: 9 }
    });

    doc.addPage();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('AI Health Summary', 14, 20);
    
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
        `Page ${i} of ${totalPages} | Farm Analytics Dashboard`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`Farm-Analytics-Report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleShare = () => {
    if (!analytics) return;

    const message = `🌾 *Farm Analytics Report*\\n\\n` +
      `📊 *Summary*\\n` +
      `• Total Fields: ${analytics.totalFields}\\n` +
      `• Risk Alerts: ${analytics.risks.length}\\n` +
      `• Avg Moisture: ${analytics.averages.moisture}%\\n` +
      `• Avg pH: ${analytics.averages.ph}\\n\\n` +
      `🔬 *NPK Levels*\\n` +
      `• Nitrogen: ${analytics.averages.nitrogen}\\n` +
      `• Phosphorus: ${analytics.averages.phosphorus}\\n` +
      `• Potassium: ${analytics.averages.potassium}\\n\\n` +
      `💡 *Health Summary*\\n${analytics.healthSummary}\\n\\n` +
      `Generated: ${new Date().toLocaleString()}`;

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
          <h3 className="text-xl font-bold text-gray-700 mb-2">Loading Analytics</h3>
          <p className="text-gray-500">Crunching your farm data...</p>
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
          <h3 className="text-2xl font-bold text-red-800 mb-3">Oops! Something went wrong</h3>
          <p className="text-red-600 mb-6 text-lg">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
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
          <p className="text-gray-500 text-xl">No analytics data available</p>
        </div>
      </div>
    );
  }

  const displayData = filteredAnalytics || analytics;

  const healthDistribution = [
    { name: 'Excellent', value: analytics.fields.filter(f => f.healthScore >= 80).length, color: '#10b981' },
    { name: 'Good', value: analytics.fields.filter(f => f.healthScore >= 60 && f.healthScore < 80).length, color: '#fbbf24' },
    { name: 'Fair', value: analytics.fields.filter(f => f.healthScore >= 40 && f.healthScore < 60).length, color: '#f97316' },
    { name: 'Poor', value: analytics.fields.filter(f => f.healthScore < 40).length, color: '#ef4444' }
  ].filter(item => item.value > 0);

  return (
    <div className="min-h-screen relative pb-8">
      {/* Enhanced Background Decorations - Matching Dashboard Theme */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Dotted Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07]"></div>
        
        {/* Floating Nature Elements */}
        <Sun className="absolute -top-20 -right-20 text-yellow-400 opacity-10 w-96 h-96 animate-pulse-slow" />
        <Leaf className="absolute bottom-10 -left-10 text-emerald-600 opacity-5 w-80 h-80 rotate-45" />
        <Cloud className="absolute top-20 left-1/4 text-emerald-200 opacity-15 w-32 h-32" />
        <Cloud className="absolute top-40 right-1/4 text-emerald-200 opacity-15 w-24 h-24" />
        <CircleDashed className="absolute top-40 left-10 w-64 h-64 text-emerald-300 opacity-10 animate-spin-slow" />
        <Flower2 className="absolute bottom-20 right-10 w-96 h-96 text-emerald-200 opacity-10" />
      </div>

      {/* Enhanced Hero Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white px-8 py-10 mb-8 shadow-2xl relative overflow-hidden z-10">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse delay-75"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tight mb-2">Analytics Dashboard</h1>
                  <p className="text-emerald-100 text-lg font-semibold flex items-center gap-2">
                    <div className="h-1 w-8 bg-emerald-300 rounded-full"></div>
                    Comprehensive farm performance insights
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={fetchAnalytics}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-5 py-3 rounded-xl transition-all duration-200 border border-white/30 hover:scale-105 font-bold shadow-lg"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh
              </button>
              <button 
                onClick={handleExportPDF}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-5 py-3 rounded-xl transition-all duration-200 border border-white/30 hover:scale-105 font-bold shadow-lg"
                title="Download PDF Report"
              >
                <Download className="w-5 h-5" />
                Export PDF
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-5 py-3 rounded-xl transition-all duration-200 border border-white/30 hover:scale-105 font-bold shadow-lg"
                title="Share via WhatsApp"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            <QuickStat 
              label="Total Fields" 
              value={analytics.totalFields} 
              icon={<Leaf className="w-6 h-6" />}
              trend="+12%"
              trendUp={true}
            />
            <QuickStat 
              label="Total Zones" 
              value={analytics.totalZones || analytics.totalFields} 
              icon={<Target className="w-6 h-6" />}
              trend="+8%"
              trendUp={true}
            />
            <QuickStat 
              label="Risk Alerts" 
              value={analytics.risks.length} 
              icon={<AlertTriangle className="w-6 h-6" />}
              trend={analytics.risks.length > 0 ? "Action Needed" : "All Clear"}
              trendUp={false}
            />
            <QuickStat 
              label="Avg Health" 
              value={`${(analytics.fields.reduce((sum, f) => sum + f.healthScore, 0) / analytics.fields.length).toFixed(0)}%`}
              icon={<Award className="w-6 h-6" />}
              trend="+5%"
              trendUp={true}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Enhanced Filters Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 mb-8 border border-emerald-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-emerald-950">Filters:</span>
              </div>
              
              <select 
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-4 py-2 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white font-bold text-emerald-900 shadow-sm hover:shadow-md transition-all"
              >
                <option value="all">🌐 All Metrics</option>
                <option value="moisture">💧 Moisture Issues</option>
                <option value="nutrients">🧪 Nutrient Deficiency</option>
                <option value="ph">⚖️ pH Imbalance</option>
              </select>

              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white font-bold text-emerald-900 shadow-sm hover:shadow-md transition-all"
              >
                <option value="week">📅 Last Week</option>
                <option value="month">📆 Last Month</option>
                <option value="quarter">📊 Last Quarter</option>
                <option value="year">🗓️ Last Year</option>
              </select>

              {selectedMetric !== 'all' && (
                <button
                  onClick={() => setSelectedMetric('all')}
                  className="px-4 py-2 bg-rose-100 text-rose-700 rounded-xl hover:bg-rose-200 transition-colors font-bold text-sm shadow-sm"
                >
                  Clear Filter
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
                <span>{isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}</span>
                <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
              </button>
              <div className="text-xs text-emerald-600 flex items-center gap-1 font-bold">
                <Clock className="w-3 h-3" />
                Refreshes every 30s
              </div>
            </div>
          </div>

          {selectedMetric !== 'all' && (
            <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-500 rounded-r-xl shadow-sm">
              <p className="text-emerald-800 text-sm font-bold">
                🔍 Showing {displayData.fields.length} field(s) with {
                  selectedMetric === 'moisture' ? 'moisture issues' :
                  selectedMetric === 'nutrients' ? 'nutrient deficiencies' :
                  'pH imbalances'
                }
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Key Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Average Moisture"
            value={`${analytics.averages.moisture}%`}
            icon={<Droplets className="w-8 h-8" />}
            color="blue"
            subtitle="Optimal range: 40-60%"
            status={analytics.averages.moisture >= 40 && analytics.averages.moisture <= 60 ? 'good' : 'warning'}
          />
          <MetricCard
            title="Average Nitrogen"
            value={analytics.averages.nitrogen}
            icon={<Zap className="w-8 h-8" />}
            color="orange"
            subtitle="Optimal range: 60-80"
            status={analytics.averages.nitrogen >= 60 ? 'good' : 'warning'}
          />
          <MetricCard
            title="Average pH"
            value={analytics.averages.ph}
            icon={<Activity className="w-8 h-8" />}
            color="cyan"
            subtitle="Optimal range: 6.0-7.5"
            status={analytics.averages.ph >= 6.0 && analytics.averages.ph <= 7.5 ? 'good' : 'warning'}
          />
        </div>

        {/* Enhanced NPK Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <NPKCard title="Phosphorus (P)" value={analytics.averages.phosphorus} color="purple" />
          <NPKCard title="Potassium (K)" value={analytics.averages.potassium} color="red" />
          <NPKCard title="NPK Balance" value="Good" color="green" status="balanced" />
        </div>

        {/* Enhanced Risk Alerts Section */}
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
                <h2 className="text-3xl font-black text-emerald-950 mb-1 tracking-tight">Risk Assessment Center</h2>
                <p className="text-emerald-700 text-lg font-semibold">Critical issues requiring immediate attention</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className={`px-6 py-3 rounded-full font-bold text-lg shadow-lg ${
                analytics.risks.length === 0 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' 
                  : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
              }`}>
                {analytics.risks.length} Active {analytics.risks.length === 1 ? 'Alert' : 'Alerts'}
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-bold">
                <Calendar className="w-4 h-4" />
                Last updated: {new Date().toLocaleTimeString()}
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
                  <h3 className="text-3xl font-black mb-2 tracking-tight">All Systems Operational!</h3>
                  <p className="text-xl text-emerald-100 font-semibold">No critical risks detected across your farm zones</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-bold">Moisture: Optimal</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-bold">Nutrients: Balanced</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-bold">pH: Normal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Risk Summary Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <RiskStat
                  label="Moisture Issues"
                  count={analytics.risks.filter(r => r.issue.includes('moisture')).length}
                  icon={<Droplets className="w-5 h-5" />}
                  color="blue"
                />
                <RiskStat
                  label="Nutrient Deficiency"
                  count={analytics.risks.filter(r => r.issue.includes('nitrogen') || r.issue.includes('phosphorus') || r.issue.includes('potassium')).length}
                  icon={<Zap className="w-5 h-5" />}
                  color="orange"
                />
                <RiskStat
                  label="pH Imbalance"
                  count={analytics.risks.filter(r => r.issue.includes('pH')).length}
                  icon={<Activity className="w-5 h-5" />}
                  color="purple"
                />
                <RiskStat
                  label="Total Affected"
                  count={new Set(analytics.risks.map(r => r.fieldName)).size}
                  icon={<AlertTriangle className="w-5 h-5" />}
                  color="red"
                />
              </div>

              {/* Enhanced Risk Cards Grid */}
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
                                risk.issue.includes('moisture') ? 'bg-blue-100 text-blue-700' :
                                risk.issue.includes('nitrogen') || risk.issue.includes('phosphorus') || risk.issue.includes('potassium') ? 'bg-orange-100 text-orange-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {risk.issue.includes('moisture') ? '💧 Moisture' :
                                 risk.issue.includes('nitrogen') || risk.issue.includes('phosphorus') || risk.issue.includes('potassium') ? '🧪 Nutrients' :
                                 '⚖️ pH Level'}
                              </span>
                              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-black shadow-sm">
                                🔴 High Priority
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-emerald-200">
                        <button className="text-orange-600 hover:text-orange-700 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                          View Details <ExternalLink className="w-4 h-4" />
                        </button>
                        <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105">
                          Take Action
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
            <ChartCard title="Moisture Distribution" icon={<Droplets className="w-6 h-6" />}>
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
                  <Bar dataKey="value" fill="url(#colorMoisture)" name="Moisture %" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Health Score Distribution" icon={<PieIcon className="w-6 h-6" />}>
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
          <ChartCard title="NPK Nutrient Analysis" icon={<Activity className="w-6 h-6" />} className="mb-8">
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
                <Bar dataKey="nitrogen" fill="#f97316" name="Nitrogen (N)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="phosphorus" fill="#a855f7" name="Phosphorus (P)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="potassium" fill="#ef4444" name="Potassium (K)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {(selectedMetric === 'all' || selectedMetric === 'ph') && displayData.chartData.ph.length > 0 && (
          <ChartCard title="pH Level Trends" icon={<TrendingUp className="w-6 h-6" />} className="mb-8">
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
                <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} fill="url(#colorPh)" name="pH Level" />
                <Line type="monotone" dataKey={() => 7} stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Neutral pH" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Enhanced Field Performance Matrix */}
        <div className="bg-gradient-to-br from-white/80 to-emerald-50/30 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-8 border-2 border-emerald-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-emerald-950 mb-1 tracking-tight">Field Performance Matrix</h2>
                <p className="text-emerald-700 text-lg font-semibold">Comprehensive metrics across all farm zones</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-black">
                {displayData.fields.length} {displayData.fields.length === 1 ? 'Zone' : 'Zones'}
              </div>
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-200 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md">
                <Download className="w-4 h-4" />
                Export Table
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
                      Field/Zone
                    </div>
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4" />
                      Crop Type
                    </div>
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <Droplets className="w-4 h-4" />
                      Moisture
                    </div>
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">N</th>
                  <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">P</th>
                  <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">K</th>
                  <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <Activity className="w-4 h-4" />
                      pH
                    </div>
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-black uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <Award className="w-4 h-4" />
                      Health
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
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                          {index + 1}
                        </div>
                        <span className="text-sm text-emerald-900 font-black group-hover:text-emerald-600 transition-colors">
                          {field.fieldName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 rounded-full text-xs font-black shadow-sm">
                        🌾 {field.cropType}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <EnhancedValueBadge value={field.moisture} threshold={25} suffix="%" type="moisture" />
                    </td>
                    <td className="px-6 py-5 text-center">
                      <EnhancedValueBadge value={field.N} threshold={40} type="nutrient" />
                    </td>
                    <td className="px-6 py-5 text-center">
                      <EnhancedValueBadge value={field.P} threshold={40} type="nutrient" />
                    </td>
                    <td className="px-6 py-5 text-center">
                      <EnhancedValueBadge value={field.K} threshold={40} type="nutrient" />
                    </td>
                    <td className="px-6 py-5 text-center">
                      <EnhancedValueBadge 
                        value={field.pH} 
                        threshold={5.5} 
                        maxThreshold={8}
                        isWarning={field.pH < 5.5 || field.pH > 8}
                        type="ph"
                      />
                    </td>
                    <td className="px-6 py-5 text-center">
                      <EnhancedHealthScoreBadge score={field.healthScore} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer Stats */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200 shadow-sm">
              <p className="text-blue-600 text-sm font-bold mb-1">Avg Moisture</p>
              <p className="text-2xl font-black text-blue-800">{analytics.averages.moisture}%</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border-2 border-orange-200 shadow-sm">
              <p className="text-orange-600 text-sm font-bold mb-1">Avg NPK</p>
              <p className="text-2xl font-black text-orange-800">
                {((parseFloat(analytics.averages.nitrogen) + parseFloat(analytics.averages.phosphorus) + parseFloat(analytics.averages.potassium)) / 3).toFixed(1)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border-2 border-purple-200 shadow-sm">
              <p className="text-purple-600 text-sm font-bold mb-1">Avg pH</p>
              <p className="text-2xl font-black text-purple-800">{analytics.averages.ph}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-4 rounded-xl border-2 border-emerald-200 shadow-sm">
              <p className="text-emerald-600 text-sm font-bold mb-1">Avg Health</p>
              <p className="text-2xl font-black text-emerald-800">
                {(analytics.fields.reduce((sum, f) => sum + f.healthScore, 0) / analytics.fields.length).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Health Summary */}
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 rounded-3xl shadow-2xl p-10 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white mb-1 tracking-tight">AI-Powered Health Summary</h2>
                <p className="text-emerald-100 font-semibold">Generated insights from your farm data</p>
              </div>
            </div>
            
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <p className="text-emerald-900 text-lg leading-relaxed flex-1 font-medium">
                  {analytics.healthSummary}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 40s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 5s ease-in-out infinite;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .scrollbar-thumb-emerald-400::-webkit-scrollbar-thumb {
          background-color: rgb(52 211 153);
          border-radius: 3px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

// Sub-components

const QuickStat = ({ label, value, icon, trend, trendUp }) => (
  <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-lg">
    <div className="flex items-center justify-between mb-2">
      <span className="text-white/90 text-sm font-bold">{label}</span>
      {icon}
    </div>
    <div className="text-3xl font-black text-white mb-1">{value}</div>
    <div className="flex items-center gap-1 text-sm font-bold">
      {trendUp ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
      <span className="text-white/90">{trend}</span>
    </div>
  </div>
);

const MetricCard = ({ title, value, icon, color, subtitle, status }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    orange: 'from-orange-500 to-orange-600',
    cyan: 'from-cyan-500 to-cyan-600',
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-emerald-100 hover:shadow-2xl transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
          <div className="text-white">{icon}</div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-black ${status === 'good' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
          {status === 'good' ? 'Optimal' : 'Check'}
        </div>
      </div>
      <h3 className="text-emerald-700 text-sm font-black mb-2 uppercase tracking-wider">{title}</h3>
      <div className="text-4xl font-black text-emerald-950 mb-2">{value}</div>
      <p className="text-emerald-600 text-xs font-bold">{subtitle}</p>
    </div>
  );
};

const NPKCard = ({ title, value, color, status }) => {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600 border-purple-200',
    red: 'from-red-500 to-red-600 border-red-200',
    green: 'from-emerald-500 to-emerald-600 border-emerald-200',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-3xl shadow-xl p-6 border-2 text-white hover:scale-105 transition-transform`}>
      <h3 className="text-sm font-black mb-2 opacity-90 uppercase tracking-wider">{title}</h3>
      <div className="text-4xl font-black mb-1">{value}</div>
      {status && <p className="text-sm opacity-90 font-bold">System {status}</p>}
    </div>
  );
};

const ChartCard = ({ title, icon, children, className = '' }) => (
  <div className={`bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-emerald-100 ${className}`}>
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="text-xl font-black text-emerald-950">{title}</h3>
    </div>
    {children}
  </div>
);

const RiskStat = ({ label, count, icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-4 text-white shadow-lg hover:scale-105 transition-transform`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-black opacity-90">{label}</span>
      </div>
      <div className="text-3xl font-black">{count}</div>
    </div>
  );
};

const EnhancedValueBadge = ({ value, threshold, maxThreshold, suffix = '', isWarning, type }) => {
  const isLow = isWarning !== undefined ? isWarning : value < threshold;
  const isHigh = maxThreshold && value > maxThreshold;
  
  let bgColor, textColor, icon;
  
  if (isLow || isHigh) {
    bgColor = 'bg-gradient-to-r from-red-500 to-red-600';
    textColor = 'text-white';
    icon = <AlertTriangle className="w-3 h-3" />;
  } else {
    bgColor = 'bg-gradient-to-r from-emerald-500 to-emerald-600';
    textColor = 'text-white';
    icon = <CheckCircle2 className="w-3 h-3" />;
  }
  
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`px-4 py-2 rounded-lg text-sm font-black shadow-lg ${bgColor} ${textColor} flex items-center gap-2`}>
        {icon}
        {value}{suffix}
      </span>
    </div>
  );
};

const EnhancedHealthScoreBadge = ({ score }) => {
  let bgColor, textColor, label, icon;
  
  if (score >= 80) {
    bgColor = 'bg-gradient-to-r from-emerald-500 to-emerald-600';
    textColor = 'text-white';
    label = 'Excellent';
    icon = '🌟';
  } else if (score >= 60) {
    bgColor = 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    textColor = 'text-white';
    label = 'Good';
    icon = '👍';
  } else if (score >= 40) {
    bgColor = 'bg-gradient-to-r from-orange-500 to-orange-600';
    textColor = 'text-white';
    label = 'Fair';
    icon = '⚠️';
  } else {
    bgColor = 'bg-gradient-to-r from-red-500 to-red-600';
    textColor = 'text-white';
    label = 'Poor';
    icon = '🚨';
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`px-5 py-2 rounded-xl text-base font-black shadow-lg ${bgColor} ${textColor} flex items-center gap-2`}>
        <span>{icon}</span>
        <span>{score}</span>
      </div>
      <span className="text-xs font-black text-emerald-700 px-3 py-1 bg-emerald-100 rounded-full">{label}</span>
    </div>
  );
};

export default Analytics;
