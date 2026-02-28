import { useState, useEffect } from "react";

const SLIDES = [
  {
    title:    "iPhone 16 Pro Max",
    subtitle: "ĐỈNH CAO CÔNG NGHỆ",
    desc:     "Chip A18 Pro · Camera 48MP · Titanium Design",
    cta:      "Khám phá ngay",
    emoji:    "📱",
    accent:   "#E8000D",
    bg:       "linear-gradient(135deg, #0D0000 0%, #1A0505 50%, #0A0A0A 100%)",
  },
  {
    title:    "MacBook Pro M4",
    subtitle: "HIỆU NĂNG VƯỢT TRỘI",
    desc:     "Chip M4 · 22 giờ pin · Space Black",
    cta:      "Mua ngay",
    emoji:    "💻",
    accent:   "#E8000D",
    bg:       "linear-gradient(135deg, #000D1A 0%, #050E1A 50%, #0A0A0A 100%)",
  },
  {
    title:    "iPad Pro M4",
    subtitle: "MỎNG NHẤT MỌI THỜI ĐẠI",
    desc:     "Chip M4 · OLED 13\" · Apple Pencil Pro",
    cta:      "Xem chi tiết",
    emoji:    "📟",
    accent:   "#E8000D",
    bg:       "linear-gradient(135deg, #001A0A 0%, #051A0A 50%, #0A0A0A 100%)",
  },
];

export default function Banner({ setActivePage }) {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
      setAnimKey((k) => k + 1);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[current];

  return (
    <section style={{ ...s.wrap, background: slide.bg }}>
      {/* Grid lines overlay */}
      <div style={s.gridLines} />

      {/* Corner accents */}
      <div style={{ ...s.corner, top: 20, left: 20, borderTop: "2px solid #E8000D", borderLeft: "2px solid #E8000D" }} />
      <div style={{ ...s.corner, top: 20, right: 20, borderTop: "2px solid #E8000D", borderRight: "2px solid #E8000D" }} />
      <div style={{ ...s.corner, bottom: 20, left: 20, borderBottom: "2px solid #E8000D", borderLeft: "2px solid #E8000D" }} />
      <div style={{ ...s.corner, bottom: 20, right: 20, borderBottom: "2px solid #E8000D", borderRight: "2px solid #E8000D" }} />

      <div style={s.inner} key={animKey}>
        {/* Text side */}
        <div style={s.textSide}>
          <div style={s.subtitle}>{slide.subtitle}</div>
          <h1 style={s.title}>{slide.title}</h1>
          <div style={s.divider} />
          <p style={s.desc}>{slide.desc}</p>
          <div style={s.ctaRow}>
            <button style={s.ctaBtn} onClick={() => setActivePage("phone")}>
              {slide.cta} →
            </button>
            <button style={s.ctaOutline} onClick={() => setActivePage("about")}>
              Tìm hiểu thêm
            </button>
          </div>
          {/* Stats */}
          <div style={s.stats}>
            {[["10K+", "Sản phẩm"], ["500K+", "Khách hàng"], ["24/7", "Hỗ trợ"]].map(([n, l]) => (
              <div key={l} style={s.stat}>
                <span style={s.statNum}>{n}</span>
                <span style={s.statLabel}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emoji side */}
        <div style={s.imgSide}>
          <div style={s.emojiRing}>
            <div style={s.emojiInner}>{slide.emoji}</div>
          </div>
          <div style={s.glowDot} />
        </div>
      </div>

      {/* Dots */}
      <div style={s.dots}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            style={{
              ...s.dot,
              background:    i === current ? "#E8000D" : "#333",
              width:         i === current ? 28 : 8,
              boxShadow:     i === current ? "0 0 12px rgba(232,0,13,0.8)" : "none",
            }}
            onClick={() => { setCurrent(i); setAnimKey((k) => k + 1); }}
          />
        ))}
      </div>
    </section>
  );
}

const s = {
  wrap: {
    position:   "relative",
    overflow:   "hidden",
    minHeight:  520,
    display:    "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderBottom: "2px solid #1a1a1a",
    transition: "background 0.8s ease",
  },
  gridLines: {
    position:   "absolute",
    inset:      0,
    backgroundImage:
      "linear-gradient(rgba(232,0,13,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,0,13,0.04) 1px, transparent 1px)",
    backgroundSize: "60px 60px",
    pointerEvents: "none",
  },
  corner: {
    position:  "absolute",
    width:     30, height: 30,
    opacity:   0.6,
  },
  inner: {
    maxWidth: 1400,
    margin:   "0 auto",
    padding:  "60px 40px",
    display:  "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap:      40,
    width:    "100%",
    animation: "fadeIn 0.6s ease both",
  },
  textSide: {
    flex:      1,
    maxWidth:  600,
    animation: "slideInLeft 0.6s ease both",
  },
  subtitle: {
    fontFamily:    "'Orbitron', monospace",
    fontSize:      11,
    fontWeight:    600,
    letterSpacing: 4,
    color:         "#E8000D",
    marginBottom:  12,
    textTransform: "uppercase",
  },
  title: {
    fontFamily:    "'Bebas Neue', cursive",
    fontSize:      "clamp(42px, 7vw, 80px)",
    letterSpacing: 3,
    color:         "#F0F0F0",
    lineHeight:    1,
    textShadow:    "0 0 40px rgba(232,0,13,0.2)",
  },
  divider: {
    width:        80,
    height:       3,
    background:   "linear-gradient(90deg, #E8000D, transparent)",
    margin:       "20px 0",
    borderRadius: 2,
  },
  desc: {
    fontFamily:    "'Rajdhani', sans-serif",
    fontSize:      16,
    color:         "#888",
    letterSpacing: 1,
    marginBottom:  28,
  },
  ctaRow: {
    display:       "flex",
    gap:           14,
    marginBottom:  36,
    flexWrap:      "wrap",
  },
  ctaBtn: {
    background:    "linear-gradient(135deg, #E8000D, #8B0000)",
    border:        "none",
    color:         "#fff",
    fontFamily:    "'Orbitron', monospace",
    fontSize:      13,
    fontWeight:    700,
    letterSpacing: 1.5,
    padding:       "14px 32px",
    borderRadius:  3,
    cursor:        "pointer",
    boxShadow:     "0 6px 24px rgba(232,0,13,0.4)",
    transition:    "all 0.3s",
  },
  ctaOutline: {
    background:    "transparent",
    border:        "1px solid #333",
    color:         "#888",
    fontFamily:    "'Rajdhani', sans-serif",
    fontSize:      14,
    fontWeight:    600,
    letterSpacing: 1,
    padding:       "14px 28px",
    borderRadius:  3,
    cursor:        "pointer",
    transition:    "all 0.3s",
  },
  stats: {
    display:       "flex",
    gap:           32,
    borderTop:     "1px solid #1e1e1e",
    paddingTop:    24,
  },
  stat:      { display: "flex", flexDirection: "column", gap: 2 },
  statNum:   { fontFamily: "'Orbitron', monospace", fontSize: 20, fontWeight: 700, color: "#E8000D" },
  statLabel: { fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: "#555", letterSpacing: 1.5 },

  imgSide: {
    flex:            0.8,
    display:         "flex",
    justifyContent:  "center",
    alignItems:      "center",
    position:        "relative",
    animation:       "slideInRight 0.6s ease both",
  },
  emojiRing: {
    width:          280,
    height:         280,
    border:         "1px solid rgba(232,0,13,0.25)",
    borderRadius:   "50%",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    position:       "relative",
    boxShadow:      "0 0 60px rgba(232,0,13,0.12), inset 0 0 60px rgba(232,0,13,0.04)",
    animation:      "glow 3s ease-in-out infinite",
  },
  emojiInner: {
    fontSize:   120,
    animation:  "float 4s ease-in-out infinite",
    filter:     "drop-shadow(0 0 30px rgba(232,0,13,0.4))",
  },
  glowDot: {
    position:     "absolute",
    width:         80, height: 80,
    background:    "radial-gradient(circle, rgba(232,0,13,0.35), transparent 70%)",
    borderRadius:  "50%",
    bottom:        30, right: 30,
    animation:     "pulse 2s ease-in-out infinite",
  },

  dots: {
    position:       "absolute",
    bottom:         20,
    left:           "50%",
    transform:      "translateX(-50%)",
    display:        "flex",
    gap:            8,
    alignItems:     "center",
  },
  dot: {
    height:       8,
    borderRadius: 4,
    border:       "none",
    cursor:       "pointer",
    transition:   "all 0.4s ease",
    padding:      0,
  },
};
