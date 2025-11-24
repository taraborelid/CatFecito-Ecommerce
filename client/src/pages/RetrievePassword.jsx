import { useState } from 'react';
import api from '../services/api';
import '../styles/Auth.css';
import logo from '../assets/img/Group.svg';

export const RetrievePassword = ({ onSuccess, onBack }) => {
  const [step, setStep] = useState(1); // 1: email, 2: código+password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/request-password-reset', { email });
      setMessage(data.message);
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al solicitar código');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres');
    }

    setLoading(true);

    try {
      const { data } = await api.post('/auth/reset-password', { 
        code: code.toUpperCase(), 
        newPassword 
      });
      
      setMessage(data.message);
      
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al restablecer contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <form 
        className="auth-form" 
        onSubmit={step === 1 ? handleRequestCode : handleResetPassword}
      >
        <div className="auth-header">
          <h2>{step === 1 ? 'Recuperar contraseña' : 'Restablecer contraseña'}</h2>
          <img src={logo} alt="CatFecito" className="auth-logo" />
        </div>

        {message && <p className="auth-success">{message}</p>}
        {error && <p className="auth-error">{error}</p>}

        {step === 1 && (
          <>
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
            <button type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar código'}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label htmlFor="code">Código de recuperación</label>
            <input
              type="text"
              id="code"
              placeholder="ABC123"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
              maxLength={6}
              style={{ textTransform: 'uppercase', letterSpacing: '2px' }}
              disabled={loading}
            />

            <label htmlFor="newPassword">Nueva contraseña</label>
            <input
              type="password"
              id="newPassword"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              disabled={loading}
            />
            
            <button type="submit" disabled={loading}>
              {loading ? 'Procesando...' : 'Cambiar contraseña'}
            </button>
          </>
        )}

        {onBack && (
          <p style={{ marginTop: '12px' }}>
            <button 
              type="button" 
              className="auth-link-btn" 
              onClick={onBack}
              disabled={loading}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#5b3b2b', 
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Volver al login
            </button>
          </p>
        )}
      </form>
    </main>
  );
};