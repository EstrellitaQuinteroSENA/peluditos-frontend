import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ tipo }) {
  const navigate = useNavigate();

  // ==========================================
  // ESTADOS PARA PASARELAS Y VENTANAS EMERGENTES
  // ==========================================
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showError, setShowError] = useState(false);

  // Estados para capturar las cajas de texto
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================
  // LOGICA DE CONTROL DE FLUJO (AUTENTICACIÓN RIGIDA)
  // ==========================================
  const handleLoginSubmit = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage("Por favor ingresa un correo válido.");
      setShowError(true);
      return;
    }

    if (cleanPassword.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      setShowError(true);
      return;
    }

    if (cleanEmail === "cliente@peluditos.com" && cleanPassword === "123456") {
      localStorage.setItem("isLogged", "true");
      localStorage.setItem("userRole", "client");
      setShowLogin(false);
      resetForm();
      navigate("/designer");
    } else if (
      cleanEmail === "admin@peluditos.com" &&
      cleanPassword === "admin123"
    ) {
      localStorage.setItem("isLogged", "true");
      localStorage.setItem("userRole", "admin");
      setShowLogin(false);
      resetForm();
      navigate("/admin");
    } else {
      setErrorMessage("Credenciales de prueba incorrectas. Revisa la guía.");
      setShowError(true);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const openLoginModal = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const openRegisterModal = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  // ==========================================
  // RENDERIZADO DINÁMICO DE ENLACES Y BOTONES
  // ==========================================
  const renderEnlaces = () => {
    if (tipo === "admin") {
      return (
        <nav className="nav">
          <a href="#" onClick={(e) => e.preventDefault()}>
            Inventario
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>
            Pedidos
          </a>
        </nav>
      );
    }

    if (tipo === "diseno") {
      return (
        <nav className="nav">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            Inicio
          </a>
          <a href="/#catalogo">Catálogo</a>
          <a
            href="#"
            className="nav-orders"
            onClick={(e) => e.preventDefault()}
          >
            Mis pedidos
          </a>
          <a href="#">Nosotros</a>
          <a href="#contacto">Contacto</a>
        </nav>
      );
    }

    // Menú Comercial por defecto (LandingPage)
    return (
      <nav className="nav">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          Inicio
        </a>
        <a href="#catalogo">Catálogo</a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            openLoginModal();
          }}
        >
          Diseña tu accesorio
        </a>
        <a href="#">Nosotros</a>
        <a href="#contacto">Contacto</a>
      </nav>
    );
  };

  const renderBotones = () => {
    if (tipo === "admin") {
      return (
        <div className="auth-buttons">
          <button onClick={handleLogout} className="btn btn-header-yellow">
            Cerrar sesión
          </button>
        </div>
      );
    }

    if (tipo === "diseno") {
      return (
        <div className="auth-buttons">
          <span className="user-info">Sesión activa 🐾</span>
          <button onClick={handleLogout} className="btn btn-header-green">
            Cerrar sesión
          </button>
        </div>
      );
    }

    // Botones comerciales por defecto
    return (
      <div className="auth-buttons">
        <button onClick={openLoginModal} className="btn btn-header-outline">
          Iniciar sesión
        </button>
        <button onClick={openRegisterModal} className="btn btn-header-green">
          Registrarse
        </button>
      </div>
    );
  };

  return (
    <header className="header">
      <div className="logo">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          <img
            src="/Imagenes/logo verde nombre.png"
            alt="Peluditos con estilo"
          />
        </a>
      </div>

      <div className="header-right">
        {renderEnlaces()}
        {renderBotones()}
      </div>

      {/* MODAL DE INICIAR SESIÓN */}
      {showLogin && (
        <div
          id="loginModal"
          className="login-modal"
          style={{ display: "flex" }}
        >
          <div className="login-box">
            <span className="close-modal" onClick={() => setShowLogin(false)}>
              ✕
            </span>
            <img
              src="/Imagenes/logo verde nombre.png"
              className="modal-logo"
              alt="Logo"
            />
            <h2>Iniciar sesión</h2>
            <p className="modal-subtitle">
              Accede a tu cuenta para personalizar accesorios para tu peludito.
            </p>

            <form onSubmit={handleLoginSubmit}>
              <label>Correo electrónico</label>
              <input
                type="email"
                placeholder="cliente@peluditos.com o admin@peluditos.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="123456 o admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <a
                href="#"
                className="forgot"
                onClick={(e) => e.preventDefault()}
              >
                ¿Olvidaste tu contraseña?
              </a>
              <button type="submit" className="btn-primary">
                Iniciar sesión
              </button>
            </form>

            <p className="switch">
              ¿No tienes cuenta?{" "}
              <span onClick={openRegisterModal}>Regístrate</span>
            </p>
          </div>
        </div>
      )}

      {/* MODAL DE REGISTRO */}
      {showRegister && (
        <div
          id="registerModal"
          className="login-modal"
          style={{ display: "flex" }}
        >
          <div className="login-box">
            <span
              className="close-modal"
              onClick={() => setShowRegister(false)}
            >
              ✕
            </span>
            <img
              src="/Imagenes/logo verde nombre.png"
              className="modal-logo"
              alt="Logo"
            />
            <h2>Crear cuenta</h2>
            <p className="modal-subtitle">
              Crea tu cuenta para diseñar accesorios únicos para tu peludito.
            </p>
            <form onSubmit={(e) => e.preventDefault()}>
              <label>Nombre completo</label>
              <input type="text" placeholder="Ej. María Gómez" />
              <label>Correo electrónico</label>
              <input type="email" placeholder="ejemplo@correo.com" />
              <label>Contraseña</label>
              <input type="password" placeholder="********" />
              <label>Confirmar contraseña</label>
              <input type="password" placeholder="********" />
              <button
                className="btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  openLoginModal();
                }}
              >
                Crear cuenta
              </button>
            </form>
            <p className="switch">
              ¿Ya tienes cuenta?{" "}
              <span onClick={openLoginModal}>Iniciar sesión</span>
            </p>
          </div>
        </div>
      )}

      {/* MODAL DE ERROR */}
      {showError && (
        <div
          className="modal-error"
          id="errorModal"
          style={{ display: "flex" }}
        >
          <div className="modal-error-content">
            <button className="modal-close" onClick={() => setShowError(false)}>
              ✕
            </button>
            <div className="modal-error-logo">
              <img
                src="/Imagenes/logo verde nombre.png"
                alt="Peluditos con estilo"
              />
            </div>
            <h2 className="modal-title">Revisa tu información</h2>
            <div className="modal-icon">⚠️</div>
            <p className="modal-message">{errorMessage}</p>
            <button className="modal-btn" onClick={() => setShowError(false)}>
              Entendido
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
