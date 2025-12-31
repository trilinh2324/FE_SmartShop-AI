import axios from "axios";

const CATEGORY_API = "http://localhost:8080/api/categories";

export const getAllCategories = async () => {
  const res = await axios.get(CATEGORY_API);
  // 👉 đảm bảo luôn trả về mảng
  return Array.isArray(res.data) ? res.data : res.data.data;
};
