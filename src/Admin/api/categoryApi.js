import axios from "./utils/axiosConfig"; // ✅ chỉ dùng axiosConfig

export const getAllCategories = async () => {
  const res = await axios.get("/api/categories");
  return Array.isArray(res.data) ? res.data : res.data.data;
};