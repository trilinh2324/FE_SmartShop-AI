import axios from "axios";

// 🔥 Base URL backend
const instance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Tự động gắn token vào header
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

// ✅ Xử lý lỗi global (ví dụ token hết hạn)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 401 = hết hạn token
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/users/login";
      }
    }
    return Promise.reject(error);
  }
);

export default instance;