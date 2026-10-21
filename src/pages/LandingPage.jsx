import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProductoModal from "../components/ProductoModal";
import { API_URL } from "../config/api";

function LandingPage() {
  const [bandanas, setBandanas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [forzarAbrirLogin, setForzarAbrirLogin] = useState(false);

  const usuarioAutenticado = Boolean(localStorage.getItem("token"));

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

  // Consume la API REST del backend al cargar el componente para poblar el catálogo de productos.
  useEffect(() => {
    fetch(`${API_URL}/productos`)
      .then((res) => res.json())
      .then((data) => {
        const productosConImagen = data.map((item) => ({
          ...item,
          imagen_url: formatearUrlImagen(item.imagen_url),
        }));
        setBandanas(productosConImagen);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al cargar el catálogo público:", error);
        setCargando(false);
      });
  }, []);

  // Cierra el modal de detalle del producto y activa el estado para abrir el inicio de sesión desde el componente Navbar.
  const abrirLoginModal = () => {
    setProductoSeleccionado(null);
    setForzarAbrirLogin(true);
  };

  return (
    <div>
      <Navbar
        abrirLoginExterno={forzarAbrirLogin}
        onLoginAbierto={() => setForzarAbrirLogin(false)}
      />

      <section className="hero">
        <img src="/Imagenes/Perro.png" className="hero-img left" alt="Perro" />

        <div className="hero-text">
          <h1>
            Collares, bandanas y accesorios personalizados para tu mascota.
          </h1>
          <p>
            "Diseños exclusivos hechos a mano con amor para consentir a tu
            peludito."
          </p>
          <a href="#catalogo" className="btn btn-hero">
            Ver Últimos Diseños
          </a>
        </div>

        <img src="/Imagenes/Gato.png" className="hero-img right" alt="Gato" />
      </section>

      <section className="catalogo" id="catalogo">
        <h2>Nuestras bandanas</h2>

        {cargando ? (
          <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
            Cargando catálogo... 🐾
          </p>
        ) : bandanas.length === 0 ? (
          <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
            No hay bandanas disponibles en este momento.
          </p>
        ) : (
          <div className="grid-collares">
            {bandanas.map((item) => (
              <div
                className="card"
                key={item.id_producto}
                onClick={() => setProductoSeleccionado(item)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={item.imagen_url}
                  alt={item.nombre}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/Imagenes/Perro.png";
                  }}
                />
                <p style={{ fontWeight: "bold", marginTop: "10px" }}>
                  {item.nombre}
                </p>
                <p style={{ color: "#2d6a4f", fontWeight: "600" }}>
                  ${Number(item.precio).toLocaleString("es-CO")}
                </p>
              </div>
            ))}
          </div>
        )}

        <a href="#" className="btn btn-catalogo">
          Ver más
        </a>
      </section>

      {productoSeleccionado && (
        <ProductoModal
          producto={productoSeleccionado}
          onClose={() => setProductoSeleccionado(null)}
          usuarioAutenticado={usuarioAutenticado}
          abrirLogin={abrirLoginModal}
        />
      )}
    </div>
  );
}

export default LandingPage;
