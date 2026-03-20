import { useState } from "react";
import { formatPrice, getDiscount } from "../api/data";

const CART_BASE = "http://localhost:8080/api/user/cart";

const TAG_COLORS = {
  HOT:  { bg: "#ff4500", glow: "#ff450060" },
  NEW:  { bg: "#0088ff", glow: "#0088ff60" },
  SALE: { bg: "#E8000D", glow: "#E8000D60" },
};

function getAuthToken() {
  const keys = ["token", "accessToken", "access_token", "jwt", "authToken"];
  for (const key of keys) {
    const t = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (t) return t;
  }
  return null;
}

export default function ProductCard({ product, setActivePage }) {
  const [hovered,  setHovered]  = useState(false);
  const [added,    setAdded]    = useState(false);
  const [imgHover, setImgHover] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const discount = getDiscount(product.price, product.oldPrice);
  const tag      = TAG_COLORS[product.tag] || null;

  // ── Tổng tồn kho = tổng quantity của tất cả màu ──────────────
  const totalStock = product.colors?.reduce((sum, c) => sum + (c.quantity || 0), 0) || 0;
  const isOutOfStock = totalStock === 0;

  const goDetail = () => {
    if (typeof setActivePage === "function") {
      setActivePage(`detail-${product.id}`);
    }
  };

  // ── Thêm vào giỏ hàng ────────────────────────────────────────
  const handleAdd = async (e) => {
    e.stopPropagation();

    if (isOutOfStock) {
      alert("Sản phẩm đã hết hàng!");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      return;
    }

    const productColorId = product?.colors?.[0]?.id;
    if (!productColorId) {
      alert("Sản phẩm chưa có màu sắc!");
      return;
    }

    try {
      setLoading(true);
      const url = `${CART_BASE}/add?productColorId=${productColorId}&quantity=1`;
      const res = await fetch(url, {
        method:  "POST",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (res.status === 401) {
        ["token","accessToken","access_token","jwt","authToken"].forEach(k => {
          localStorage.removeItem(k);
          sessionStorage.removeItem(k);
        });
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        window.location.href = "/users/login";
        return;
      }

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Lỗi HTTP ${res.status}`);
      }

      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } catch (err) {
      console.error("[Cart] Lỗi:", err);
      alert("Thêm vào giỏ thất bại: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        ...s.card,
        border:     isOutOfStock
          ? "1px solid #2a2a2a"
          : hovered ? "1px solid #E8000D" : "1px solid #1e1e1e",
        background: hovered ? "#120808" : "#0F0F0F",
        transform:  hovered ? "translateY(-7px) scale(1.015)" : "none",
        boxShadow:  hovered
          ? "0 16px 45px rgba(232,0,13,0.28)"
          : "0 4px 20px rgba(0,0,0,0.5)",
        opacity: isOutOfStock ? 0.75 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tag HOT / NEW / SALE */}
      {tag && !isOutOfStock && (
        <div style={{ ...s.tag, background: tag.bg, boxShadow: `0 0 14px ${tag.glow}` }}>
          {product.tag}
        </div>
      )}

      {/* Hết hàng badge */}
      {isOutOfStock && (
        <div style={s.outOfStock}>HẾT HÀNG</div>
      )}

      {/* Discount badge */}
      {discount > 0 && !isOutOfStock && (
        <div style={s.discount}>-{discount}%</div>
      )}

      {/* Ảnh sản phẩm */}
      <div
        style={s.imgWrap}
        onMouseEnter={() => setImgHover(true)}
        onMouseLeave={() => setImgHover(false)}
      >
        <div style={{ ...s.emoji, transform: imgHover ? "scale(1.2) translateY(-6px)" : "scale(1)" }}>
          <div onClick={goDetail} style={s.imageContainer}>
            {product.colors?.[0]?.image ? (
              <img
                src={`http://localhost:8080${product.colors[0].image}`}
                alt={product.name}
                style={{ ...s.productImage, filter: isOutOfStock ? "grayscale(60%)" : "none" }}
              />
            ) : (
              <div style={s.noImg}>NO IMAGE</div>
            )}
          </div>
        </div>
      </div>

      <div style={s.info}>
        {/* Tên sản phẩm */}
        <div onClick={goDetail} style={{ ...s.name, cursor: "pointer" }}>
          {product.name}
        </div>
        <div style={s.specs}>{product.specs}</div>

        {/* Rating + Đã bán */}
        <div style={s.meta}>
          <span style={s.stars}>
            {"★".repeat(Math.floor(product.rating || 0))}
            <span style={{ color: "#333" }}>
              {"★".repeat(5 - Math.floor(product.rating || 0))}
            </span>
          </span>
          <span style={{ color: "#888", fontSize: 11, fontFamily: "'Rajdhani',sans-serif" }}>
            🔥 Đã bán:{" "}
            <span style={{ color: "#E8000D", fontWeight: 700 }}>
              {(product.soldQuantity || 0).toLocaleString("vi-VN")}
            </span>
          </span>
        </div>

        {/* Tồn kho */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          marginBottom: 10,
        }}>
          <div style={{
            flex: 1, height: 3, borderRadius: 2,
            background: "#1a1a1a", overflow: "hidden",
          }}>
            {!isOutOfStock && (
              <div style={{
                height: "100%",
                width: `${Math.min(100, (totalStock / 100) * 100)}%`,
                background: totalStock <= 5
                  ? "#E8000D"
                  : totalStock <= 20
                  ? "#f59e0b"
                  : "#22c55e",
                borderRadius: 2,
                transition: "width 0.3s ease",
              }} />
            )}
          </div>
          <span style={{
            fontSize: 10, fontFamily: "'Rajdhani',sans-serif", fontWeight: 600,
            color: isOutOfStock
              ? "#E8000D"
              : totalStock <= 5
              ? "#f59e0b"
              : "#555",
            whiteSpace: "nowrap",
          }}>
            {isOutOfStock
              ? "Hết hàng"
              : totalStock <= 5
              ? `Còn ${totalStock} cái`
              : `Còn ${totalStock}`}
          </span>
        </div>

        {/* Giá */}
        <div style={s.priceRow}>
          <span style={s.price}>{formatPrice(product.price)}</span>
          <span style={s.oldPrice}>
            {product.oldPrice ? formatPrice(product.oldPrice) : ""}
          </span>
        </div>

        {/* Buttons */}
        <div style={s.btnRow}>
          <button
            style={{
              ...s.btnAdd,
              background: isOutOfStock
                ? "#2a2a2a"
                : added
                ? "#1a6b00"
                : loading
                ? "#8B0000"
                : "#E8000D",
              cursor: isOutOfStock ? "not-allowed" : "pointer",
              opacity: loading ? 0.8 : 1,
            }}
            onClick={handleAdd}
            disabled={loading || isOutOfStock}
          >
            {isOutOfStock
              ? "HẾT HÀNG"
              : loading
              ? "ĐANG THÊM..."
              : added
              ? "✓ ĐÃ THÊM"
              : "🛒 THÊM GIỎ"}
          </button>

          <button style={s.btnBuy} onClick={goDetail}>
            XEM CHI TIẾT
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  card: {
    position:     "relative",
    borderRadius: 6,
    overflow:     "hidden",
    cursor:       "pointer",
    transition:   "all 0.3s ease",
  },
  tag: {
    position:     "absolute",
    top:          10,
    left:         10,
    fontSize:     9,
    fontWeight:   700,
    padding:      "4px 10px",
    borderRadius: 2,
    color:        "#fff",
    zIndex:       2,
  },
  outOfStock: {
    position:       "absolute",
    top:            10,
    left:           10,
    background:     "#1a1a1a",
    border:         "1px solid #333",
    color:          "#555",
    fontSize:       9,
    fontWeight:     700,
    padding:        "4px 10px",
    borderRadius:   2,
    letterSpacing:  1,
    zIndex:         2,
  },
  discount: {
    position:     "absolute",
    top:          10,
    right:        10,
    background:   "#161616",
    border:       "1px solid #E8000D",
    color:        "#E8000D",
    fontSize:     10,
    padding:      "3px 8px",
    borderRadius: 2,
    zIndex:       2,
  },
  imgWrap: {
    height:         200,
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    borderBottom:   "1px solid #1a1a1a",
  },
  emoji:  { fontSize: 72, transition: "all 0.35s ease" },
  info:   { padding: "16px" },
  name:   { fontSize: 15, fontWeight: 700, color: "#F0F0F0", marginBottom: 4 },
  specs:  { fontSize: 11, color: "#666", marginBottom: 8 },
  meta: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    marginBottom:   8,
  },
  stars:    { color: "#e6a800", fontSize: 13 },
  priceRow: { display: "flex", gap: 8, alignItems: "center", marginBottom: 14 },
  price:    { fontSize: 17, fontWeight: 700, color: "#E8000D" },
  oldPrice: { fontSize: 12, color: "#e1d7d7", textDecoration: "line-through" },
  btnRow:   { display: "flex", gap: 8 },
  btnAdd: {
    flex:          1,
    border:        "none",
    color:         "#fff",
    padding:       "10px 0",
    borderRadius:  3,
    fontSize:      12,
    fontWeight:    700,
    letterSpacing: 0.5,
    transition:    "all 0.2s ease",
  },
  btnBuy: {
    background:   "transparent",
    border:       "1px solid #333",
    color:        "#aaa",
    padding:      "10px 14px",
    borderRadius: 3,
    cursor:       "pointer",
    fontSize:     12,
  },
  imageContainer: {
    width:          "100%",
    height:         "100%",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    cursor:         "pointer",
  },
  productImage: {
    maxWidth:   "85%",
    maxHeight:  "85%",
    objectFit:  "contain",
    transition: "filter 0.3s",
  },
  noImg: { color: "#444", fontSize: 12 },
};
