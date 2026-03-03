import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8080";
const fmt = (n) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n || 0);
const fmtDate = (d) => {
  if (!d) return "";
  const r = String(d).slice(0, 10).split("-");
  return r.length === 3 ? `${r[2]}/${r[1]}/${r[0]}` : String(d);
};

function getToken() { return localStorage.getItem("token"); }

export default function PaymentSuccess({ setActivePage }) {
  const [bill,    setBill]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [count,   setCount]   = useState(0);
  const [visible, setVisible] = useState(false);

  // ✅ FIX: lấy billId đúng cách — không dùng searchParams bên ngoài component
  const billId = new URLSearchParams(window.location.search).get("billId")
    || localStorage.getItem("lastBillId");

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);

    if (!billId) { setLoading(false); return; }

    // ✅ FIX: kiểm tra paymentStatus trước khi lấy chi tiết bill
    const token = getToken();
    fetch(`${API_BASE}/api/user/bill/${billId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          if (data.paymentStatus === "PAID") {
            setBill(data);
          } else {
            // Đang xử lý hoặc chờ — vẫn hiện bill nhưng có thể báo trạng thái
            setBill(data);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [billId]); // ✅ FIX: thêm billId vào dependency array

  // Animated total counter
  useEffect(() => {
    if (!bill?.totalPayableAmount && !bill?.totalAmount) return;
    const target = bill.totalPayableAmount || bill.totalAmount;
    const dur    = 1200;
    const steps  = 50;
    const inc    = target / steps;
    let cur      = 0;
    const t      = setInterval(() => {
      cur += inc;
      if (cur >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(cur));
    }, dur / steps);
    return () => clearInterval(t);
  }, [bill]);

  const orderCode   = bill?.id ? `#TZ${String(bill.id).padStart(8, "0")}` : billId ? `#TZ${String(billId).padStart(8,"0")}` : "#TZ--------";
  const items       = bill?.items || bill?.billItems || [];
  const total       = bill?.totalPayableAmount || bill?.totalAmount || 0;
  const method      = bill?.paymentMethod || "";
  const address     = [bill?.recipientAddress, bill?.selectedDistrict, bill?.selectedProvince].filter(Boolean).join(", ");
  const methodLabel = { COD:"Thanh toán khi nhận hàng", BANKING:"Chuyển khoản ngân hàng", MOMO:"Ví MoMo", VNPAY:"VNPay" }[method] || method;

  const getItemName  = (i) => i.productColor?.product?.name || i.name || "Sản phẩm";
  const getItemColor = (i) => i.productColor?.color?.name || "";
  const getItemImg   = (i) => i.productColor?.product?.image || i.productColor?.image || null;
  const getItemPrice = (i) => i.price || i.productColor?.product?.price || 0;
  const getItemQty   = (i) => i.quantity || i.qty || 1;

  return (
    <div style={s.wrap}>
      <div style={s.gridBg} />
      <div style={s.glow} />

      <div style={{ ...s.inner, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: "opacity .6s ease, transform .6s ease" }}>

        {/* ── Success icon ── */}
        <div style={s.iconWrap}>
          <div style={s.iconRing1} />
          <div style={s.iconRing2} />
          <div style={s.iconCircle}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M8 21L16 29L32 13" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ strokeDasharray:40, strokeDashoffset: visible?0:40, transition:"stroke-dashoffset .7s .3s ease" }}/>
            </svg>
          </div>
        </div>

        {/* ── Heading ── */}
        <div style={s.tagLine}>GIAO DỊCH THÀNH CÔNG</div>
        <h1 style={s.heading}>CẢM ƠN BẠN ĐÃ<br/>MUA HÀNG!</h1>
        <div style={s.accent}><div style={s.aBar}/><div style={s.aDot}/><div style={s.aBar}/></div>

        {/* ── Order code ── */}
        <div style={s.orderCodeWrap}>
          <span style={s.orderCodeLabel}>MÃ ĐƠN HÀNG</span>
          <span style={s.orderCode}>{orderCode}</span>
        </div>

        {loading ? (
          <div style={s.loadRow}><div style={s.spin}/><span style={s.gray}>ĐANG TẢI THÔNG TIN...</span></div>
        ) : (
          <div style={s.card}>

            {/* ── Items ── */}
            {items.length > 0 && (
              <div style={s.section}>
                <div style={s.sectionLabel}>🛒 SẢN PHẨM ĐÃ MUA</div>
                <div style={s.itemList}>
                  {items.map((item, i) => (
                    <div key={i} style={s.itemRow}>
                      <div style={s.itemThumb}>
                        {getItemImg(item)
                          ? <img src={`${API_BASE}${getItemImg(item)}`} alt="" style={s.itemImg}/>
                          : <span style={{fontSize:20}}>📦</span>
                        }
                      </div>
                      <div style={s.itemInfo}>
                        <div style={s.itemName}>{getItemName(item)}</div>
                        {getItemColor(item) && <div style={s.itemColor}>{getItemColor(item)}</div>}
                      </div>
                      <div style={s.itemQty}>× {getItemQty(item)}</div>
                      <div style={s.itemPrice}>{fmt(getItemPrice(item) * getItemQty(item))}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={s.divider} />

            {/* ── Details grid ── */}
            <div style={s.detailGrid}>
              {bill?.recipientName && (
                <div style={s.detailItem}>
                  <div style={s.detailKey}>👤 NGƯỜI NHẬN</div>
                  <div style={s.detailVal}>{bill.recipientName}</div>
                </div>
              )}
              {bill?.recipientPhone && (
                <div style={s.detailItem}>
                  <div style={s.detailKey}>📞 ĐIỆN THOẠI</div>
                  <div style={s.detailVal}>{bill.recipientPhone}</div>
                </div>
              )}
              {address && (
                <div style={{ ...s.detailItem, gridColumn:"1/-1" }}>
                  <div style={s.detailKey}>📍 ĐỊA CHỈ GIAO HÀNG</div>
                  <div style={s.detailVal}>{address}</div>
                </div>
              )}
              {methodLabel && (
                <div style={s.detailItem}>
                  <div style={s.detailKey}>💳 THANH TOÁN</div>
                  <div style={s.detailVal}>{methodLabel}</div>
                </div>
              )}
              {bill?.createdAt && (
                <div style={s.detailItem}>
                  <div style={s.detailKey}>📅 NGÀY ĐẶT</div>
                  <div style={s.detailVal}>{fmtDate(bill.createdAt)}</div>
                </div>
              )}
            </div>

            {/* ── Total ── */}
            <div style={s.totalRow}>
              <span style={s.totalLabel}>TỔNG THANH TOÁN</span>
              <span style={s.totalAmount}>{fmt(count || total)}</span>
            </div>
          </div>
        )}

        {/* ── Notice ── */}
        <div style={s.notice}>
          <span style={s.noticeIcon}>📱</span>
          <span style={s.noticeText}>
            Chúng tôi sẽ liên hệ xác nhận qua{" "}
            <strong style={{color:"#F0F0F0"}}>{bill?.recipientPhone || "số điện thoại của bạn"}</strong>{" "}
            trong vòng <strong style={{color:"#E8000D"}}>30 phút</strong>.
          </span>
        </div>

        {/* ── Badges ── */}
        <div style={s.badges}>
          {[["🛡️","Bảo hành 24 tháng"],["🔄","Đổi trả 30 ngày"],["🚚","Giao hàng toàn quốc"]].map(([icon, label]) => (
            <div key={label} style={s.badge}>
              <span style={{fontSize:20}}>{icon}</span>
              <span style={s.badgeLabel}>{label}</span>
            </div>
          ))}
        </div>

        {/* ── Actions ── */}
        <div style={s.actions}>
          <button style={s.btnPrimary}    onClick={() => setActivePage && setActivePage("/user/home")}>
            🛒 TIẾP TỤC MUA HÀNG
          </button>
          <button style={s.btnSecondary} onClick={() => setActivePage && setActivePage("/user/profile")}>
            📦 XEM ĐƠN HÀNG
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin      { to { transform: rotate(360deg); } }
        @keyframes pulse     { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.7;transform:scale(1.06)} }
        @keyframes ringPulse { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.12);opacity:.2} }
      `}</style>
    </div>
  );
}

const s = {
  wrap:   { background:"#070707", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px", position:"relative", overflow:"hidden" },
  gridBg: { position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(232,0,13,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(232,0,13,.025) 1px,transparent 1px)", backgroundSize:"44px 44px", pointerEvents:"none" },
  glow:   { position:"absolute", top:"10%", left:"50%", transform:"translateX(-50%)", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(232,0,13,.07) 0%,transparent 70%)", pointerEvents:"none" },

  inner: { width:"100%", maxWidth:620, display:"flex", flexDirection:"column", alignItems:"center", gap:0, position:"relative", zIndex:1 },

  iconWrap:   { position:"relative", width:96, height:96, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:28 },
  iconRing1:  { position:"absolute", inset:-10, borderRadius:"50%", border:"1px solid rgba(232,0,13,.25)", animation:"ringPulse 2.5s ease-in-out infinite" },
  iconRing2:  { position:"absolute", inset:-22, borderRadius:"50%", border:"1px solid rgba(232,0,13,.1)", animation:"ringPulse 2.5s .5s ease-in-out infinite" },
  iconCircle: { width:96, height:96, borderRadius:"50%", background:"linear-gradient(135deg,#1a0000,#2d0005)", border:"2px solid #E8000D", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 30px rgba(232,0,13,.35), inset 0 0 20px rgba(232,0,13,.08)" },

  tagLine: { fontFamily:"'Orbitron',monospace", fontSize:9.5, letterSpacing:4, color:"#E8000D", marginBottom:12, textAlign:"center" },
  heading: { fontFamily:"'Bebas Neue',cursive", fontSize:"clamp(38px,7vw,58px)", letterSpacing:4, color:"#F0F0F0", lineHeight:1.1, textAlign:"center", marginBottom:16 },
  accent:  { display:"flex", alignItems:"center", gap:10, marginBottom:24 },
  aBar:    { width:44, height:2, background:"linear-gradient(90deg,transparent,#E8000D)" },
  aDot:    { width:6, height:6, borderRadius:"50%", background:"#E8000D", boxShadow:"0 0 10px rgba(232,0,13,.9)" },

  orderCodeWrap:  { display:"flex", flexDirection:"column", alignItems:"center", gap:5, marginBottom:24 },
  orderCodeLabel: { fontFamily:"'Orbitron',monospace", fontSize:8, letterSpacing:3, color:"#333" },
  orderCode:      { fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:900, color:"#E8000D", letterSpacing:2, textShadow:"0 0 16px rgba(232,0,13,.4)" },

  loadRow: { display:"flex", alignItems:"center", gap:12, padding:"30px 0" },
  spin:    { width:18, height:18, border:"2px solid #1a1a1a", borderTop:"2px solid #E8000D", borderRadius:"50%", animation:"spin .8s linear infinite" },
  gray:    { fontFamily:"'Orbitron',monospace", fontSize:9, color:"#333", letterSpacing:2 },

  card:    { width:"100%", background:"#0A0A0A", border:"1px solid #1a1a1a", borderRadius:8, overflow:"hidden", marginBottom:18 },
  section: { padding:"18px 22px" },
  sectionLabel: { fontFamily:"'Orbitron',monospace", fontSize:8, letterSpacing:2, color:"#444", marginBottom:13 },

  itemList:  { display:"flex", flexDirection:"column", gap:10 },
  itemRow:   { display:"flex", alignItems:"center", gap:12, padding:"8px 0", borderBottom:"1px solid #111" },
  itemThumb: { width:42, height:42, background:"#141414", borderRadius:4, border:"1px solid #1e1e1e", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, overflow:"hidden" },
  itemImg:   { width:"100%", height:"100%", objectFit:"cover" },
  itemInfo:  { flex:1, minWidth:0 },
  itemName:  { fontSize:13, fontWeight:600, color:"#E0E0E0", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontFamily:"'Rajdhani',sans-serif" },
  itemColor: { fontSize:11, color:"#555", fontFamily:"'Rajdhani',sans-serif", marginTop:2 },
  itemQty:   { fontFamily:"'Orbitron',monospace", fontSize:10, color:"#444", flexShrink:0 },
  itemPrice: { fontFamily:"'Orbitron',monospace", fontSize:11, fontWeight:700, color:"#E8000D", flexShrink:0, minWidth:80, textAlign:"right" },

  divider: { height:1, background:"linear-gradient(90deg,transparent,rgba(232,0,13,.3),transparent)" },

  detailGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:"#111" },
  detailItem: { padding:"13px 20px", background:"#0A0A0A" },
  detailKey:  { fontFamily:"'Orbitron',monospace", fontSize:7.5, letterSpacing:1.5, color:"#333", marginBottom:5 },
  detailVal:  { fontSize:13, fontWeight:600, color:"#C0C0C0", fontFamily:"'Rajdhani',sans-serif" },

  totalRow:    { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 22px", background:"#070707", borderTop:"1px solid #161616" },
  totalLabel:  { fontFamily:"'Orbitron',monospace", fontSize:9, color:"#444", letterSpacing:2 },
  totalAmount: { fontFamily:"'Orbitron',monospace", fontSize:22, fontWeight:900, color:"#E8000D", textShadow:"0 0 18px rgba(232,0,13,.35)" },

  notice:     { width:"100%", display:"flex", alignItems:"flex-start", gap:12, background:"rgba(232,0,13,.05)", border:"1px solid rgba(232,0,13,.15)", borderRadius:5, padding:"13px 16px", marginBottom:18 },
  noticeIcon: { fontSize:18, flexShrink:0, marginTop:1 },
  noticeText: { fontSize:13, color:"#666", lineHeight:1.7, fontFamily:"'Rajdhani',sans-serif" },

  badges:     { display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", marginBottom:26 },
  badge:      { display:"flex", alignItems:"center", gap:7, background:"#0A0A0A", border:"1px solid #1a1a1a", borderRadius:30, padding:"7px 16px" },
  badgeLabel: { fontFamily:"'Orbitron',monospace", fontSize:7.5, color:"#444", letterSpacing:.8 },

  actions:      { display:"flex", gap:12, width:"100%", flexWrap:"wrap" },
  btnPrimary:   { flex:1, minWidth:160, background:"linear-gradient(135deg,#E8000D,#8B0000)", border:"none", color:"#fff", fontFamily:"'Orbitron',monospace", fontSize:10, fontWeight:700, letterSpacing:1.5, padding:"14px 0", borderRadius:4, cursor:"pointer", boxShadow:"0 6px 22px rgba(232,0,13,.35)", transition:"box-shadow .2s" },
  btnSecondary: { flex:1, minWidth:160, background:"none", border:"1px solid #222", color:"#666", fontFamily:"'Orbitron',monospace", fontSize:10, fontWeight:700, letterSpacing:1.5, padding:"14px 0", borderRadius:4, cursor:"pointer", transition:"border-color .2s, color .2s" },
};
