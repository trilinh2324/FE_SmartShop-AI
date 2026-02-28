import { useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductSection({ title, icon, products, onAddCart }) {
  const [filter, setFilter] = useState("all");
  const [sort,   setSort]   = useState("default");

  const tags = ["all", "HOT", "NEW", "SALE"];

  const filtered = products
    .filter((p) => filter === "all" || p.tag === filter)
    .sort((a, b) => {
      if (sort === "priceAsc")  return a.price - b.price;
      if (sort === "priceDesc") return b.price - a.price;
      if (sort === "rating")    return b.rating - a.rating;
      if (sort === "sold")      return b.sold - a.sold;
      return 0;
    });

  return (
    <section style={s.section}>
      {/* Section Header */}
      <div style={s.header}>
        <div style={s.titleRow}>
          <span style={s.icon}>{icon}</span>
          <div>
            <h2 style={s.title}>{title}</h2>
            <div style={s.titleLine} />
          </div>
          <div style={s.count}>{products.length} sản phẩm</div>
        </div>

        {/* Filters */}
        <div style={s.controls}>
          {/* Tag filter */}
          <div style={s.filterGroup}>
            {tags.map((t) => (
              <button
                key={t}
                style={{
                  ...s.filterBtn,
                  background:  filter === t ? "#E8000D" : "transparent",
                  color:       filter === t ? "#fff"    : "#666",
                  border:      filter === t ? "1px solid #E8000D" : "1px solid #222",
                  boxShadow:   filter === t ? "0 0 14px rgba(232,0,13,0.3)" : "none",
                }}
                onClick={() => setFilter(t)}
              >
                {t === "all" ? "TẤT CẢ" : t}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            style={s.select}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">Mặc định</option>
            <option value="priceAsc">Giá thấp → cao</option>
            <option value="priceDesc">Giá cao → thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
            <option value="sold">Bán chạy nhất</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: 48 }}>🔍</div>
          <div style={{ color: "#444", fontFamily: "'Orbitron',monospace", fontSize: 12, marginTop: 12 }}>
            KHÔNG TÌM THẤY SẢN PHẨM
          </div>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map((product, i) => (
            <div key={product.id} style={{ animationDelay: `${i * 0.07}s` }}>
              <ProductCard product={product} onAddCart={onAddCart} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const s = {
  section: {
    maxWidth: 1400,
    margin:   "0 auto",
    padding:  "50px 24px 0",
  },
  header: {
    marginBottom: 28,
  },
  titleRow: {
    display:     "flex",
    alignItems:  "center",
    gap:         14,
    marginBottom: 18,
    flexWrap:    "wrap",
  },
  icon: { fontSize: 32, filter: "drop-shadow(0 0 8px rgba(232,0,13,0.5))" },
  title: {
    fontFamily:    "'Bebas Neue', cursive",
    fontSize:      36,
    letterSpacing: 3,
    color:         "#F0F0F0",
    lineHeight:    1,
    textShadow:    "0 0 20px rgba(232,0,13,0.15)",
  },
  titleLine: {
    width:        60,
    height:       2,
    background:   "linear-gradient(90deg, #E8000D, transparent)",
    marginTop:    4,
    borderRadius: 1,
  },
  count: {
    marginLeft:    "auto",
    fontFamily:    "'Orbitron', monospace",
    fontSize:      10,
    color:         "#444",
    letterSpacing: 1,
    padding:       "5px 14px",
    border:        "1px solid #1e1e1e",
    borderRadius:  2,
  },
  controls: {
    display:     "flex",
    alignItems:  "center",
    justifyContent: "space-between",
    flexWrap:    "wrap",
    gap:         12,
  },
  filterGroup: {
    display: "flex",
    gap:     8,
    flexWrap: "wrap",
  },
  filterBtn: {
    fontFamily:    "'Orbitron', monospace",
    fontSize:      9,
    fontWeight:    700,
    letterSpacing: 1.5,
    padding:       "7px 18px",
    borderRadius:  3,
    cursor:        "pointer",
    transition:    "all 0.2s",
  },
  select: {
    background:    "#111",
    border:        "1px solid #222",
    color:         "#888",
    fontFamily:    "'Rajdhani', sans-serif",
    fontSize:      13,
    fontWeight:    600,
    padding:       "7px 14px",
    borderRadius:  3,
    cursor:        "pointer",
    outline:       "none",
    letterSpacing: 0.5,
  },
  grid: {
    display:               "grid",
    gridTemplateColumns:   "repeat(auto-fill, minmax(240px, 1fr))",
    gap:                   20,
  },
  empty: {
    textAlign:  "center",
    padding:    "80px 0",
    color:      "#333",
  },
};
