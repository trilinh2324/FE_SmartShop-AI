import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { label: "Điện Thoại", key: "phone",  icon: "📱" },
  { label: "iPad",       key: "ipad",   icon: "📟" },
  { label: "Laptop",     key: "laptop", icon: "💻" },
  { label: "Tin Tức",    key: "news",   icon: "📰" },
  { label: "Giới Thiệu", key: "about",  icon: "ℹ️"  },
];

export default function Header({ activePage, setActivePage, cartCount }) {
  const [scrolled,    setScrolled]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      {/* Announcement */}
      <div style={{
        background: "linear-gradient(90deg,#8B0000,#E8000D,#8B0000)",
        backgroundSize: "200% 100%",
        animation: "shimmer 3s linear infinite",
        padding: "7px 16px",
        textAlign: "center",
        fontSize: 12,
        fontFamily: "'Rajdhani',sans-serif",
        fontWeight: 600,
        letterSpacing: 0.8,
        color: "#fff",
      }}>
        🔥 FLASH SALE — Giảm đến <b>40%</b> &nbsp;|&nbsp; Free ship cho hội viên &nbsp;|&nbsp; Bảo hành 24 tháng chính hãng
      </div>

      {/* Header */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: scrolled ? "rgba(7,7,7,0.97)" : "#0F0F0F",
        borderBottom: "2px solid #E8000D",
        boxShadow: scrolled ? "0 4px 28px rgba(232,0,13,0.25)" : "none",
        transition: "all 0.3s",
      }}>

        {/* === SINGLE ROW === */}
        <div style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 20px",
          height: 66,
          display: "flex",
          flexDirection: "row",       /* ngang */
          flexWrap: "nowrap",         /* không xuống dòng */
          alignItems: "center",
          justifyContent: "space-between",
        }}>

          {/* LOGO */}
          <div onClick={() => setActivePage("home")} style={{
            display: "flex", flexDirection: "row", alignItems: "center",
            gap: 9, cursor: "pointer",
            flex: "0 0 auto",         /* không co giãn */
          }}>
            <span style={{ fontSize: 24, filter: "drop-shadow(0 0 8px rgba(232,0,13,0.8))" }}>⚡</span>
            <div>
              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 22, letterSpacing: 3, color: "#F0F0F0", lineHeight: 1 }}>
                SMART<span style={{ color: "#E8000D" }}>SHOP</span>
              </div>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 6, letterSpacing: 3, color: "#444" }}>
                CÔNG NGHỆ ĐỈNH CAO
              </div>
            </div>
          </div>

          {/* NAV */}
          <div style={{
            display: "flex",
            flexDirection: "row",     /* NGANG */
            flexWrap: "nowrap",       /* KHÔNG XUỐNG DÒNG */
            alignItems: "center",
            gap: 2,
            flex: "1 1 auto",
            justifyContent: "center",
            overflow: "visible",
          }}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                style={{
                  display: "inline-flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  whiteSpace: "nowrap",
                  background: activePage === item.key ? "rgba(232,0,13,0.1)" : "transparent",
                  border: "none",
                  color: activePage === item.key ? "#E8000D" : "#888",
                  fontFamily: "'Rajdhani',sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  padding: "8px 12px",
                  cursor: "pointer",
                  borderRadius: 3,
                  transition: "color 0.2s, background 0.2s",
                  textTransform: "uppercase",
                  position: "relative",
                  flex: "0 0 auto",
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {activePage === item.key && (
                  <span style={{
                    position: "absolute", bottom: 2,
                    left: "50%", transform: "translateX(-50%)",
                    width: "60%", height: 2,
                    background: "#E8000D", borderRadius: 1,
                    boxShadow: "0 0 8px rgba(232,0,13,0.8)",
                  }} />
                )}
              </button>
            ))}
          </div>

          {/* ACTIONS */}
          <div style={{
            display: "flex", flexDirection: "row",
            flexWrap: "nowrap", alignItems: "center",
            gap: 7, flex: "0 0 auto",
          }}>
            <button onClick={() => setSearchOpen(!searchOpen)} style={iconBtn}>🔍</button>

            <button onClick={() => setActivePage("cart")} style={{ ...iconBtn, position: "relative" }}>
              🛒
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: -6, right: -6,
                  background: "#E8000D", color: "#fff",
                  fontSize: 9, fontWeight: 700,
                  width: 17, height: 17, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Orbitron',monospace",
                }}>{cartCount}</span>
              )}
            </button>

            <button style={iconBtn}>👤</button>

            <div style={{ paddingLeft: 10, borderLeft: "1px solid #222" }}>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 7, color: "#444", letterSpacing: 1.5 }}>Hotline</div>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 13, color: "#E8000D", fontWeight: 700 }}>84+ 339806596</div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div style={{
            padding: "10px 20px", borderTop: "1px solid #161616",
            display: "flex", gap: 8, background: "#0A0A0A",
          }}>
            <input
              autoFocus
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tìm kiếm: iPhone, MacBook, iPad Pro..."
              style={{
                flex: 1, background: "#141414",
                border: "1px solid #2a2a2a", borderRadius: 3,
                padding: "9px 14px", color: "#F0F0F0",
                fontFamily: "'Rajdhani',sans-serif", fontSize: 13, outline: "none",
              }}
            />
            <button style={{
              background: "#E8000D", border: "none", color: "#fff",
              fontFamily: "'Orbitron',monospace", fontSize: 9.5, fontWeight: 700,
              padding: "0 20px", borderRadius: 3, cursor: "pointer", letterSpacing: 1,
            }}>TÌM KIẾM</button>
          </div>
        )}
      </header>
    </>
  );
}

const iconBtn = {
  background: "none",
  border: "1px solid #2a2a2a",
  color: "#aaa",
  fontSize: 15,
  width: 35, height: 35,
  borderRadius: 3,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
