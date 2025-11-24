import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './AdminInsert.css';
import addCategoryIcon from '../../assets/img/add-category-svgrepo-com (1).svg';

export default function AdminInsert() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category_id: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(Array.isArray(data?.categories) ? data.categories : data);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const onChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const onFile = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      await submit();
    }
  };

  const submit = async () => {
    setError(''); setSuccess('');
    if (!form.name || !form.description || !form.price || !form.category_id) {
      setError('Nombre, descripción, precio y categoría son requeridos');
      return;
    }
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => { if (v !== '') fd.append(k, v); });
      if (imageFile) fd.append('image', imageFile);
      const { data } = await api.post('/products', fd);
      setSuccess(data?.message || 'Producto creado');
      setForm({ name: '', description: '', price: '', stock: '', category_id: '' });
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al crear producto');
    }
  };

  return (
    <section className="admin-insert-section">
      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}
      
      <div className="insert-products-table">
        <div className="insert-table-header">
          <div className="col-image">Imagen</div>
          <div className="col-name">Nombre</div>
          <div className="col-description">Descripción</div>
          <div className="col-price">Precio</div>
          <div className="col-stock">Stock</div>
          <div className="col-category">Categoría</div>
        </div>
        
        <div className="insert-table-row">
          <div className="col-image">
            <label htmlFor="image-upload" className="image-upload-label-insert">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="insert-image-preview" />
              ) : (
                <div className="insert-image-placeholder">Sin imagen</div>
              )}
            </label>
            <input 
              id="image-upload"
              type="file" 
              accept="image/*" 
              onChange={onFile}
              style={{ display: 'none' }}
            />
          </div>
          
          <div className="col-name">
            <input 
              name="name" 
              value={form.name} 
              onChange={onChange}
              onKeyPress={handleKeyPress}
              placeholder="Nombre del producto"
              required 
            />
          </div>
          
          <div className="col-description">
            <textarea 
              name="description" 
              value={form.description} 
              onChange={onChange}
              placeholder="Descripción del producto"
              rows={3}
              required 
            />
          </div>
          
          <div className="col-price">
            <input 
              name="price" 
              type="number" 
              min="0" 
              step="0.01" 
              value={form.price} 
              onChange={onChange}
              onKeyPress={handleKeyPress}
              placeholder="0.00"
              required 
            />
          </div>
          
          <div className="col-stock">
            <input 
              name="stock" 
              type="number" 
              min="0" 
              step="1" 
              value={form.stock} 
              onChange={onChange}
              onKeyPress={handleKeyPress}
              placeholder="0"
            />
          </div>
          
          <div className="col-category">
            <select 
              name="category_id" 
              value={form.category_id} 
              onChange={onChange}
              required
            >
              <option value="">Selecciona</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className='col-insert-product'>
            <button className="btn-add-category" onClick={submit}>
              <img src={addCategoryIcon} alt="Agregar categoría" className="add-category-icon" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
