import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Simple placeholders for dashboards
const ManagerDashboard = () => (
  <h1 className="text-2xl p-10">Manager Dashboard</h1>
);
const FarmerDashboard = () => (
  <h1 className="text-2xl p-10">Farmer Dashboard</h1>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
