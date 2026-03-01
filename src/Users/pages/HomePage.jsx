import { useState } from "react";
import Header         from "../components/Header";
import Banner         from "../components/Banner";
import ProductSection from "../components/ProductSection";
import NewsPage       from "../components/NewsPage";
import AboutPage      from "../components/AboutPage";
import Footer         from "../components/Footer";

import CheckoutPage      from "../components/CheckoutPage";
import UserProfilePage   from "../components/UserProfilePage";
import ProductDetailPage from "../components/ProductDetailPage"; // ✅ THÊM
import "../css/global.css";
import { useEffect } from "react";
import {
  fetchCart,
  updateCartApi,
  deleteCartApi,
  formatPrice1 as formatCartPrice,
} from "../api/cartApi";

function CartPage({ setActivePage }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatPrice = (price) => formatCartPrice(price);
  // =========================
  // LOAD CART THEO USER LOGIN
  // =========================
  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await fetchCart();

        // Nếu backend trả nested object
        const mapped = data.map((item) => ({
          id: item.id,
          name: item.productColor?.product?.name,
          price: item.productColor?.product?.price,
          image: item.productColor?.image
            ? `http://localhost:8080${item.productColor.image}`
            : null,
          qty: item.quantity,
          description: item.productColor?.product?.description,
        }));

        setCart(mapped);
      } catch (err) {
        console.error("Lỗi load cart:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const total = cart.reduce(
    (s, i) => s + Number(i.price || 0) * Number(i.qty || 1),
    0
  );

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "100px 24px" }}>
        Đang tải giỏ hàng...
      </div>
    );

  if (!cart || cart.length === 0)
    return (
      <div style={{ textAlign: "center", padding: "100px 24px" }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>🛒</div>
        <div
          style={{
            fontFamily: "'Orbitron',monospace",
            fontSize: 13,
            color: "#2a2a2a",
            letterSpacing: 2,
          }}
        >
          GIỎ HÀNG TRỐNG
        </div>
      </div>
    );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "50px 24px" }}>
      <h2
        style={{
          fontFamily: "'Bebas Neue',cursive",
          fontSize: 36,
          letterSpacing: 3,
          marginBottom: 28,
          color: "#F0F0F0",
        }}
      >
        GIỎ HÀNG
      </h2>

      {cart.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            gap: 14,
            padding: "15px",
            border: "1px solid #1e1e1e",
            borderRadius: 4,
            marginBottom: 10,
            background: "#0F0F0F",
            alignItems: "center",
          }}
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: 60,
                height: 60,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          ) : (
            <span style={{ fontSize: 38 }}>📦</span>
          )}

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "'Rajdhani',sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: "#F0F0F0",
              }}
            >
              {item.name}
            </div>

            <div
              style={{
                fontFamily: "'Orbitron',monospace",
                fontSize: 9.5,
                color: "#444",
              }}
            >
              {item.description}
            </div>
          </div>

          <div
            style={{
              fontFamily: "'Orbitron',monospace",
              color: "#E8000D",
              fontSize: 14,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {formatPrice(item.price)}
          </div>

          {/* QTY */}
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <button
              onClick={async () => {
                const newQty = Math.max(1, item.qty - 1);
                await updateCartApi(item.id, newQty);

                setCart((c) =>
                  c.map((i) =>
                    i.id === item.id ? { ...i, qty: newQty } : i
                  )
                );
              }}
              style={qB}
            >
              −
            </button>

            <span
              style={{
                fontFamily: "'Orbitron',monospace",
                fontSize: 13,
                color: "#F0F0F0",
                width: 24,
                textAlign: "center",
              }}
            >
              {item.qty}
            </span>

            <button
              onClick={async () => {
                const newQty = item.qty + 1;
                await updateCartApi(item.id, newQty);

                setCart((c) =>
                  c.map((i) =>
                    i.id === item.id ? { ...i, qty: newQty } : i
                  )
                );
              }}
              style={qB}
            >
              +
            </button>
          </div>

          {/* REMOVE */}
          <button
            onClick={async () => {
              await deleteCartApi(item.id);
              setCart((c) => c.filter((i) => i.id !== item.id));
            }}
            style={{ ...qB, borderColor: "#2a2a2a", color: "#555" }}
          >
            ✕
          </button>
        </div>
      ))}

      {/* TOTAL */}
      <div
        style={{
          textAlign: "right",
          marginTop: 22,
          padding: "20px",
          background: "#0F0F0F",
          border: "1px solid #1e1e1e",
          borderRadius: 4,
        }}
      >
        <div
          style={{
            fontFamily: "'Orbitron',monospace",
            fontSize: 11,
            color: "#444",
            marginBottom: 6,
          }}
        >
          TỔNG CỘNG
        </div>

        <div
          style={{
            fontFamily: "'Orbitron',monospace",
            fontSize: 28,
            color: "#E8000D",
            fontWeight: 900,
          }}
        >
          {formatPrice(total)}
        </div>

        <button
          onClick={() => setActivePage("checkout")}
          style={{
            marginTop: 15,
            background: "linear-gradient(135deg,#E8000D,#8B0000)",
            border: "none",
            color: "#fff",
            fontFamily: "'Orbitron',monospace",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.5,
            padding: "13px 38px",
            borderRadius: 3,
            cursor: "pointer",
            boxShadow: "0 6px 22px rgba(232,0,13,.4)",
          }}
        >
          TIẾN HÀNH THANH TOÁN →
        </button>
      </div>
    </div>
  );
}

const qB = {
  background: "none",
  border: "1px solid #E8000D",
  borderRadius: 3,
  color: "#E8000D",
  width: 28,
  height: 28,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 14,
  fontWeight: 700,
};

function QuickCategories({ setActivePage }) {
  return (
    <div style={{ background:"#0A0A0A", borderBottom:"1px solid #141414", padding:"26px 0" }}>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 24px", display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:14 }}>
        {[
          { icon:"📱", label:"Điện Thoại", key:"phone",  desc:"iPhone, Samsung, Xiaomi..." },
          { icon:"📟", label:"iPad",       key:"ipad",   desc:"iPad Pro, Air, Mini..."     },
          { icon:"💻", label:"Laptop",     key:"laptop", desc:"MacBook, ROG, Dell XPS..."  },
          { icon:"📰", label:"Tin Tức",    key:"news",   desc:"Công nghệ mới nhất"         },
        ].map(({ icon, label, key, desc }) => (
          <button key={key} onClick={() => setActivePage(key)}
            style={{ background:"#111", border:"1px solid #1e1e1e", borderRadius:4, padding:"18px 20px", cursor:"pointer", display:"flex", alignItems:"center", gap:12, textAlign:"left" }}>
            <span style={{ fontSize:26, flexShrink:0 }}>{icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:14, fontWeight:700, color:"#F0F0F0" }}>{label}</div>
              <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:11, color:"#444" }}>{desc}</div>
            </div>
            <span style={{ color:"#E8000D", fontSize:16, fontWeight:700 }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PromoStrip() {
  return (
    <div style={{ background:"#0D0000", borderTop:"1px solid rgba(232,0,13,0.15)", borderBottom:"1px solid rgba(232,0,13,0.15)", padding:"22px 0", marginTop:50 }}>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 24px", display:"flex", flexWrap:"wrap", gap:18, justifyContent:"space-between" }}>
        {[["🚚","Miễn phí vận chuyển","Đơn từ 500.000đ"],["🔄","Đổi trả 30 ngày","Không cần lý do"],["🛡️","Bảo hành 24 tháng","50+ trung tâm"],["💳","Trả góp 0%","Lên đến 24 tháng"],["📞","Hỗ trợ 24/7","1800 6789 miễn phí"]].map(([icon,title,desc]) => (
          <div key={title} style={{ display:"flex", alignItems:"center", gap:11, flex:"1 1 150px" }}>
            <span style={{ fontSize:26, flexShrink:0 }}>{icon}</span>
            <div>
              <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:13.5, fontWeight:700, color:"#F0F0F0" }}>{title}</div>
              <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:11, color:"#444" }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activePage, setActivePage] = useState("home");
  const [cart,       setCart]       = useState([]);
  const [toast,      setToast]      = useState(null);

  const handleAddCart = (product) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === product.id);
      if (found) return prev.map((i) => i.id===product.id ? {...i, qty:i.qty+1} : i);
      return [...prev, { ...product, qty:1 }];
    });
    setToast(`✓ Đã thêm "${product.name}" vào giỏ hàng`);
    setTimeout(() => setToast(null), 2500);
  };

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const renderContent = () => {
    // ✅ THÊM: xử lý route detail-{id} TRƯỚC switch
    if (activePage?.startsWith("detail-")) {
      const productId = activePage.replace("detail-", "");
      return (
        <ProductDetailPage
          productId={productId}
          setActivePage={setActivePage}
          onAddCart={handleAddCart}
        />
      );
    }

    switch (activePage) {
      // key "phone" → data.js map → "Điện Thoại" → gửi lên API
      case "phone":
        return <ProductSection title="ĐIỆN THOẠI" icon="📱" category="phone"  onAddCart={handleAddCart} setActivePage={setActivePage} />; // ✅ thêm setActivePage
      // key "ipad" → data.js map → "Ipad" → gửi lên API
      case "ipad":
        return <ProductSection title="iPAD"       icon="📟" category="ipad"   onAddCart={handleAddCart} setActivePage={setActivePage} />; // ✅ thêm setActivePage
      // key "laptop" → data.js map → "Laptop" → gửi lên API
      case "laptop":
        return <ProductSection title="LAPTOP"     icon="💻" category="laptop" onAddCart={handleAddCart} setActivePage={setActivePage} />; // ✅ thêm setActivePage
      case "news":  return <NewsPage />;
      case "about": return <AboutPage />;
      case "cart":  return <CartPage cart={cart} setCart={setCart} setActivePage={setActivePage} />;
      case "checkout":
        return <CheckoutPage cart={cart} setActivePage={setActivePage} />;

      // ── Trang tài khoản / profile ─────────────────────────
      case "profile":
        return <UserProfilePage setActivePage={setActivePage} />;

      default:
        return (
          <>
            <Banner setActivePage={setActivePage} />
            <QuickCategories setActivePage={setActivePage} />
            {/* ✅ thêm setActivePage vào 3 dòng này */}
            <ProductSection title="ĐIỆN THOẠI NỔI BẬT" icon="📱" category="phone"  onAddCart={handleAddCart} setActivePage={setActivePage} />
            <ProductSection title="iPAD BÁN CHẠY"       icon="📟" category="ipad"   onAddCart={handleAddCart} setActivePage={setActivePage} />
            <ProductSection title="LAPTOP ĐỈNH CAO"      icon="💻" category="laptop" onAddCart={handleAddCart} setActivePage={setActivePage} />
            <PromoStrip />
          </>
        );
    }
  };

  return (
    <div style={{ background:"#070707", minHeight:"100vh" }}>
      <Header activePage={activePage} setActivePage={setActivePage} cartCount={cartCount} />
      <main>{renderContent()}</main>
      <Footer setActivePage={setActivePage} />
      {toast && (
        <div style={{ position:"fixed", bottom:28, right:28, background:"#0F0F0F", border:"1px solid #E8000D", borderLeft:"4px solid #E8000D", color:"#F0F0F0", fontFamily:"'Rajdhani',sans-serif", fontSize:14, fontWeight:600, padding:"13px 20px", borderRadius:4, boxShadow:"0 8px 28px rgba(232,0,13,0.28)", zIndex:9999, animation:"fadeInUp 0.3s ease both", maxWidth:370 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
