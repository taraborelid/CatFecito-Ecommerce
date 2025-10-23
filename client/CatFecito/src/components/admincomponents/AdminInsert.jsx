import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AdminProfile.css';

const API_BASE = (import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '')}/api` : '/api');

const authHeaders = () => {
  const token = sessionStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function AdminInsert() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category_id: '' });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/categories`);
        setCategories(Array.isArray(data?.categories) ? data.categories : data);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const onChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const onFile = (e) => setImageFile(e.target.files?.[0] || null);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.name || !form.description || !form.price || !form.category_id) {
      setError('Nombre, descripción, precio y categoría son requeridos');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => { if (v !== '') fd.append(k, v); });
      if (imageFile) fd.append('image', imageFile);
      const { data } = await axios.post(`${API_BASE}/products`, fd, { headers: { ...authHeaders() } });
      setSuccess(data?.message || 'Producto creado');
      setForm({ name: '', description: '', price: '', stock: '', category_id: '' });
      setImageFile(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al crear producto');
    } finally { setLoading(false); }
  };

  return (
    <section className="profile-card-admin">
      <h3>Agregar producto</h3>
      {error && <div className="profile-error">{error}</div>}
      {success && <div className="profile-success">{success}</div>}
      <form onSubmit={submit} className="iud-products-admin">
        <label>Nombre</label>
        <input name="name" value={form.name} onChange={onChange} required />

        <label>Descripción</label>
        <textarea name="description" value={form.description} onChange={onChange} rows={4} required />

        <label>Precio</label>
        <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={onChange} required />

        <label>Stock</label>
        <input name="stock" type="number" min="0" step="1" value={form.stock} onChange={onChange} />

        <label>Categoría</label>
        <select name="category_id" value={form.category_id} onChange={onChange} required>
          <option value="">Selecciona</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <label>Imagen</label>
        <input type="file" accept="image/*" onChange={onFile} />

        <button className="btn-primary-admin" disabled={loading}>{loading ? 'Creando...' : 'Crear'}</button>
      </form>
    </section>
  );
}
