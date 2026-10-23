import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { API_URL } from "../config/api";

function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [compraPendiente, setCompraPendiente] = useState(null);
  const [comprobante, setComprobante] = useState(null);

  // Formatea la URL de las imágenes obtenidas desde el servidor backend.
  const BASE_URL = API_URL.replace("/api", "");

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
    return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  // Carga los pedidos del usuario autenticado e inspecciona si existe alguna intención de compra pendiente en el almacenamiento local.
  useEffect(() => {
    fetchMisPedidos();

    const datosGuardados = localStorage.getItem("compraPendiente");
    if (datosGuardados) {
      try {
        setCompraPendiente(JSON.parse(datosGuardados));
      } catch (err) {
        console.error("Error leyendo compra pendiente:", err);
      }
      localStorage.removeItem("compraPendiente");
    }
  }, []);

  // Realiza una petición HTTP GET para obtener el listado de pedidos asociados al usuario actual.
  const fetchMisPedidos = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCargando(false);
        return;
      }

      const res = await fetch(`${API_URL}/pedidos/mis-pedidos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setPedidos(data);
      } else {
        console.error("Error al obtener los pedidos. Status:", res.status);
      }
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    } finally {
      setCargando(false);
    }
  };

  // Valida el comprobante de pago y envía la orden pendiente hacia el backend mediante un objeto FormData.
  const confirmarYGuardarPedido = async () => {
    if (!comprobante) {
      alert("Por favor adjunta el comprobante para continuar.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append(
        "id_producto",
        compraPendiente.producto.id_producto || compraPendiente.producto.id,
      );
      formData.append("talla", compraPendiente.talla);
      formData.append("cantidad", compraPendiente.cantidad);
      formData.append("total", compraPendiente.total);
      formData.append("comprobante", comprobante);

      const res = await fetch(`${API_URL}/pedidos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        alert(
          "¡Pedido registrado exitosamente! Ha quedado en la tabla con estado Pendiente.",
        );
        setCompraPendiente(null);
        setComprobante(null);
        fetchMisPedidos();
      } else {
        const err = await res.json();
        alert(err.message || "Error al guardar el pedido.");
      }
    } catch (error) {
      console.error("Error enviando el pedido:", error);
      alert("Error de conexión al guardar el pedido.");
    }
  };

  return (
    <div>
      <Navbar />

      <div
        style={{
          padding: "40px 20px",
          maxWidth: "950px",
          margin: "0 auto",
          minHeight: "65vh",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#124e3f" }}>
          Mis Pedidos 🐾
        </h1>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>
          Aquí podrás ver el historial y estado de tus compras.
        </p>

        {cargando ? (
          <p style={{ textAlign: "center", color: "#888" }}>
            Cargando tus pedidos... 🐾
          </p>
        ) : pedidos.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              background: "#f9f9f9",
              borderRadius: "10px",
            }}
          >
            <p style={{ color: "#666", fontSize: "1.1rem" }}>
              Aún no has realizado ningún pedido.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.tabla}>
              <thead>
                <tr style={styles.encabezadoTabla}>
                  <th style={styles.th}># Pedido</th>
                  <th style={styles.th}>Imagen</th>
                  <th style={styles.th}>Producto</th>
                  <th style={styles.th}>Talla</th>
                  <th style={styles.th}>Cantidad</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p, index) => {
                  const imagenMostrar =
                    p.imagen_url || p.imagen || p.imagen_producto;
                  const nombreMostrar =
                    p.nombre_producto || p.nombre || p.producto || "Bandana";
                  const estadoMostrar =
                    p.estado_pedido || p.estado || "Pendiente de verificación";
                  const totalMostrar =
                    p.total || p.precio_total || p.precio || 0;

                  return (
                    <tr key={p.id_pedido || index} style={styles.filaTabla}>
                      <td style={styles.td}>P-00{p.id_pedido}</td>
                      <td style={styles.td}>
                        <img
                          src={formatearUrlImagen(imagenMostrar)}
                          alt={nombreMostrar}
                          style={{
                            width: "45px",
                            height: "45px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            border: "1px solid #ddd",
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/Imagenes/Perro.png";
                          }}
                        />
                      </td>
                      <td style={styles.td}>{nombreMostrar}</td>
                      <td style={styles.td}>
                        <strong>{p.talla || "M"}</strong>
                      </td>
                      <td style={styles.td}>{p.cantidad || 1}</td>
                      <td
                        style={{
                          ...styles.td,
                          color: "#124e3f",
                          fontWeight: "bold",
                        }}
                      >
                        ${Number(totalMostrar).toLocaleString("es-CO")}
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "0.85rem",
                            fontWeight: "bold",
                            backgroundColor:
                              estadoMostrar === "Verificado"
                                ? "#d4edda"
                                : "#fff3cd",
                            color:
                              estadoMostrar === "Verificado"
                                ? "#155724"
                                : "#856404",
                          }}
                        >
                          {estadoMostrar}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {compraPendiente && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button
              style={styles.closeBtn}
              onClick={() => setCompraPendiente(null)}
            >
              ✕
            </button>

            <div style={{ textAlign: "center" }}>
              <img
                src="/Imagenes/logo verde nombre.png"
                alt="Logo"
                style={{ height: "35px", marginBottom: "5px" }}
              />
              <h2 style={{ color: "#124e3f", margin: "5px 0" }}>
                Pagar tu pedido
              </h2>

              <div style={styles.resumenBox}>
                <p
                  style={{
                    margin: "2px 0",
                    fontWeight: "bold",
                    color: "#124e3f",
                  }}
                >
                  Producto:{" "}
                  <span style={{ color: "#333", fontWeight: "normal" }}>
                    {compraPendiente.producto?.nombre}
                  </span>
                </p>
                <p
                  style={{
                    margin: "2px 0",
                    fontWeight: "bold",
                    color: "#124e3f",
                  }}
                >
                  Talla:{" "}
                  <span style={{ color: "#333", fontWeight: "normal" }}>
                    {compraPendiente.talla}
                  </span>{" "}
                  | Cantidad:{" "}
                  <span style={{ color: "#333", fontWeight: "normal" }}>
                    {compraPendiente.cantidad}
                  </span>
                </p>
              </div>

              <p
                style={{
                  color: "#555",
                  fontSize: "0.88rem",
                  lineHeight: "1.3",
                  margin: "10px 0",
                }}
              >
                Realiza el pago de tu accesorio a través de Nequi y adjunta el
                comprobante para continuar el proceso. Luego podrás ver el
                estado de tu pedido en <strong>'Mis pedidos'</strong>.
              </p>

              <div style={styles.nequiCard}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <div style={styles.nequiLogoBox}>NEQUI</div>
                  <div style={{ textAlign: "left" }}>
                    <p
                      style={{
                        margin: 0,
                        color: "#124e3f",
                        fontWeight: "bold",
                      }}
                    >
                      Celular: 321 913 6057
                    </p>
                    <p
                      style={{
                        margin: 0,
                        color: "#124e3f",
                        fontWeight: "bold",
                      }}
                    >
                      Estrellita Quintero
                    </p>
                    <p
                      style={{
                        margin: "3px 0 0 0",
                        color: "#333",
                        fontWeight: "bold",
                      }}
                    >
                      Valor total:{" "}
                      <span style={{ color: "#2d6a4f" }}>
                        ${Number(compraPendiente.total).toLocaleString("es-CO")}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "left", margin: "12px 0" }}>
                <label
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  Adjuntar comprobante de pago:
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setComprobante(e.target.files[0])}
                  style={{
                    width: "100%",
                    padding: "6px",
                    marginTop: "4px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                style={styles.btnConfirmar}
                onClick={confirmarYGuardarPedido}
              >
                Confirmar y enviar pago
              </button>

              <p
                style={{
                  fontSize: "0.72rem",
                  color: "#666",
                  margin: "10px 0",
                  fontStyle: "italic",
                }}
              >
                "Toda la información es cifrada y segura. Tu pedido iniciará
                fabricación después de verificar el pago."
              </p>

              <button
                style={styles.btnCancelar}
                onClick={() => setCompraPendiente(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "25px",
    maxWidth: "500px",
    width: "90%",
    position: "relative",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
  },
  closeBtn: {
    position: "absolute",
    top: "15px",
    right: "15px",
    border: "none",
    background: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
    color: "#333",
  },
  tabla: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    background: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  encabezadoTabla: { backgroundColor: "#124e3f", color: "#fff" },
  th: { padding: "12px 15px", textAlign: "left", fontSize: "0.95rem" },
  td: {
    padding: "12px 15px",
    borderBottom: "1px solid #eee",
    fontSize: "0.9rem",
    color: "#444",
    verticalAlign: "middle",
  },
  filaTabla: { textAlign: "left" },
  resumenBox: {
    background: "#f4f8f6",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #d0e1d4",
    textAlign: "left",
  },
  nequiCard: {
    background: "#fdfdfd",
    padding: "12px",
    borderRadius: "10px",
    margin: "8px 0",
    border: "1px solid #e0e0e0",
  },
  nequiLogoBox: {
    backgroundColor: "#da0080",
    color: "#fff",
    fontWeight: "bold",
    padding: "8px 10px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    letterSpacing: "1px",
  },
  btnConfirmar: {
    backgroundColor: "#d39e24",
    color: "#fff",
    border: "none",
    padding: "11px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%",
    fontSize: "0.95rem",
  },
  btnCancelar: {
    backgroundColor: "transparent",
    color: "#124e3f",
    border: "1px solid #124e3f",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%",
    fontSize: "0.88rem",
  },
};

export default MisPedidos;
