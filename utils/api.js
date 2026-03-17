/**
 * src/utils/api.js  ─  Drop-in Axios instance for Desi V Desi frontend
 *
 * 1. Replace your existing src/utils/api.js with this file.
 * 2. Add to your .env:
 *      VITE_API_BASE_URL=http://localhost:5000        (Vite)
 *      REACT_APP_API_BASE_URL=http://localhost:5000   (CRA)
 *
 * Route prefixes exactly match existing frontend calls:
 *   api.get('/maharashtra-domestic/getstates')
 *   api.get('/International-tours/getallInternational')
 *   api.get('/favourites/getCards')
 *   api.put('/favourites/:id/toggle')
 *   api.post('/bookings/create')
 *   api.get('/packages/type/adventure')
 */
import axios from 'axios';

const BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL  ||
  'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Bearer token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-handle 401 (token expired / invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redirect if needed: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
