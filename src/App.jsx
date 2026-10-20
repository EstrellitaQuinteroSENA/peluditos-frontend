import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import AdminPanel from "./pages/AdminPanel";
import AdminPedidos from "./pages/AdminPedidos";
import MisPedidos from "./pages/MisPedidos";
import "./App.css";

function App() {
  return (
    <Router>
      {/* Configura el enrutador principal de la aplicación web */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/mis-pedidos" element={<MisPedidos />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/pedidos" element={<AdminPedidos />} />
      </Routes>

      {/* Renderiza el componente de pie de página de forma global en todas las vistas */}
      <Footer />
    </Router>
  );
}

export default App;
