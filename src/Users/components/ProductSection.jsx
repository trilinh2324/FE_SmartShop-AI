import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { fetchProductsByCategory, fetchAllProducts } from "../api/data";

// ✅ SỬA: thêm setActivePage vào props
export default function ProductSection({ title, icon, category, products, onAddCart, setActivePage }) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter,  setFilter]  = useState("all");
  const [sort,    setSort]    = useState("default");

  useEffect(() => {
    if (products && products.length > 0) {
      setItems(products);
      return;
    }
    if (category) {
      setLoading(true);
      const apiFn = category === "all"
        ? fetchAllProducts
        : () => fetchProductsByCategory(category); // truyền key FE: "phone"|"ipad"|"laptop"
      apiFn()
        .then(setItems)   // backend đã lọc đúng rồi, KHÔNG filter thêm
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [category, products]);

  const tags = ["all", "HOT", "NEW", "SALE"];

  const list = items
    .filter((p) => filter === "all" || p.tag === filter)
    .sort((a, b) => {
      if (sort === "priceAsc")  return (a.price || 0) - (b.price || 0);
      if (sort === "priceDesc") return (b.price || 0) - (a.price || 0);
      if (sort === "rating")    return (b.rating || 0) - (a.rating || 0);
      if (sort === "sold")      return (b.sold || 0) - (a.sold || 0);
      return 0;
    });

  return (
    <section style={s.section}>
      <div style={s.headerWrap}>
        <div style={s.titleRow}>
          <span style={s.icon}>{icon}</span>
          <div>
            <h2 style={s.title}>{title}</h2>
            <div style={s.titleLine} />
          </div>
          <span style={s.count}>{items.length} sản phẩm</span>
        </div>
        <div style={s.controls}>
          <div style={s.filterRow}>
            {tags.map((t) => (
              <button key={t} onClick={() => setFilter(t)} style={{
                ...s.filterBtn,
                background: filter === t ? "#E8000D" : "transparent",
                color:      filter === t ? "#fff"    : "#555",
                border:     filter === t ? "1px solid #E8000D" : "1px solid #1e1e1e",
                boxShadow:  filter === t ? "0 0 12px rgba(232,0,13,0.3)" : "none",
              }}>
                {t === "all" ? "TẤT CẢ" : t}
              </button>
            ))}
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={s.select}>
            <option value="default">Mặc định</option>
            <option value="priceAsc">Giá thấp → cao</option>
            <option value="priceDesc">Giá cao → thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
            <option value="sold">Bán chạy nhất</option>
          </select>
        </div>
      </div>

      {loading && (
        <div style={s.loading}>
          <div style={s.spinner} />
          <span style={{ fontFamily:"'Orbitron',monospace", fontSize:11, color:"#444", letterSpacing:2 }}>ĐANG TẢI...</span>
        </div>
      )}

      {!loading && list.length === 0 && (
        <div style={s.empty}>
          <div style={{ fontSize:48 }}>🔍</div>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:12, color:"#333", marginTop:12, letterSpacing:2 }}>
            KHÔNG TÌM THẤY SẢN PHẨM
          </div>
        </div>
      )}

      {!loading && list.length > 0 && (
        <div style={s.grid}>
          {list.map((product, i) => (
            <div key={product.id} style={{ animationDelay:`${i*0.06}s` }}>
              {/* ✅ SỬA: truyền setActivePage xuống ProductCard */}
              <ProductCard
                product={product}
                onAddCart={onAddCart}
                setActivePage={setActivePage}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const s = {
  section:    { maxWidth:1400, margin:"0 auto", padding:"48px 24px 0" },
  headerWrap: { marginBottom:24 },
  titleRow:   { display:"flex", alignItems:"center", gap:14, marginBottom:16, flexWrap:"wrap" },
  icon:       { fontSize:30, filter:"drop-shadow(0 0 8px rgba(232,0,13,0.5))" },
  title:      { fontFamily:"'Bebas Neue',cursive", fontSize:34, letterSpacing:3, color:"#F0F0F0", lineHeight:1 },
  titleLine:  { width:55, height:2, background:"linear-gradient(90deg,#E8000D,transparent)", marginTop:4, borderRadius:1 },
  count:      { marginLeft:"auto", fontFamily:"'Orbitron',monospace", fontSize:9, color:"#333", letterSpacing:1, padding:"4px 12px", border:"1px solid #1e1e1e", borderRadius:2 },
  controls:   { display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 },
  filterRow:  { display:"flex", gap:7, flexWrap:"wrap" },
  filterBtn:  { fontFamily:"'Orbitron',monospace", fontSize:8.5, fontWeight:700, letterSpacing:1.5, padding:"6px 16px", borderRadius:3, cursor:"pointer", transition:"all 0.2s" },
  select:     { background:"#111", border:"1px solid #1e1e1e", color:"#666", fontFamily:"'Rajdhani',sans-serif", fontSize:13, fontWeight:600, padding:"6px 12px", borderRadius:3, cursor:"pointer", outline:"none" },
  loading:    { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 0", gap:16 },
  spinner:    { width:36, height:36, border:"3px solid #1e1e1e", borderTop:"3px solid #E8000D", borderRadius:"50%", animation:"spin 0.8s linear infinite" },
  empty:      { textAlign:"center", padding:"80px 0" },
  grid:       { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(235px, 1fr))", gap:18 },
};
