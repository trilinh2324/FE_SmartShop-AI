import { news } from "../api/data";

export default function NewsPage() {
  return (
    <div style={s.wrap}>
      <div style={s.inner}>
        {/* Header */}
        <div style={s.pageHeader}>
          <div style={s.pageSubtitle}>TIN TỨC CÔNG NGHỆ</div>
          <h1 style={s.pageTitle}>CẬP NHẬT MỚI NHẤT</h1>
          <div style={s.titleBar} />
        </div>

        {/* Featured */}
        <div style={s.featured}>
          <div style={s.featuredBadge}>📰 TIN NỔI BẬT</div>
          <h2 style={s.featuredTitle}>{news[0].title}</h2>
          <p style={s.featuredDesc}>{news[0].summary}</p>
          <div style={s.featuredMeta}>
            <span style={s.cat}>{news[0].cat}</span>
            <span style={s.date}>{news[0].date}</span>
          </div>
        </div>

        {/* Grid */}
        <div style={s.grid}>
          {news.map((item, i) => (
            <div key={item.id} style={{ ...s.card, animationDelay: `${i * 0.1}s` }}>
              <div style={s.cardEmoji}>{item.emoji}</div>
              <div style={s.cardBody}>
                <div style={s.cardCat}>{item.cat}</div>
                <h3 style={s.cardTitle}>{item.title}</h3>
                <p style={s.cardDesc}>{item.summary}</p>
                <div style={s.cardFooter}>
                  <span style={s.cardDate}>📅 {item.date}</span>
                  <button style={s.readMore}>ĐỌC TIẾP →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  wrap:  { background: "#070707", minHeight: "100vh", paddingBottom: 60 },
  inner: { maxWidth: 1400, margin: "0 auto", padding: "50px 24px" },

  pageHeader: { textAlign: "center", marginBottom: 50 },
  pageSubtitle: {
    fontFamily:    "'Orbitron', monospace",
    fontSize:      11,
    letterSpacing: 4,
    color:         "#E8000D",
    marginBottom:  12,
  },
  pageTitle: {
    fontFamily:    "'Bebas Neue', cursive",
    fontSize:      "clamp(40px, 7vw, 72px)",
    letterSpacing: 5,
    color:         "#F0F0F0",
  },
  titleBar: {
    width:        80, height: 3,
    background:   "#E8000D",
    margin:       "14px auto 0",
    borderRadius: 2,
    boxShadow:    "0 0 12px rgba(232,0,13,0.6)",
  },

  featured: {
    background:    "linear-gradient(135deg, #120808, #0F0F0F)",
    border:        "1px solid rgba(232,0,13,0.3)",
    borderLeft:    "4px solid #E8000D",
    borderRadius:  6,
    padding:       "36px 40px",
    marginBottom:  40,
    boxShadow:     "0 8px 40px rgba(232,0,13,0.1)",
    animation:     "fadeInUp 0.5s ease both",
  },
  featuredBadge: {
    fontFamily:    "'Orbitron', monospace",
    fontSize:      10,
    fontWeight:    700,
    letterSpacing: 2,
    color:         "#E8000D",
    marginBottom:  14,
  },
  featuredTitle: {
    fontFamily:    "'Bebas Neue', cursive",
    fontSize:      32,
    letterSpacing: 1,
    color:         "#F0F0F0",
    lineHeight:    1.2,
    marginBottom:  12,
  },
  featuredDesc: {
    fontSize:      15,
    color:         "#666",
    lineHeight:    1.7,
    fontFamily:    "'Rajdhani', sans-serif",
    marginBottom:  20,
  },
  featuredMeta: { display: "flex", gap: 16, alignItems: "center" },

  grid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap:                 20,
  },
  card: {
    background:    "#0F0F0F",
    border:        "1px solid #1e1e1e",
    borderRadius:  6,
    overflow:      "hidden",
    display:       "flex",
    flexDirection: "column",
    transition:    "all 0.3s ease",
    animation:     "fadeInUp 0.5s ease both",
  },
  cardEmoji: {
    fontSize:       60,
    textAlign:      "center",
    padding:        "30px 0",
    background:     "#141414",
    borderBottom:   "1px solid #1a1a1a",
  },
  cardBody:  { padding: "20px", flex: 1, display: "flex", flexDirection: "column", gap: 10 },
  cardCat: {
    fontFamily:    "'Orbitron', monospace",
    fontSize:      9,
    fontWeight:    700,
    letterSpacing: 2,
    color:         "#E8000D",
  },
  cardTitle: {
    fontFamily:    "'Rajdhani', sans-serif",
    fontSize:      15,
    fontWeight:    700,
    color:         "#F0F0F0",
    lineHeight:    1.4,
  },
  cardDesc: {
    fontSize:   13,
    color:      "#555",
    lineHeight: 1.6,
    fontFamily: "'Rajdhani', sans-serif",
    flex:       1,
  },
  cardFooter: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    marginTop:      "auto",
    paddingTop:     12,
    borderTop:      "1px solid #1a1a1a",
  },
  cardDate: { fontSize: 11, color: "#444", fontFamily: "'Orbitron', monospace", letterSpacing: 0.5 },
  readMore: {
    background:    "none",
    border:        "1px solid #E8000D",
    color:         "#E8000D",
    fontFamily:    "'Orbitron', monospace",
    fontSize:      9,
    fontWeight:    700,
    letterSpacing: 1,
    padding:       "6px 14px",
    borderRadius:  2,
    cursor:        "pointer",
  },
  cat:  { background: "#E8000D", color: "#fff", fontSize: 10, fontFamily: "'Orbitron',monospace", padding: "3px 10px", borderRadius: 2, fontWeight: 700, letterSpacing: 1 },
  date: { fontSize: 12, color: "#555", fontFamily: "'Orbitron',monospace" },
};
