import React from "react";
import Navbar from "../components/Navbar";

function LandingPage() {
  return (
    <div>
      {/* Barra de navegación superior comercial */}
      <Navbar />

      {/* Sección principal de presentación (Hero) */}
      <section className="hero">
        <img src="/Imagenes/Perro.png" className="hero-img left" alt="Perro" />

        <div className="hero-text">
          <h1>
            Collares, bandanas y accesorios personalizados para tu mascota.
          </h1>
          <p>
            Tú eliges los colores, nosotros creamos la magia para tu peludito.
          </p>
          <a href="#" className="btn btn-hero">
            Diseñar mi propio accesorio
          </a>
        </div>

        <img src="/Imagenes/Gato.png" className="hero-img right" alt="Gato" />
      </section>

      {/* Sección del catálogo de productos */}
      <section className="catalogo" id="catalogo">
        <h2>Nuestras bandanas</h2>
        <div className="grid-collares">
          {/* Renderizado dinámico de las tarjetas de productos mediante un mapeo de arreglo */}
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div className="card" key={num}>
              <div className="img-placeholder"></div>
              <p>Verde selva</p>
              <p>$ xxxxxxx</p>
            </div>
          ))}
        </div>

        <a href="#" className="btn btn-catalogo">
          Ver más
        </a>
      </section>
    </div>
  );
}

export default LandingPage;
