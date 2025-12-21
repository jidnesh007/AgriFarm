import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FieldList from "./pages/FieldList";
import FieldDetails from "./pages/FieldDetails";
import Weather from "./components/Weather";
import AiRecommendation from "./components/AiRecommendation";
import HeroSection from "./pages/Hero";
import AboutSection from "./components/About";
import SigroLanding from "./components/SigroLanding";
import ContactSection from "./components/Contact";
import Footer from "./components/Footer";
import DiseaseDetection from "./components/DiseaseDetection";
import Analytics from "./components/Analytics";

// Landing Page Component - combines all sections
const LandingPage = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ContactSection />
      <SigroLanding />
      <Footer />
    </>
  );
};
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/fields" element={<FieldList />} />
        <Route path="/field/:id" element={<FieldDetails />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/ai-recommendation" element={<AiRecommendation />} />
        <Route path="/disease-detection" element={<DiseaseDetection />} />
         <Route path="/analytics" element={< Analytics/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
