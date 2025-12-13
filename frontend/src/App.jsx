import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Import components
import LandingPage from "./pages/Landingpage"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import HeroSection from "./pages/Hero";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SigroLanding from "./pages/SigroLanding";
import Footer from "./pages/Footer";

// Simple placeholders for dashboards
const ManagerDashboard = () => (
  <h1 className="text-2xl p-10 text-white bg-gray-900 min-h-screen">Manager Dashboard</h1>
);
const FarmerDashboard = () => (
  <h1 className="text-2xl p-10 text-white bg-gray-900 min-h-screen">Farmer Dashboard</h1>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Home route with Hero and About sections */}
        <Route path="/" element={
          <>
            <HeroSection />
            <About />
            <Contact/>
            <SigroLanding/>
            <Footer/>
          </>
        } />  
      
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard routes */}
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;