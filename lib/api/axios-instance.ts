import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'https://api.floruit.co.uk/';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    // Skip authorization header for login and other public endpoints
    const isPublicEndpoint = config.url?.includes('auth/login') || config.url?.includes('auth/register');
    
    if (!isPublicEndpoint) {
      const token = Cookies.get('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like 401 Unauthorized
    const isLoginRequest = error.config?.url?.includes('auth/login');
    
    if (error.response?.status === 401 && !isLoginRequest) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        Cookies.remove('auth_token');
        // Use replace to avoid back-button loops
        window.location.replace('/');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
