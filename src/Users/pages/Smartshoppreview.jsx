import { useState, useEffect, useRef } from "react";

const NAV_ITEMS = [
  { label: "Điện Thoại", key: "phone",  icon: "📱" },
  { label: "iPad",       key: "ipad",   icon: "📟" },
  { label: "Laptop",     key: "laptop", icon: "💻" },
  { label: "Tin Tức",    key: "news",   icon: "📰" },
  { label: "Giới Thiệu", key: "about",  icon: "ℹ️"  },
];

const PRODUCTS = [
  { id:1,  name:"iPhone 15 Pro Max 256GB",    category:"phone",  price:29_990_000, tag:"HOT",  img:"📱" },
  { id:2,  name:"iPhone 15 128GB",            category:"phone",  price:22_490_000, tag:"",     img:"📱" },
  { id:3,  name:"iPhone 14 Pro 256GB",        category:"phone",  price:24_990_000, tag:"SALE", img:"📱" },
  { id:4,  name:"Samsung Galaxy S24 Ultra",   category:"phone",  price:31_990_000, tag:"HOT",  img:"📱" },
  { id:5,  name:"Samsung Galaxy A55",         category:"phone",  price:9_490_000,  tag:"",     img:"📱" },
  { id:6,  name:"iPad Pro M4 11-inch",        category:"ipad",   price:27_990_000, tag:"NEW",  img:"📟" },
  { id:7,  name:"iPad Air M2 256GB",          category:"ipad",   price:18_990_000, tag:"",     img:"📟" },
  { id:8,  name:"iPad Mini 6 64GB",           category:"ipad",   price:12_490_000, tag:"SALE", img:"📟" },
  { id:9,  name:"MacBook Pro M3 14-inch",     category:"laptop", price:49_990_000, tag:"HOT",  img:"💻" },
  { id:10, name:"MacBook Air M2 256GB",       category:"laptop", price:27_490_000, tag:"",     img:"💻" },
  { id:11, name:"MacBook Pro M3 Max 16-inch", category:"laptop", price:89_990_000, tag:"NEW",  img:"💻" },
  { id:12, name:"Dell XPS 15 OLED",           category:"laptop", price:42_990_000, tag:"",     img:"💻" },
  { id:13, name:"Asus ROG Zephyrus G14",      category:"laptop", price:35_990_000, tag:"HOT",  img:"💻" },
  { id:14, name:"Apple Watch Series 9 45mm",  category:"phone",  price:10_990_000, tag:"",     img:"⌚" },
  { id:15, name:"AirPods Pro 2nd Gen",        category:"phone",  price:5_990_000,  tag:"SALE", img:"🎧" },
];

const fmt = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const normalize = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function searchProducts(q) {
  const qn = normalize(q.trim());
  if (!qn) return [];
  return PRODUCTS.filter((p) => normalize(p.name).includes(qn)).slice(0, 8);
}

function SearchDropdown({ results, query, onSelect, onViewAll }) {
  if (!query.trim()) return null;
  return (
    <div style={{
      position:"absolute", top:"calc(100% + 4px)", left:0, right:0,
      background:"#111", border:"1px solid #2a2a2a", borderTop:"2px solid #E8000D",
      borderRadius:"0 0 6px 6px", zIndex:2000, maxHeight:420, overflowY:"auto",
      boxShadow:"0 16px 40px rgba(0,0,0,0.85)",
    }}>
      {results.length === 0 ? (
        <div style={{ padding:"22px 16px", textAlign:"center", color:"#555",
          fontFamily:"'Rajdhani',sans-serif", fontSize:13 }}>
          😕 Không tìm thấy "<span style={{color:"#E8000D"}}>{query}</span>"
        </div>
      ) : (
        <>
          <div style={{ padding:"7px 14px", fontSize:9, fontFamily:"'Orbitron',monospace",
            color:"#444", letterSpacing:1.5, borderBottom:"1px solid #1a1a1a" }}>
            {results.length} KẾT QUẢ PHÙ HỢP
          </div>
          {results.map((p) => (
            <div key={p.id} onClick={() => onSelect(p)}
              style={{ display:"flex", alignItems:"center", gap:12,
                padding:"10px 14px", cursor:"pointer", borderBottom:"1px solid #161616",
                transition:"background 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.background="#1a1a1a"}
              onMouseLeave={(e) => e.currentTarget.style.background="transparent"}
            >
              <span style={{ fontSize:24, width:34, textAlign:"center" }}>{p.img}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:13.5,
                  color:"#F0F0F0", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                  {p.name}
                </div>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:11, color:"#E8000D",
                  fontWeight:700, marginTop:2 }}>
                  {fmt(p.price)}
                </div>
              </div>
              {p.tag && (
                <span style={{
                  background: p.tag==="HOT"?"#E8000D":p.tag==="NEW"?"#00a86b":"#c97d00",
                  color:"#fff", fontSize:9, fontFamily:"'Orbitron',monospace", fontWeight:700,
                  padding:"2px 6px", borderRadius:2, letterSpacing:0.5, flexShrink:0,
                }}>{p.tag}</span>
              )}
            </div>
          ))}
          <div onClick={onViewAll}
            style={{ padding:"11px 14px", textAlign:"center",
              fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:12,
              color:"#E8000D", cursor:"pointer", letterSpacing:1, textTransform:"uppercase",
              borderTop:"1px solid #1e1e1e" }}
            onMouseEnter={(e) => e.currentTarget.style.background="#1a0000"}
            onMouseLeave={(e) => e.currentTarget.style.background="transparent"}
          >
            🔍 Xem tất cả {results.length} kết quả cho "{query}"
          </div>
        </>
      )}
    </div>
  );
}

const iconBtn = {
  background:"none", border:"1px solid #2a2a2a", color:"#aaa",
  fontSize:15, width:35, height:35, borderRadius:3, cursor:"pointer",
  display:"flex", alignItems:"center", justifyContent:"center",
};

function Header({ activePage, setActivePage, cartCount, onProductSelect }) {
  const [scrolled,    setScrolled]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [results,     setResults]     = useState([]);
  const [showDrop,    setShowDrop]    = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setShowDrop(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (e) => {
    const v = e.target.value;
    setSearchValue(v);
    setResults(searchProducts(v));
    setShowDrop(true);
  };

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    setResults(searchProducts(searchValue));
    setShowDrop(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") { setShowDrop(false); setSearchOpen(false); }
  };

  const handleSelect = (p) => {
    setShowDrop(false); setSearchOpen(false); setSearchValue("");
    onProductSelect(p);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Orbitron:wght@400;700&family=Rajdhani:wght@500;600;700&display=swap');
        @keyframes shimmer { 0%{background-position:0 0} 100%{background-position:200% 0} }
      `}</style>

      <div style={{ background:"linear-gradient(90deg,#8B0000,#E8000D,#8B0000)",
        backgroundSize:"200% 100%", animation:"shimmer 3s linear infinite",
        padding:"7px 16px", textAlign:"center", fontSize:12,
        fontFamily:"'Rajdhani',sans-serif", fontWeight:600, letterSpacing:0.8, color:"#fff" }}>
        🔥 FLASH SALE — Giảm đến <b>40%</b> &nbsp;|&nbsp; Free ship cho hội viên &nbsp;|&nbsp; Bảo hành 24 tháng chính hãng
      </div>

      <header style={{ position:"sticky", top:0, zIndex:1000,
        background: scrolled ? "rgba(7,7,7,0.97)":"#0F0F0F",
        borderBottom:"2px solid #E8000D",
        boxShadow: scrolled ? "0 4px 28px rgba(232,0,13,0.25)":"none",
        transition:"all 0.3s" }}>

        <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 20px", height:66,
          display:"flex", flexDirection:"row", flexWrap:"nowrap",
          alignItems:"center", justifyContent:"space-between" }}>

          {/* LOGO */}
          <div onClick={() => setActivePage("home")} style={{
            display:"flex", alignItems:"center", gap:9, cursor:"pointer", flex:"0 0 auto" }}>
            <span style={{ fontSize:24, filter:"drop-shadow(0 0 8px rgba(232,0,13,0.8))" }}>⚡</span>
            <div>
              <div style={{ fontFamily:"'Bebas Neue',cursive", fontSize:22, letterSpacing:3, color:"#F0F0F0", lineHeight:1 }}>
                SMART<span style={{color:"#E8000D"}}>SHOP</span>
              </div>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:6, letterSpacing:3, color:"#444" }}>
                CÔNG NGHỆ ĐỈNH CAO
              </div>
            </div>
          </div>

          {/* NAV */}
          <div style={{ display:"flex", flexWrap:"nowrap", alignItems:"center",
            gap:2, flex:"1 1 auto", justifyContent:"center" }}>
            {NAV_ITEMS.map((item) => (
              <button key={item.key} onClick={() => setActivePage(item.key)} style={{
                display:"inline-flex", alignItems:"center", gap:5, whiteSpace:"nowrap",
                background: activePage===item.key ? "rgba(232,0,13,0.1)":"transparent",
                border:"none", color: activePage===item.key ? "#E8000D":"#888",
                fontFamily:"'Rajdhani',sans-serif", fontSize:13, fontWeight:700,
                letterSpacing:0.8, padding:"8px 12px", cursor:"pointer",
                borderRadius:3, transition:"color 0.2s, background 0.2s",
                textTransform:"uppercase", position:"relative", flex:"0 0 auto",
              }}>
                <span>{item.icon}</span><span>{item.label}</span>
                {activePage===item.key && (
                  <span style={{ position:"absolute", bottom:2, left:"50%",
                    transform:"translateX(-50%)", width:"60%", height:2,
                    background:"#E8000D", borderRadius:1,
                    boxShadow:"0 0 8px rgba(232,0,13,0.8)" }} />
                )}
              </button>
            ))}
          </div>

          {/* ACTIONS */}
          <div style={{ display:"flex", flexWrap:"nowrap", alignItems:"center", gap:7, flex:"0 0 auto" }}>
            <button onClick={() => { setSearchOpen(!searchOpen); setShowDrop(false); }} style={iconBtn}>🔍</button>
            <button onClick={() => setActivePage("cart")} style={{ ...iconBtn, position:"relative" }}>
              🛒
              {cartCount > 0 && (
                <span style={{ position:"absolute", top:-6, right:-6,
                  background:"#E8000D", color:"#fff", fontSize:9, fontWeight:700,
                  width:17, height:17, borderRadius:"50%",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"'Orbitron',monospace" }}>{cartCount}</span>
              )}
            </button>
            <button onClick={() => setActivePage("profile")} style={{
              ...iconBtn,
              background: activePage==="profile"?"rgba(232,0,13,.1)":"none",
              borderColor: activePage==="profile"?"#E8000D":"#2a2a2a",
              color: activePage==="profile"?"#E8000D":"#aaa",
            }}>👤</button>
            <div style={{ paddingLeft:10, borderLeft:"1px solid #222" }}>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:7, color:"#444", letterSpacing:1.5 }}>Hotline</div>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:13, color:"#E8000D", fontWeight:700 }}>84+ 339806596</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div style={{ padding:"10px 20px", borderTop:"1px solid #161616", background:"#0A0A0A" }}>
            <div ref={searchRef} style={{ position:"relative", display:"flex", gap:8 }}>
              <input autoFocus value={searchValue}
                onChange={handleChange} onKeyDown={handleKeyDown}
                onFocus={() => searchValue.trim() && setShowDrop(true)}
                placeholder="Tìm kiếm: iPhone, MacBook, Samsung, iPad..."
                style={{ flex:1, background:"#141414", border:"1px solid #2a2a2a",
                  borderRadius:3, padding:"9px 14px", color:"#F0F0F0",
                  fontFamily:"'Rajdhani',sans-serif", fontSize:13, outline:"none" }}
              />
              <button onClick={handleSearch} style={{
                background:"#E8000D", border:"none", color:"#fff",
                fontFamily:"'Orbitron',monospace", fontSize:9.5, fontWeight:700,
                padding:"0 20px", borderRadius:3, cursor:"pointer", letterSpacing:1,
              }}>TÌM KIẾM</button>

              {showDrop && (
                <SearchDropdown results={results} query={searchValue}
                  onSelect={handleSelect}
                  onViewAll={() => { setShowDrop(false); setActivePage(results[0]?.category || "phone"); }}
                />
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

// ─── Demo App ────────────────────────────────────────────────────────────────
export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [cartCount]  = useState(3);
  const [selected,   setSelected]   = useState(null);
  const [toast,      setToast]      = useState(null);

  const handleProductSelect = (p) => {
    setSelected(p);
    setActivePage(p.category);
    setToast(`Đã chuyển đến: ${p.name}`);
    setTimeout(() => setToast(null), 3000);
  };

  const fmt = (n) =>
    new Intl.NumberFormat("vi-VN", { style:"currency", currency:"VND" }).format(n);

  return (
    <div style={{ minHeight:"100vh", background:"#0A0A0A", color:"#F0F0F0" }}>
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cartCount}
        onProductSelect={handleProductSelect}
      />

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", top:90, right:20, zIndex:9999,
          background:"#1a1a1a", border:"1px solid #E8000D",
          color:"#F0F0F0", padding:"12px 18px", borderRadius:6,
          fontFamily:"'Rajdhani',sans-serif", fontSize:13, fontWeight:600,
          boxShadow:"0 8px 24px rgba(0,0,0,0.6)",
          animation:"fadeIn 0.2s ease",
        }}>
          ✅ {toast}
        </div>
      )}

      {/* Page Content Demo */}
      <div style={{ maxWidth:900, margin:"60px auto", padding:"0 24px", textAlign:"center" }}>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:"#444",
          letterSpacing:3, marginBottom:16 }}>TRANG HIỆN TẠI</div>
        <div style={{ fontFamily:"'Bebas Neue',cursive", fontSize:52, letterSpacing:4,
          color:"#F0F0F0", lineHeight:1, marginBottom:8 }}>
          {activePage.toUpperCase()}
        </div>

        {selected && (
          <div style={{ marginTop:40, padding:24, background:"#111",
            border:"1px solid #2a2a2a", borderRadius:8, display:"inline-block",
            minWidth:320, textAlign:"left" }}>
            <div style={{ fontSize:10, fontFamily:"'Orbitron',monospace",
              color:"#444", letterSpacing:2, marginBottom:12 }}>SẢN PHẨM ĐÃ CHỌN</div>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <span style={{ fontSize:48 }}>{selected.img}</span>
              <div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700,
                  fontSize:18, color:"#F0F0F0", marginBottom:4 }}>{selected.name}</div>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:14,
                  color:"#E8000D", fontWeight:700 }}>{fmt(selected.price)}</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop:48, fontFamily:"'Rajdhani',sans-serif",
          fontSize:14, color:"#333", lineHeight:1.8 }}>
          Nhấn 🔍 trên header để mở thanh tìm kiếm<br/>
          Gõ: <span style={{color:"#E8000D"}}>iphone</span>, <span style={{color:"#E8000D"}}>macbook</span>,{" "}
          <span style={{color:"#E8000D"}}>samsung</span>, <span style={{color:"#E8000D"}}>ipad</span>...
        </div>
      </div>
    </div>
  );
}
