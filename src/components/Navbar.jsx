import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ tipo }) {
  const navigate = useNavigate();

  // Estado para verificar si hay sesión activa en tiempo real
  const [isLogged, setIsLogged] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // ESTADOS PARA MODALES
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showError, setShowError] = useState(false);

  // Campos de formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Verificar sesión al cargar el componente
  useEffect(() => {
    const logged = localStorage.getItem("isLogged") === "true";
    const role = localStorage.getItem("userRole");
    setIsLogged(logged);
    setUserRole(role);
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (cleanEmail === "cliente@peluditos.com" && cleanPassword === "123456") {
      localStorage.setItem("isLogged", "true");
      localStorage.setItem("userRole", "client");
      setIsLogged(true);
      setUserRole("client");
      setShowLogin(false);
      resetForm();
      navigate("/mis-pedidos");
    } else if (
      cleanEmail === "admin@peluditos.com" &&
      cleanPassword === "admin123"
    ) {
      localStorage.setItem("isLogged", "true");
      localStorage.setItem("userRole", "admin");
      setIsLogged(true);
      setUserRole("admin");
      setShowLogin(false);
      resetForm();
      navigate("/admin");
    } else {
      setErrorMessage("Credenciales incorrectas. Revisa los datos de prueba.");
      setShowError(true);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLogged(false);
    setUserRole(null);
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

  // RENDER DE ENLACES
  const renderEnlaces = () => {
    if (tipo === "admin" || userRole === "admin") {
      return (
        <nav className="nav">
          <a href="/admin">Inventario</a>
          <a href="/admin">Pedidos General</a>
        </nav>
      );
    }

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

        {/* Solo se muestra Mis Pedidos si hay sesión activa */}
        {isLogged && (
          <a
            href="/mis-pedidos"
            onClick={(e) => {
              e.preventDefault();
              navigate("/mis-pedidos");
            }}
          >
            Mis pedidos
          </a>
        )}

        <a href="#nosotros">Nosotros</a>
        <a href="#contacto">Contacto</a>
      </nav>
    );
  };

  // RENDER DE BOTONES
  const renderBotones = () => {
    if (isLogged) {
      return (
        <div className="auth-buttons">
          <span className="user-info">Sesión activa 🐾</span>
          <button onClick={handleLogout} className="btn btn-header-green">
            Cerrar sesión
          </button>
        </div>
      );
    }

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
        <div className="login-modal" style={{ display: "flex" }}>
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
              Accede a tu cuenta para explorar el catálogo y gestionar tus
              compras.
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
        <div className="login-modal" style={{ display: "flex" }}>
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
              Crea tu cuenta para realizar compras y hacer seguimiento a tus
              pedidos.
            </p>
            <form onSubmit={(e) => e.preventDefault()}>
              <label>Nombre completo</label>
              <input type="text" placeholder="Ej. María Gómez" />
              <label>Correo electrónico</label>
              <input type="email" placeholder="ejemplo@correo.com" />
              <label>Contraseña</label>
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
        <div className="modal-error" style={{ display: "flex" }}>
          <div className="modal-error-content">
            <button className="modal-close" onClick={() => setShowError(false)}>
              ✕
            </button>
            <h2 className="modal-title">Revisa tu información</h2>
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
