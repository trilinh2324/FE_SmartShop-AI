import { useState } from "react";
import Header       from "../components/Header";
import Banner       from "../components/Banner";
import ProductSection from "../components/ProductSection";
import NewsPage     from "../components/NewsPage";
import AboutPage    from "../components/AboutPage";
import Footer       from "../components/Footer";
import { phones, ipads, laptops } from "../api/data";
import "../css/global.css";

export default function HomePage() {
  const [activePage, setActivePage] = useState("home");
  const [cart,       setCart]       = useState([]);
  const [toast,      setToast]      = useState(null);

  // Add to cart
  const handleAddCart = (product) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === product.id);
      if (found) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setToast(`✓ Đã thêm "${product.name}" vào giỏ hàng`);
    setTimeout(() => setToast(null), 2500);
  };

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  // Render content based on page
  const renderContent = () => {
    switch (activePage) {
      case "phone":
        return (
          <ProductSection
            title="ĐIỆN THOẠI"
            icon="📱"
            products={phones}
            onAddCart={handleAddCart}
          />
        );
      case "ipad":
        return (
          <ProductSection
            title="iPAD"
            icon="📟"
            products={ipads}
            onAddCart={handleAddCart}
          />
        );
      case "laptop":
        return (
          <ProductSection
            title="LAPTOP"
            icon="💻"
            products={laptops}
            onAddCart={handleAddCart}
          />
        );
      case "news":
        return <NewsPage />;
      case "about":
        return <AboutPage />;
      case "cart":
        return <CartPage cart={cart} setCart={setCart} />;
      default:
        // Home - show all sections
        return (
          <>
            <Banner setActivePage={setActivePage} />
            {/* Quick categories */}
            <QuickCategories setActivePage={setActivePage} />
            <ProductSection title="ĐIỆN THOẠI NỔI BẬT" icon="📱" products={phones}  onAddCart={handleAddCart} />
            <ProductSection title="iPAD BÁN CHẠY"       icon="📟" products={ipads}   onAddCart={handleAddCart} />
            <ProductSection title="LAPTOP ĐỈNH CAO"      icon="💻" products={laptops} onAddCart={handleAddCart} />
            <PromoStrip />
          </>
        );
    }
  };

  return (
    <div style={{ background: "#070707", minHeight: "100vh" }}>
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cartCount}
      />

      <main>{renderContent()}</main>

      <Footer setActivePage={setActivePage} />

      {/* Toast notification */}
      {toast && (
        <div style={toastStyle}>
          {toast}
        </div>
      )}
    </div>
  );
}

// ── Quick Categories ────────────────────────────────────────
function QuickCategories({ setActivePage }) {
  const cats = [
    { icon: "📱", label: "Điện Thoại", key: "phone",  desc: "iPhone, Samsung, Xiaomi..." },
    { icon: "📟", label: "iPad",       key: "ipad",   desc: "iPad Pro, Air, Mini..." },
    { icon: "💻", label: "Laptop",     key: "laptop", desc: "MacBook, ROG, Dell XPS..." },
    { icon: "📰", label: "Tin Tức",    key: "news",   desc: "Công nghệ mới nhất" },
  ];
  return (
    <div style={qc.wrap}>
      <div style={qc.inner}>
        {cats.map(({ icon, label, key, desc }, i) => (
          <button
            key={key}
            style={{ ...qc.card, animationDelay: `${i * 0.1}s` }}
            onClick={() => setActivePage(key)}
          >
            <span style={qc.icon}>{icon}</span>
            <span style={qc.label}>{label}</span>
            <span style={qc.desc}>{desc}</span>
            <span style={qc.arrow}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const qc = {
  wrap:  { background: "#0A0A0A", borderBottom: "1px solid #161616", padding: "30px 0" },
  inner: {
    maxWidth: 1400, margin: "0 auto", padding: "0 24px",
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16,
  },
  card: {
    background:  "#111",
    border:      "1px solid #1e1e1e",
    borderRadius: 5,
    padding:     "20px 24px",
    cursor:      "pointer",
    display:     "flex",
    alignItems:  "center",
    gap:         14,
    transition:  "all 0.25s",
    animation:   "fadeInUp 0.5s ease both",
    textAlign:   "left",
  },
  icon:  { fontSize: 28, flexShrink: 0 },
  label: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize:   15,
    fontWeight: 700,
    color:      "#F0F0F0",
    display:    "block",
    lineHeight: 1.2,
  },
  desc: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize:   11,
    color:      "#555",
    display:    "block",
  },
  arrow: {
    marginLeft: "auto",
    color:      "#E8000D",
    fontSize:   18,
    fontWeight: 700,
    flexShrink: 0,
  },
};

// ── Promo Strip ─────────────────────────────────────────────
function PromoStrip() {
  return (
    <div style={ps.wrap}>
      <div style={ps.inner}>
        {[
          { icon: "🚚", title: "Miễn phí vận chuyển", desc: "Đơn từ 500.000đ" },
          { icon: "🔄", title: "Đổi trả 30 ngày",     desc: "Không cần lý do" },
          { icon: "🛡️", title: "Bảo hành 24 tháng",   desc: "Tại 50+ trung tâm" },
          { icon: "💳", title: "Trả góp 0%",           desc: "Lên đến 24 tháng" },
          { icon: "📞", title: "Hỗ trợ 24/7",          desc: "1800 6789 miễn phí" },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={ps.item}>
            <span style={ps.icon}>{icon}</span>
            <div>
              <div style={ps.title}>{title}</div>
              <div style={ps.desc}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ps = {
  wrap:  { background: "#0D0000", borderTop: "1px solid rgba(232,0,13,0.15)", borderBottom: "1px solid rgba(232,0,13,0.15)", padding: "24px 0", marginTop: 50 },
  inner: { maxWidth: 1400, margin: "0 auto", padding: "0 24px", display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "space-between" },
  item:  { display: "flex", alignItems: "center", gap: 12, flex: "1 1 160px" },
  icon:  { fontSize: 28, flexShrink: 0 },
  title: { fontFamily: "'Rajdhani',sans-serif", fontSize: 14, fontWeight: 700, color: "#F0F0F0" },
  desc:  { fontFamily: "'Rajdhani',sans-serif", fontSize: 11, color: "#555" },
};

// ── Cart Page ───────────────────────────────────────────────
function CartPage({ cart, setCart }) {
  const { formatPrice } = require("../api/data");
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (cart.length === 0) return (
    <div style={{ textAlign: "center", padding: "100px 24px" }}>
      <div style={{ fontSize: 72, marginBottom: 20 }}>🛒</div>
      <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 14, color: "#333", letterSpacing: 2 }}>GIỎ HÀNG TRỐNG</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "50px 24px" }}>
      <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 36, letterSpacing: 3, marginBottom: 28, color: "#F0F0F0" }}>GIỎ HÀNG</h2>
      {cart.map((item) => (
        <div key={item.id} style={{ display: "flex", gap: 16, padding: "16px", border: "1px solid #1e1e1e", borderRadius: 4, marginBottom: 12, background: "#0F0F0F", alignItems: "center" }}>
          <span style={{ fontSize: 40 }}>{item.image}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 15, color: "#F0F0F0" }}>{item.name}</div>
            <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 10, color: "#555" }}>{item.specs}</div>
          </div>
          <div style={{ fontFamily: "'Orbitron',monospace", color: "#E8000D", fontSize: 14, fontWeight: 700 }}>{formatPrice(item.price)}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setCart(c => c.map(i => i.id === item.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))} style={{ ...qtyBtn, borderColor: "#E8000D", color: "#E8000D" }}>−</button>
            <span style={{ fontFamily: "'Orbitron',monospace", fontSize: 13, color: "#F0F0F0", width: 24, textAlign: "center" }}>{item.qty}</span>
            <button onClick={() => setCart(c => c.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))} style={{ ...qtyBtn, borderColor: "#E8000D", color: "#E8000D" }}>+</button>
          </div>
          <button onClick={() => setCart(c => c.filter(i => i.id !== item.id))} style={{ ...qtyBtn, borderColor: "#333", color: "#666" }}>✕</button>
        </div>
      ))}
      <div style={{ textAlign: "right", marginTop: 24, padding: "20px", background: "#0F0F0F", border: "1px solid #1e1e1e", borderRadius: 4 }}>
        <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 12, color: "#666", marginBottom: 8 }}>TỔNG CỘNG</div>
        <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 28, color: "#E8000D", fontWeight: 900 }}>{formatPrice(total)}</div>
        <button style={{ marginTop: 16, background: "#E8000D", border: "none", color: "#fff", fontFamily: "'Orbitron',monospace", fontSize: 12, fontWeight: 700, letterSpacing: 1.5, padding: "14px 40px", borderRadius: 3, cursor: "pointer", boxShadow: "0 6px 24px rgba(232,0,13,0.4)" }}>
          THANH TOÁN NGAY →
        </button>
      </div>
    </div>
  );
}
const qtyBtn = { background: "none", border: "1px solid", borderRadius: 3, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, transition: "all 0.2s" };

// ── Toast style ─────────────────────────────────────────────
const toastStyle = {
  position:      "fixed",
  bottom:        30,
  right:         30,
  background:    "#0F0F0F",
  border:        "1px solid #E8000D",
  borderLeft:    "4px solid #E8000D",
  color:         "#F0F0F0",
  fontFamily:    "'Rajdhani', sans-serif",
  fontSize:      14,
  fontWeight:    600,
  padding:       "14px 22px",
  borderRadius:  4,
  boxShadow:     "0 8px 30px rgba(232,0,13,0.3)",
  zIndex:        9999,
  animation:     "fadeInUp 0.3s ease both",
  maxWidth:      380,
  letterSpacing: 0.3,
};
