import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Auth.css';
import logo from '../assets/img/Group.svg';

export const Login = ({ onSwitch, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      if (data?.token) {
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('authUser', JSON.stringify(data.user));
        window.dispatchEvent(new Event('authChanged'));
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        
        // Llamar onSuccess si fue pasado (permite cerrar modal sin navegar)
        if (typeof onSuccess === 'function') {
          await onSuccess(data);
          return; // Importante: detener ejecución aquí
        }
        
        // Fallback: recarga para compatibilidad con comportamiento previo
        window.location.replace('/');
      } else {
        setError('Respuesta de login inválida');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          'Error al iniciar sesión. Por favor, verifica tus credenciales.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="auth-header">
          <h2>Iniciar sesión</h2>
          <img src={logo} alt="CatFecito" className="auth-logo" />
        </div>

        <label htmlFor="email">Correo electrónico</label>
        <input 
          type="email"
          id="email"
          placeholder="tu@email.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={loading}
        />

        <label htmlFor="password">Contraseña</label>
        <input 
          type="password"
          id="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          disabled={loading}
        />
        
        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        {onSwitch && (
          <p style={{ marginTop: '8px', fontSize: '14px', textAlign: 'center' }}>
            <button
              type="button"
              className="auth-link-btn"
              onClick={() => onSwitch('retrieve')}
              disabled={loading}
              style={{ 
                background: 'none',
                border: 'none',
                color: '#5b3b2b', 
                textDecoration: 'underline',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </p>
        )}

        <p>
          ¿No tenés cuenta? {
            onSwitch ? (
              <button 
                type="button" 
                className="auth-link-btn" 
                onClick={() => onSwitch('register')}
                disabled={loading}
              >
                Registrate
              </button>
            ) : (
              <Link to="/register">Registrate</Link>
            )
          }
        </p>
      </form>
    </main>
  );
};