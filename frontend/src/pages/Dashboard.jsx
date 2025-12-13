import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Target,
  Sprout,
  Settings,
  LogOut,
  Bell,
  User,
  TrendingUp,
  Droplets,
  Leaf,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [selectedField, setSelectedField] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      if (response.data.fields.length > 0) {
        setSelectedField(response.data.fields[0]);
      }
    } catch (error) {
      console.error("Error fetching fields:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleFieldClick = (field) => {
    // Navigate to the specific field details page
    navigate(`/field/${field._id}`);
  };

  const handleFieldsNavigation = () => {
    // Navigate to fields list page
    navigate("/fields");
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-500" />
            <span className="text-xl font-bold">AgriSync</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-3 px-4 py-3 mb-2 bg-green-500 text-white rounded-lg"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 mb-2 text-gray-400 hover:bg-gray-800 rounded-lg">
            <Target className="w-5 h-5" />
            <span>AI Recommendations</span>
          </button>

          <button
            onClick={handleFieldsNavigation}
            className="w-full flex items-center gap-3 px-4 py-3 mb-2 text-gray-400 hover:bg-gray-800 rounded-lg"
          >
            <Sprout className="w-5 h-5" />
            <span>Fields</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 mb-2 text-gray-400 hover:bg-gray-800 rounded-lg">
            <BarChart3 className="w-5 h-5" />
            <span>Analytics</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-[#0a0a0a] border-b border-gray-800 flex items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-400">
              Real-time farm monitoring & AI optimization
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-800 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-lg">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-lg">
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl">
            {/* AgriSync Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Leaf className="w-8 h-8 text-green-500" />
                <div>
                  <h2 className="text-2xl font-bold">AgriSync</h2>
                  <p className="text-sm text-gray-400">
                    Real-time farm monitoring & optimization
                  </p>
                </div>
              </div>
              <button
                onClick={fetchFields}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
              >
                Refresh Data
              </button>
            </div>

            {/* Field Selector */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-2 block">
                SELECT FIELD
              </label>
              {loading ? (
                <div className="text-gray-400">Loading fields...</div>
              ) : fields.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {fields.map((field) => (
                    <button
                      key={field._id}
                      onClick={() => handleFieldClick(field)}
                      className={`px-6 py-2 rounded-lg transition ${
                        selectedField?._id === field._id
                          ? "bg-green-500 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {field.fieldName}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400">
                  No fields found.
                  <button
                    onClick={handleFieldsNavigation}
                    className="ml-2 text-green-500 hover:text-green-400"
                  >
                    Create your first field
                  </button>
                </div>
              )}
            </div>

            {/* Info Banner */}
            <div className="mb-6 p-4 bg-gray-900 border border-gray-800 rounded-lg flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-300">
                {selectedField
                  ? `${selectedField.fieldName} monitoring active. Click field name to view detailed analytics and recommendations.`
                  : "South field irrigation efficiency improved to 94% after DRL optimization. Next recommendation in 6 hours."}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Soil Moisture Card */}
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 hover:border-green-500 transition cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <Droplets className="w-8 h-8 text-green-500" />
                  <span className="text-green-500 text-sm font-medium">
                    +6%
                  </span>
                </div>
                <h3 className="text-gray-400 text-sm mb-2">Soil Moisture</h3>
                <p className="text-4xl font-bold mb-1">68%</p>
                <p className="text-xs text-gray-500">Status: Optimal</p>
              </div>

              {/* Soil NPK Card */}
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 hover:border-orange-500 transition cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <Leaf className="w-8 h-8 text-orange-500" />
                  <span className="text-orange-500 text-sm font-medium">
                    Balanced
                  </span>
                </div>
                <h3 className="text-gray-400 text-sm mb-2">Soil NPK</h3>
                <p className="text-4xl font-bold mb-1">7.2</p>
                <p className="text-xs text-gray-500">N:P:K ratio</p>
              </div>

              {/* Field Health Card */}
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 hover:border-green-500 transition cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                  <span className="text-green-500 text-sm font-medium">
                    +3%
                  </span>
                </div>
                <h3 className="text-gray-400 text-sm mb-2">Field Health</h3>
                <p className="text-4xl font-bold mb-1">
                  {selectedField?.overallHealth?.score || 89}%
                </p>
                <p className="text-xs text-gray-500">NDVI Score</p>
              </div>

              {/* Optimization Card */}
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 hover:border-green-500 transition cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <Target className="w-8 h-8 text-green-500" />
                  <span className="text-green-500 text-sm font-medium">
                    DRL Active
                  </span>
                </div>
                <h3 className="text-gray-400 text-sm mb-2">Optimization</h3>
                <p className="text-4xl font-bold mb-1">94%</p>
                <p className="text-xs text-gray-500">Efficiency</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
