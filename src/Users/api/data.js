const BASE_URL = "http://localhost:8080/api/user/products";

export const formatPrice = (price) => {
  const value = Number(price);
  if (!value || isNaN(value)) return "0đ";
  return value.toLocaleString("vi-VN") + "đ";
};

export const formatPrice1 = (price) => {
  const value = Number(price);
  if (!value || isNaN(value)) return "0đ";
  return value.toLocaleString("vi-VN") + "đ";
};
export const getDiscount = (price, oldPrice) => {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
};

const CATEGORY_MAP = {
  phone: "Điện Thoại",
  ipad: "Ipad",
  laptop: "Laptop",
};

export const fetchAllProducts = async () => {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Lỗi server");
    return await res.json();
  } catch (err) {
    console.error("fetchAllProducts:", err);
    return [];
  }
};

export const fetchProductsByCategory = async (categoryKey) => {
  try {
    const dbName = CATEGORY_MAP[categoryKey] ?? categoryKey;

    const url = `${BASE_URL}/category/${encodeURIComponent(dbName)}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Lỗi server");

    return await res.json();
  } catch (err) {
    console.error("fetchProductsByCategory:", err);
    return [];
  }
};

export const fetchProductById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Không tìm thấy");
    return await res.json();
  } catch (err) {
    console.error("fetchProductById:", err);
    return null;
  }
};



export const news = [
  { id:1, title:"iPhone 17 Series: Rò rỉ thiết kế hoàn toàn mới với camera AI siêu khủng",       date:"28/02/2026", cat:"TIN TỨC",   emoji:"📱", summary:"Apple chuẩn bị ra mắt iPhone 17 với thiết kế đột phá, tích hợp AI camera thế hệ mới nhất..." },
  { id:2, title:"Samsung Galaxy S26 Ultra: Snapdragon 8 Elite Gen 2 mạnh nhất từ trước đến nay",  date:"27/02/2026", cat:"CÔNG NGHỆ", emoji:"📱", summary:"Samsung xác nhận Galaxy S26 Ultra dùng Snapdragon 8 Elite Gen 2, hiệu năng tăng 40%..." },
  { id:3, title:"MacBook Pro M5: Hiệu năng tăng gấp 3 lần thế hệ trước",                          date:"26/02/2026", cat:"LAPTOP",    emoji:"💻", summary:"Chip M5 của Apple hứa hẹn cách mạng hóa hiệu năng AI, tốc độ GPU tăng đáng kinh ngạc..." },
  { id:4, title:"iPad Pro 2026 tích hợp màn hình gập - Cuộc cách mạng của tablet",                date:"25/02/2026", cat:"IPAD",      emoji:"📟", summary:"Apple lần đầu thử nghiệm iPad Pro màn hình gập OLED, dự kiến ra mắt cuối năm 2026..." },
];
