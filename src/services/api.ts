// src/services/api.ts
import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const BASE_URL = configuredApiUrl || (import.meta.env.DEV ? 'http://localhost:3001' : '');

if (!BASE_URL) {
  throw new Error('VITE_API_URL debe configurarse para ejecutar el frontend en producción.');
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor: adjunta el token JWT a cada petición
apiClient.interceptors.request.use((config) => {
  // Leemos el store directamente (sin hook, para poder usarlo fuera de componentes)
  const authData = localStorage.getItem('auth-storage');
  if (authData) {
    try {
      const parsed = JSON.parse(authData);
      const token = parsed?.state?.user?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Si el JSON es inválido, lo ignoramos y la petición sigue sin token
    }
  }
  return config;
});

// Interceptor: manejo global de errores de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido: limpiamos la sesión
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
