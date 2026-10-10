import React from "react";
import Navbar from "../components/Navbar";

function MisPedidos() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "100px 20px", textAlign: "center", minHeight: "60vh" }}>
        <h1>Mis Pedidos 🐾</h1>
        <p>Aquí podrás ver el historial y estado de tus compras.</p>
      </div>
    </div>
  );
}

export default MisPedidos;