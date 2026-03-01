import { useState } from "react";
import { formatPrice, getDiscount } from "../api/data";

const CART_BASE = "http://localhost:8080/api/user/cart";

const TAG_COLORS = {
  HOT: { bg: "#ff4500", glow: "#ff450060" },
  NEW: { bg: "#0088ff", glow: "#0088ff60" },
  SALE: { bg: "#E8000D", glow: "#E8000D60" },
};

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgHover, setImgHover] = useState(false);
  const [loading, setLoading] = useState(false);

  const discount = getDiscount(product.price, product.oldPrice);
  const tag = TAG_COLORS[product.tag] || null;

  // ===============================
  // 🔥 THÊM VÀO GIỎ HÀNG
  // ===============================
  const handleAdd = async (e) => {
    e.stopPropagation();

    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {
      alert("Vui lòng đăng nhập!");
      return;
    }

    const productColorId = product?.colors?.[0]?.id;

    if (!productColorId) {
      alert("Sản phẩm chưa có màu!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${CART_BASE}/add?productColorId=${productColorId}&quantity=1`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          alert("Phiên đăng nhập đã hết hạn!");
        }
        throw new Error("Thêm giỏ thất bại");
      }

      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } catch (err) {
      console.error(err);
      alert("Thêm vào giỏ thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        ...s.card,
        border: hovered ? "1px solid #E8000D" : "1px solid #1e1e1e",
        background: hovered ? "#120808" : "#0F0F0F",
        transform: hovered ? "translateY(-7px) scale(1.015)" : "none",
        boxShadow: hovered
          ? "0 16px 45px rgba(232,0,13,0.28)"
          : "0 4px 20px rgba(0,0,0,0.5)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {tag && (
        <div
          style={{
            ...s.tag,
            background: tag.bg,
            boxShadow: `0 0 14px ${tag.glow}`,
          }}
        >
          {product.tag}
        </div>
      )}

      {discount > 0 && <div style={s.discount}>-{discount}%</div>}

      <div
        style={s.imgWrap}
        onMouseEnter={() => setImgHover(true)}
        onMouseLeave={() => setImgHover(false)}
      >
        <div
          style={{
            ...s.emoji,
            transform: imgHover
              ? "scale(1.2) translateY(-6px)"
              : "scale(1)",
          }}
        >
          <div style={s.imageContainer}>
            {product.colors?.[0]?.image ? (
              <img
                src={`http://localhost:8080${product.colors[0].image}`}
                alt={product.name}
                style={s.productImage}
              />
            ) : (
              <div style={s.noImg}>NO IMAGE</div>
            )}
          </div>
        </div>
      </div>

      <div style={s.info}>
        <div style={s.name}>{product.name}</div>
        <div style={s.specs}>{product.specs}</div>

        <div style={s.meta}>
          <span style={s.stars}>
            {"★".repeat(Math.floor(product.rating || 0))}
            <span style={{ color: "#f3ef01" }}>
              {"★".repeat(5 - Math.floor(product.rating || 0))}
            </span>
          </span>
          <span style={{ color: "#aea5a5" }}>
            Đã bán: {product.soldQuantity?.toLocaleString() || "0"}
          </span>
        </div>

        <div style={s.priceRow}>
          <span style={s.price}>
            {formatPrice(product.price)}
          </span>
          <span style={s.oldPrice}>
            {product.oldPrice
              ? formatPrice(product.oldPrice)
              : ""}
          </span>
        </div>

        <div style={s.btnRow}>
          <button
            style={{
              ...s.btnAdd,
              background: added ? "#1a6b00" : "#E8000D",
              opacity: loading ? 0.7 : 1,
            }}
            onClick={handleAdd}
            disabled={loading}
          >
            {loading
              ? "ĐANG THÊM..."
              : added
              ? "✓ ĐÃ THÊM"
              : "🛒 THÊM GIỎ"}
          </button>

          <button style={s.btnBuy}>
            MUA NGAY
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  card: {
    position: "relative",
    borderRadius: 6,
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  tag: {
    position: "absolute",
    top: 10,
    left: 10,
    fontSize: 9,
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: 2,
    color: "#fff",
  },
  discount: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "#161616",
    border: "1px solid #E8000D",
    color: "#E8000D",
    fontSize: 10,
    padding: "3px 8px",
    borderRadius: 2,
  },
  imgWrap: {
    height: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: "1px solid #1a1a1a",
  },
  emoji: {
    fontSize: 72,
    transition: "all 0.35s ease",
  },
  info: { padding: "16px" },
  name: { fontSize: 15, fontWeight: 700, color: "#F0F0F0" },
  specs: { fontSize: 11, color: "#666", marginBottom: 8 },
  meta: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  stars: { color: "#e6a800", fontSize: 13 },
  priceRow: {
    display: "flex",
    gap: 8,
    marginBottom: 14,
  },
  price: {
    fontSize: 17,
    fontWeight: 700,
    color: "#E8000D",
  },
  oldPrice: {
    fontSize: 12,
    color: "#e1d7d7",
    textDecoration: "line-through",
  },
  btnRow: { display: "flex", gap: 8 },
  btnAdd: {
    flex: 1,
    border: "none",
    color: "#fff",
    padding: "10px 0",
    borderRadius: 3,
    cursor: "pointer",
  },
  btnBuy: {
    background: "transparent",
    border: "1px solid #333",
    color: "#aaa",
    padding: "10px 14px",
    borderRadius: 3,
    cursor: "pointer",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  productImage: {
    maxWidth: "85%",
    maxHeight: "85%",
    objectFit: "contain",
  },
  noImg: {
    color: "#444",
    fontSize: 12,
  },
};