import React from "react";
import api from "../../services/api";
import "../CustomBarComponents/Header.css";
import group from "../../assets/img/Group.svg";
import user from "../../assets/img/user.svg";
import logout from "../../assets/img/logout.svg";
import { useNavigate } from "react-router-dom";

export const UserHeader = () => {

  const navigate = useNavigate();

  const handleNavigateToHome = () => {
    console.log('Navegando a home...');
    navigate('/');
    console.log('Navigate ejecutado');
  };

  const handleNavigateToProducts = () => {
    console.log('Navegando a products...');
    navigate('/products');
    console.log('Navigate ejecutado');
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch {
      // ignorar errores de logout
    } finally {
      sessionStorage.removeItem('authUser');
      navigate('/');
    }
  };


  return (
    <div className="header">
      <div className="left-group">
        <div className="logo-container" onClick={handleNavigateToHome}>
          <img src={group} alt="Catfecito logo" />
        </div>
        <button
          type="button"
          className="shop-button"
          onClick={handleNavigateToProducts}
          aria-label="Volver a la tienda"
        >
          Shop
        </button>
      </div>
      
      <div className="user-icons">
        <button
          type="button"
          className="profile-button"
          onClick={() => {
            const userStored = sessionStorage.getItem('authUser');
            if (!userStored) return navigate('/login');

            let role = undefined;
            try {
              const u = JSON.parse(userStored);
              role = u?.role;
            } catch {
              // ignore JSON parse errors
            }

            navigate(role === 'admin' ? '/admin' : '/profile');
          }}
        >
          <img className="user" src={user} alt="Usuario" />
        </button>
        {logout && (
          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            <img className="log-out" src={logout} alt="Cerrar sesión" />
          </button>
        )}
      </div>

      
    </div>
  );
};
