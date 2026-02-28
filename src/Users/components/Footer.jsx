export default function Footer({ setActivePage }) {
  return (
    <footer style={s.footer}>
      {/* Top divider */}
      <div style={s.topLine} />

      <div style={s.inner}>
        {/* Brand */}
        <div style={s.col}>
          <div style={s.brand}>
            <span style={s.brandIcon}>⚡</span>
            <div>
              <div style={s.brandName}>SMART<span style={{ color: "#E8000D" }}>SHOP</span></div>
              <div style={s.brandSub}>CÔNG NGHỆ ĐỈNH CAO</div>
            </div>
          </div>
          <p style={s.brandDesc}>
            Chuyên cung cấp điện thoại, iPad, laptop chính hãng với giá tốt nhất thị trường. Bảo hành 24 tháng, đổi trả 30 ngày.
          </p>
          <div style={s.socials}>
            {["FB", "YT", "TK", "IG"].map((s) => (
              <div key={s} style={sBtn}>{s}</div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div style={s.col}>
          <div style={s.colTitle}>SẢN PHẨM</div>
          {[
            { label: "Điện Thoại", key: "phone" },
            { label: "iPad",       key: "ipad"  },
            { label: "Laptop",     key: "laptop"},
            // { label: "Phụ kiện",   key: "home"  },
          ].map(({ label, key }) => (
            <button key={key} style={s.link} onClick={() => setActivePage(key)}>
              <span style={{ color: "#E8000D", marginRight: 6 }}>›</span>{label}
            </button>
          ))}
        </div>

        {/* Info */}
        <div style={s.col}>
          <div style={s.colTitle}>HỖ TRỢ</div>
          {["Chính sách bảo hành", "Hướng dẫn mua hàng", "Chính sách đổi trả", "Câu hỏi thường gặp", "Liên hệ"].map((t) => (
            <div key={t} style={s.link}>
              <span style={{ color: "#E8000D", marginRight: 6 }}>›</span>{t}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div style={s.col}>
          <div style={s.colTitle}>LIÊN HỆ</div>
          <div style={s.contactRow}><span>📍</span><span>Mỹ Đình, Nam Từ Liêm, Hà Nội</span></div>
          <div style={s.contactRow}><span>📞</span><span style={{ color: "#E8000D", fontFamily: "'Orbitron',monospace", fontSize: 13 }}>84+ 339806596</span></div>
          <div style={s.contactRow}><span>✉️</span><span>support@smartshop.vn</span></div>
          <div style={s.contactRow}><span>🕐</span><span>8:00 - 22:00 mỗi ngày</span></div>
          <div style={s.badge}>
            <span style={s.badgeDot} />
            <span style={{ color: "#3a3", fontSize: 11, fontFamily: "'Orbitron',monospace" }}>ĐANG HOẠT ĐỘNG</span>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={s.bottom}>
        <span>© 2026 SmartShop. All rights reserved.</span>
        <span style={{ color: "#333" }}>|</span>
        <span>Thiết kế bởi <span style={{ color: "#E8000D" }}>SmartShop Team</span></span>
      </div>
    </footer>
  );
}

const sBtn = {
  width:          36, height: 36,
  border:         "1px solid #2a2a2a",
  borderRadius:   3,
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  fontSize:       10,
  fontFamily:     "'Orbitron', monospace",
  fontWeight:     700,
  color:          "#555",
  cursor:         "pointer",
  transition:     "all 0.2s",
};

const s = {
  footer: {
    background:   "#0A0A0A",
    borderTop:    "1px solid #1a1a1a",
    marginTop:    60,
  },
  topLine: {
    height:     2,
    background: "linear-gradient(90deg, transparent, #E8000D 20%, #E8000D 80%, transparent)",
  },
  inner: {
    maxWidth: 1400,
    margin:   "0 auto",
    padding:  "50px 40px",
    display:  "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1.5fr",
    gap:      40,
  },
  col: { display: "flex", flexDirection: "column", gap: 10 },

  brand: { display: "flex", alignItems: "center", gap: 10, marginBottom: 4 },
  brandIcon: { fontSize: 24, filter: "drop-shadow(0 0 6px rgba(232,0,13,0.7))" },
  brandName: {
    fontFamily: "'Bebas Neue', cursive",
    fontSize:   22,
    letterSpacing: 3,
    color:      "#F0F0F0",
    lineHeight: 1,
  },
  brandSub: {
    fontFamily: "'Orbitron', monospace",
    fontSize:   7,
    letterSpacing: 3,
    color:      "#444",
  },
  brandDesc: {
    fontSize:   13,
    color:      "#555",
    lineHeight: 1.7,
    fontFamily: "'Rajdhani', sans-serif",
  },
  socials: { display: "flex", gap: 8, marginTop: 4 },

  colTitle: {
    fontFamily:    "'Orbitron', monospace",
    fontSize:      10,
    fontWeight:    700,
    letterSpacing: 2,
    color:         "#E8000D",
    marginBottom:  6,
    paddingBottom: 8,
    borderBottom:  "1px solid #1a1a1a",
  },
  link: {
    background: "none",
    border:     "none",
    color:      "#555",
    fontFamily: "'Rajdhani', sans-serif",
    fontSize:   13,
    fontWeight: 500,
    cursor:     "pointer",
    textAlign:  "left",
    padding:    0,
    transition: "color 0.2s",
  },
  contactRow: {
    display:    "flex",
    gap:        10,
    fontSize:   13,
    color:      "#555",
    fontFamily: "'Rajdhani', sans-serif",
    alignItems: "flex-start",
  },
  badge: {
    display:    "flex",
    alignItems: "center",
    gap:        8,
    marginTop:  8,
    padding:    "8px 12px",
    background: "rgba(0,100,0,0.08)",
    border:     "1px solid rgba(0,180,0,0.15)",
    borderRadius: 3,
  },
  badgeDot: {
    width:        8, height: 8,
    borderRadius: "50%",
    background:   "#3a3",
    boxShadow:    "0 0 8px rgba(50,170,50,0.8)",
    animation:    "pulse 1.5s ease-in-out infinite",
  },
  bottom: {
    borderTop:   "1px solid #161616",
    padding:     "16px 40px",
    display:     "flex",
    gap:         16,
    fontSize:    12,
    color:       "#333",
    fontFamily:  "'Rajdhani', sans-serif",
    letterSpacing: 0.5,
    maxWidth:    1400,
    margin:      "0 auto",
  },
};
