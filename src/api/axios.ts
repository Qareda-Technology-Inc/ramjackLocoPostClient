import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://192.168.0.100:2025/api',
  baseURL: "https://rjlserver.onrender.com/api",
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
