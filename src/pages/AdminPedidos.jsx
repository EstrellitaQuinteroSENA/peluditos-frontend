import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [comprobanteModal, setComprobanteModal] = useState(null);

  // Formatea la ruta de las imágenes y comprobantes gestionados por el servidor backend.
  const formatearUrlImagen = (url) => {
    if (!url) return "/Imagenes/Perro.png";
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("data:") ||
      url.startsWith("blob:")
    ) {
      return url;
    }
    return `http://localhost:5000${url.startsWith("/") ? "" : "/"}${url}`;
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  // Obtiene el listado general de pedidos registrados desde la base de datos a través de la API REST.
  const cargarPedidos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/pedidos");
      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
      }
    } catch (error) {
      console.error("Error al cargar pedidos generales:", error);
    } finally {
      setCargando(false);
    }
  };

  // Actualiza el estado logístico de un pedido específico mediante una petición HTTP PUT al servidor.
  const handleCambiarEstado = async (id_pedido, nuevoEstado) => {
    try {
      const response = await fetch(`http://localhost:5000/api/pedidos/${id_pedido}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado_pedido: nuevoEstado })
      });

      if (response.ok) {
        alert(`Estado del pedido P-00${id_pedido} actualizado a: ${nuevoEstado}`);
        cargarPedidos();
      } else {
        alert("No se pudo actualizar el estado.");
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  return (
    <div className="admin-page">
      <Navbar tipo="admin" />

      <main style={{ padding: "30px 20px", maxWidth: "1100px", margin: "0 auto" }}>
        <h1 style={{ color: "#124e3f", textAlign: "center" }}>Gestión de Pedidos Generales 🐾</h1>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "25px" }}>
          Revisa las compras realizadas, verifica los comprobantes de pago y actualiza los estados de producción y entrega.
        </p>

        {cargando ? (
          <p style={{ textAlign: "center", color: "#888" }}>Cargando pedidos... 🐾</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.tabla}>
              <thead>
                <tr style={styles.encabezadoTabla}>
                  <th style={styles.th}># Pedido</th>
                  <th style={styles.th}>Cliente</th>
                  <th style={styles.th}>Dirección / Entrega</th>
                  <th style={styles.th}>Bandana</th>
                  <th style={styles.th}>Talla / Cant.</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Comprobante</th>
                  <th style={styles.th}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p.id_pedido} style={styles.filaTabla}>
                    <td style={styles.td}><strong>P-00{p.id_pedido}</strong></td>
                    <td style={styles.td}>
                      <div><strong>{p.cliente_nombre || "Cliente"}</strong></div>
                      <div style={{ fontSize: "0.8rem", color: "#666" }}>Tel: {p.telefono_contacto || "N/A"}</div>
                    </td>
                    <td style={styles.td}>
                      <div>{p.direccion_envio || "Recogida en tienda"}</div>
                      {p.ciudad && <div style={{ fontSize: "0.8rem", color: "#666" }}>{p.ciudad}</div>}
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <img
                          src={formatearUrlImagen(p.imagen)}
                          alt={p.nombre_producto}
                          style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px" }}
                          onError={(e) => { e.target.src = "/Imagenes/Perro.png"; }}
                        />
                        <span>{p.nombre_producto || "Bandana"}</span>
                      </div>
                    </td>
                    <td style={styles.td}>{p.talla || "M"} x {p.cantidad || 1}</td>
                    <td style={{ ...styles.td, color: "#124e3f", fontWeight: "bold" }}>
                      ${Number(p.total || p.precio_total || 0).toLocaleString("es-CO")}
                    </td>
                    <td style={styles.td}>
                      {p.comprobante_nequi ? (
                        <button
                          onClick={() => setComprobanteModal(formatearUrlImagen(p.comprobante_nequi))}
                          style={styles.btnVerRecibo}
                        >
                          👁️ Ver recibo
                        </button>
                      ) : (
                        <span style={{ color: "#aaa", fontSize: "0.85rem" }}>Sin recibo</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <select
                        value={p.estado_pedido || "Pendiente de verificación"}
                        onChange={(e) => handleCambiarEstado(p.id_pedido, e.target.value)}
                        style={styles.selectEstado}
                      >
                        <option value="Pendiente de verificación">Pendiente de verificación</option>
                        <option value="En fabricación">En fabricación</option>
                        <option value="En envío">En envío</option>
                        <option value="Entregado">Entregado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {comprobanteModal && (
        <div style={styles.overlay} onClick={() => setComprobanteModal(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setComprobanteModal(null)}>✕</button>
            <h3 style={{ color: "#124e3f", marginTop: 0 }}>Comprobante de Pago Nequi</h3>
            <img
              src={comprobanteModal}
              alt="Comprobante de pago"
              style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: "8px" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  tabla: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  encabezadoTabla: { backgroundColor: "#124e3f", color: "#fff" },
  th: { padding: "12px 10px", textAlign: "left", fontSize: "0.9rem" },
  td: { padding: "12px 10px", borderBottom: "1px solid #eee", fontSize: "0.88rem", verticalAlign: "middle" },
  btnVerRecibo: { backgroundColor: "#d39e24", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.82rem", fontWeight: "bold" },
  selectEstado: { padding: "6px 8px", borderRadius: "6px", border: "1px solid #124e3f", fontWeight: "bold", color: "#124e3f", backgroundColor: "#f4f8f6", cursor: "pointer" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000 },
  modalContent: { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", maxWidth: "500px", width: "90%", textAlign: "center", position: "relative" },
  closeBtn: { position: "absolute", top: "10px", right: "15px", border: "none", background: "none", fontSize: "1.2rem", cursor: "pointer" }
};

export default AdminPedidos;