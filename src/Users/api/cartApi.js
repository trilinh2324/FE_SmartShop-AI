const CART_BASE = "http://localhost:8080/api/user/cart";

const getAuthHeader = () => {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (!token) {
    throw new Error("Chưa đăng nhập");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// =======================
// API FUNCTIONS
// =======================

export const fetchCart = async () => {
  const res = await fetch(CART_BASE, {
    headers: getAuthHeader(),
  });

  if (!res.ok) throw new Error("Lỗi lấy giỏ hàng");
  return await res.json();
};

export const updateCartApi = async (cartId, quantity) => {
  const res = await fetch(
    `${CART_BASE}/${cartId}?quantity=${quantity}`,
    {
      method: "PUT",
      headers: getAuthHeader(),
    }
  );

  if (!res.ok) throw new Error("Lỗi cập nhật");
  return await res.json();
};

export const deleteCartApi = async (cartId) => {
  const res = await fetch(`${CART_BASE}/${cartId}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  if (!res.ok) throw new Error("Lỗi xoá giỏ hàng");
};

// ❌ KHÔNG được có export default ở cuối file

// =======================
// FORMAT PRICE
// =======================
export const formatPrice1 = (price) => {
  if (!price || isNaN(price)) return "0 ₫";
  return new Intl.NumberFormat("vi-VN").format(Number(price)) + " ₫";
};