import axios from 'axios';

// Obtener la URL base del backend desde variables de entorno
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL 
  ? import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '') 
  : '';

// Crear instancia de axios con configuración predeterminada
const api = axios.create({
  baseURL: BACKEND_URL ? `${BACKEND_URL}/api` : '/api',
  timeout: 10000, // 10 segundos timeout
  withCredentials: true
});

// Interceptor para agregar token de autenticación a todas las peticiones
api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else if (config.data && typeof config.data === 'object') {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta (UN SOLO INTERCEPTOR)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Solo redirigir a login si:
    // 1. Es error 401
    // 2. NO es un intento de login/register/retrieve
    // 3. NO estamos ya en la página de login
    const authEndpoints = ['/auth/login', '/auth/register', '/auth/retrieve', '/auth/reset-password'];
    const isAuthRequest = authEndpoints.some(endpoint => originalRequest?.url?.includes(endpoint));
    const isLoginPage = window.location.pathname === '/login';
    
    if (error.response?.status === 401 && !isAuthRequest && !isLoginPage) {
      // Token expirado o inválido: limpiar sesión y redirigir
      sessionStorage.removeItem('authUser');
      
      window.dispatchEvent(new Event('authChanged'));
      
      // Redirigir solo si no estamos procesando autenticación
      window.location.replace('/login');
    }
    
    return Promise.reject(error);
  }
);

export default api;
