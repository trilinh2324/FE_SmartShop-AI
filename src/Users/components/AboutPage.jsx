export default function AboutPage() {
  const team = [
    { name: "Lê Trí Linh", role: "CEO & Founder", emoji: "👨‍💼" },
    { name: "Nguyễn Minh Đức", role: "CTO",            emoji: "👩‍💻" },
    { name: "Vũ Thị Trà My", role: "Head of Sales",  emoji: "👨‍💻" },
  ];

  const milestones = [
    { year: "2022", text: "Thành lập SmartShop với 1 cửa hàng nhỏ tại Thủ Đô Hà Nội" },
    { year: "2023", text: "Mở rộng lên 10 chi nhánh toàn quốc" },
    { year: "2024", text: "Đạt 100.000 khách hàng, ra mắt website thương mại điện tử" },
    { year: "2025", text: "Top 3 chuỗi bán lẻ công nghệ uy tín nhất Việt Nam" },
    { year: "2026", text: "500.000+ khách hàng trên toàn quốc" },
  ];

  return (
    <div style={s.wrap}>
      <div style={s.inner}>

        {/* Hero */}
        <div style={s.hero}>
          <div style={s.heroOverlay} />
          <div style={s.heroContent}>
            <div style={s.heroSub}>CHÚNG TÔI LÀ AI?</div>
            <h1 style={s.heroTitle}>SMART<span style={{ color: "#E8000D" }}>SHOP</span></h1>
            <p style={s.heroDesc}>
              Hơn 8 năm kinh nghiệm trong lĩnh vực phân phối thiết bị công nghệ chính hãng.
              Chúng tôi cam kết mang đến sản phẩm tốt nhất với dịch vụ hoàn hảo nhất.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={s.statsRow}>
          {[
            { num: "500K+", label: "Khách hàng" },
            { num: "50+",   label: "Chi nhánh"  },
            { num: "10K+",  label: "Sản phẩm"   },
            { num: "8+",    label: "Năm kinh nghiệm" },
          ].map(({ num, label }) => (
            <div key={label} style={s.statCard}>
              <span style={s.statNum}>{num}</span>
              <span style={s.statLabel}>{label}</span>
            </div>
          ))}
        </div>

        {/* Values */}
        <div style={s.section}>
          <div style={s.sectionTitle}>GIÁ TRỊ CỐT LÕI</div>
          <div style={s.valuesGrid}>
            {[
              { icon: "🏆", title: "Chính hãng 100%", desc: "Toàn bộ sản phẩm được nhập từ hãng và đại lý ủy quyền chính thức" },
              { icon: "🛡️", title: "Bảo hành 24 tháng", desc: "Cam kết bảo hành toàn diện, hỗ trợ kỹ thuật 24/7 không nghỉ" },
              { icon: "🚚", title: "Giao hàng nhanh", desc: "Ship trong 2 giờ nội thành, toàn quốc trong 24 giờ" },
              { icon: "💳", title: "Thanh toán linh hoạt", desc: "Trả góp 0% lãi suất, chấp nhận 20+ phương thức thanh toán" },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={s.valueCard}>
                <span style={s.valueIcon}>{icon}</span>
                <h3 style={s.valueTitle}>{title}</h3>
                <p style={s.valueDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div style={s.section}>
          <div style={s.sectionTitle}>HÀNH TRÌNH PHÁT TRIỂN</div>
          <div style={s.timeline}>
            {milestones.map(({ year, text }, i) => (
              <div key={year} style={s.timelineItem}>
                <div style={s.timelineLeft}>
                  <span style={s.timelineYear}>{year}</span>
                </div>
                <div style={s.timelineDot} />
                <div style={s.timelineRight}>
                  <p style={s.timelineText}>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={s.section}>
          <div style={s.sectionTitle}>ĐỘI NGŨ LÃNH ĐẠO</div>
          <div style={s.teamGrid}>
            {team.map(({ name, role, emoji }) => (
              <div key={name} style={s.teamCard}>
                <div style={s.teamEmoji}>{emoji}</div>
                <div style={s.teamName}>{name}</div>
                <div style={s.teamRole}>{role}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const s = {
  wrap:  { background: "#070707", minHeight: "100vh", paddingBottom: 60 },
  inner: { maxWidth: 1400, margin: "0 auto", padding: "0 24px" },

  hero: {
    position:   "relative",
    background: "linear-gradient(135deg, #120808 0%, #0F0F0F 60%, #0A0A0A 100%)",
    borderBottom: "2px solid rgba(232,0,13,0.2)",
    padding:    "80px 40px",
    marginBottom: 50,
    overflow:   "hidden",
    textAlign:  "center",
  },
  heroOverlay: {
    position:        "absolute",
    inset:           0,
    backgroundImage: "linear-gradient(rgba(232,0,13,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,0,13,0.03) 1px, transparent 1px)",
    backgroundSize:  "40px 40px",
    pointerEvents:   "none",
  },
  heroContent: { position: "relative", zIndex: 1 },
  heroSub: {
    fontFamily:    "'Orbitron', monospace",
    fontSize:      11,
    letterSpacing: 5,
    color:         "#E8000D",
    marginBottom:  12,
  },
  heroTitle: {
    fontFamily:    "'Bebas Neue', cursive",
    fontSize:      "clamp(60px, 10vw, 110px)",
    letterSpacing: 8,
    color:         "#F0F0F0",
    lineHeight:    1,
    textShadow:    "0 0 60px rgba(232,0,13,0.2)",
  },
  heroDesc: {
    fontFamily:  "'Rajdhani', sans-serif",
    fontSize:    16,
    color:       "#666",
    maxWidth:    600,
    margin:      "20px auto 0",
    lineHeight:  1.7,
  },

  statsRow: {
    display:             "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap:                 16,
    marginBottom:        50,
  },
  statCard: {
    background:    "#0F0F0F",
    border:        "1px solid #1e1e1e",
    borderTop:     "2px solid #E8000D",
    borderRadius:  4,
    padding:       "28px",
    display:       "flex",
    flexDirection: "column",
    alignItems:    "center",
    gap:           8,
    animation:     "fadeInUp 0.5s ease both",
    boxShadow:     "0 4px 20px rgba(232,0,13,0.06)",
  },
  statNum: {
    fontFamily:    "'Orbitron', monospace",
    fontSize:      32,
    fontWeight:    900,
    color:         "#E8000D",
    letterSpacing: 1,
  },
  statLabel: {
    fontFamily:    "'Rajdhani', sans-serif",
    fontSize:      13,
    color:         "#555",
    fontWeight:    600,
    letterSpacing: 1,
  },

  section:      { marginBottom: 60 },
  sectionTitle: {
    fontFamily:    "'Bebas Neue', cursive",
    fontSize:      32,
    letterSpacing: 4,
    color:         "#F0F0F0",
    marginBottom:  28,
    paddingBottom: 14,
    borderBottom:  "1px solid #1a1a1a",
    display:       "flex",
    alignItems:    "center",
    gap:           14,
  },

  valuesGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap:                 20,
  },
  valueCard: {
    background:    "#0F0F0F",
    border:        "1px solid #1e1e1e",
    borderRadius:  6,
    padding:       "28px 24px",
    transition:    "all 0.3s",
    animation:     "fadeInUp 0.5s ease both",
  },
  valueIcon:  { fontSize: 36, display: "block", marginBottom: 14 },
  valueTitle: {
    fontFamily:    "'Rajdhani', sans-serif",
    fontSize:      17,
    fontWeight:    700,
    color:         "#F0F0F0",
    marginBottom:  8,
    letterSpacing: 0.5,
  },
  valueDesc: {
    fontSize:   13,
    color:      "#555",
    lineHeight: 1.7,
    fontFamily: "'Rajdhani', sans-serif",
  },

  timeline: { display: "flex", flexDirection: "column", gap: 0 },
  timelineItem: {
    display:     "flex",
    alignItems:  "center",
    gap:         20,
    padding:     "16px 0",
    borderBottom: "1px solid #141414",
    animation:   "slideInLeft 0.5s ease both",
  },
  timelineLeft: { width: 70, flexShrink: 0, textAlign: "right" },
  timelineYear: {
    fontFamily:    "'Orbitron', monospace",
    fontSize:      14,
    fontWeight:    700,
    color:         "#E8000D",
    letterSpacing: 1,
  },
  timelineDot: {
    width:        12, height: 12,
    background:   "#E8000D",
    borderRadius: "50%",
    flexShrink:   0,
    boxShadow:    "0 0 12px rgba(232,0,13,0.6)",
  },
  timelineRight: { flex: 1 },
  timelineText: {
    fontFamily:  "'Rajdhani', sans-serif",
    fontSize:    15,
    color:       "#888",
    fontWeight:  500,
  },

  teamGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap:                 20,
  },
  teamCard: {
    background:    "#0F0F0F",
    border:        "1px solid #1e1e1e",
    borderRadius:  6,
    padding:       "32px 20px",
    textAlign:     "center",
    animation:     "fadeInUp 0.5s ease both",
    transition:    "all 0.3s",
  },
  teamEmoji:  { fontSize: 56, display: "block", marginBottom: 14 },
  teamName: {
    fontFamily:    "'Rajdhani', sans-serif",
    fontSize:      16,
    fontWeight:    700,
    color:         "#F0F0F0",
    marginBottom:  4,
  },
  teamRole: {
    fontFamily:    "'Orbitron', monospace",
    fontSize:      9,
    color:         "#E8000D",
    letterSpacing: 1.5,
  },
};
