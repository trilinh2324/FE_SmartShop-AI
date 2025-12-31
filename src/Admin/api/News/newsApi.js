import axios from "axios";

const API = "http://localhost:8080/api/news";

export const getAllNews = () => axios.get(API);
export const getNewsById = (id) => axios.get(`${API}/${id}`);

export const createNews = (formData) =>
  axios.post(API, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateNews = (id, formData) =>
  axios.put(`${API}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteNews = (id) => axios.delete(`${API}/${id}`);
