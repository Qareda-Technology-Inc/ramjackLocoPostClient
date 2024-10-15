import axios, { InternalAxiosRequestConfig } from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:7854/api', // Replace with your API URL
//   baseURL: "https://mpsserver.onrender.com/api",
});

// Add a request interceptor to include token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(new Error(error.message))
);

export default api;
