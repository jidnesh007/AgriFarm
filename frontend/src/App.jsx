import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FieldList from "./pages/FieldList";
import FieldDetails from "./pages/FieldDetails";
import Weather from "./Components/Weather";
import AiRecommendation from "./Components/AiRecommendation";
import HeroSection from "./pages/Hero";
import AboutSection from "./Components/About";
import SigroLanding from "./Components/SigroLanding";
import ContactSection from "./Components/Contact";
import Footer from "./Components/Footer";
import DiseaseDetection from "./Components/DiseaseDetection";
import Analytics from "./Components/Analytics";

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
