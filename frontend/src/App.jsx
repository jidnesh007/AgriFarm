import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FieldList from "./pages/FieldList";
import FieldDetails from "./pages/FieldDetails";
import Weather from "./pages/Weather";
import AiRecommendation from "./components/AiRecommendation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/fields" element={<FieldList />} />
        <Route path="/field/:id" element={<FieldDetails />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/ai-recommendation" element={<AiRecommendation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
