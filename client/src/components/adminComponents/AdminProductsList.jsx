import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './AdminProductsList.css';
import updateIcon from '../../assets/img/update-svgrepo-com.svg';
import deleteIcon from '../../assets/img/delete-filled-svgrepo-com.svg';

export default function AdminProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', stock: '', category_id: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const BACKEND_ORIGIN = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || '';

  const getImageSrc = (url) => {
    if (!url) return '/placeholder-coffee.jpg';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `${BACKEND_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products');
      setProducts(Array.isArray(data?.products) ? data.products : []);
    } catch (err) {
      setMessage('Error al cargar productos');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(Array.isArray(data?.categories) ? data.categories : []);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price != null ? String(product.price) : '',
      stock: product.stock != null ? String(product.stock) : '',
      category_id: product.category_id || ''
    });
    setImageFile(null);
    setImagePreview(getImageSrc(product.image_url));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', description: '', price: '', stock: '', category_id: '' });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (id) => {
    setMessage('');
    try {
      let body;
      if (imageFile) {
        body = new FormData();
        Object.keys(editForm).forEach(k => {
          if (editForm[k] !== '') body.append(k, editForm[k]);
        });
        body.append('image', imageFile);
      } else {
        body = {};
        Object.keys(editForm).forEach(k => {
          if (editForm[k] !== '') body[k] = editForm[k];
        });
      }

      await api.put(`/products/${id}`, body);
      setMessage('Producto actualizado');
      setMessageType('success');
      setEditingId(null);
      setImageFile(null);
      setImagePreview(null);
      fetchProducts();
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Error al actualizar');
      setMessageType('error');
    }
  };

  const confirmDelete = (id) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    setMessage('');
    try {
      await api.delete(`/products/${productToDelete}`);
      setMessage('Producto eliminado');
      setMessageType('success');
      setShowDeleteModal(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Error al eliminar');
      setMessageType('error');
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  return (
    <section className="admin-products-list">
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="products-table">
          <div className="table-header">
            <div className="col-image">Imagen</div>
            <div className="col-name">Nombre del producto</div>
            <div className="col-description">Descripción</div>
            <div className="col-price">Precio</div>
            <div className="col-stock">Stock</div>
            <div className="col-category">Categoría</div>
            <div className="col-actions">Acciones</div>
          </div>
          {products.map(p => (
            <div key={p.id} className="table-row">
              {editingId === p.id ? (
                <>
                  <div className="col-image">
                    <label htmlFor={`image-upload-${p.id}`} className="image-upload-label-edit">
                      <img 
                        src={imagePreview || getImageSrc(p.image_url)} 
                        alt={p.name}
                        className="product-image-edit"
                      />
                    </label>
                    <input 
                      id={`image-upload-${p.id}`}
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                  <div className="col-name">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div className="col-description">
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="col-price">
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    />
                  </div>
                  <div className="col-stock">
                    <input
                      type="number"
                      value={editForm.stock}
                      onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                    />
                  </div>
                  <div className="col-category">
                    <select
                      value={editForm.category_id}
                      onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}
                    >
                      <option value="">--</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-actions">
                    <button className="btn-save" onClick={() => handleUpdate(p.id)}>Guardar</button>
                    <button className="btn-cancel" onClick={cancelEdit}>Cancelar</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-image">
                    <img src={getImageSrc(p.image_url)} alt={p.name} />
                  </div>
                  <div className="col-name">{p.name}</div>
                  <div className="col-description">{p.description}</div>
                  <div className="col-price">${p.price}</div>
                  <div className="col-stock">{p.stock}</div>
                  <div className="col-category">{p.category_name || '-'}</div>
                  <div className="col-actions">
                    <button className="btn-icon" onClick={() => startEdit(p)} title="Actualizar">
                      <img src={updateIcon} alt="Actualizar" />
                    </button>
                    <button className="btn-icon" onClick={() => confirmDelete(p.id)} title="Eliminar">
                      <img src={deleteIcon} alt="Eliminar" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <div className="delete-modal-overlay" onClick={cancelDelete}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="delete-modal-title">Confirmar eliminación</h3>
            <p className="delete-modal-message">
              ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
            </p>
            <div className="delete-modal-actions">
              <button className="delete-modal-btn confirm" onClick={handleDelete}>
                Aceptar
              </button>
              <button className="delete-modal-btn cancel" onClick={cancelDelete}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}