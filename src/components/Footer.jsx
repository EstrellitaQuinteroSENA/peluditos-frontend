import React from "react";

function Footer({ tipo }) {
  return (
    <footer className="footer" id="contacto">
      <div className="footer-container">
        <div className="footer-col footer-brand">
          <img
            src="/Imagenes/logo blanco.png"
            alt="Logo oficial de Peluditos_EQ"
            className="footer-logo"
          />
          {/* Solo muestra la descripción si NO es la página de diseño */}
          {tipo !== "diseno" && <p>Diseños únicos para tus mejores amigos.</p>}
        </div>

        <div className="footer-col">
          <h4>Enlaces útiles</h4>
          <ul>
            <li>
              <a href="/">Inicio</a>
            </li>
            <li>
              <a href={tipo === "diseno" ? "/#catalogo" : "#catalogo"}>
                Catálogo
              </a>
            </li>
            <li>
              <a href="#">
                {tipo === "diseno" ? "Mis pedidos" : "Diseña tu accesorio"}
              </a>
            </li>
            <li>
              <a href="#">Nosotros</a>
            </li>
            <li>
              <a href="#contacto">Contacto</a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Información</h4>
          <ul>
            <li>
              <a href="#">Política de privacidad</a>
            </li>
            <li>
              <a href="#">Términos y condiciones</a>
            </li>
            <li>
              <a href="#">Preguntas frecuentes</a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Síguenos</h4>
          <div className="footer-socials">
            <a href="#">🐾</a>
            <a href="#">📷</a>
            <a href="#">💬</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Peluditos_EQ – Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
