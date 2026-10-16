import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ tipo, abrirLoginExterno, onLoginAbierto }) {
  const navigate = useNavigate();

  // Estado para verificar si hay sesión activa en tiempo real
  const [isLogged, setIsLogged] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // ESTADOS PARA MODALES
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Estado para saber si el aviso actual es un éxito de registro
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);

  // Campos de formulario de Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Campos de formulario de Registro
  const [regNombre, setRegNombre] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Verificar sesión al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (token) {
      setIsLogged(true);
      setUserRole(role);
    }
  }, []);

  // Efecto para abrir el modal de login si se solicita desde fuera (Catálogo/LandingPage)
  useEffect(() => {
    if (abrirLoginExterno) {
      setShowRegister(false);
      setShowLogin(true);
      if (onLoginAbierto) onLoginAbierto();
    }
  }, [abrirLoginExterno]);

  // Función para Iniciar Sesión conectada al Backend
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: loginEmail.trim().toLowerCase(),
          password: loginPassword.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.usuario.rol);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        localStorage.setItem("isLogged", "true");

        setIsLogged(true);
        setUserRole(data.usuario.rol);
        setShowLogin(false);
        resetForms();

        if (data.usuario.rol === "admin") {
          navigate("/admin");
        } else {
          navigate("/mis-pedidos");
        }
      } else {
        setIsRegisterSuccess(false);
        setErrorMessage(data.message || "Credenciales incorrectas.");
        setShowError(true);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setIsRegisterSuccess(false);
      setErrorMessage("No se pudo conectar con el servidor.");
      setShowError(true);
    }
  };

  // Función para Registrarse conectada al Backend (Usando el modal de la plataforma)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_completo: regNombre.trim(),
          correo: regEmail.trim().toLowerCase(),
          password: regPassword.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowRegister(false);
        resetForms();
        setIsRegisterSuccess(true); // Marcamos que fue un éxito
        setErrorMessage(
          "¡Cuenta creada con éxito! 🐾 Ya puedes iniciar sesión.",
        );
        setShowError(true); // Muestra tu modal bonito de la plataforma
      } else {
        setIsRegisterSuccess(false);
        setErrorMessage(data.message || "Error al registrar el usuario.");
        setShowError(true);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setIsRegisterSuccess(false);
      setErrorMessage("No se pudo conectar con el servidor.");
      setShowError(true);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLogged(false);
    setUserRole(null);
    navigate("/");
  };

  const resetForms = () => {
    setLoginEmail("");
    setLoginPassword("");
    setRegNombre("");
    setRegEmail("");
    setRegPassword("");
  };

  const openLoginModal = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const openRegisterModal = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  // Controlar la acción del botón del modal de aviso
  const handleModalClose = () => {
    setShowError(false);
    if (isRegisterSuccess) {
      setIsRegisterSuccess(false);
      setShowLogin(true); // Abre el login automáticamente al cerrar el aviso de éxito
    }
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
                placeholder="ejemplo@correo.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="********"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
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

            <form onSubmit={handleRegisterSubmit}>
              <label>Nombre completo</label>
              <input
                type="text"
                placeholder="Ej. María Gómez"
                value={regNombre}
                onChange={(e) => setRegNombre(e.target.value)}
                required
              />
              <label>Correo electrónico</label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="********"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary">
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

      {/* MODAL DE AVISO / ERROR DEL SISTEMA */}
      {showError && (
        <div className="modal-error" style={{ display: "flex" }}>
          <div className="modal-error-content">
            <button className="modal-close" onClick={handleModalClose}>
              ✕
            </button>
            <h2 className="modal-title">
              {isRegisterSuccess ? "¡Registro exitoso!" : "Aviso del sistema"}
            </h2>
            <p className="modal-message">{errorMessage}</p>
            <button className="modal-btn" onClick={handleModalClose}>
              Entendido
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;