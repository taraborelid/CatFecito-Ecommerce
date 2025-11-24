import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../pages/AdminProfile.css';

export const AdminNav = () => {
  return (
    <nav className="profile-nav-admin" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      <NavLink to="/admin/AdminProductsList" className={({isActive})=> isActive ? 'btn-primary-admin' : 'btn-secondary-admin'}>Productos</NavLink>
      <NavLink to="/admin/insert" className={({isActive})=> isActive ? 'btn-primary-admin' : 'btn-secondary-admin'}>Agregar producto</NavLink>
      <NavLink to="/admin/orders" className={({isActive})=> isActive ? 'btn-primary-admin' : 'btn-secondary-admin'}>
              Pedidos
            </NavLink>
    </nav>
  );
};

export default AdminNav;
