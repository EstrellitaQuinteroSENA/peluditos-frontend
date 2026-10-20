import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Footer({ tipo }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navegarASeccion = (idSeccion) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const elemento = document.getElementById(idSeccion);
        if (elemento) {
          elemento.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    } else {
      const elemento = document.getElementById(idSeccion);
      if (elemento) {
        elemento.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="footer" id="contacto">
      <div className="footer-container">
        <div className="footer-col footer-brand">
          <img
            src="/Imagenes/logo blanco.png"
            alt="Logo oficial de Peluditos_EQ"
            className="footer-logo"
          />
          <p>Diseños únicos para tus mejores amigos.</p>
        </div>

        <div className="footer-col" id="nosotros">
          <h4>Enlaces útiles</h4>
          <ul>
            <li>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Inicio
              </a>
            </li>
            <li>
              <a
                href="#catalogo"
                onClick={(e) => {
                  e.preventDefault();
                  navegarASeccion("catalogo");
                }}
              >
                Catálogo
              </a>
            </li>
            <li>
              <a
                href="#nosotros"
                onClick={(e) => {
                  e.preventDefault();
                  navegarASeccion("nosotros");
                }}
              >
                Nosotros
              </a>
            </li>
            <li>
              <a
                href="#contacto"
                onClick={(e) => {
                  e.preventDefault();
                  navegarASeccion("contacto");
                }}
              >
                Contacto
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Información</h4>
          <ul>
            <li>
              <a href="#contacto">Política de privacidad</a>
            </li>
            <li>
              <a href="#contacto">Términos y condiciones</a>
            </li>
            <li>
              <a href="#contacto">Preguntas frecuentes</a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Síguenos</h4>
          <div className="footer-socials">
            <a href="#contacto">🐾</a>
            <a href="#contacto">📷</a>
            <a href="#contacto">💬</a>
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
