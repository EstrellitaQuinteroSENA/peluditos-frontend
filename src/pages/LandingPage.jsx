import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProductoModal from "../components/ProductoModal";

function LandingPage() {
  const [bandanas, setBandanas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estado para la bandana seleccionada
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Estado para ordenar al Navbar que abra el modal de inicio de sesión
  const [forzarAbrirLogin, setForzarAbrirLogin] = useState(false);

  // Verificar si hay un token de usuario autenticado
  const usuarioAutenticado = Boolean(localStorage.getItem("token"));

  // Consumir la API de productos al cargar la página
  useEffect(() => {
    fetch("http://localhost:5000/api/productos")
      .then((res) => res.json())
      .then((data) => {
        setBandanas(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al cargar el catálogo público:", error);
        setCargando(false);
      });
  }, []);

  // Función que se ejecuta al hacer clic en "Iniciar sesión para comprar" desde el modal de la bandana
  const abrirLoginModal = () => {
    setProductoSeleccionado(null); // Cierra la ventana de la bandana
    setForzarAbrirLogin(true); // Ordena al Navbar que despliegue el modal de login
  };

  return (
    <div>
      {/* Barra de navegación superior conectada para abrir el login externamente */}
      <Navbar
        abrirLoginExterno={forzarAbrirLogin}
        onLoginAbierto={() => setForzarAbrirLogin(false)}
      />

      {/* Sección principal de presentación (Hero) */}
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

      {/* Sección del catálogo de productos dinámico */}
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
                {item.imagen_url ? (
                  <img
                    src={item.imagen_url}
                    alt={item.nombre}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ) : (
                  <div className="img-placeholder"></div>
                )}
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

      {/* Ventana modal del detalle del producto */}
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
