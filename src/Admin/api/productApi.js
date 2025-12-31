import axios from "axios";

const API_URL = "http://localhost:8080/api/products";

// ✅ CREATE PRODUCT (multipart/form-data)
export const createProduct = (formData) => {
  return axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

// ✏️ UPDATE PRODUCT (nếu cũng có ảnh)
export const updateProduct = (id, formData) => {
  return axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

// 🗑️ DELETE
export const deleteProduct = (id) =>
  axios.delete(`${API_URL}/${id}`);

// 📥 GET
export const getProducts = () =>
  axios.get(API_URL);

export const getAllProducts = () =>
  axios.get(API_URL);
