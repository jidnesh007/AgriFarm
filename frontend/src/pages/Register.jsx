import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, UserPlus } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("manager");
  const [formData, setFormData] = useState({ phoneNumber: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // API Call using Axios
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: role,
      });

      if (res.data) {
        alert("Registration Successful! Please Login.");
        navigate("/"); // Redirect to Login
      }
    } catch (err) {
      // Handle Axios Errors
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-green-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white flex justify-center items-center gap-2">
            <UserPlus size={28} /> Join SmartFarm AI
          </h1>
          <p className="text-green-100 text-sm mt-1">Create your account</p>
        </div>

        <div className="p-8">
          {/* Role Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => setRole("manager")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                role === "manager"
                  ? "bg-white text-green-700 shadow"
                  : "text-gray-500"
              }`}
            >
              Manager
            </button>
            <button
              onClick={() => setRole("farmer")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                role === "farmer"
                  ? "bg-white text-green-700 shadow"
                  : "text-gray-500"
              }`}
            >
              Farmer
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="e.g. 9876543210"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Create Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Min 6 characters"
                onChange={handleChange}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-green-700 font-semibold hover:underline"
            >
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
