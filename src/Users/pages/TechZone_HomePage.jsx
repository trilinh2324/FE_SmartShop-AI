import { useState, useEffect } from "react";

/* ============================================================
   TECHZONE - Full React App
   Cấu trúc file: Users/pages/HomePage.jsx (entry point)
   Dependencies: ../api/data.js | ../components/* | ../css/global.css
   ============================================================ */

// ── DATA (from Users/api/data.js) ───────────────────────────
const phones = [
  { id:1,  name:"iPhone 16 Pro Max",       price:34990000, oldPrice:39990000, tag:"HOT",    specs:"256GB | Titanium Black",    category:"phone",  image:"📱", rating:4.9, sold:1240 },
  { id:2,  name:"Samsung Galaxy S25 Ultra", price:29990000, oldPrice:34990000, tag:"NEW",    specs:"512GB | Phantom Black",     category:"phone",  image:"📱", rating:4.8, sold:987  },
  { id:3,  name:"Xiaomi 14 Ultra",          price:22990000, oldPrice:26990000, tag:"SALE",   specs:"512GB | Black",             category:"phone",  image:"📱", rating:4.7, sold:654  },
  { id:4,  name:"OPPO Find X8 Pro",         price:19990000, oldPrice:23990000, tag:"",       specs:"256GB | Midnight Black",    category:"phone",  image:"📱", rating:4.6, sold:432  },
  { id:5,  name:"OnePlus 13",               price:17490000, oldPrice:20990000, tag:"SALE",   specs:"512GB | Black Eclipse",     category:"phone",  image:"📱", rating:4.7, sold:321  },
  { id:6,  name:"Google Pixel 9 Pro",       price:21990000, oldPrice:25990000, tag:"NEW",    specs:"256GB | Obsidian",          category:"phone",  image:"📱", rating:4.8, sold:280  },
];
const ipads = [
  { id:7,  name:'iPad Pro M4 13"',   price:39990000, oldPrice:45990000, tag:"NEW",  specs:"256GB WiFi | Space Black", category:"ipad",   image:"📟", rating:4.9, sold:876 },
  { id:8,  name:'iPad Air M2 11"',   price:18990000, oldPrice:22990000, tag:"HOT",  specs:"128GB WiFi | Midnight",    category:"ipad",   image:"📟", rating:4.8, sold:643 },
  { id:9,  name:"iPad Mini 7",        price:14990000, oldPrice:17990000, tag:"SALE", specs:"128GB WiFi | Space Gray",  category:"ipad",   image:"📟", rating:4.7, sold:421 },
  { id:10, name:"iPad Gen 10",        price:11990000, oldPrice:13990000, tag:"",     specs:"64GB WiFi | Silver",       category:"ipad",   image:"📟", rating:4.5, sold:387 },
  { id:11, name:'iPad Pro M4 11"',   price:29990000, oldPrice:34990000, tag:"NEW",  specs:"512GB WiFi+5G | Black",    category:"ipad",   image:"📟", rating:4.9, sold:234 },
  { id:12, name:'iPad Air M2 13"',   price:23990000, oldPrice:27990000, tag:"HOT",  specs:"256GB WiFi | Midnight",    category:"ipad",   image:"📟", rating:4.8, sold:198 },
];
const laptops = [
  { id:13, name:'MacBook Pro M4 14"',       price:52990000, oldPrice:59990000, tag:"NEW",    specs:"16GB | 512GB | Space Black",    category:"laptop", image:"💻", rating:4.9, sold:543 },
  { id:14, name:'MacBook Air M3 15"',       price:38990000, oldPrice:44990000, tag:"HOT",    specs:"8GB | 256GB | Midnight",        category:"laptop", image:"💻", rating:4.8, sold:721 },
  { id:15, name:"ASUS ROG Zephyrus G16",    price:49990000, oldPrice:55990000, tag:"GAMING", specs:"RTX4090 | 32GB | 2TB | Black",  category:"laptop", image:"💻", rating:4.9, sold:312 },
  { id:16, name:"Dell XPS 15 9530",         price:44990000, oldPrice:50990000, tag:"SALE",   specs:"RTX4060 | 16GB | 1TB | Gray",   category:"laptop", image:"💻", rating:4.7, sold:287 },
  { id:17, name:"Lenovo ThinkPad X1 Carbon",price:39990000, oldPrice:45990000, tag:"",       specs:"i7 | 32GB | 1TB | Black",       category:"laptop", image:"💻", rating:4.8, sold:198 },
  { id:18, name:"HP Spectre x360 14",       price:36990000, oldPrice:42990000, tag:"NEW",    specs:"i7 | 16GB | 1TB | Nightfall",   category:"laptop", image:"💻", rating:4.7, sold:165 },
];
const newsData = [
  { id:1, title:"iPhone 17 Series: Rò rỉ thiết kế hoàn toàn mới với camera AI siêu khủng",               date:"28/02/2026", cat:"TIN TỨC",    emoji:"📱", summary:"Apple đang chuẩn bị ra mắt iPhone 17 với thiết kế đột phá, tích hợp AI camera thế hệ mới nhất..." },
  { id:2, title:"Samsung Galaxy S26 Ultra chip Snapdragon 8 Elite Gen 2 mạnh nhất từ trước đến nay",      date:"27/02/2026", cat:"CÔNG NGHỆ",  emoji:"📟", summary:"Samsung xác nhận Galaxy S26 Ultra sẽ sử dụng chip Snapdragon 8 Elite Gen 2, hiệu năng tăng 40%..." },
  { id:3, title:"MacBook Pro M5: Apple sắp ra mắt với hiệu năng tăng gấp 3 lần thế hệ trước",            date:"26/02/2026", cat:"LAPTOP",     emoji:"💻", summary:"Chip M5 của Apple hứa hẹn cách mạng hóa hiệu năng xử lý AI, GPU tăng đáng kinh ngạc..." },
  { id:4, title:"iPad Pro 2026 tích hợp màn hình gập - Cuộc cách mạng tablet hoàn toàn mới",             date:"25/02/2026", cat:"IPAD",       emoji:"📟", summary:"Apple lần đầu thử nghiệm iPad Pro với màn hình gập OLED, dự kiến ra mắt cuối năm 2026..." },
];

const fmt = (p) => p.toLocaleString("vi-VN") + "đ";
const disc = (p, op) => Math.round((1 - p / op) * 100);

const TAG_COLORS = {
  HOT:    "#ff4500",
  NEW:    "#0088ff",
  SALE:   "#E8000D",
  GAMING: "#9b00ff",
};

// ── GLOBAL STYLES ───────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
    :root{
      --red:#E8000D;--red-glow:rgba(232,0,13,0.35);
      --black:#070707;--black2:#0F0F0F;--black3:#161616;
      --white:#F0F0F0;--gray:#555;--gray2:#888;
    }
    body{background:var(--black);color:var(--white);font-family:'Rajdhani',sans-serif;overflow-x:hidden;}
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:#0F0F0F}
    ::-webkit-scrollbar-thumb{background:#E8000D;border-radius:2px}
    ::selection{background:#E8000D;color:#fff}
    @keyframes fadeInUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideLeft{from{opacity:0;transform:translateX(-36px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideRight{from{opacity:0;transform:translateX(36px)}to{opacity:1;transform:translateX(0)}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes glowPulse{0%,100%{box-shadow:0 0 12px var(--red-glow)}50%{box-shadow:0 0 30px var(--red-glow),0 0 60px rgba(232,0,13,0.12)}}
    @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
    @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes scanMove{0%{transform:translateX(-100%)}100%{transform:translateX(400%)}}
    button:hover{opacity:.88}
  `}</style>
);

// ── HEADER ──────────────────────────────────────────────────
const NAV = [
  { label:"Điện Thoại", key:"phone",  icon:"📱" },
  { label:"iPad",       key:"ipad",   icon:"📟" },
  { label:"Laptop",     key:"laptop", icon:"💻" },
  { label:"Tin Tức",    key:"news",   icon:"📰" },
  { label:"Giới Thiệu", key:"about",  icon:"ℹ️"  },
];

function Header({ page, setPage, cartCount }) {
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      {/* Announcement */}
      <div style={{ background:"linear-gradient(90deg,#7a0008,#E8000D,#7a0008)", backgroundSize:"200%", animation:"shimmer 3s linear infinite", padding:"7px", textAlign:"center", fontSize:12, fontFamily:"'Rajdhani',sans-serif", fontWeight:600, letterSpacing:.8, color:"rgba(255,255,255,.9)" }}>
        🔥 FLASH SALE — Giảm đến <b style={{color:"#fff"}}>40%</b> &nbsp;|&nbsp; Free ship đơn từ 500K &nbsp;|&nbsp; Bảo hành 24 tháng chính hãng
      </div>

      {/* Main header */}
      <header style={{ position:"sticky", top:0, zIndex:1000, background: scrolled?"rgba(7,7,7,.97)":"#0F0F0F", borderBottom:"2px solid #E8000D", boxShadow: scrolled?"0 4px 28px rgba(232,0,13,.25)":"none", transition:"all .3s", backdropFilter:"blur(12px)" }}>
        {/* Scan line */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(232,0,13,.6),transparent)", animation:"scanMove 5s linear infinite", pointerEvents:"none" }} />

        <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 24px", height:68, display:"flex", alignItems:"center", gap:20 }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", flexShrink:0 }} onClick={()=>setPage("home")}>
            <span style={{ fontSize:26, filter:"drop-shadow(0 0 8px rgba(232,0,13,.8))", animation:"pulse 2.5s ease-in-out infinite" }}>⚡</span>
            <div>
              <div style={{ fontFamily:"'Bebas Neue',cursive", fontSize:26, letterSpacing:3, color:"#F0F0F0", lineHeight:1 }}>
                TECH<span style={{color:"#E8000D"}}>ZONE</span>
              </div>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:7, letterSpacing:3, color:"#444" }}>CÔNG NGHỆ ĐỈNH CAO</div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display:"flex", gap:2, flex:1, justifyContent:"center" }}>
            {NAV.map(n => (
              <button key={n.key} onClick={()=>setPage(n.key)} style={{
                background: page===n.key?"rgba(232,0,13,.1)":"none",
                border:     "none",
                color:      page===n.key?"#E8000D":"#888",
                fontFamily: "'Rajdhani',sans-serif",
                fontSize:   14, fontWeight:600, letterSpacing:.8,
                padding:    "8px 15px", cursor:"pointer", borderRadius:3,
                transition: "all .2s", position:"relative",
                display:"flex", alignItems:"center", gap:5,
                textTransform:"uppercase",
              }}>
                <span style={{fontSize:14}}>{n.icon}</span>
                {n.label}
                {page===n.key && <span style={{ position:"absolute", bottom:2, left:"50%", transform:"translateX(-50%)", width:"55%", height:2, background:"#E8000D", borderRadius:1, boxShadow:"0 0 8px rgba(232,0,13,.8)" }} />}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <button onClick={()=>setSearch(!search)} style={iconBtnStyle}>🔍</button>
            <button onClick={()=>setPage("cart")} style={{ ...iconBtnStyle, position:"relative" }}>
              🛒
              {cartCount>0 && <span style={{ position:"absolute", top:-6, right:-6, background:"#E8000D", color:"#fff", fontSize:9, fontWeight:700, width:17, height:17, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Orbitron',monospace" }}>{cartCount}</span>}
            </button>
            <button style={iconBtnStyle}>👤</button>
            <div style={{ paddingLeft:10, borderLeft:"1px solid #222" }}>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:8, color:"#444", letterSpacing:1.5 }}>Hotline</div>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:12, color:"#E8000D", fontWeight:700, letterSpacing:.8 }}>1800 6789</div>
            </div>
          </div>
        </div>

        {search && (
          <div style={{ padding:"10px 24px", borderTop:"1px solid #161616", display:"flex", gap:8, background:"#0A0A0A", animation:"fadeInUp .2s ease" }}>
            <input placeholder="Tìm kiếm: iPhone, MacBook, iPad Pro..." autoFocus style={{ flex:1, background:"#161616", border:"1px solid #2a2a2a", borderRadius:3, padding:"10px 16px", color:"#F0F0F0", fontFamily:"'Rajdhani',sans-serif", fontSize:14, outline:"none" }} />
            <button style={{ background:"#E8000D", border:"none", color:"#fff", fontFamily:"'Orbitron',monospace", fontSize:10, fontWeight:700, padding:"0 24px", borderRadius:3, cursor:"pointer", letterSpacing:1 }}>TÌM KIẾM</button>
          </div>
        )}
      </header>
    </>
  );
}
const iconBtnStyle = { background:"none", border:"1px solid #2a2a2a", color:"#ccc", fontSize:16, width:36, height:36, borderRadius:3, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s" };

// ── BANNER ──────────────────────────────────────────────────
const SLIDES = [
  { title:"iPhone 16 Pro Max",  sub:"ĐỈNH CAO CÔNG NGHỆ",    desc:"Chip A18 Pro · Camera 48MP · Titanium Black",     emoji:"📱", bg:"linear-gradient(135deg,#0D0000,#1A0505,#0A0A0A)" },
  { title:"MacBook Pro M4",     sub:"HIỆU NĂNG VƯỢT TRỘI",   desc:"Chip M4 · 22 giờ pin · Space Black",              emoji:"💻", bg:"linear-gradient(135deg,#000915,#040E1A,#0A0A0A)" },
  { title:'iPad Pro M4 13"',   sub:"MỎNG NHẤT MỌI THỜI ĐẠI",desc:"Chip M4 · OLED 13\" · Apple Pencil Pro",          emoji:"📟", bg:"linear-gradient(135deg,#001309,#03120A,#0A0A0A)" },
];

function Banner({ setPage }) {
  const [cur, setCur] = useState(0);
  const [key, setKey] = useState(0);
  useEffect(()=>{
    const t=setInterval(()=>{ setCur(c=>(c+1)%SLIDES.length); setKey(k=>k+1); },5000);
    return ()=>clearInterval(t);
  },[]);
  const s=SLIDES[cur];
  return (
    <section style={{ position:"relative", overflow:"hidden", minHeight:510, display:"flex", flexDirection:"column", justifyContent:"center", background:s.bg, borderBottom:"2px solid #1a1a1a", transition:"background .8s ease" }}>
      {/* Grid bg */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(232,0,13,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(232,0,13,.035) 1px,transparent 1px)", backgroundSize:"55px 55px", pointerEvents:"none" }} />
      {/* Corners */}
      {[[{top:16,left:16},{borderTop:"2px solid #E8000D",borderLeft:"2px solid #E8000D"}],[{top:16,right:16},{borderTop:"2px solid #E8000D",borderRight:"2px solid #E8000D"}],[{bottom:16,left:16},{borderBottom:"2px solid #E8000D",borderLeft:"2px solid #E8000D"}],[{bottom:16,right:16},{borderBottom:"2px solid #E8000D",borderRight:"2px solid #E8000D"}]].map(([pos,border],i)=>(
        <div key={i} style={{ position:"absolute", width:28, height:28, opacity:.55, ...pos, ...border }} />
      ))}
      <div key={key} style={{ maxWidth:1400, margin:"0 auto", padding:"55px 40px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:40, width:"100%", animation:"fadeIn .6s ease both" }}>
        {/* Text */}
        <div style={{ flex:1, maxWidth:580, animation:"slideLeft .6s ease both" }}>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, fontWeight:600, letterSpacing:4, color:"#E8000D", marginBottom:10, textTransform:"uppercase" }}>{s.sub}</div>
          <h1 style={{ fontFamily:"'Bebas Neue',cursive", fontSize:"clamp(40px,7vw,78px)", letterSpacing:3, color:"#F0F0F0", lineHeight:1, textShadow:"0 0 40px rgba(232,0,13,.18)" }}>{s.title}</h1>
          <div style={{ width:70, height:3, background:"linear-gradient(90deg,#E8000D,transparent)", margin:"18px 0", borderRadius:2 }} />
          <p style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:16, color:"#777", letterSpacing:.8, marginBottom:26 }}>{s.desc}</p>
          <div style={{ display:"flex", gap:12, marginBottom:34, flexWrap:"wrap" }}>
            <button onClick={()=>setPage("phone")} style={{ background:"linear-gradient(135deg,#E8000D,#8B0000)", border:"none", color:"#fff", fontFamily:"'Orbitron',monospace", fontSize:12, fontWeight:700, letterSpacing:1.2, padding:"13px 30px", borderRadius:3, cursor:"pointer", boxShadow:"0 6px 22px rgba(232,0,13,.4)" }}>
              Khám phá ngay →
            </button>
            <button onClick={()=>setPage("about")} style={{ background:"transparent", border:"1px solid #2a2a2a", color:"#777", fontFamily:"'Rajdhani',sans-serif", fontSize:14, fontWeight:600, padding:"13px 26px", borderRadius:3, cursor:"pointer" }}>
              Tìm hiểu thêm
            </button>
          </div>
          <div style={{ display:"flex", gap:28, borderTop:"1px solid #1a1a1a", paddingTop:22 }}>
            {[["10K+","Sản phẩm"],["500K+","Khách hàng"],["24/7","Hỗ trợ"]].map(([n,l])=>(
              <div key={l}>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:700, color:"#E8000D" }}>{n}</div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:11, color:"#444", letterSpacing:1.5 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Emoji */}
        <div style={{ flex:.75, display:"flex", justifyContent:"center", alignItems:"center", animation:"slideRight .6s ease both" }}>
          <div style={{ width:260, height:260, border:"1px solid rgba(232,0,13,.22)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 60px rgba(232,0,13,.1)", animation:"glowPulse 3s ease-in-out infinite" }}>
            <span style={{ fontSize:110, animation:"float 4s ease-in-out infinite", filter:"drop-shadow(0 0 28px rgba(232,0,13,.4))" }}>{s.emoji}</span>
          </div>
        </div>
      </div>
      {/* Dots */}
      <div style={{ position:"absolute", bottom:16, left:"50%", transform:"translateX(-50%)", display:"flex", gap:8, alignItems:"center" }}>
        {SLIDES.map((_,i)=>(
          <button key={i} onClick={()=>{setCur(i);setKey(k=>k+1);}} style={{ height:7, borderRadius:4, border:"none", cursor:"pointer", transition:"all .4s", padding:0, background: i===cur?"#E8000D":"#2a2a2a", width: i===cur?26:7, boxShadow: i===cur?"0 0 10px rgba(232,0,13,.7)":"none" }} />
        ))}
      </div>
    </section>
  );
}

// ── PRODUCT CARD ─────────────────────────────────────────────
function ProductCard({ p, onAdd }) {
  const [hov, setHov] = useState(false);
  const [added, setAdded] = useState(false);
  const d = disc(p.price, p.oldPrice);
  const tc = TAG_COLORS[p.tag];

  const doAdd = (e) => { e.stopPropagation(); onAdd(p); setAdded(true); setTimeout(()=>setAdded(false),1800); };

  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ position:"relative", borderRadius:5, overflow:"hidden", cursor:"pointer", transition:"all .3s cubic-bezier(.4,0,.2,1)", animation:"fadeInUp .5s ease both",
        background: hov?"#120808":"#0F0F0F",
        border: `1px solid ${hov?"#E8000D":"#1e1e1e"}`,
        transform: hov?"translateY(-6px) scale(1.012)":"none",
        boxShadow: hov?"0 14px 42px rgba(232,0,13,.25),0 0 0 1px rgba(232,0,13,.12)":"0 3px 16px rgba(0,0,0,.5)",
      }}>
      {tc && <div style={{ position:"absolute", top:10, left:10, zIndex:3, background:tc, color:"#fff", fontSize:8.5, fontWeight:700, fontFamily:"'Orbitron',monospace", letterSpacing:1.5, padding:"3px 9px", borderRadius:2, boxShadow:`0 0 12px ${tc}80` }}>{p.tag}</div>}
      {d>0 && <div style={{ position:"absolute", top:10, right:10, zIndex:3, background:"#161616", border:"1px solid #E8000D", color:"#E8000D", fontSize:9.5, fontWeight:700, fontFamily:"'Orbitron',monospace", padding:"2px 8px", borderRadius:2 }}>-{d}%</div>}

      <div style={{ height:190, display:"flex", alignItems:"center", justifyContent:"center", background:hov?"#1a0808":"#141414", borderBottom:"1px solid #1a1a1a", transition:"background .3s" }}>
        <span style={{ fontSize:70, transition:"all .35s", transform:hov?"scale(1.18) translateY(-5px)":"scale(1)", filter:hov?"drop-shadow(0 8px 18px rgba(232,0,13,.45))":"drop-shadow(0 3px 8px rgba(0,0,0,.6))" }}>{p.image}</span>
      </div>

      <div style={{ padding:"15px 15px 17px" }}>
        <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:14.5, fontWeight:700, color:"#F0F0F0", lineHeight:1.3, marginBottom:4, letterSpacing:.3 }}>{p.name}</div>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:"#555", letterSpacing:.4, marginBottom:8 }}>{p.specs}</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <span style={{ color:"#e6a800", fontSize:12, letterSpacing:-1 }}>{"★".repeat(Math.floor(p.rating))}<span style={{color:"#333"}}>{"★".repeat(5-Math.floor(p.rating))}</span></span>
          <span style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:"#444" }}>Đã bán: {p.sold.toLocaleString()}</span>
        </div>
        <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:13 }}>
          <span style={{ fontFamily:"'Orbitron',monospace", fontSize:16, fontWeight:700, color:"#E8000D", letterSpacing:.4 }}>{fmt(p.price)}</span>
          <span style={{ fontSize:11, color:"#383838", textDecoration:"line-through", fontFamily:"'Rajdhani',sans-serif" }}>{fmt(p.oldPrice)}</span>
        </div>
        <div style={{ display:"flex", gap:7 }}>
          <button onClick={doAdd} style={{ flex:1, border:"none", color:"#fff", fontFamily:"'Orbitron',monospace", fontSize:9.5, fontWeight:700, letterSpacing:.8, padding:"9px 0", borderRadius:3, cursor:"pointer", transition:"all .3s", background: added?"#1a6b00":"#E8000D", boxShadow: added?"0 3px 16px rgba(26,107,0,.45)":"0 3px 16px rgba(232,0,13,.38)" }}>
            {added?"✓ ĐÃ THÊM":"🛒 THÊM GIỎ"}
          </button>
          <button style={{ background:"transparent", border:"1px solid #2a2a2a", color:"#777", fontFamily:"'Orbitron',monospace", fontSize:8.5, fontWeight:700, padding:"9px 12px", borderRadius:3, cursor:"pointer", whiteSpace:"nowrap" }}>MUA NGAY</button>
        </div>
      </div>
    </div>
  );
}

// ── PRODUCT SECTION ──────────────────────────────────────────
function ProductSection({ title, icon, data, onAdd }) {
  const [filter, setFilter] = useState("all");
  const [sort,   setSort]   = useState("default");
  const tags = ["all","HOT","NEW","SALE"];

  const list = data
    .filter(p => filter==="all"||p.tag===filter)
    .sort((a,b)=> sort==="priceAsc"?a.price-b.price: sort==="priceDesc"?b.price-a.price: sort==="rating"?b.rating-a.rating: sort==="sold"?b.sold-a.sold:0);

  return (
    <section style={{ maxWidth:1400, margin:"0 auto", padding:"48px 24px 0" }}>
      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16, flexWrap:"wrap" }}>
          <span style={{ fontSize:30, filter:"drop-shadow(0 0 8px rgba(232,0,13,.5))" }}>{icon}</span>
          <div>
            <h2 style={{ fontFamily:"'Bebas Neue',cursive", fontSize:34, letterSpacing:3, color:"#F0F0F0", lineHeight:1 }}>{title}</h2>
            <div style={{ width:55, height:2, background:"linear-gradient(90deg,#E8000D,transparent)", marginTop:4, borderRadius:1 }} />
          </div>
          <span style={{ marginLeft:"auto", fontFamily:"'Orbitron',monospace", fontSize:9.5, color:"#333", letterSpacing:1, padding:"4px 12px", border:"1px solid #1e1e1e", borderRadius:2 }}>{data.length} sản phẩm</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
          <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
            {tags.map(t=>(
              <button key={t} onClick={()=>setFilter(t)} style={{ fontFamily:"'Orbitron',monospace", fontSize:8.5, fontWeight:700, letterSpacing:1.5, padding:"6px 16px", borderRadius:3, cursor:"pointer", transition:"all .2s", background:filter===t?"#E8000D":"transparent", color:filter===t?"#fff":"#555", border:filter===t?"1px solid #E8000D":"1px solid #1e1e1e", boxShadow:filter===t?"0 0 12px rgba(232,0,13,.28)":"none" }}>
                {t==="all"?"TẤT CẢ":t}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{ background:"#111", border:"1px solid #1e1e1e", color:"#777", fontFamily:"'Rajdhani',sans-serif", fontSize:13, fontWeight:600, padding:"6px 12px", borderRadius:3, cursor:"pointer", outline:"none" }}>
            <option value="default">Mặc định</option>
            <option value="priceAsc">Giá thấp → cao</option>
            <option value="priceDesc">Giá cao → thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
            <option value="sold">Bán chạy nhất</option>
          </select>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(235px,1fr))", gap:18 }}>
        {list.map((p,i)=>(
          <div key={p.id} style={{ animationDelay:`${i*.07}s` }}>
            <ProductCard p={p} onAdd={onAdd} />
          </div>
        ))}
      </div>
    </section>
  );
}

// ── QUICK CATEGORIES ─────────────────────────────────────────
function QuickCats({ setPage }) {
  const cats=[
    {icon:"📱",label:"Điện Thoại",key:"phone", desc:"iPhone, Samsung, Xiaomi..."},
    {icon:"📟",label:"iPad",      key:"ipad",  desc:"iPad Pro, Air, Mini..."},
    {icon:"💻",label:"Laptop",    key:"laptop",desc:"MacBook, ROG, Dell XPS..."},
    {icon:"📰",label:"Tin Tức",   key:"news",  desc:"Công nghệ mới nhất"},
  ];
  return (
    <div style={{ background:"#0A0A0A", borderBottom:"1px solid #141414", padding:"26px 0" }}>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 24px", display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:14 }}>
        {cats.map(({icon,label,key,desc},i)=>(
          <button key={key} onClick={()=>setPage(key)} style={{ background:"#111", border:"1px solid #1e1e1e", borderRadius:4, padding:"18px 20px", cursor:"pointer", display:"flex", alignItems:"center", gap:12, textAlign:"left", transition:"all .25s", animation:`fadeInUp .5s ease ${i*.09}s both` }}>
            <span style={{ fontSize:26, flexShrink:0 }}>{icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:14, fontWeight:700, color:"#F0F0F0", lineHeight:1.2 }}>{label}</div>
              <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:11, color:"#444" }}>{desc}</div>
            </div>
            <span style={{ color:"#E8000D", fontSize:16, fontWeight:700 }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── PROMO STRIP ──────────────────────────────────────────────
function PromoStrip() {
  const items=[
    {icon:"🚚",t:"Miễn phí vận chuyển",d:"Đơn từ 500.000đ"},
    {icon:"🔄",t:"Đổi trả 30 ngày",d:"Không cần lý do"},
    {icon:"🛡️",t:"Bảo hành 24 tháng",d:"50+ trung tâm"},
    {icon:"💳",t:"Trả góp 0%",d:"Lên đến 24 tháng"},
    {icon:"📞",t:"Hỗ trợ 24/7",d:"1800 6789 miễn phí"},
  ];
  return (
    <div style={{ background:"#0C0000", borderTop:"1px solid rgba(232,0,13,.12)", borderBottom:"1px solid rgba(232,0,13,.12)", padding:"22px 0", marginTop:50 }}>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 24px", display:"flex", flexWrap:"wrap", gap:18, justifyContent:"space-between" }}>
        {items.map(({icon,t,d})=>(
          <div key={t} style={{ display:"flex", alignItems:"center", gap:11, flex:"1 1 150px" }}>
            <span style={{ fontSize:26, flexShrink:0 }}>{icon}</span>
            <div>
              <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:13.5, fontWeight:700, color:"#F0F0F0" }}>{t}</div>
              <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:11, color:"#444" }}>{d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── NEWS PAGE ────────────────────────────────────────────────
function NewsPage() {
  return (
    <div style={{ background:"#070707", minHeight:"100vh", paddingBottom:60 }}>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"50px 24px" }}>
        <div style={{ textAlign:"center", marginBottom:46 }}>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, letterSpacing:4, color:"#E8000D", marginBottom:10 }}>TIN TỨC CÔNG NGHỆ</div>
          <h1 style={{ fontFamily:"'Bebas Neue',cursive", fontSize:"clamp(38px,7vw,70px)", letterSpacing:5, color:"#F0F0F0" }}>CẬP NHẬT MỚI NHẤT</h1>
          <div style={{ width:75, height:3, background:"#E8000D", margin:"14px auto 0", borderRadius:2, boxShadow:"0 0 12px rgba(232,0,13,.6)" }} />
        </div>
        {/* Featured */}
        <div style={{ background:"linear-gradient(135deg,#120808,#0F0F0F)", border:"1px solid rgba(232,0,13,.25)", borderLeft:"4px solid #E8000D", borderRadius:5, padding:"34px 38px", marginBottom:36, animation:"fadeInUp .5s ease", boxShadow:"0 8px 36px rgba(232,0,13,.08)" }}>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9.5, fontWeight:700, letterSpacing:2, color:"#E8000D", marginBottom:12 }}>📰 TIN NỔI BẬT</div>
          <h2 style={{ fontFamily:"'Bebas Neue',cursive", fontSize:30, letterSpacing:1, color:"#F0F0F0", lineHeight:1.2, marginBottom:10 }}>{newsData[0].title}</h2>
          <p style={{ fontSize:14, color:"#666", lineHeight:1.7, fontFamily:"'Rajdhani',sans-serif", marginBottom:18 }}>{newsData[0].summary}</p>
          <div style={{ display:"flex", gap:14, alignItems:"center" }}>
            <span style={{ background:"#E8000D", color:"#fff", fontSize:9.5, fontFamily:"'Orbitron',monospace", padding:"3px 10px", borderRadius:2, fontWeight:700, letterSpacing:.8 }}>{newsData[0].cat}</span>
            <span style={{ fontSize:11, color:"#444", fontFamily:"'Orbitron',monospace" }}>📅 {newsData[0].date}</span>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:18 }}>
          {newsData.map((n,i)=>(
            <div key={n.id} style={{ background:"#0F0F0F", border:"1px solid #1e1e1e", borderRadius:5, overflow:"hidden", animation:`fadeInUp .5s ease ${i*.09}s both`, transition:"all .3s" }}>
              <div style={{ fontSize:58, textAlign:"center", padding:"28px 0", background:"#141414", borderBottom:"1px solid #1a1a1a" }}>{n.emoji}</div>
              <div style={{ padding:"18px" }}>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:8.5, fontWeight:700, letterSpacing:2, color:"#E8000D", marginBottom:8 }}>{n.cat}</div>
                <h3 style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:14.5, fontWeight:700, color:"#F0F0F0", lineHeight:1.4, marginBottom:8 }}>{n.title}</h3>
                <p style={{ fontSize:12.5, color:"#4a4a4a", lineHeight:1.6, fontFamily:"'Rajdhani',sans-serif", marginBottom:14 }}>{n.summary}</p>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid #161616", paddingTop:12 }}>
                  <span style={{ fontSize:10, color:"#383838", fontFamily:"'Orbitron',monospace" }}>📅 {n.date}</span>
                  <button style={{ background:"none", border:"1px solid #E8000D", color:"#E8000D", fontFamily:"'Orbitron',monospace", fontSize:8.5, fontWeight:700, letterSpacing:.8, padding:"5px 12px", borderRadius:2, cursor:"pointer" }}>ĐỌC TIẾP →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ABOUT PAGE ───────────────────────────────────────────────
function AboutPage() {
  const vals=[
    {icon:"🏆",t:"Chính hãng 100%",d:"Toàn bộ sản phẩm nhập từ hãng và đại lý ủy quyền chính thức"},
    {icon:"🛡️",t:"Bảo hành 24 tháng",d:"Cam kết bảo hành toàn diện, hỗ trợ kỹ thuật 24/7"},
    {icon:"🚚",t:"Giao hàng nhanh",d:"Ship 2 giờ nội thành, toàn quốc trong 24 giờ"},
    {icon:"💳",t:"Trả góp 0% lãi suất",d:"20+ phương thức thanh toán, trả góp linh hoạt"},
  ];
  const timeline=[
    {y:"2018",t:"Thành lập TechZone với cửa hàng đầu tiên tại TP.HCM"},
    {y:"2020",t:"Mở rộng lên 10 chi nhánh toàn quốc"},
    {y:"2022",t:"Đạt 100.000 khách hàng, ra mắt website thương mại điện tử"},
    {y:"2024",t:"Top 3 chuỗi bán lẻ công nghệ uy tín nhất Việt Nam"},
    {y:"2026",t:"500.000+ khách hàng, 50 chi nhánh trên cả nước"},
  ];
  return (
    <div style={{ background:"#070707", minHeight:"100vh", paddingBottom:60 }}>
      {/* Hero */}
      <div style={{ position:"relative", background:"linear-gradient(135deg,#120808,#0F0F0F,#0A0A0A)", padding:"75px 40px", textAlign:"center", borderBottom:"2px solid rgba(232,0,13,.15)", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(232,0,13,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(232,0,13,.025) 1px,transparent 1px)", backgroundSize:"40px 40px", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, letterSpacing:5, color:"#E8000D", marginBottom:10 }}>CHÚNG TÔI LÀ AI?</div>
          <h1 style={{ fontFamily:"'Bebas Neue',cursive", fontSize:"clamp(55px,10vw,108px)", letterSpacing:8, color:"#F0F0F0", lineHeight:1, textShadow:"0 0 55px rgba(232,0,13,.18)" }}>TECH<span style={{color:"#E8000D"}}>ZONE</span></h1>
          <p style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:16, color:"#555", maxWidth:560, margin:"18px auto 0", lineHeight:1.7 }}>Hơn 8 năm kinh nghiệm trong lĩnh vực phân phối thiết bị công nghệ chính hãng với hơn 500.000 khách hàng tin dùng.</p>
        </div>
      </div>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"50px 24px" }}>
        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16, marginBottom:50 }}>
          {[["500K+","Khách hàng"],["50+","Chi nhánh"],["10K+","Sản phẩm"],["8+","Năm kinh nghiệm"]].map(([n,l])=>(
            <div key={l} style={{ background:"#0F0F0F", border:"1px solid #1e1e1e", borderTop:"2px solid #E8000D", borderRadius:4, padding:"26px", textAlign:"center", animation:"fadeInUp .5s ease both" }}>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:30, fontWeight:900, color:"#E8000D" }}>{n}</div>
              <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:12, color:"#555", fontWeight:600, letterSpacing:1, marginTop:6 }}>{l}</div>
            </div>
          ))}
        </div>
        {/* Values */}
        <div style={{ marginBottom:50 }}>
          <h2 style={{ fontFamily:"'Bebas Neue',cursive", fontSize:30, letterSpacing:4, color:"#F0F0F0", marginBottom:22, paddingBottom:12, borderBottom:"1px solid #161616" }}>GIÁ TRỊ CỐT LÕI</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:18 }}>
            {vals.map(({icon,t,d})=>(
              <div key={t} style={{ background:"#0F0F0F", border:"1px solid #1e1e1e", borderRadius:5, padding:"26px 22px", animation:"fadeInUp .5s ease both" }}>
                <span style={{ fontSize:34, display:"block", marginBottom:12 }}>{icon}</span>
                <h3 style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:16, fontWeight:700, color:"#F0F0F0", marginBottom:7, letterSpacing:.3 }}>{t}</h3>
                <p style={{ fontSize:12.5, color:"#4a4a4a", lineHeight:1.7, fontFamily:"'Rajdhani',sans-serif" }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Timeline */}
        <div style={{ marginBottom:50 }}>
          <h2 style={{ fontFamily:"'Bebas Neue',cursive", fontSize:30, letterSpacing:4, color:"#F0F0F0", marginBottom:22, paddingBottom:12, borderBottom:"1px solid #161616" }}>HÀNH TRÌNH PHÁT TRIỂN</h2>
          {timeline.map(({y,t},i)=>(
            <div key={y} style={{ display:"flex", alignItems:"center", gap:18, padding:"14px 0", borderBottom:"1px solid #111", animation:`slideLeft .5s ease ${i*.08}s both` }}>
              <div style={{ width:65, textAlign:"right", flexShrink:0 }}>
                <span style={{ fontFamily:"'Orbitron',monospace", fontSize:13, fontWeight:700, color:"#E8000D", letterSpacing:.8 }}>{y}</span>
              </div>
              <div style={{ width:11, height:11, background:"#E8000D", borderRadius:"50%", flexShrink:0, boxShadow:"0 0 10px rgba(232,0,13,.6)" }} />
              <p style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:14.5, color:"#777", fontWeight:500 }}>{t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── CART PAGE ────────────────────────────────────────────────
function CartPage({ cart, setCart }) {
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  if (!cart.length) return (
    <div style={{ textAlign:"center", padding:"100px 24px" }}>
      <div style={{ fontSize:70, marginBottom:18 }}>🛒</div>
      <div style={{ fontFamily:"'Orbitron',monospace", fontSize:13, color:"#2a2a2a", letterSpacing:3 }}>GIỎ HÀNG TRỐNG</div>
    </div>
  );
  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"50px 24px" }}>
      <h2 style={{ fontFamily:"'Bebas Neue',cursive", fontSize:34, letterSpacing:3, marginBottom:26, color:"#F0F0F0" }}>GIỎ HÀNG CỦA BẠN</h2>
      {cart.map(item=>(
        <div key={item.id} style={{ display:"flex", gap:14, padding:"15px", border:"1px solid #1e1e1e", borderRadius:4, marginBottom:10, background:"#0F0F0F", alignItems:"center", animation:"fadeInUp .3s ease" }}>
          <span style={{ fontSize:38 }}>{item.image}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:14.5, color:"#F0F0F0" }}>{item.name}</div>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:"#444" }}>{item.specs}</div>
          </div>
          <div style={{ fontFamily:"'Orbitron',monospace", color:"#E8000D", fontSize:14, fontWeight:700 }}>{fmt(item.price)}</div>
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <button onClick={()=>setCart(c=>c.map(i=>i.id===item.id?{...i,qty:Math.max(1,i.qty-1)}:i))} style={qtyB}>−</button>
            <span style={{ fontFamily:"'Orbitron',monospace", fontSize:13, color:"#F0F0F0", width:22, textAlign:"center" }}>{item.qty}</span>
            <button onClick={()=>setCart(c=>c.map(i=>i.id===item.id?{...i,qty:i.qty+1}:i))} style={qtyB}>+</button>
          </div>
          <button onClick={()=>setCart(c=>c.filter(i=>i.id!==item.id))} style={{ ...qtyB, borderColor:"#2a2a2a", color:"#555" }}>✕</button>
        </div>
      ))}
      <div style={{ textAlign:"right", marginTop:22, padding:"20px", background:"#0F0F0F", border:"1px solid #1e1e1e", borderRadius:4 }}>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:11, color:"#444", marginBottom:6, letterSpacing:1 }}>TỔNG CỘNG</div>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:26, color:"#E8000D", fontWeight:900 }}>{fmt(total)}</div>
        <button style={{ marginTop:14, background:"linear-gradient(135deg,#E8000D,#8B0000)", border:"none", color:"#fff", fontFamily:"'Orbitron',monospace", fontSize:11, fontWeight:700, letterSpacing:1.5, padding:"13px 38px", borderRadius:3, cursor:"pointer", boxShadow:"0 6px 22px rgba(232,0,13,.4)" }}>THANH TOÁN NGAY →</button>
      </div>
    </div>
  );
}
const qtyB = { background:"none", border:"1px solid #E8000D", borderRadius:3, color:"#E8000D", width:28, height:28, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700 };

// ── FOOTER ───────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background:"#0A0A0A", marginTop:60 }}>
      <div style={{ height:2, background:"linear-gradient(90deg,transparent,#E8000D 20%,#E8000D 80%,transparent)" }} />
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"46px 40px", display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1.5fr", gap:36 }}>
        {/* Brand */}
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:14 }}>
            <span style={{ fontSize:22, filter:"drop-shadow(0 0 6px rgba(232,0,13,.7))" }}>⚡</span>
            <div>
              <div style={{ fontFamily:"'Bebas Neue',cursive", fontSize:20, letterSpacing:3, color:"#F0F0F0", lineHeight:1 }}>TECH<span style={{color:"#E8000D"}}>ZONE</span></div>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:7, letterSpacing:3, color:"#333" }}>CÔNG NGHỆ ĐỈNH CAO</div>
            </div>
          </div>
          <p style={{ fontSize:12.5, color:"#444", lineHeight:1.7, fontFamily:"'Rajdhani',sans-serif", marginBottom:14 }}>Chuyên cung cấp điện thoại, iPad, laptop chính hãng. Bảo hành 24 tháng, đổi trả 30 ngày.</p>
          <div style={{ display:"flex", gap:7 }}>
            {["FB","YT","TK","IG"].map(s=><div key={s} style={{ width:32,height:32,border:"1px solid #1e1e1e",borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontFamily:"'Orbitron',monospace",fontWeight:700,color:"#444",cursor:"pointer" }}>{s}</div>)}
          </div>
        </div>
        {/* Products */}
        <div>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, fontWeight:700, letterSpacing:2, color:"#E8000D", marginBottom:14, paddingBottom:8, borderBottom:"1px solid #1a1a1a" }}>SẢN PHẨM</div>
          {[{l:"Điện Thoại",k:"phone"},{l:"iPad",k:"ipad"},{l:"Laptop",k:"laptop"}].map(({l,k})=>(
            <button key={k} onClick={()=>setPage(k)} style={{ display:"block", background:"none", border:"none", color:"#444", fontFamily:"'Rajdhani',sans-serif", fontSize:13, fontWeight:500, cursor:"pointer", padding:"4px 0", textAlign:"left" }}>
              <span style={{color:"#E8000D",marginRight:5}}>›</span>{l}
            </button>
          ))}
        </div>
        {/* Support */}
        <div>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, fontWeight:700, letterSpacing:2, color:"#E8000D", marginBottom:14, paddingBottom:8, borderBottom:"1px solid #1a1a1a" }}>HỖ TRỢ</div>
          {["Bảo hành","Đổi trả","Hướng dẫn mua","Câu hỏi thường gặp"].map(t=>(
            <div key={t} style={{ color:"#444", fontFamily:"'Rajdhani',sans-serif", fontSize:13, padding:"4px 0", cursor:"pointer" }}>
              <span style={{color:"#E8000D",marginRight:5}}>›</span>{t}
            </div>
          ))}
        </div>
        {/* Contact */}
        <div>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, fontWeight:700, letterSpacing:2, color:"#E8000D", marginBottom:14, paddingBottom:8, borderBottom:"1px solid #1a1a1a" }}>LIÊN HỆ</div>
          {[["📍","123 Nguyễn Huệ, Q.1, TP.HCM"],["📞","1800 6789"],["✉️","support@techzone.vn"],["🕐","8:00 - 22:00 mỗi ngày"]].map(([icon,text])=>(
            <div key={text} style={{ display:"flex", gap:9, fontSize:12.5, color:text==="1800 6789"?"#E8000D":"#444", fontFamily: text==="1800 6789"?"'Orbitron',monospace":"'Rajdhani',sans-serif", padding:"4px 0", alignItems:"flex-start" }}>
              <span style={{flexShrink:0}}>{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop:"1px solid #141414", padding:"14px 40px", display:"flex", gap:14, fontSize:11, color:"#2a2a2a", fontFamily:"'Rajdhani',sans-serif", letterSpacing:.5, maxWidth:1400, margin:"0 auto" }}>
        <span>© 2026 TechZone. All rights reserved.</span>
        <span style={{color:"#1e1e1e"}}>|</span>
        <span>Thiết kế bởi <span style={{color:"#E8000D"}}>TechZone Team</span></span>
      </div>
    </footer>
  );
}

// ── APP ROOT (Users/pages/HomePage.jsx) ─────────────────────
export default function HomePage() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [toast,setToast]= useState(null);

  const addCart = (p) => {
    setCart(prev=>{
      const f=prev.find(i=>i.id===p.id);
      if(f) return prev.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i);
      return [...prev,{...p,qty:1}];
    });
    setToast(`✓ Đã thêm "${p.name}" vào giỏ hàng`);
    setTimeout(()=>setToast(null),2500);
  };

  const cartCount = cart.reduce((s,i)=>s+i.qty,0);

  const renderPage = () => {
    switch(page) {
      case "phone":  return <ProductSection title="ĐIỆN THOẠI"         icon="📱" data={phones}  onAdd={addCart} />;
      case "ipad":   return <ProductSection title="iPAD"               icon="📟" data={ipads}   onAdd={addCart} />;
      case "laptop": return <ProductSection title="LAPTOP"             icon="💻" data={laptops} onAdd={addCart} />;
      case "news":   return <NewsPage />;
      case "about":  return <AboutPage />;
      case "cart":   return <CartPage cart={cart} setCart={setCart} />;
      default:
        return (
          <>
            <Banner setPage={setPage} />
            <QuickCats setPage={setPage} />
            <ProductSection title="ĐIỆN THOẠI NỔI BẬT" icon="📱" data={phones}  onAdd={addCart} />
            <ProductSection title="iPAD BÁN CHẠY"       icon="📟" data={ipads}   onAdd={addCart} />
            <ProductSection title="LAPTOP ĐỈNH CAO"      icon="💻" data={laptops} onAdd={addCart} />
            <PromoStrip />
          </>
        );
    }
  };

  return (
    <>
      <GlobalStyle />
      <div style={{ background:"#070707", minHeight:"100vh" }}>
        <Header page={page} setPage={setPage} cartCount={cartCount} />
        <main>{renderPage()}</main>
        <Footer setPage={setPage} />
        {toast && (
          <div style={{ position:"fixed", bottom:28, right:28, background:"#0F0F0F", border:"1px solid #E8000D", borderLeft:"4px solid #E8000D", color:"#F0F0F0", fontFamily:"'Rajdhani',sans-serif", fontSize:14, fontWeight:600, padding:"13px 20px", borderRadius:4, boxShadow:"0 8px 28px rgba(232,0,13,.28)", zIndex:9999, animation:"fadeInUp .3s ease both", maxWidth:370, letterSpacing:.3 }}>
            {toast}
          </div>
        )}
      </div>
    </>
  );
}
