import { useState } from "react";
import { formatPrice, getDiscount } from "../api/data";

const TAG_COLORS = {
  HOT:    { bg: "#ff4500", glow: "#ff450060" },
  NEW:    { bg: "#0088ff", glow: "#0088ff60" },
  SALE:   { bg: "#E8000D", glow: "#E8000D60" },
  GAMING: { bg: "#9b00ff", glow: "#9b00ff60" },
};

export default function ProductCard({ product, onAddCart }) {
  const [hovered,   setHovered]   = useState(false);
  const [added,     setAdded]     = useState(false);
  const [imgHover,  setImgHover]  = useState(false);

  const discount = getDiscount(product.price, product.oldPrice);
  const tag      = TAG_COLORS[product.tag] || null;

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      style={{
        ...s.card,
        border:     hovered ? "1px solid #E8000D" : "1px solid #1e1e1e",
        background: hovered ? "#120808" : "#0F0F0F",
        transform:  hovered ? "translateY(-7px) scale(1.015)" : "none",
        boxShadow:  hovered
          ? "0 16px 45px rgba(232,0,13,0.28), 0 0 0 1px rgba(232,0,13,0.15)"
          : "0 4px 20px rgba(0,0,0,0.5)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* TAG */}
      {tag && (
        <div style={{ ...s.tag, background: tag.bg, boxShadow: `0 0 14px ${tag.glow}` }}>
          {product.tag}
        </div>
      )}

      {/* Discount badge */}
      {discount > 0 && (
        <div style={s.discount}>-{discount}%</div>
      )}

      {/* Image area */}
      <div
        style={{ ...s.imgWrap, background: hovered ? "#1a0a0a" : "#141414" }}
        onMouseEnter={() => setImgHover(true)}
        onMouseLeave={() => setImgHover(false)}
      >
        <div style={{
          ...s.emoji,
          transform: imgHover ? "scale(1.2) translateY(-6px)" : "scale(1)",
          filter: imgHover
            ? "drop-shadow(0 8px 20px rgba(232,0,13,0.5))"
            : "drop-shadow(0 4px 10px rgba(0,0,0,0.6))",
        }}>
          {product.image}
        </div>
      </div>

      {/* Info */}
      <div style={s.info}>
        <div style={s.name}>{product.name}</div>
        <div style={s.specs}>{product.specs}</div>

        {/* Stars + sold */}
        <div style={s.meta}>
          <span style={s.stars}>
            {"★".repeat(Math.floor(product.rating))}
            <span style={{ color: "#444" }}>{"★".repeat(5 - Math.floor(product.rating))}</span>
          </span>
          <span style={s.sold}>Đã bán: {product.sold.toLocaleString()}</span>
        </div>

        {/* Prices */}
        <div style={s.priceRow}>
          <span style={s.price}>{formatPrice(product.price)}</span>
          <span style={s.oldPrice}>{formatPrice(product.oldPrice)}</span>
        </div>

        {/* Buttons */}
        <div style={s.btnRow}>
          <button
            style={{
              ...s.btnAdd,
              background: added ? "#1a6b00" : "#E8000D",
              boxShadow:  added
                ? "0 4px 18px rgba(26,107,0,0.5)"
                : "0 4px 18px rgba(232,0,13,0.4)",
            }}
            onClick={handleAdd}
          >
            {added ? "✓ ĐÃ THÊM" : "🛒 THÊM GIỎ"}
          </button>
          <button style={s.btnBuy}>MUA NGAY</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  card: {
    position:   "relative",
    borderRadius: 6,
    overflow:   "hidden",
    cursor:     "pointer",
    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    animation:  "fadeInUp 0.5s ease both",
  },
  tag: {
    position:   "absolute",
    top: 10, left: 10,
    zIndex: 3,
    fontSize:   9,
    fontWeight: 700,
    fontFamily: "'Orbitron', monospace",
    letterSpacing: 1.5,
    padding:    "4px 10px",
    borderRadius: 2,
    color: "#fff",
  },
  discount: {
    position:   "absolute",
    top: 10, right: 10,
    zIndex: 3,
    background: "#161616",
    border:     "1px solid #E8000D",
    color:      "#E8000D",
    fontSize:   10,
    fontWeight: 700,
    fontFamily: "'Orbitron', monospace",
    padding:    "3px 8px",
    borderRadius: 2,
  },
  imgWrap: {
    height:         200,
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    transition:     "background 0.3s",
    borderBottom:   "1px solid #1a1a1a",
  },
  emoji: {
    fontSize:   72,
    transition: "all 0.35s ease",
    userSelect: "none",
  },
  info:  { padding: "16px 16px 18px" },
  name:  {
    fontFamily:  "'Rajdhani', sans-serif",
    fontSize:    15,
    fontWeight:  700,
    color:       "#F0F0F0",
    lineHeight:  1.3,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  specs: {
    fontSize:    11,
    color:       "#666",
    fontFamily:  "'Orbitron', monospace",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  meta: {
    display:      "flex",
    alignItems:   "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  stars: {
    color:     "#e6a800",
    fontSize:  13,
    letterSpacing: -1,
  },
  sold: {
    fontSize:  10,
    color:     "#555",
    fontFamily: "'Orbitron', monospace",
  },
  priceRow: {
    display:     "flex",
    alignItems:  "baseline",
    gap:         8,
    marginBottom: 14,
  },
  price: {
    fontFamily:  "'Orbitron', monospace",
    fontSize:    17,
    fontWeight:  700,
    color:       "#E8000D",
    letterSpacing: 0.5,
  },
  oldPrice: {
    fontSize:        12,
    color:           "#444",
    textDecoration:  "line-through",
    fontFamily:      "'Rajdhani', sans-serif",
  },
  btnRow: {
    display: "flex",
    gap:     8,
  },
  btnAdd: {
    flex:        1,
    border:      "none",
    color:       "#fff",
    fontFamily:  "'Orbitron', monospace",
    fontSize:    10,
    fontWeight:  700,
    letterSpacing: 0.8,
    padding:     "10px 0",
    borderRadius: 3,
    cursor:      "pointer",
    transition:  "all 0.3s",
  },
  btnBuy: {
    background:  "transparent",
    border:      "1px solid #333",
    color:       "#aaa",
    fontFamily:  "'Orbitron', monospace",
    fontSize:    9,
    fontWeight:  700,
    letterSpacing: 0.8,
    padding:     "10px 14px",
    borderRadius: 3,
    cursor:      "pointer",
    transition:  "all 0.2s",
    whiteSpace:  "nowrap",
  },
};
