import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import Designer from "./pages/Designer";
import AdminPanel from "./pages/AdminPanel";
import "./App.css";

function App() {
  return (
    <Router>
      {/* La barra de navegación se remueve de este nivel para permitir que cada componente de página implemente su propia versión especializada */}

      <Routes>
        {/* Configuración de las rutas principales de la aplicación web */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/designer" element={<Designer />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>

      {/* Componente de pie de página global permanente en todas las vistas */}
      <Footer />
    </Router>
  );
}

export default App;
