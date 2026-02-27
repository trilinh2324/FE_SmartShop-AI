import instance from "./utils/axiosConfig"; 

const API_URL = "/api/products";

// ✅ CREATE PRODUCT
export const createProduct = (formData) => {
  return instance.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✏️ UPDATE PRODUCT
export const updateProduct = (id, formData) => {
  return instance.put(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🗑️ DELETE
export const deleteProduct = (id) => {
  return instance.delete(`${API_URL}/${id}`);
};

// 📥 GET ALL
export const getProducts = () => {
  return instance.get(API_URL);
};