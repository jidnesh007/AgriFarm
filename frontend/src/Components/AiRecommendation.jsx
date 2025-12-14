import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Brain,
  Droplets,
  Leaf,
  AlertCircle,
  Loader,
  ChevronRight,
  RefreshCw,
  TrendingUp,
  Cloud,
  Sprout,
  CheckCircle,
} from "lucide-react";

const AiRecommendations = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingForZone, setGeneratingForZone] = useState(null);

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/fields", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFields(response.data.fields);
    } catch (error) {
      console.error("Error fetching fields:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIRecommendation = async (fieldId, zoneId) => {
    setGeneratingForZone(zoneId);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/fields/${fieldId}/zone/${zoneId}/ai-recommendation`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchFields();
    } catch (error) {
      console.error("Error generating AI recommendation:", error);
      alert(
        error.response?.data?.message ||
          "Failed to generate AI recommendation. Make sure Python server is running on port 8000."
      );
    } finally {
      setGeneratingForZone(null);
    }
  };

  const getHealthColor = (health) => {
    if (health >= 75) return "text-green-600 bg-green-100 border-green-300";
    if (health >= 50) return "text-yellow-600 bg-yellow-100 border-yellow-300";
    return "text-red-600 bg-red-100 border-red-300";
  };

  const getHealthStatus = (health) => {
    if (health >= 75) return "Healthy";
    if (health >= 50) return "Moderate";
    return "Poor";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading AI recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                AI-Powered Recommendations
              </h1>
              <p className="text-gray-600">
                Deep Reinforcement Learning for optimal irrigation and
                fertilization
              </p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-md p-6 mb-6 text-white">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1">How it works</h3>
              <p className="text-sm text-purple-100">
                Our AI model analyzes soil moisture, NPK levels, pH, weather
                conditions, and crop growth stage to provide intelligent
                recommendations. The model is trained using Deep Reinforcement
                Learning to optimize crop health while minimizing resource
                waste.
              </p>
            </div>
          </div>
        </div>

        {/* Fields with Zones */}
        {fields.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Sprout size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No fields available
            </h3>
            <p className="text-gray-600 mb-6">
              Create a field first to get AI recommendations
            </p>
            <button
              onClick={() => navigate("/fields")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
            >
              Go to Fields
              <ChevronRight size={20} />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {fields.map((field) => (
              <div
                key={field._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Field Header */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {field.fieldName}
                      </h2>
                      <p className="text-green-100">
                        {field.cropType} • {field.fieldArea.value}{" "}
                        {field.fieldArea.unit}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/field/${field._id}`)}
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      View Details
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                {/* Zones Grid */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Zones & AI Recommendations
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {field.zones.map((zone) => (
                      <div
                        key={zone._id}
                        className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition"
                      >
                        {/* Zone Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-gray-800">
                              {zone.zoneName}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Moisture: {zone.soilMoisture.value}% • pH:{" "}
                              {zone.soilPH.value}
                            </p>
                          </div>
                          {zone.recommendations?.healthScore > 0 && (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getHealthColor(
                                zone.recommendations.healthScore
                              )}`}
                            >
                              {getHealthStatus(
                                zone.recommendations.healthScore
                              )}
                            </span>
                          )}
                        </div>

                        {/* Soil Data Summary */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="text-gray-600">N:</span>
                              <span className="font-semibold ml-1">
                                {zone.soilNutrients.nitrogen}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">P:</span>
                              <span className="font-semibold ml-1">
                                {zone.soilNutrients.phosphorus}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">K:</span>
                              <span className="font-semibold ml-1">
                                {zone.soilNutrients.potassium}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* AI Recommendations */}
                        {zone.recommendations &&
                        zone.recommendations.aiGenerated ? (
                          <div className="space-y-3">
                            {/* Irrigation Card */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Droplets
                                    size={18}
                                    className="text-blue-600"
                                  />
                                  <span className="font-semibold text-gray-800">
                                    Irrigation
                                  </span>
                                </div>
                                <span className="text-2xl font-bold text-blue-600">
                                  {zone.recommendations.irrigation.amount} mm
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                {zone.recommendations.irrigation.timing}
                              </p>
                            </div>

                            {/* Fertilizer Card */}
                            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Leaf size={18} className="text-green-600" />
                                  <span className="font-semibold text-gray-800">
                                    Fertilizer
                                  </span>
                                </div>
                                <span className="text-2xl font-bold text-green-600">
                                  {zone.recommendations.fertilizer.amount} kg
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                {zone.recommendations.fertilizer.type}
                              </p>
                            </div>

                            {/* Health Score */}
                            {zone.recommendations.healthScore > 0 && (
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-semibold text-gray-700">
                                    Health Score
                                  </span>
                                  <span className="text-xl font-bold text-gray-800">
                                    {zone.recommendations.healthScore.toFixed(
                                      1
                                    )}
                                    %
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="h-2 rounded-full transition-all duration-500"
                                    style={{
                                      width: `${zone.recommendations.healthScore}%`,
                                      backgroundColor:
                                        zone.recommendations.healthScore >= 75
                                          ? "#16a34a"
                                          : zone.recommendations.healthScore >=
                                            50
                                          ? "#eab308"
                                          : "#dc2626",
                                    }}
                                  ></div>
                                </div>
                              </div>
                            )}

                            {/* Weather Info */}
                            {zone.recommendations.weatherInfluence && (
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Cloud size={14} />
                                <span>
                                  {zone.recommendations.weatherInfluence}
                                </span>
                              </div>
                            )}

                            {/* Explanation */}
                            <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
                              <p className="text-xs text-gray-700">
                                {zone.recommendations.explanation}
                              </p>
                            </div>

                            {/* Timestamp & Regenerate */}
                            <div className="flex justify-between items-center pt-2">
                              <p className="text-xs text-gray-500">
                                Generated:{" "}
                                {new Date(
                                  zone.recommendations.lastGenerated
                                ).toLocaleString()}
                              </p>
                              <button
                                onClick={() =>
                                  generateAIRecommendation(field._id, zone._id)
                                }
                                disabled={generatingForZone === zone._id}
                                className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded flex items-center gap-1 disabled:opacity-50"
                              >
                                {generatingForZone === zone._id ? (
                                  <>
                                    <Loader
                                      size={12}
                                      className="animate-spin"
                                    />
                                    Updating...
                                  </>
                                ) : (
                                  <>
                                    <RefreshCw size={12} />
                                    Refresh
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Brain
                              size={32}
                              className="mx-auto text-gray-400 mb-2"
                            />
                            <p className="text-sm text-gray-600 mb-3">
                              {zone.soilMoisture.lastUpdated
                                ? "Generate AI recommendation"
                                : "Update soil data first"}
                            </p>
                            <button
                              onClick={() => {
                                if (!zone.soilMoisture.lastUpdated) {
                                  navigate(`/field/${field._id}`);
                                } else {
                                  generateAIRecommendation(field._id, zone._id);
                                }
                              }}
                              disabled={generatingForZone === zone._id}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 mx-auto disabled:opacity-50"
                            >
                              {generatingForZone === zone._id ? (
                                <>
                                  <Loader size={16} className="animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Brain size={16} />
                                  {zone.soilMoisture.lastUpdated
                                    ? "Generate AI Rec"
                                    : "Update Data"}
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiRecommendations;
