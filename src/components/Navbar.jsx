import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../config/api";

function Navbar({ tipo, abrirLoginExterno, onLoginAbierto }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogged, setIsLogged] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false); // Estado ojito Login

  const [regNombre, setRegNombre] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false); // Estado ojito Registro

  // Verifica la sesión activa almacenada al cargar el componente.
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (token) {
      setIsLogged(true);
      setUserRole(role);
    }
  }, []);

  // Controla la apertura del modal de inicio de sesión mediante solicitudes externas.
  useEffect(() => {
    if (abrirLoginExterno) {
      setShowRegister(false);
      setShowLogin(true);
      if (onLoginAbierto) onLoginAbierto();
    }
  }, [abrirLoginExterno]);

  // Procesa la autenticación del usuario comunicándose con el servidor backend.
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
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
          navigate("/admin/pedidos");
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

  // Gestiona el registro de nuevos usuarios mediante el API backend.
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/auth/registro`, {
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
        setIsRegisterSuccess(true);
        setErrorMessage(
          "¡Cuenta creada con éxito! 🐾 Ya se puede iniciar sesión.",
        );
        setShowError(true);
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
    setShowLoginPassword(false);
    setRegNombre("");
    setRegEmail("");
    setRegPassword("");
    setShowRegPassword(false);
  };

  const openLoginModal = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const openRegisterModal = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleModalClose = () => {
    setShowError(false);
    if (isRegisterSuccess) {
      setIsRegisterSuccess(false);
      setShowLogin(true);
    }
  };

  // Realiza la navegación fluida hacia secciones específicas de la página principal.
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

  // Renderiza los enlaces de navegación según el rol del usuario.
  const renderEnlaces = () => {
    if (tipo === "admin" || userRole === "admin") {
      return (
        <nav className="nav">
          <a
            href="/admin"
            onClick={(e) => {
              e.preventDefault();
              navigate("/admin");
            }}
          >
            Inventario
          </a>
          <a
            href="/admin/pedidos"
            onClick={(e) => {
              e.preventDefault();
              navigate("/admin/pedidos");
            }}
          >
            Pedidos General
          </a>
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
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Inicio
        </a>

        <a
          href="#catalogo"
          onClick={(e) => {
            e.preventDefault();
            navegarASeccion("catalogo");
          }}
        >
          Catálogo
        </a>

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

        <a
          href="#nosotros"
          onClick={(e) => {
            e.preventDefault();
            navegarASeccion("nosotros");
          }}
        >
          Nosotros
        </a>

        <a
          href="#contacto"
          onClick={(e) => {
            e.preventDefault();
            navegarASeccion("contacto");
          }}
        >
          Contacto
        </a>
      </nav>
    );
  };

  // Renderiza los botones de autenticación o el estado de sesión activa.
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
            window.scrollTo({ top: 0, behavior: "smooth" });
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
              <div style={{ position: "relative" }}>
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="********"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  style={{ width: "100%", paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  {showLoginPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ marginTop: "15px" }}
              >
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
              <div style={{ position: "relative" }}>
                <input
                  type={showRegPassword ? "text" : "password"}
                  placeholder="********"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  style={{ width: "100%", paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  {showRegPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ marginTop: "15px" }}
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
