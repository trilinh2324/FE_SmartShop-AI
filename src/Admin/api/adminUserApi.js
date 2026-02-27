import axios from "axios";

const ADMIN_API = "http://localhost:8080/api/admin";

/* ======================
   GET ALL USERS
====================== */
export const getAllUsers = async () => {
  const res = await axios.get(ADMIN_API);
  return Array.isArray(res.data) ? res.data : [];
};

/* ======================
   CREATE USER
====================== */
export const createUser = async (user) => {
  return axios.post(ADMIN_API, {
    username: user.username,
    password: user.password,
    email: user.email,
    role: user.role || "USER",
  });
};

/* ======================
   UPDATE USER
====================== */
export const updateUser = async (id, user) => {
  return axios.put(`${ADMIN_API}/${id}`, {
    email: user.email,
    phone_number: user.phone_number,
    gender: user.gender,
    address: user.address,
    role: user.role,
  });
};

/* ======================
   BLOCK USER
====================== */
export const blockUser = async (id) => {
  return axios.put(`${ADMIN_API}/${id}/block`);
};

/* ======================
   UNBLOCK USER
====================== */
export const unblockUser = async (id) => {
  return axios.put(`${ADMIN_API}/${id}/unblock`);
};

/* ======================
   DELETE USER
====================== */
export const deleteUser = async (id) => {
  return axios.delete(`${ADMIN_API}/${id}`);
};
