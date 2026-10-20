import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductoModal = ({
  producto,
  onClose,
  usuarioAutenticado,
  abrirLogin,
}) => {
  const navigate = useNavigate();
  const [talla, setTalla] = useState("M");
  const [cantidad, setCantidad] = useState(1);
  const [mostrarPagoNequi, setMostrarPagoNequi] = useState(false);
  const [comprobante, setComprobante] = useState(null);

  const [tipoEnvio, setTipoEnvio] = useState("domicilio");
  const [telefonoContacto, setTelefonoContacto] = useState("");
  const [cedula, setCedula] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [direccionEnvio, setDireccionEnvio] = useState("");

  if (!producto) return null;

  const subtotal = (Number(producto.precio) || 0) * cantidad;
  const costoEnvio = tipoEnvio === "domicilio" ? 10000 : 0;
  const totalConEnvio = subtotal + costoEnvio;

  // Evalúa la autenticación del usuario antes de permitir la compra; si no está autenticado, almacena la intención de compra temporalmente.
  const manejarClicComprar = () => {
    if (!usuarioAutenticado) {
      const compraPendiente = {
        producto,
        talla,
        cantidad,
        subtotal,
        costoEnvio,
        total: totalConEnvio,
        tipoEnvio,
      };
      localStorage.setItem("compraPendiente", JSON.stringify(compraPendiente));
      abrirLogin();
      return;
    }
    setMostrarPagoNequi(true);
  };

  // Valida los datos del formulario y envía la información del pedido junto con el comprobante al servidor backend mediante una petición HTTP POST.
  const confirmarPedidoConNequi = async () => {
    if (!telefonoContacto.trim()) {
      alert("Por favor ingresa un número de teléfono de contacto.");
      return;
    }

    if (tipoEnvio === "domicilio") {
      if (!cedula.trim() || !ciudad.trim() || !direccionEnvio.trim()) {
        alert(
          "Para envío a domicilio debes completar Cédula, Ciudad y Dirección.",
        );
        return;
      }
    }

    if (!comprobante) {
      alert("Por favor adjunta el comprobante de pago en Nequi.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const usuarioGuardado = JSON.parse(localStorage.getItem("usuario")) || {};
      const idUsuarioActivo =
        usuarioGuardado.id_usuario || usuarioGuardado.id || 5;

      const formData = new FormData();

      formData.append("id_usuario", idUsuarioActivo);
      formData.append("id_producto", producto.id_producto || producto.codigo);
      formData.append("talla_seleccionada", talla);
      formData.append("talla", talla);
      formData.append("cantidad", cantidad);
      formData.append("precio_total", totalConEnvio);
      formData.append("total", totalConEnvio);

      formData.append("telefono_contacto", telefonoContacto.trim());
      formData.append("telefono_cliente", telefonoContacto.trim());

      formData.append(
        "tipo_entrega",
        tipoEnvio === "domicilio" ? "Envio" : "Recoger",
      );

      if (tipoEnvio === "domicilio") {
        formData.append("cedula_cliente", cedula.trim());
        formData.append("ciudad", ciudad.trim());
        formData.append("direccion_envio", direccionEnvio.trim());
        formData.append("direccion_entrega", direccionEnvio.trim());
      } else {
        formData.append("direccion_envio", "Recogida en tienda");
        formData.append("direccion_entrega", "Recogida en tienda");
      }

      formData.append("comprobante", comprobante);
      formData.append("comprobante_nequi", comprobante);

      const res = await fetch(`${API_URL}/pedidos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("¡Pedido registrado con éxito! Redirigiendo a tus pedidos...");
        onClose();
        navigate("/mis-pedidos");
      } else {
        alert(data.message || "Error al registrar el pedido.");
      }
    } catch (error) {
      console.error("Error al registrar el pedido:", error);
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        {!mostrarPagoNequi ? (
          <div style={styles.container}>
            <div style={styles.imageCol}>
              <img
                src={producto.imagen_url || "/Imagenes/Perro.png"}
                alt={producto.nombre}
                style={styles.img}
              />
            </div>

            <div style={styles.infoCol}>
              <h2 style={{ color: "#124e3f", margin: 0 }}>{producto.nombre}</h2>
              <p style={styles.precio}>
                ${Number(producto.precio).toLocaleString("es-CO")}
              </p>
              <p style={styles.descripcion}>
                {producto.descripcion ||
                  "Bandana exclusiva hecha a mano con amor para tu mascota."}
              </p>

              <div style={styles.fieldGroup}>
                <label>
                  <strong>Selecciona la Talla:</strong>
                </label>
                <div style={styles.tallasContainer}>
                  {["XS", "S", "M", "L", "XL"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTalla(t)}
                      style={{
                        ...styles.tallaBtn,
                        backgroundColor: talla === t ? "#124e3f" : "#f0f0f0",
                        color: talla === t ? "#fff" : "#333",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <label>
                  <strong>Cantidad:</strong>
                </label>
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) =>
                    setCantidad(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  style={styles.inputCantidad}
                />
              </div>

              <div style={styles.totalBox}>
                <span>
                  Subtotal:{" "}
                  <strong style={{ color: "#124e3f" }}>
                    ${subtotal.toLocaleString("es-CO")}
                  </strong>
                </span>
              </div>

              <button style={styles.btnComprar} onClick={manejarClicComprar}>
                {usuarioAutenticado
                  ? "Comprar y Pagar con Nequi 📱"
                  : "Iniciar sesión para comprar 🔑"}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <img
              src="/Imagenes/logo verde nombre.png"
              alt="Logo"
              style={{ height: "30px", marginBottom: "3px" }}
            />
            <h2 style={{ color: "#124e3f", margin: "2px 0" }}>
              Pagar tu pedido
            </h2>

            <div style={styles.opcionesEnvioBox}>
              <label
                style={{
                  fontWeight: "bold",
                  fontSize: "0.88rem",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Método de Entrega:
              </label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "15px",
                }}
              >
                <label style={{ fontSize: "0.85rem", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="tipoEnvio"
                    value="domicilio"
                    checked={tipoEnvio === "domicilio"}
                    onChange={() => setTipoEnvio("domicilio")}
                  />
                  Envío a domicilio (+$10.000)
                </label>
                <label style={{ fontSize: "0.85rem", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="tipoEnvio"
                    value="recoger"
                    checked={tipoEnvio === "recoger"}
                    onChange={() => setTipoEnvio("recoger")}
                  />
                  Recoger en punto ($0)
                </label>
              </div>
            </div>

            <div style={{ textAlign: "left", margin: "8px 0" }}>
              <label style={styles.labelForm}>
                Teléfono de contacto / WhatsApp: *
              </label>
              <input
                type="text"
                placeholder="Ej: 300 123 4567"
                value={telefonoContacto}
                onChange={(e) => setTelefonoContacto(e.target.value)}
                style={styles.inputForm}
              />

              {tipoEnvio === "domicilio" && (
                <>
                  <label style={styles.labelForm}>
                    Cédula del destinatario: *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 1098765432"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    style={styles.inputForm}
                  />

                  <label style={styles.labelForm}>Ciudad: *</label>
                  <input
                    type="text"
                    placeholder="Ej: Bogotá"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    style={styles.inputForm}
                  />

                  <label style={styles.labelForm}>Dirección de Envío: *</label>
                  <input
                    type="text"
                    placeholder="Ej: Calle 123 # 45 - 67, Apto 201"
                    value={direccionEnvio}
                    onChange={(e) => setDireccionEnvio(e.target.value)}
                    style={styles.inputForm}
                  />
                </>
              )}
            </div>

            <div style={styles.nequiCard}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                }}
              >
                <div style={styles.nequiLogoBox}>NEQUI</div>
                <div style={{ textAlign: "left" }}>
                  <p
                    style={{
                      margin: 0,
                      color: "#124e3f",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                    }}
                  >
                    Celular: 321 913 6057
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: "#124e3f",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                    }}
                  >
                    Estrellita Quintero
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0 0",
                      color: "#333",
                      fontWeight: "bold",
                      fontSize: "0.95rem",
                    }}
                  >
                    Valor total a pagar:{" "}
                    <span style={{ color: "#da0080" }}>
                      ${totalConEnvio.toLocaleString("es-CO")}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div style={{ textAlign: "left", margin: "8px 0" }}>
              <label style={styles.labelForm}>
                Adjuntar comprobante (PDF o imagen): *
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setComprobante(e.target.files[0])}
                style={styles.inputForm}
              />
            </div>

            <button
              style={styles.btnConfirmar}
              onClick={confirmarPedidoConNequi}
            >
              Confirmar y enviar pago
            </button>

            <p
              style={{
                fontSize: "0.7rem",
                color: "#666",
                margin: "8px 0",
                fontStyle: "italic",
              }}
            >
              "Toda la información es cifrada y segura. Tu pedido iniciará
              fabricación después de verificar el pago."
            </p>

            <button
              style={styles.btnCancelar}
              onClick={() => setMostrarPagoNequi(false)}
            >
              Volver al detalle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

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
    padding: "20px 25px",
    maxWidth: "480px",
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
  container: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    textAlign: "left",
  },
  imageCol: { flex: "1 1 180px", display: "flex", justifyContent: "center" },
  img: {
    width: "100%",
    maxHeight: "220px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  infoCol: {
    flex: "1 1 220px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  precio: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#2d6a4f",
    margin: 0,
  },
  descripcion: { fontSize: "0.85rem", color: "#555" },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    textAlign: "left",
    margin: "6px 0",
  },
  tallasContainer: { display: "flex", gap: "6px", marginTop: "3px" },
  tallaBtn: {
    padding: "5px 10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.9rem",
  },
  inputCantidad: {
    width: "60px",
    padding: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  totalBox: { fontSize: "1.05rem", margin: "5px 0" },
  btnComprar: {
    backgroundColor: "#d39e24",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.95rem",
  },
  opcionesEnvioBox: {
    background: "#f4f8f6",
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #d0e1d4",
    margin: "8px 0",
  },
  labelForm: {
    fontSize: "0.8rem",
    fontWeight: "bold",
    color: "#333",
    display: "block",
    marginTop: "4px",
  },
  inputForm: {
    width: "100%",
    padding: "6px 8px",
    marginTop: "2px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    fontSize: "0.85rem",
  },
  nequiCard: {
    background: "#fdfdfd",
    padding: "10px",
    borderRadius: "8px",
    margin: "8px 0",
    border: "1px solid #e0e0e0",
  },
  nequiLogoBox: {
    backgroundColor: "#da0080",
    color: "#fff",
    fontWeight: "bold",
    padding: "6px 8px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    letterSpacing: "1px",
  },
  btnConfirmar: {
    backgroundColor: "#d39e24",
    color: "#fff",
    border: "1px solid #d0e1d4",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%",
    fontSize: "0.95rem",
    marginTop: "4px",
  },
  btnCancelar: {
    backgroundColor: "transparent",
    color: "#124e3f",
    border: "1px solid #124e3f",
    padding: "6px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%",
    fontSize: "0.85rem",
  },
};

export default ProductoModal;
