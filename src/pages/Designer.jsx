import React from "react";
import Navbar from "../components/Navbar";

function Designer() {
  // ==========================================
  // FUNCIONES DE CONTROL PARA VENTANAS EMERGENTES
  // ==========================================
  const openSizeGuide = () => {
    const modal = document.getElementById("sizeGuideModal");
    if (modal) modal.style.display = "flex";
  };

  const closeSizeGuide = () => {
    const modal = document.getElementById("sizeGuideModal");
    if (modal) modal.style.display = "none";
  };

  const openPaymentGuide = () => {
    const modal = document.getElementById("paymentGuideModal");
    if (modal) modal.style.display = "flex";
  };

  const closePaymentGuide = () => {
    const modal = document.getElementById("paymentGuideModal");
    if (modal) modal.style.display = "none";
  };

  const closeOrders = () => {
    const modal = document.getElementById("ordersModal");
    if (modal) modal.style.display = "none";
  };

  return (
    <div className="designer-page">
      {/* 🐾 Barra de navegación superior con sesión activa de usuario */}
      <Navbar tipo="diseno" />

      <main className="design-page">
        <h1 className="page-title">Diseña tu bandana</h1>

        <section className="design-container">
          {/* COLUMNA IZQUIERDA: PANEL DE CONTROLES Y SELECCIÓN */}
          <div className="options-panel">
            {/* Control: Selección de Talla */}
            <section className="option-group">
              <h3>Talla de la bandana</h3>
              <p className="help-text">
                ¿No sabes tu talla?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openSizeGuide();
                  }}
                >
                  Ver guía
                </a>
              </p>
              <div className="sizes">
                <button type="button" className="size-btn">
                  S
                </button>
                <button type="button" className="size-btn active">
                  M
                </button>
                <button type="button" className="size-btn">
                  L
                </button>
                <button type="button" className="size-btn">
                  XL
                </button>
              </div>
            </section>

            {/* Control: Selección de Color Base y Patrones */}
            <section className="option-group">
              <h3>Color base</h3>
              <p className="sub-title">Color plano</p>
              <div className="slider">
                <button type="button" className="arrow">
                  ‹
                </button>
                <div className="slider-track">
                  <span className="color color-1"></span>
                  <span className="color color-2"></span>
                  <span className="color color-3"></span>
                  <span className="color color-4"></span>
                  <span className="color color-5"></span>
                  <span className="color color-6"></span>
                  <span className="color color-7"></span>
                  <span className="color color-8"></span>
                  <span className="color color-9"></span>
                  <span className="color color-10"></span>
                </div>
                <button type="button" className="arrow">
                  ›
                </button>
              </div>

              <p className="sub-title">Color con patrón</p>
              <div className="slider">
                <button type="button" className="arrow">
                  ‹
                </button>
                <div className="slider-track">
                  <img
                    src="/patrones/patron1.png"
                    className="pattern"
                    alt="Patrón 1"
                  />
                  <img
                    src="/patrones/patron2.png"
                    className="pattern"
                    alt="Patrón 2"
                  />
                  <img
                    src="/patrones/patron3.png"
                    className="pattern"
                    alt="Patrón 3"
                  />
                  <img
                    src="/patrones/patron4.png"
                    className="pattern"
                    alt="Patrón 4"
                  />
                  <img
                    src="/patrones/patron5.png"
                    className="pattern"
                    alt="Patrón 5"
                  />
                </div>
                <button type="button" className="arrow">
                  ›
                </button>
              </div>
            </section>

            {/* Control: Selección de Elementos Gráficos (Stickers) */}
            <section className="option-group">
              <h3>Stickers</h3>
              <div className="slider">
                <button type="button" className="arrow">
                  ‹
                </button>
                <div className="slider-track">
                  <img
                    src="/stickers/s1.png"
                    className="sticker"
                    alt="Sticker 1"
                  />
                  <img
                    src="/stickers/s2.png"
                    className="sticker"
                    alt="Sticker 2"
                  />
                  <img
                    src="/stickers/s3.png"
                    className="sticker"
                    alt="Sticker 3"
                  />
                  <img
                    src="/stickers/s4.png"
                    className="sticker"
                    alt="Sticker 4"
                  />
                  <img
                    src="/stickers/s5.png"
                    className="sticker"
                    alt="Sticker 5"
                  />
                </div>
                <button type="button" className="arrow">
                  ›
                </button>
              </div>
            </section>

            {/* Control: Personalización de Textos */}
            <section className="option-group">
              <h3>Frase</h3>
              <input
                type="text"
                placeholder="Nombre de tu peludo"
                className="filter-input-search"
                style={{ width: "100%" }}
              />
            </section>

            {/* Control: Estilos de Tipografía */}
            <section className="option-group">
              <h3>Tipografía</h3>
              <input
                type="text"
                value="Poppins"
                disabled
                className="filter-input-search"
                style={{ width: "100%", background: "#f0f0f0" }}
              />
            </section>
          </div>

          {/* COLUMNA DERECHA: LIENZO DE PREVISUALIZACIÓN */}
          <div className="preview-panel">
            <div className="preview-box">
              <p>Previsualización de la bandana</p>
            </div>
            <button
              type="button"
              className="btn-save-changes"
              style={{ width: "100%", marginTop: "15px" }}
              onClick={openPaymentGuide}
            >
              Continuar compra
            </button>
          </div>
        </section>
      </main>

      {/* MODAL 1: GUÍA DE TALLAS */}
      <div id="sizeGuideModal" className="login-modal">
        <div className="login-box modal-guia">
          <span className="close-modal" onClick={closeSizeGuide}>
            ✕
          </span>
          <div className="modal-logo-container">
            <img
              src="/Imagenes/logo%20verde%20nombre.png"
              alt="Logo"
              className="modal-logo-img"
            />
          </div>
          <h2 className="modal-title">Guía de tallas para bandana</h2>

          <div
            className="guia-img-container"
            style={{ textAlign: "center", margin: "15px 0" }}
          >
            <img
              src="/Imagenes/medida%20cuello.png"
              alt="Cómo medir"
              className="img-guia"
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <p
              className="modal-note"
              style={{ fontSize: "14px", color: "#555", marginTop: "5px" }}
            >
              Mide el cuello de tu peludito dejando espacio para dos dedos
            </p>
          </div>

          <div
            className="tabla-tallas"
            style={{ width: "100%", marginBottom: "15px" }}
          >
            <div className="tabla-header">
              <span>Contorno cuello</span>
              <span>Raza referencia</span>
              <span>Talla</span>
            </div>
            <div className="tabla-body">
              <div className="tabla-fila">
                <span>20 - 26 cm</span>
                <span>Chihuahua, Gatos, Yorkie</span>
                <span className="talla-badge">XS</span>
              </div>
              <div className="tabla-fila">
                <span>27 - 35 cm</span>
                <span>Shih Tzu, Pomerania</span>
                <span className="talla-badge">S</span>
              </div>
              <div className="tabla-fila">
                <span>36 - 45 cm</span>
                <span>Beagle, Cocker Spaniel</span>
                <span className="talla-badge">M</span>
              </div>
              <div className="tabla-fila">
                <span>46 - 55 cm</span>
                <span>Border Collie, Boxer, Labrador</span>
                <span className="talla-badge">L</span>
              </div>
              <div className="tabla-fila">
                <span>56 - 65 cm</span>
                <span>Golden Retriever</span>
                <span className="talla-badge">XL</span>
              </div>
            </div>
          </div>

          <p
            className="modal-note"
            style={{ textAlign: "center", fontSize: "13px" }}
          >
            Ahora que conoces la talla de la bandana de tu peludo
          </p>
          <button
            type="button"
            className="btn-save-changes"
            onClick={closeSizeGuide}
          >
            Continuar diseño
          </button>
        </div>
      </div>

      {/* MODAL 2: PASARELA DE PAGO ASISTIDA (NEQUI) */}
      <div id="paymentGuideModal" className="login-modal">
        <div className="login-box modal-guia">
          <span className="close-modal" onClick={closePaymentGuide}>
            ✕
          </span>
          <div className="modal-logo-container">
            <img
              src="/Imagenes/logo%20verde%20nombre.png"
              alt="Logo"
              className="modal-logo-img"
            />
          </div>
          <h2 className="modal-title">Pagar tu pedido</h2>
          <h3
            className="order-number"
            style={{ textAlign: "center", color: "#2e7d32" }}
          >
            P-023
          </h3>

          <p
            className="modal-message"
            style={{ fontSize: "14px", textAlign: "justify", margin: "10px 0" }}
          >
            Realiza el pago de tu accesorio a través de Nequi y adjunta el
            comprobante para continuar el proceso. Luego podrás ver el estado de
            tu pedido en{" "}
            <span
              className="highlight-text"
              style={{ fontWeight: "bold", color: "#2e7d32" }}
            >
              'Mis pedidos'
            </span>
            .
          </p>

          <div
            className="payment-details"
            style={{
              display: "flex",
              gap: "15px",
              alignItems: "center",
              background: "#f9f9f9",
              padding: "15px",
              borderRadius: "6px",
              margin: "15px 0",
            }}
          >
            <div className="nequi-info">
              <img
                src="/Imagenes/nequi.jpg"
                alt="Nequi"
                className="nequi-logo"
                style={{ width: "70px", borderRadius: "4px" }}
              />
            </div>
            <div className="account-info" style={{ fontSize: "14px" }}>
              <p>
                <strong>Celular:</strong> 321 913 6057
              </p>
              <p>
                <strong>Estrellita Quintero</strong>
              </p>
              <p>
                <strong>Valor total:</strong> Por definir
              </p>
            </div>
          </div>

          <div
            className="modal-actions"
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              type="button"
              className="btn-save-changes"
              onClick={() => alert("Comprobante enviado a verificación.")}
            >
              Confirmar y enviar pago
            </button>
            <p
              className="security-note"
              style={{
                fontSize: "11px",
                color: "#777",
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              "Toda la información es cifrada y segura. Tu pedido iniciará
              fabricación después de verificar el pago."
            </p>
            <button
              type="button"
              className="btn-limpiar"
              onClick={closePaymentGuide}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 3: SEGUIMIENTO DE PEDIDOS */}
      <div id="ordersModal" className="login-modal">
        <div className="login-box modal-pedidos">
          <span className="close-modal" onClick={closeOrders}>
            ✕
          </span>
          <div className="modal-logo-container">
            <img
              src="/Imagenes/logo%20verde%20nombre.png"
              alt="Logo"
              className="modal-logo-img"
            />
          </div>
          <h2 className="modal-title">Mis pedidos</h2>

          <div
            className="orders-container"
            style={{ maxHeight: "250px", overflowY: "auto", margin: "15px 0" }}
          >
            <div
              className="order-card"
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "6px",
                marginBottom: "10px",
              }}
            >
              <div className="order-info">
                <div className="info-group">
                  <label
                    style={{
                      fontWeight: "bold",
                      display: "block",
                      fontSize: "12px",
                    }}
                  >
                    Id pedido
                  </label>
                  <span>P 023</span>
                </div>
                <div className="info-group">
                  <label
                    style={{
                      fontWeight: "bold",
                      display: "block",
                      fontSize: "12px",
                    }}
                  >
                    Diseño
                  </label>
                  <span>Verde bosque v 532</span>
                </div>
                <div className="info-group">
                  <label
                    style={{
                      fontWeight: "bold",
                      display: "block",
                      fontSize: "12px",
                    }}
                  >
                    Estado
                  </label>
                  <span
                    className="status-pending"
                    style={{ color: "#d32f2f", fontWeight: "bold" }}
                  >
                    Pago pendiente
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p
            className="modal-note-small"
            style={{
              fontSize: "11px",
              color: "#666",
              textAlign: "center",
              marginBottom: "15px",
            }}
          >
            "Tus diseños se empezarán a fabricar una vez verifiquemos el pago."
          </p>
          <button
            type="button"
            className="btn-save-changes"
            onClick={closeOrders}
          >
            Continuar nuevo diseño
          </button>
        </div>
      </div>
    </div>
  );
}

export default Designer;
