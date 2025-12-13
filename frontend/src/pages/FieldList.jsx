import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, MapPin, Sprout, TrendingUp } from "lucide-react";

const FieldList = () => {
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
      setFields(response.data.fields);
    } catch (error) {
      console.error("Error fetching fields:", error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (status) => {
    switch (status) {
      case "Good":
        return "text-green-600 bg-green-100";
      case "Fair":
        return "text-yellow-600 bg-yellow-100";
      case "Poor":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading fields...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Fields</h1>
              <p className="text-gray-600 mt-1">
                Manage your agricultural fields and monitor crop health
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition"
            >
              <Plus size={20} />
              Create New Field
            </button>
          </div>
        </div>

        {/* Fields Grid */}
        {fields.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Sprout size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No fields yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first field to start monitoring crop health
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create First Field
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field) => (
              <div
                key={field._id}
                onClick={() => navigate(`/field/${field._id}`)}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden"
              >
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
                  <h3 className="text-xl font-bold text-white">
                    {field.fieldName}
                  </h3>
                  <p className="text-green-100">{field.cropType}</p>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin size={18} className="text-green-600" />
                    <span className="text-sm">
                      {field.location.village ||
                        field.location.district ||
                        "Location not set"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <TrendingUp size={18} className="text-green-600" />
                    <span className="text-sm">
                      {field.fieldArea.value} {field.fieldArea.unit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {field.numberOfZones} Zones
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getHealthColor(
                        field.overallHealth.status
                      )}`}
                    >
                      {field.overallHealth.status}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Updated: {new Date(field.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Field Modal */}
      {showCreateModal && (
        <CreateFieldModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchFields();
          }}
        />
      )}
    </div>
  );
};

// Create Field Modal Component
const CreateFieldModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fieldName: "",
    cropType: "",
    fieldArea: "",
    village: "",
    district: "",
    latitude: "",
    longitude: "",
    numberOfZones: 3,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cropTypes = [
    "Wheat",
    "Rice",
    "Cotton",
    "Corn",
    "Sugarcane",
    "Soybean",
    "Potato",
    "Tomato",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/fields",
        {
          fieldName: formData.fieldName,
          cropType: formData.cropType,
          fieldArea: parseFloat(formData.fieldArea),
          location: {
            village: formData.village,
            district: formData.district,
            coordinates: {
              latitude: formData.latitude
                ? parseFloat(formData.latitude)
                : null,
              longitude: formData.longitude
                ? parseFloat(formData.longitude)
                : null,
            },
          },
          numberOfZones: parseInt(formData.numberOfZones),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create field");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Create New Field
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Field Name *
              </label>
              <input
                type="text"
                value={formData.fieldName}
                onChange={(e) =>
                  setFormData({ ...formData, fieldName: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="e.g., North Field, Plot 42"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crop Type *
              </label>
              <select
                value={formData.cropType}
                onChange={(e) =>
                  setFormData({ ...formData, cropType: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              >
                <option value="">Select crop type</option>
                {cropTypes.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Field Area (hectares) *
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.fieldArea}
                onChange={(e) =>
                  setFormData({ ...formData, fieldArea: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="e.g., 5.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Village
                </label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) =>
                    setFormData({ ...formData, village: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="Village name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="District name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude (optional)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="e.g., 28.6139"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude (optional)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="e.g., 77.2090"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Zones *
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.numberOfZones}
                onChange={(e) =>
                  setFormData({ ...formData, numberOfZones: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Zones will be automatically created (1-20)
              </p>
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
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Field"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FieldList;
