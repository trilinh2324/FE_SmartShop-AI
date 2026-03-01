import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8080";
const IMG = (t) => `${API_BASE}/uploads/news/${t}`;
const fmt = (d) => {
  if (!d) return "";
  const r = String(d).slice(0, 10).split("-");
  return r.length === 3 ? `${r[2]}/${r[1]}/${r[0]}` : String(d);
};

export default function NewsPage() {
  const [news,    setNews]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);
  const [mLoad,   setMLoad]   = useState(false);
  const [hov,     setHov]     = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/user/news`)
      .then(r => r.json())
      .then(d => setNews(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const openModal = (item) => {
    setModal(item);
    setMLoad(true);
    fetch(`${API_BASE}/api/user/news/${item.id}`)
      .then(r => r.json())
      .then(d => setModal(d))
      .finally(() => setMLoad(false));
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModal(null);
    document.body.style.overflow = "";
  };

  const featured  = news[0] || null;
  const secondary = news.slice(1, 3);
  const rest      = news.slice(3);

  return (
    <div style={s.wrap}>
      <div style={s.gridBg} />
      <div style={s.inner}>

        {/* Header */}
        <div style={s.header}>
          <div style={s.headerLine} />
          <div style={s.tag}>TIN TỨC CÔNG NGHỆ</div>
          <h1 style={s.title}>CẬP NHẬT MỚI NHẤT</h1>
          <div style={s.accent}><div style={s.aBar}/><div style={s.aDot}/><div style={s.aBar}/></div>
        </div>

        {loading && <div style={s.center}><div style={s.spin}/><span style={s.gray}>ĐANG TẢI...</span></div>}

        {/* Featured */}
        {!loading && featured && (
          <div
            style={{ ...s.featured, ...(hov==="f" ? s.featHov : {}) }}
            onMouseEnter={() => setHov("f")} onMouseLeave={() => setHov(null)}
            onClick={() => openModal(featured)}
          >
            <div style={s.featImg}>
              {featured.thumbnail
                ? <img src={IMG(featured.thumbnail)} alt={featured.title} style={{ ...s.img, ...(hov==="f"?{transform:"scale(1.05)"}:{}) }}/>
                : <div style={s.emoji}>📰</div>}
              <div style={s.featShade}/>
            </div>
            <div style={s.featBody}>
              <div style={s.featTop}>
                <span style={s.hotBadge}>🔥 TIN NỔI BẬT</span>
                {(featured.cat||featured.category) && <span style={s.catTag}>{featured.cat||featured.category}</span>}
              </div>
              <h2 style={s.featTitle}>{featured.title}</h2>
              <p style={s.featDesc}>{featured.summary||featured.description||""}</p>
              <div style={s.featFoot}>
                <span style={s.date}>📅 {fmt(featured.date||featured.createdAt)}</span>
                <button style={s.readBtn} onClick={e=>{e.stopPropagation();openModal(featured);}}>ĐỌC TIẾP →</button>
              </div>
            </div>
          </div>
        )}

        {/* Secondary 2-col */}
        {!loading && secondary.length > 0 && (
          <div style={s.secRow}>
            {secondary.map((item, i) => (
              <div key={item.id}
                style={{ ...s.secCard, ...(hov===`s${i}`?s.cardHov:{}) }}
                onMouseEnter={()=>setHov(`s${i}`)} onMouseLeave={()=>setHov(null)}
                onClick={()=>openModal(item)}
              >
                <div style={s.cardImgWrap}>
                  {item.thumbnail
                    ? <img src={IMG(item.thumbnail)} alt={item.title} style={{ ...s.img, ...(hov===`s${i}`?{transform:"scale(1.06)"}:{}) }}/>
                    : <div style={s.emoji}>{item.emoji||"📰"}</div>}
                  <div style={s.cardShade}/>
                  {(item.cat||item.category) && <span style={s.catBadge}>{item.cat||item.category}</span>}
                </div>
                <div style={s.cardBody}>
                  <h3 style={s.cardTitle}>{item.title}</h3>
                  <p style={s.cardDesc}>{item.summary||item.description||""}</p>
                  <div style={s.cardFoot}>
                    <span style={s.date}>📅 {fmt(item.date||item.createdAt)}</span>
                    <button style={s.readBtn}>ĐỌC TIẾP →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        {!loading && rest.length > 0 && (
          <div style={s.divider}>
            <div style={s.divLine}/><span style={s.divLabel}>TIN TỨC KHÁC</span><div style={s.divLine}/>
          </div>
        )}

        {/* Rest grid */}
        {!loading && rest.length > 0 && (
          <div style={s.grid}>
            {rest.map((item, i) => (
              <div key={item.id}
                style={{ ...s.card, animationDelay:`${i*.07}s`, ...(hov===`c${i}`?s.cardHov:{}) }}
                onMouseEnter={()=>setHov(`c${i}`)} onMouseLeave={()=>setHov(null)}
                onClick={()=>openModal(item)}
              >
                <div style={s.cardImgWrap}>
                  {item.thumbnail
                    ? <img src={IMG(item.thumbnail)} alt={item.title} style={{ ...s.img, ...(hov===`c${i}`?{transform:"scale(1.07)"}:{}) }}/>
                    : <div style={s.emoji}>{item.emoji||"📰"}</div>}
                  <div style={s.cardShade}/>
                  {(item.cat||item.category) && <span style={s.catBadge}>{item.cat||item.category}</span>}
                </div>
                <div style={s.cardBody}>
                  <h3 style={s.cardTitle}>{item.title}</h3>
                  <p style={s.cardDesc}>{item.summary||item.description||""}</p>
                  <div style={s.cardFoot}>
                    <span style={s.date}>📅 {fmt(item.date||item.createdAt)}</span>
                    <button style={s.readBtn}>ĐỌC TIẾP →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && news.length === 0 && (
          <div style={{ ...s.center, flexDirection:"column", gap:14 }}>
            <span style={{fontSize:48}}>📰</span>
            <span style={s.gray}>CHƯA CÓ TIN TỨC NÀO</span>
          </div>
        )}
      </div>

      {/* ══════════ MODAL ══════════ */}
      {modal && (
        <div style={s.overlay} onClick={closeModal}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>

            {/* Hero */}
            <div style={s.modalHero}>
              {modal.thumbnail
                ? <img src={IMG(modal.thumbnail)} alt={modal.title} style={s.modalHeroImg}/>
                : <div style={{ ...s.emoji, height:240, fontSize:64, background:"#111" }}>📰</div>}
              <div style={s.modalHeroShade}/>
              <button style={s.closeBtn} onClick={closeModal}>✕</button>
              <div style={s.modalMeta}>
                {(modal.cat||modal.category) && <span style={s.catTag}>{modal.cat||modal.category}</span>}
                <h2 style={s.modalTitle}>{modal.title}</h2>
                <div style={s.modalMetaRow}>
                  <span style={s.metaChip}>📅 {fmt(modal.date||modal.createdAt)}</span>
                  {modal.author && <span style={s.metaChip}>✍️ {modal.author}</span>}
                </div>
              </div>
            </div>

            {/* Content */}
            <div style={s.modalContent}>
              {mLoad ? (
                <div style={{ ...s.center, padding:"40px 0" }}>
                  <div style={s.spin}/><span style={s.gray}>ĐANG TẢI NỘI DUNG...</span>
                </div>
              ) : (
                <>
                  {modal.summary && (
                    <div style={s.lead}>
                      <div style={s.leadBar}/>
                      <p style={s.leadText}>{modal.summary}</p>
                    </div>
                  )}
                  {(modal.content || modal.body)
                    ? <div className="nmbody" dangerouslySetInnerHTML={{ __html: modal.content || modal.body }}/>
                    : <p style={s.bodyPlain}>{modal.description||"Nội dung đang được cập nhật..."}</p>
                  }
                </>
              )}
            </div>

            {/* Footer */}
            <div style={s.modalFoot}>
              <button style={s.closeFootBtn} onClick={closeModal}>✕ ĐÓNG</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes modalIn   { from{opacity:0;transform:translateY(28px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .nmbody p          { margin-bottom:1.3em; color:#777; font-size:15px; line-height:1.9; font-family:'Rajdhani',sans-serif; }
        .nmbody h2         { font-family:'Bebas Neue',cursive; font-size:24px; color:#F0F0F0; letter-spacing:1px; margin:1.5em 0 .5em; }
        .nmbody h3         { font-family:'Bebas Neue',cursive; font-size:20px; color:#E8000D; margin:1.3em 0 .4em; }
        .nmbody img        { max-width:100%; border-radius:4px; margin:1em 0; border:1px solid #1e1e1e; }
        .nmbody a          { color:#E8000D; }
        .nmbody ul,.nmbody ol { padding-left:22px; color:#666; font-family:'Rajdhani',sans-serif; font-size:15px; line-height:1.8; margin-bottom:1.2em; }
        .nmbody blockquote { border-left:3px solid #E8000D; padding:10px 18px; margin:1.2em 0; background:#0f0f0f; color:#888; font-style:italic; border-radius:0 3px 3px 0; }
      `}</style>
    </div>
  );
}

const s = {
  wrap:   { background:"#070707", minHeight:"100vh", paddingBottom:70, position:"relative", overflow:"hidden" },
  gridBg: { position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(232,0,13,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(232,0,13,.025) 1px,transparent 1px)", backgroundSize:"44px 44px", pointerEvents:"none" },
  inner:  { maxWidth:1400, margin:"0 auto", padding:"50px 24px", position:"relative", zIndex:1 },

  header:     { textAlign:"center", marginBottom:48, animation:"fadeInUp .5s ease both" },
  headerLine: { width:56, height:2, background:"#E8000D", margin:"0 auto 20px", boxShadow:"0 0 16px rgba(232,0,13,.7)" },
  tag:        { fontFamily:"'Orbitron',monospace", fontSize:10, letterSpacing:5, color:"#E8000D", marginBottom:10 },
  title:      { fontFamily:"'Bebas Neue',cursive", fontSize:"clamp(42px,6.5vw,76px)", letterSpacing:6, color:"#F0F0F0", lineHeight:1, marginBottom:16 },
  accent:     { display:"flex", alignItems:"center", justifyContent:"center", gap:10 },
  aBar:       { width:48, height:2, background:"linear-gradient(90deg,transparent,#E8000D)" },
  aDot:       { width:7, height:7, borderRadius:"50%", background:"#E8000D", boxShadow:"0 0 10px rgba(232,0,13,.9)" },

  center: { display:"flex", alignItems:"center", justifyContent:"center", gap:14, padding:"80px 0" },
  gray:   { fontFamily:"'Orbitron',monospace", fontSize:9, color:"#333", letterSpacing:3 },
  spin:   { width:20, height:20, border:"2px solid #1a1a1a", borderTop:"2px solid #E8000D", borderRadius:"50%", animation:"spin .8s linear infinite", flexShrink:0 },

  img:   { width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform .45s ease" },
  emoji: { width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:52, background:"#141414" },

  featured:  { display:"flex", background:"#0A0A0A", border:"1px solid rgba(232,0,13,.2)", borderLeft:"4px solid #E8000D", borderRadius:6, overflow:"hidden", marginBottom:22, cursor:"pointer", transition:"border-color .25s, box-shadow .25s", animation:"fadeInUp .5s .05s ease both", minHeight:290 },
  featHov:   { borderColor:"#E8000D", boxShadow:"0 8px 44px rgba(232,0,13,.16)" },
  featImg:   { width:"43%", flexShrink:0, position:"relative", overflow:"hidden", background:"#0d0d0d" },
  featShade: { position:"absolute", top:0, right:0, width:55, height:"100%", background:"linear-gradient(90deg,transparent,#0A0A0A)", pointerEvents:"none" },
  featBody:  { flex:1, padding:"30px 34px", display:"flex", flexDirection:"column", gap:11 },
  featTop:   { display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" },
  hotBadge:  { fontFamily:"'Orbitron',monospace", fontSize:9, fontWeight:700, letterSpacing:2, color:"#E8000D" },
  catTag:    { background:"rgba(232,0,13,.12)", border:"1px solid rgba(232,0,13,.3)", color:"#E8000D", fontFamily:"'Orbitron',monospace", fontSize:8, padding:"2px 9px", borderRadius:2, letterSpacing:1 },
  featTitle: { fontFamily:"'Bebas Neue',cursive", fontSize:30, letterSpacing:1.5, color:"#F0F0F0", lineHeight:1.2, flex:1 },
  featDesc:  { fontSize:14, color:"#666", lineHeight:1.75, fontFamily:"'Rajdhani',sans-serif" },
  featFoot:  { display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"auto", paddingTop:12, borderTop:"1px solid #161616" },

  date:    { fontFamily:"'Orbitron',monospace", fontSize:9, color:"#3a3a3a" },
  readBtn: { background:"none", border:"1px solid #E8000D", color:"#E8000D", fontFamily:"'Orbitron',monospace", fontSize:8, fontWeight:700, letterSpacing:1, padding:"5px 13px", borderRadius:2, cursor:"pointer", flexShrink:0 },
  cardHov: { borderColor:"rgba(232,0,13,.45)", boxShadow:"0 5px 26px rgba(232,0,13,.1)" },

  cardImgWrap: { position:"relative", height:185, overflow:"hidden", background:"#111", flexShrink:0 },
  cardShade:   { position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,.75) 0%,transparent 55%)", pointerEvents:"none" },
  catBadge:    { position:"absolute", bottom:10, left:12, background:"#E8000D", color:"#fff", fontFamily:"'Orbitron',monospace", fontSize:7.5, padding:"2px 8px", borderRadius:2, fontWeight:700, letterSpacing:1 },
  cardBody:    { padding:"16px 18px", flex:1, display:"flex", flexDirection:"column", gap:8 },
  cardTitle:   { fontFamily:"'Bebas Neue',cursive", fontSize:18, letterSpacing:.8, color:"#F0F0F0", lineHeight:1.3 },
  cardDesc:    { fontSize:12.5, color:"#4a4a4a", lineHeight:1.6, fontFamily:"'Rajdhani',sans-serif", flex:1 },
  cardFoot:    { display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:10, borderTop:"1px solid #141414" },

  secRow:  { display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:22 },
  secCard: { background:"#0A0A0A", border:"1px solid #1a1a1a", borderRadius:6, overflow:"hidden", cursor:"pointer", transition:"border-color .25s, box-shadow .25s", display:"flex", flexDirection:"column", animation:"fadeInUp .5s .1s ease both" },

  divider:  { display:"flex", alignItems:"center", gap:14, margin:"28px 0 18px" },
  divLine:  { flex:1, height:1, background:"linear-gradient(90deg,transparent,#1e1e1e)" },
  divLabel: { fontFamily:"'Orbitron',monospace", fontSize:8.5, letterSpacing:3, color:"#252525", whiteSpace:"nowrap" },

  grid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 },
  card: { background:"#0A0A0A", border:"1px solid #1a1a1a", borderRadius:6, overflow:"hidden", display:"flex", flexDirection:"column", cursor:"pointer", transition:"border-color .25s, box-shadow .25s", animation:"fadeInUp .5s ease both" },

  /* Modal */
  overlay:       { position:"fixed", inset:0, background:"rgba(0,0,0,.9)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:20, backdropFilter:"blur(4px)" },
  modalBox:      { background:"#0A0A0A", border:"1px solid rgba(232,0,13,.25)", borderRadius:8, width:"100%", maxWidth:760, maxHeight:"90vh", display:"flex", flexDirection:"column", overflow:"hidden", animation:"modalIn .32s ease both", boxShadow:"0 30px 90px rgba(232,0,13,.2)" },
  modalHero:     { position:"relative", height:240, flexShrink:0, overflow:"hidden", background:"#0d0d0d" },
  modalHeroImg:  { width:"100%", height:"100%", objectFit:"cover", filter:"brightness(.55)" },
  modalHeroShade:{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(10,10,10,1) 0%,rgba(10,10,10,.5) 40%,transparent 75%)", pointerEvents:"none" },
  closeBtn:      { position:"absolute", top:12, right:12, background:"rgba(0,0,0,.75)", border:"1px solid #2a2a2a", color:"#888", width:32, height:32, borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, zIndex:2, transition:"border-color .2s,color .2s" },
  modalMeta:     { position:"absolute", bottom:18, left:22, right:22 },
  modalTitle:    { fontFamily:"'Bebas Neue',cursive", fontSize:"clamp(20px,3.2vw,28px)", letterSpacing:1.5, color:"#F0F0F0", lineHeight:1.2, marginTop:8, textShadow:"0 2px 12px rgba(0,0,0,.9)" },
  modalMetaRow:  { display:"flex", gap:12, marginTop:7, flexWrap:"wrap" },
  metaChip:      { fontFamily:"'Orbitron',monospace", fontSize:9, color:"rgba(240,240,240,.5)" },
  modalContent:  { flex:1, overflowY:"auto", padding:"22px 26px" },
  lead:          { display:"flex", gap:14, alignItems:"flex-start", marginBottom:20, paddingBottom:16, borderBottom:"1px solid #161616" },
  leadBar:       { width:3, flexShrink:0, alignSelf:"stretch", background:"#E8000D", borderRadius:2 },
  leadText:      { fontFamily:"'Rajdhani',sans-serif", fontSize:15, color:"#888", lineHeight:1.8, fontStyle:"italic" },
  bodyPlain:     { fontFamily:"'Rajdhani',sans-serif", fontSize:15, color:"#666", lineHeight:1.9 },
  modalFoot:     { padding:"12px 22px", borderTop:"1px solid #141414", display:"flex", justifyContent:"flex-end", background:"#070707", flexShrink:0 },
  closeFootBtn:  { background:"none", border:"1px solid #222", color:"#555", fontFamily:"'Orbitron',monospace", fontSize:8.5, fontWeight:700, letterSpacing:1.5, padding:"8px 22px", borderRadius:3, cursor:"pointer" },
};
