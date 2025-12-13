import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FieldList from "./pages/FieldList";
import FieldDetails from "./pages/FieldDetails";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
