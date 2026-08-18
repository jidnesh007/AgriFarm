// src/config/api.js
// Central API configuration - uses environment variables in production
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const PYTHON_API_URL = import.meta.env.VITE_PYTHON_API_URL || "http://localhost:8000";

export { BACKEND_URL, PYTHON_API_URL };
