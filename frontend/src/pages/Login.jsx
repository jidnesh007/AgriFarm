import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // For navigation
import { Sprout } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("manager");
  const [formData, setFormData] = useState({ phoneNumber: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // API Call using Axios
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: role,
      });

      // On Success: Save token & redirect
      localStorage.setItem("userInfo", JSON.stringify(res.data));

      // Navigate based on role (optional logic)
      if (role === "manager") {
        navigate("/manager-dashboard");
      } else {
        navigate("/farmer-dashboard");
      }
    } catch (err) {
      // Axios error handling
      setError(err.response?.data?.message || "Invalid phone or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-green-700 p-6 text-center">
          <h1 className="text-3xl font-bold text-white flex justify-center items-center gap-2">
            <Sprout size={32} /> SmartFarm AI
          </h1>
          <p className="text-green-100 mt-2 text-sm">Welcome Back</p>
        </div>

        <div className="p-8">
          {/* Role Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRole("manager")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                role === "manager"
                  ? "bg-white text-green-700 shadow"
                  : "text-gray-500"
              }`}
            >
              Farm Manager
            </button>
            <button
              type="button"
              onClick={() => setRole("farmer")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                role === "farmer"
                  ? "bg-white text-green-700 shadow"
                  : "text-gray-500"
              }`}
            >
              Field Worker
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="e.g. 9876543210"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-lg transition-colors"
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-green-700 font-semibold hover:underline"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
