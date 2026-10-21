import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { API_URL } from "../config/api";

function AdminPanel() {
  const [bandanas, setBandanas] = useState([]);
  const [listaEstilos, setListaEstilos] = useState([]);
  const [listaMateriales, setListaMateriales] = useState([]);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstilo, setFiltroEstilo] = useState("Todos");
  const [filtroTalla, setFiltroTalla] = useState("Todas");
  const [filtroMaterial, setFiltroMaterial] = useState("Todos");

  const [editingId, setEditingId] = useState(null);
  const [isNuevoEstilo, setIsNuevoEstilo] = useState(false);
  const [isNuevoMaterial, setIsNuevoMaterial] = useState(false);

  const [formData, setFormData] = useState({
    estilo: "",
    nuevoEstilo: "",
    nombre: "",
    material: "",
    nuevoMaterial: "",
    stockXS: 0,
    stockS: 0,
    stockM: 0,
    stockL: 0,
    stockXL: 0,
    precio: "",
    descripcion: "",
  });

  const [imagenPreview, setImagenPreview] = useState(null);
  const [imagenFile, setImagenFile] = useState(null);
  const fileInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    cargarProductos();
    cargarCatalogos();
  }, []);

  // Carga los estilos y materiales dinámicamente desde la base de datos
  const cargarCatalogos = async () => {
    try {
      const resEstilos = await fetch(`${API_URL}/estilos`);
      if (resEstilos.ok) {
        const dataEstilos = await resEstilos.json();
        // Extraemos los nombres de los estilos de la BD (ej: Clásico, Galáctico, Urbano, Floral, Navidad)
        setListaEstilos(dataEstilos.map((e) => e.nombre_estilo || e));
      }

      const resMateriales = await fetch(`${API_URL}/materiales`);
      if (resMateriales.ok) {
        const dataMateriales = await resMateriales.json();
        setListaMateriales(dataMateriales.map((m) => m.nombre_material || m));
      }
    } catch (error) {
      console.error("Error al cargar estilos y materiales:", error);
    }
  };

  // Formatea la dirección URL de las imágenes gestionadas por el servidor backend.
  const BASE_URL = API_URL.replace("/api", "");

  const formatearUrlImagen = (url) => {
    if (!url) return "/Imagenes/Perro.png";
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("data:") ||
      url.startsWith("blob:")
    ) {
      return url;
    }
    return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  // Obtiene el catálogo actualizado de productos desde la base de datos MySQL.
  const cargarProductos = async () => {
    try {
      const response = await fetch(`${API_URL}/productos`);
      if (response.ok) {
        const data = await response.json();
        const productosMapeados = data.map((item) => ({
          id: item.codigo || `#00${item.id_producto}`,
          estilo: item.estilo,
          nombre: item.nombre,
          material: item.material,
          stockXS: item.stock_xs || 0,
          stockS: item.stock_s || 0,
          stockM: item.stock_m || 0,
          stockL: item.stock_l || 0,
          stockXL: item.stock_xl || 0,
          stockTotal: item.stock_total || 0,
          precio: item.precio,
          descripcion: item.descripcion,
          imagen: formatearUrlImagen(item.imagen_url),
        }));
        setBandanas(productosMapeados);
      }
    } catch (error) {
      console.error("Error al cargar productos de MySQL:", error);
    }
  };

  const openBandanaModal = () => {
    setEditingId(null);
    resetForm();
    setShowModal(true);
  };

  // Carga la información del producto seleccionado en el formulario para su modificación.
  const handleEdit = (item) => {
    setEditingId(item.id);

    if (item.estilo && !listaEstilos.includes(item.estilo)) {
      setListaEstilos((prev) => [...prev, item.estilo]);
    }
    if (item.material && !listaMateriales.includes(item.material)) {
      setListaMateriales((prev) => [...prev, item.material]);
    }

    setFormData({
      estilo: item.estilo,
      nuevoEstilo: "",
      nombre: item.nombre,
      material: item.material,
      nuevoMaterial: "",
      stockXS: item.stockXS || 0,
      stockS: item.stockS || 0,
      stockM: item.stockM || 0,
      stockL: item.stockL || 0,
      stockXL: item.stockXL || 0,
      precio: item.precio,
      descripcion: item.descripcion || "",
    });

    setImagenPreview(item.imagen || null);
    setImagenFile(null);
    setIsNuevoEstilo(false);
    setIsNuevoMaterial(false);
    setShowModal(true);
  };

  // Envía una solicitud de eliminación del producto al API backend.
  const handleDelete = async (idToDelete) => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar la bandana ${idToDelete}?`,
      )
    ) {
      try {
        const response = await fetch(
          `${API_URL}/productos/${encodeURIComponent(idToDelete)}`,
          { method: "DELETE" },
        );

        if (response.ok) {
          cargarProductos();
        } else {
          alert("No se pudo eliminar la bandana.");
        }
      } catch (error) {
        console.error("Error al eliminar bandana:", error);
      }
    }
  };

  const closeBandanaModal = () => {
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      estilo: "",
      nuevoEstilo: "",
      nombre: "",
      material: "",
      nuevoMaterial: "",
      stockXS: 0,
      stockS: 0,
      stockM: 0,
      stockL: 0,
      stockXL: 0,
      precio: "",
      descripcion: "",
    });
    setImagenPreview(null);
    setImagenFile(null);
    setIsNuevoEstilo(false);
    setIsNuevoMaterial(false);
    setEditingId(null);
  };

  const siguienteId = editingId
    ? editingId
    : (() => {
        if (bandanas.length === 0) return "#001";
        const numeros = bandanas.map((item) => {
          const match = String(item.id).match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        });
        const maxId = Math.max(...numeros, 0);
        return `#${String(maxId + 1).padStart(3, "0")}`;
      })();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenFile(file);
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  const stockTotalCalculado =
    (Number(formData.stockXS) || 0) +
    (Number(formData.stockS) || 0) +
    (Number(formData.stockM) || 0) +
    (Number(formData.stockL) || 0) +
    (Number(formData.stockXL) || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Procesa el envío del formulario mediante FormData para actualizar o crear productos con imágenes en el backend.
  const handleSubmit = async (e) => {
    e.preventDefault();

    const estiloFinal = isNuevoEstilo ? formData.nuevoEstilo : formData.estilo;
    const materialFinal = isNuevoMaterial
      ? formData.nuevoMaterial
      : formData.material;

    if (
      !estiloFinal ||
      !formData.nombre ||
      !materialFinal ||
      !formData.precio
    ) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    if (isNuevoEstilo && !listaEstilos.includes(estiloFinal)) {
      setListaEstilos((prev) => [...prev, estiloFinal]);
    }
    if (isNuevoMaterial && !listaMateriales.includes(materialFinal)) {
      setListaMateriales((prev) => [...prev, materialFinal]);
    }

    const dataForm = new FormData();
    dataForm.append("codigo", siguienteId);
    dataForm.append("estilo", estiloFinal);
    dataForm.append("nombre", formData.nombre);
    dataForm.append("material", materialFinal);
    dataForm.append("stockXS", Number(formData.stockXS));
    dataForm.append("stockS", Number(formData.stockS));
    dataForm.append("stockM", Number(formData.stockM));
    dataForm.append("stockL", Number(formData.stockL));
    dataForm.append("stockXL", Number(formData.stockXL));
    dataForm.append("stockTotal", stockTotalCalculado);
    dataForm.append("precio", formData.precio);
    dataForm.append("descripcion", formData.descripcion);

    if (imagenFile) {
      dataForm.append("imagen", imagenFile);
    }

    try {
      const url = editingId
        ? `${API_URL}/productos/${encodeURIComponent(editingId)}`
        : `${API_URL}/productos`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: dataForm,
      });

      if (response.ok) {
        alert(
          editingId
            ? "Bandana actualizada exitosamente"
            : "¡Bandana guardada con éxito!",
        );
        cargarProductos();
        closeBandanaModal();
      } else {
        const errorData = await response.json();
        alert(
          "Error al guardar: " + (errorData.message || "No se pudo guardar"),
        );
      }
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  // Aplica los criterios de búsqueda y filtros seleccionados sobre la lista de productos.
  const bandanasFiltradas = bandanas.filter((item) => {
    const coincideTexto =
      item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.id.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstilo =
      filtroEstilo === "Todos" ||
      item.estilo.toLowerCase() === filtroEstilo.toLowerCase();

    const coincideMaterial =
      filtroMaterial === "Todos" ||
      item.material.toLowerCase() === filtroMaterial.toLowerCase();

    const coincideTalla =
      filtroTalla === "Todas" ||
      (filtroTalla === "XS" && item.stockXS > 0) ||
      (filtroTalla === "S" && item.stockS > 0) ||
      (filtroTalla === "M" && item.stockM > 0) ||
      (filtroTalla === "L" && item.stockL > 0) ||
      (filtroTalla === "XL" && item.stockXL > 0);

    return coincideTexto && coincideEstilo && coincideMaterial && coincideTalla;
  });

  return (
    <div className="admin-page">
      <Navbar tipo="admin" />

      <main className="admin-container">
        <section className="admin-controls">
          <div className="filters-bar">
            <input
              type="text"
              placeholder="Buscar por nombre o ID..."
              className="filter-input-search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <div className="filter-group">
              <label>Estilos</label>
              <select
                className="filter-select"
                value={filtroEstilo}
                onChange={(e) => setFiltroEstilo(e.target.value)}
              >
                <option value="Todos">Todos</option>
                {listaEstilos.map((est, i) => (
                  <option key={i} value={est}>
                    {est}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Talla</label>
              <select
                className="filter-select"
                value={filtroTalla}
                onChange={(e) => setFiltroTalla(e.target.value)}
              >
                <option value="Todas">Todas</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Material</label>
              <select
                className="filter-select"
                value={filtroMaterial}
                onChange={(e) => setFiltroMaterial(e.target.value)}
              >
                <option value="Todos">Todos</option>
                {listaMateriales.map((mat, i) => (
                  <option key={i} value={mat}>
                    {mat}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn-limpiar"
              onClick={() => {
                setBusqueda("");
                setFiltroEstilo("Todos");
                setFiltroTalla("Todas");
                setFiltroMaterial("Todos");
              }}
            >
              Limpiar
            </button>
          </div>

          <button className="btn-add-bandana" onClick={openBandanaModal}>
            + Agregar nueva bandana
          </button>
        </section>

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
              {bandanasFiltradas.map((item) => (
                <tr key={item.id}>
                  <td>{item.estilo}</td>
                  <td>{item.id}</td>
                  <td>{item.nombre}</td>
                  <td>
                    {item.imagen ? (
                      <img
                        src={formatearUrlImagen(item.imagen)}
                        alt={item.nombre}
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                        onError={(e) => {
                          e.target.src = "/Imagenes/Perro.png";
                        }}
                      />
                    ) : (
                      <div className="img-placeholder-table"></div>
                    )}
                  </td>
                  <td className="stock-status">{item.stockTotal}</td>
                  <td className="col-precio">
                    ${Number(item.precio).toLocaleString("es-CO")}
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-action edit"
                      onClick={() => handleEdit(item)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-action delete"
                      onClick={() => handleDelete(item.id)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {showModal && (
        <div
          id="bandanaModal"
          className="login-modal"
          style={{ display: "flex" }}
        >
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

            <h2 className="modal-title">
              {editingId ? "Editar bandana" : "Nueva bandana"}
            </h2>

            <form
              id="formBandana"
              className="modal-form-two-columns"
              onSubmit={handleSubmit}
            >
              <div className="modal-col-left">
                <div className="image-upload-container">
                  <div className="image-preview-box">
                    {imagenPreview ? (
                      <img
                        src={formatearUrlImagen(imagenPreview)}
                        alt="Vista previa"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                        onError={(e) => {
                          e.target.src = "/Imagenes/Perro.png";
                        }}
                      />
                    ) : (
                      <span style={{ color: "#aaa" }}>Sin imagen</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    className="btn-upload"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Cargar imagen
                  </button>
                </div>
              </div>

              <div className="modal-col-right">
                <div className="input-group">
                  <label>Estilo</label>
                  <div
                    className="style-select-row"
                    style={{ display: "flex", gap: "5px" }}
                  >
                    {isNuevoEstilo ? (
                      <input
                        type="text"
                        name="nuevoEstilo"
                        placeholder="Escribe nuevo estilo..."
                        value={formData.nuevoEstilo}
                        onChange={handleChange}
                        required
                      />
                    ) : (
                      <select
                        name="estilo"
                        value={formData.estilo}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar estilo</option>
                        {listaEstilos.map((est, i) => (
                          <option key={i} value={est}>
                            {est}
                          </option>
                        ))}
                      </select>
                    )}
                    <button
                      type="button"
                      className="btn-plus-style"
                      onClick={() => setIsNuevoEstilo(!isNuevoEstilo)}
                    >
                      {isNuevoEstilo ? "✕" : "+"}
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Id</label>
                  <input
                    type="text"
                    name="id"
                    className="input-id-readonly"
                    readOnly
                    value={siguienteId}
                  />
                </div>

                <div className="input-group">
                  <label>Material</label>
                  <div
                    className="style-select-row"
                    style={{ display: "flex", gap: "5px" }}
                  >
                    {isNuevoMaterial ? (
                      <input
                        type="text"
                        name="nuevoMaterial"
                        placeholder="Escribe nuevo material..."
                        value={formData.nuevoMaterial}
                        onChange={handleChange}
                        required
                      />
                    ) : (
                      <select
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar material</option>
                        {listaMateriales.map((mat, i) => (
                          <option key={i} value={mat}>
                            {mat}
                          </option>
                        ))}
                      </select>
                    )}
                    <button
                      type="button"
                      className="btn-plus-style"
                      onClick={() => setIsNuevoMaterial(!isNuevoMaterial)}
                    >
                      {isNuevoMaterial ? "✕" : "+"}
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label>Stock (Total: {stockTotalCalculado})</label>
                  <div className="stock-inputs-row">
                    <div className="stock-field">
                      <label>XS</label>
                      <input
                        type="number"
                        name="stockXS"
                        min="0"
                        value={formData.stockXS}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="stock-field">
                      <label>S</label>
                      <input
                        type="number"
                        name="stockS"
                        min="0"
                        value={formData.stockS}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="stock-field">
                      <label>M</label>
                      <input
                        type="number"
                        name="stockM"
                        min="0"
                        value={formData.stockM}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="stock-field">
                      <label>L</label>
                      <input
                        type="number"
                        name="stockL"
                        min="0"
                        value={formData.stockL}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="stock-field">
                      <label>XL</label>
                      <input
                        type="number"
                        name="stockXL"
                        min="0"
                        value={formData.stockXL}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label>Precio</label>
                  <input
                    type="number"
                    name="precio"
                    placeholder="$ 28000"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="modal-full-width">
                <div className="input-group">
                  <label>Descripción</label>
                  <textarea
                    name="descripcion"
                    rows="3"
                    value={formData.descripcion}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="modal-actions-footer">
                  <button type="submit" className="btn-save-changes">
                    {editingId ? "Actualizar cambios" : "Guardar cambios"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
