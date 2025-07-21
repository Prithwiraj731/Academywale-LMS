import axios from 'axios';

const api = axios.create({
  baseURL: '/user', // Adjust if your API base path is different
});

// Request interceptor: attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle jwt expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.data &&
      error.response.data.msg &&
      error.response.data.msg.toLowerCase().includes('jwt expired') &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        const res = await axios.post('/user/refresh-token', { refreshToken });
        if (res.data && res.data.token) {
          localStorage.setItem('token', res.data.token);
          // Update Authorization header and retry original request
          originalRequest.headers['Authorization'] = `Bearer ${res.data.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

const API_URL = import.meta.env.VITE_API_URL;

export async function registerUser(data) {
  return fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

// NOTE: All user-related API calls should use relative paths (e.g., '/register', '/login', '/profile')
//       This will resolve to '/user/register', '/user/login', etc. due to the baseURL.

export default api; 