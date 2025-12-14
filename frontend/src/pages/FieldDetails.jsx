import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "lucide-react";

const FieldDetails = () => {
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
      Dry: "bg-red-100 text-red-700 border-red-300",
      Optimal: "bg-green-100 text-green-700 border-green-300",
      Wet: "bg-blue-100 text-blue-700 border-blue-300",
      Healthy: "bg-green-100 text-green-700 border-green-300",
      Stress: "bg-yellow-100 text-yellow-700 border-yellow-300",
      Critical: "bg-red-100 text-red-700 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const getHealthColor = (health) => {
    if (health >= 75) return "text-green-600 bg-green-100 border-green-300";
    if (health >= 50) return "text-yellow-600 bg-yellow-100 border-yellow-300";
    return "text-red-600 bg-red-100 border-red-300";
  };

  const getHealthStatus = (health) => {
    if (health >= 75) return "Excellent";
    if (health >= 50) return "Moderate";
    return "Poor";
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

      // Show success message
      const rec = response.data.recommendation;
      alert(
        `✅ AI Recommendation Generated!\n\n💧 Irrigation: ${
          rec.irrigation_mm
        }mm\n🌿 Fertilizer: ${
          rec.fertilizer_kg
        }kg/acre\n💚 Health Score: ${rec.health_score.toFixed(1)}%\n\n${
          rec.explanation
        }`
      );
    } catch (error) {
      console.error("Error generating AI recommendation:", error);
      alert(
        error.response?.data?.message ||
          "Failed to generate AI recommendation. Make sure Python server (port 8000) is running."
      );
    } finally {
      setGeneratingRecs(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading field details...</p>
        </div>
      </div>
    );
  }

  if (!field) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <p className="text-gray-700">Field not found</p>
          <button
            onClick={() => navigate("/fields")}
            className="mt-4 text-green-600 hover:text-green-700"
          >
            Back to fields
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/fields")}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Fields
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {field.fieldName}
              </h1>
              <p className="text-gray-600 mt-1">
                {field.cropType} • {field.fieldArea.value}{" "}
                {field.fieldArea.unit}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {field.location.village && `${field.location.village}, `}
                {field.location.district}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                  field.overallHealth.status
                )}`}
              >
                {field.overallHealth.status} Health
              </span>
              <p className="text-xs text-gray-500 mt-2">
                Last updated: {new Date(field.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Weather Summary */}
        {field.weatherSummary && field.weatherSummary.lastUpdated && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-6 mb-6 text-white">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Cloud size={24} />
              Weather Impact Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer size={20} />
                  <span className="text-sm">Temperature</span>
                </div>
                <p className="text-2xl font-bold">
                  {field.weatherSummary.temperature}°C
                </p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets size={20} />
                  <span className="text-sm">Humidity</span>
                </div>
                <p className="text-2xl font-bold">
                  {field.weatherSummary.humidity}%
                </p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CloudRain size={20} />
                  <span className="text-sm">Rainfall</span>
                </div>
                <p className="text-sm font-semibold">
                  {field.weatherSummary.rainfall}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={20} />
                  <span className="text-sm">Stress Risk</span>
                </div>
                <p className="text-sm font-semibold">
                  {field.weatherSummary.stressRisk}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Zone Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <div className="flex overflow-x-auto border-b border-gray-200">
            {field.zones.map((zone) => (
              <button
                key={zone._id}
                onClick={() => setSelectedZone(zone)}
                className={`px-6 py-4 font-semibold whitespace-nowrap transition ${
                  selectedZone?._id === zone._id
                    ? "bg-green-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {zone.zoneName}
              </button>
            ))}
          </div>

          {/* Zone Details */}
          {selectedZone && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedZone.zoneName} Details
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => generateAIRecommendation(selectedZone._id)}
                    disabled={generatingRecs}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generatingRecs ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain size={18} />
                        AI Recommend
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowSoilModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Edit2 size={18} />
                    Update Soil Data
                  </button>
                </div>
              </div>

              {/* Soil Conditions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets size={20} className="text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Soil Moisture
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">
                    {selectedZone.soilMoisture.value}%
                  </p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      selectedZone.soilMoisture.status
                    )}`}
                  >
                    {selectedZone.soilMoisture.status}
                  </span>
                  {selectedZone.soilMoisture.lastUpdated && (
                    <p className="text-xs text-gray-500 mt-2">
                      Updated:{" "}
                      {new Date(
                        selectedZone.soilMoisture.lastUpdated
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf size={20} className="text-green-600" />
                    <span className="text-sm font-medium text-gray-700">
                      NPK Levels
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold">N:</span>{" "}
                      {selectedZone.soilNutrients.nitrogen} ppm
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">P:</span>{" "}
                      {selectedZone.soilNutrients.phosphorus} ppm
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">K:</span>{" "}
                      {selectedZone.soilNutrients.potassium} ppm
                    </p>
                  </div>
                  {selectedZone.soilNutrients.lastUpdated && (
                    <p className="text-xs text-gray-500 mt-2">
                      Updated:{" "}
                      {new Date(
                        selectedZone.soilNutrients.lastUpdated
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={20} className="text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Soil pH
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">
                    {selectedZone.soilPH.value}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    {selectedZone.soilPH.value < 6.5
                      ? "Acidic"
                      : selectedZone.soilPH.value > 7.5
                      ? "Alkaline"
                      : "Neutral"}
                  </p>
                  {selectedZone.soilPH.lastUpdated && (
                    <p className="text-xs text-gray-500 mt-2">
                      Updated:{" "}
                      {new Date(
                        selectedZone.soilPH.lastUpdated
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf size={20} className="text-yellow-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Crop Health
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">
                    {selectedZone.cropHealth.score}%
                  </p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      selectedZone.cropHealth.status
                    )}`}
                  >
                    {selectedZone.cropHealth.status}
                  </span>
                  {selectedZone.cropHealth.lastUpdated && (
                    <p className="text-xs text-gray-500 mt-2">
                      Updated:{" "}
                      {new Date(
                        selectedZone.cropHealth.lastUpdated
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* AI Recommendations Section */}
              {selectedZone.recommendations &&
              selectedZone.recommendations.lastGenerated ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      {selectedZone.recommendations.aiGenerated && (
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <Brain size={20} className="text-purple-600" />
                        </div>
                      )}
                      AI-Powered Recommendations
                    </h3>
                    {selectedZone.recommendations.aiGenerated && (
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                        DRL Model
                      </span>
                    )}
                  </div>

                  {/* Health Score Card */}
                  {selectedZone.recommendations.healthScore > 0 && (
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg p-6">
                      <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <TrendingUp size={20} className="text-purple-600" />
                        AI Health Assessment
                      </h4>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-700 font-semibold">
                          Overall Health Score
                        </span>
                        <div className="text-right">
                          <span className="text-4xl font-bold text-purple-600">
                            {selectedZone.recommendations.healthScore.toFixed(
                              1
                            )}
                            %
                          </span>
                          <span
                            className={`block mt-1 px-3 py-1 rounded-full text-xs font-semibold border ${getHealthColor(
                              selectedZone.recommendations.healthScore
                            )}`}
                          >
                            {getHealthStatus(
                              selectedZone.recommendations.healthScore
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className="h-full transition-all duration-500 rounded-full"
                          style={{
                            width: `${selectedZone.recommendations.healthScore}%`,
                            backgroundColor:
                              selectedZone.recommendations.healthScore >= 75
                                ? "#16a34a"
                                : selectedZone.recommendations.healthScore >= 50
                                ? "#eab308"
                                : "#dc2626",
                          }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-3 text-center">
                        {selectedZone.recommendations.healthScore >= 75
                          ? "🌟 Excellent crop health! Continue current practices."
                          : selectedZone.recommendations.healthScore >= 50
                          ? "⚠️ Moderate health - Follow recommendations below."
                          : "🚨 Poor health - Immediate action required!"}
                      </p>
                    </div>
                  )}

                  {/* Explanation */}
                  {selectedZone.recommendations.explanation && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        Why this recommendation?
                      </h4>
                      <p className="text-sm text-blue-800">
                        {selectedZone.recommendations.explanation}
                      </p>
                    </div>
                  )}

                  {/* Weather Influence */}
                  {selectedZone.recommendations.weatherInfluence && (
                    <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Cloud size={18} className="text-sky-600" />
                        <h4 className="font-semibold text-gray-800">
                          Weather Conditions Considered
                        </h4>
                      </div>
                      <p className="text-sm text-gray-700">
                        {selectedZone.recommendations.weatherInfluence}
                      </p>
                    </div>
                  )}

                  {/* Action Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Irrigation */}
                    <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Droplets size={24} className="text-blue-600" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-800">
                          Irrigation
                        </h4>
                      </div>

                      {selectedZone.recommendations.irrigation.amount > 0 ? (
                        <>
                          <p className="text-4xl font-bold text-blue-600 mb-2">
                            {selectedZone.recommendations.irrigation.amount}{" "}
                            {selectedZone.recommendations.irrigation.unit}
                          </p>
                          <p className="text-sm text-gray-700 mb-3">
                            <span className="font-semibold">When:</span>{" "}
                            {selectedZone.recommendations.irrigation.timing}
                          </p>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                  width: `${selectedZone.recommendations.irrigation.confidence}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-600">
                              {
                                selectedZone.recommendations.irrigation
                                  .confidence
                              }
                              % confidence
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition">
                              <CheckCircle size={18} />
                              Approve
                            </button>
                            <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg transition">
                              Modify
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <CheckCircle
                            size={48}
                            className="mx-auto text-green-500 mb-2"
                          />
                          <p className="text-gray-600 font-semibold">
                            No irrigation needed
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Soil moisture is at optimal levels
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Fertilizer */}
                    <div className="bg-white border-2 border-green-200 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Leaf size={24} className="text-green-600" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-800">
                          Fertilizer
                        </h4>
                      </div>

                      {selectedZone.recommendations.fertilizer.amount > 0 ? (
                        <>
                          <p className="text-4xl font-bold text-green-600 mb-2">
                            {selectedZone.recommendations.fertilizer.amount}{" "}
                            {selectedZone.recommendations.fertilizer.unit}
                          </p>
                          <p className="text-sm text-gray-700 mb-1">
                            <span className="font-semibold">Type:</span>{" "}
                            {selectedZone.recommendations.fertilizer.type}
                          </p>
                          <p className="text-sm text-gray-700 mb-3">
                            <span className="font-semibold">When:</span>{" "}
                            {selectedZone.recommendations.fertilizer.timing}
                          </p>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{
                                  width: `${selectedZone.recommendations.fertilizer.confidence}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-600">
                              {
                                selectedZone.recommendations.fertilizer
                                  .confidence
                              }
                              % confidence
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition">
                              <CheckCircle size={18} />
                              Approve
                            </button>
                            <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg transition">
                              Modify
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <CheckCircle
                            size={48}
                            className="mx-auto text-green-500 mb-2"
                          />
                          <p className="text-gray-600 font-semibold">
                            No fertilizer needed
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Nutrient levels are adequate
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    Recommendations generated:{" "}
                    {new Date(
                      selectedZone.recommendations.lastGenerated
                    ).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Brain size={48} className="mx-auto text-gray-400 mb-4" />
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">
                    No AI recommendations yet
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {selectedZone.soilMoisture.lastUpdated
                      ? "Click the button above to generate AI-powered recommendations"
                      : "Update soil data first, then generate recommendations"}
                  </p>
                  <button
                    onClick={() => {
                      if (selectedZone.soilMoisture.lastUpdated) {
                        generateAIRecommendation(selectedZone._id);
                      } else {
                        setShowSoilModal(true);
                      }
                    }}
                    disabled={generatingRecs}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto disabled:opacity-50"
                  >
                    {generatingRecs ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain size={20} />
                        {selectedZone.soilMoisture.lastUpdated
                          ? "Generate AI Recommendations"
                          : "Update Soil Data First"}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Soil Update Modal */}
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
    </div>
  );
};

// Soil Update Modal Component
const SoilUpdateModal = ({ fieldId, zone, onClose, onSuccess }) => {
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
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/fields/${fieldId}/zone/${zone._id}/soil`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update soil data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Update Soil Data
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <p className="text-gray-600 mb-4">
            Update readings for {zone.zoneName}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Soil Moisture (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.soilMoisture}
                onChange={(e) =>
                  setFormData({ ...formData, soilMoisture: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nitrogen (ppm)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.nitrogen}
                onChange={(e) =>
                  setFormData({ ...formData, nitrogen: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phosphorus (ppm)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.phosphorus}
                onChange={(e) =>
                  setFormData({ ...formData, phosphorus: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Potassium (ppm)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.potassium}
                onChange={(e) =>
                  setFormData({ ...formData, potassium: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Soil pH
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="14"
                value={formData.soilPH}
                onChange={(e) =>
                  setFormData({ ...formData, soilPH: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Data"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FieldDetails;
