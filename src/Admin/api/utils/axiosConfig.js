// src/api/utils/axiosConfig.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080",
});

// ✅ This interceptor attaches the token to every request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;