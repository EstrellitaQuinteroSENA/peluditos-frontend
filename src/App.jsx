import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import AdminPanel from "./pages/AdminPanel";
import MisPedidos from "./pages/MisPedidos"; // Nueva vista de pedidos para el cliente
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Configuración de las rutas principales de la aplicación web */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/mis-pedidos" element={<MisPedidos />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>

      {/* Componente de pie de página global permanente en todas las vistas */}
      <Footer />
    </Router>
  );
}

export default App;
