import React from "react";
import Navbar from "../components/Navbar";

function AdminPanel() {
/**
 * Gestiona la apertura de la ventana modal de administración de productos.
 */
const openBandanaModal = () => {
const modal = document.getElementById("bandanaModal");
if (modal) modal.style.display = "flex";
};

/**
 * Gestiona el cierre de la ventana modal de administración de productos.
 */
const closeBandanaModal = () => {
const modal = document.getElementById("bandanaModal");
if (modal) modal.style.display = "none";
};

return (
<div className="admin-page">
    {/* Barra de navegación superior con diseño especializado para la gestión interna */}
    <Navbar tipo="admin" />

    <main className="admin-container">
    {/* Sección de filtros de búsqueda y botón de acción principal */}
    <section className="admin-controls">
        <div className="filters-bar">
        <input
            type="text"
            placeholder="Buscar por nombre o ID..."
            className="filter-input-search"
        />

        <div className="filter-group">
            <label>Estilos</label>
            <select className="filter-select">
            <option>Todos</option>
            <option>Galáctico</option>
            <option>Urbano</option>
            <option>Clásico</option>
            </select>
        </div>

        <div className="filter-group">
            <label>Talla</label>
            <select className="filter-select">
            <option>Todas</option>
            <option>XS</option>
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
            </select>
        </div>

        <div className="filter-group">
            <label>Material</label>
            <select className="filter-select">
            <option>Todos</option>
            <option>Algodón</option>
            <option>Lino</option>
            </select>
        </div>

        <button className="btn-limpiar">Limpiar</button>
        </div>

        <button className="btn-add-bandana" onClick={openBandanaModal}>
        + Agregar nueva bandana
        </button>
    </section>

    {/* Tabla de visualización de inventario */}
    <section className="inventory-table-container">
        <table className="admin-table">
        <thead>
            <tr>
            <th>Estilo</th>
            <th>Id</th>
            <th>Nombre</th>
            <th>Imagen</th>
            <th>Stock Total</th>
            <th>Precio</th>
            <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {/* Registro estático de prueba para verificar la visualización de la interfaz */}
            <tr>
            <td>Galáctico</td>
            <td>N-01</td>
            <td>Estrellas</td>
            <td>
                <div className="img-placeholder-table"></div>
            </td>
            <td className="stock-status">15</td>
            <td className="col-precio">$28.000</td>
            <td className="actions-cell">
                <button
                className="btn-action edit"
                onClick={() => openBandanaModal("N-01")}
                >
                ✏️
                </button>
                <button className="btn-action delete">🗑️</button>
            </td>
            </tr>
        </tbody>
        </table>
    </section>
    </main>

    {/* Ventana modal para la creación y edición de productos */}
    <div id="bandanaModal" className="login-modal">
    <div className="login-box modal-bandana">
        <span className="close-modal" onClick={closeBandanaModal}>
        ✕
        </span>
        <div className="modal-logo-container">
        <img
            src="/Imagenes/logo%20verde%20nombre.png"
            alt="Logo Peluditos"
            className="modal-logo-img"
        />
        </div>

        <h2 className="modal-title">Nueva bandana</h2>

        <form
        id="formBandana"
        className="modal-form-two-columns"
        onSubmit={(e) => e.preventDefault()}
        >
        {/* Columna Izquierda: Carga de recursos multimedia */}
        <div className="modal-col-left">
            <div className="image-upload-container">
            <div className="image-preview-box"></div>
            <button type="button" className="btn-upload">
                Cargar imagen
            </button>
            </div>
        </div>

        {/* Columna Derecha: Formulario de especificaciones técnicas */}
        <div className="modal-col-right">
            <div className="input-group">
            <label>Estilo</label>
            <div className="style-select-row">
                <select name="estilo">
                <option>Seleccionar estilo</option>
                </select>
                <button type="button" className="btn-plus-style">
                +
                </button>
            </div>
            </div>

            <div className="input-group">
            <label>Nombre</label>
            <input type="text" name="nombre" />
            </div>

            <div className="input-group">
            <label>Id</label>
            <input
                type="text"
                name="id"
                className="input-id-readonly"
                readOnly
                placeholder="#001"
            />
            </div>

            <div className="input-group">
            <label>Material</label>
            <input type="text" name="material" />
            </div>

            <div className="input-group">
            <label>Stock</label>
            <div className="stock-inputs-row">
                <div className="stock-field">
                <label>XS</label>
                <input type="number" />
                </div>
                <div className="stock-field">
                <label>S</label>
                <input type="number" />
                </div>
                <div className="stock-field">
                <label>M</label>
                <input type="number" />
                </div>
                <div className="stock-field">
                <label>L</label>
                <input type="number" />
                </div>
                <div className="stock-field">
                <label>XL</label>
                <input type="number" />
                </div>
            </div>
            </div>

            <div className="input-group">
            <label>Precio</label>
            <input type="text" name="precio" placeholder="$" />
            </div>
        </div>

        {/* Fila de ancho completo: Elementos descriptivos y acciones finales */}
        <div className="modal-full-width">
            <div className="input-group">
            <label>Descripción</label>
            <textarea name="descripcion" rows="4"></textarea>
            </div>

            <div className="modal-actions-footer">
            <button type="submit" className="btn-save-changes">
                Guardar cambios
            </button>
            </div>
        </div>
        </form>
    </div>
    </div>
</div>
);
}

export default AdminPanel;
