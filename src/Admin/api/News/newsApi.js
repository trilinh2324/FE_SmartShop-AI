// ❌ KHÔNG import axios thường nữa
// import axios from "axios";

import instance from "../utils/axiosConfig"; // ✅ dùng instance có token

const API = "/api/news";

// GET ALL
export const getAllNews = () => instance.get(API);

// GET BY ID
export const getNewsById = (id) => instance.get(`${API}/${id}`);

// CREATE
export const createNews = (formData) =>
  instance.post(API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// UPDATE
export const updateNews = (id, formData) =>
  instance.put(`${API}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// DELETE
export const deleteNews = (id) =>
  instance.delete(`${API}/${id}`);