import axios from "axios";
import axios from "./utils/axiosConfig";

export const uploadImage = async (file) => {
const uploadImage = async (file) => {
  const fd = new FormData();
  fd.append("file", file);

  const res = await axios.post(
    "/api/uploads/products", 
    fd
  );

  return res.data;
};
}