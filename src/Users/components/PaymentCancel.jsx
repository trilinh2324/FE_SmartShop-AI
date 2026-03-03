import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import instance from "../api/axiosConfig";

const API_BASE = "http://localhost:8080";
const fmt = (n) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n || 0);

function getToken() { return localStorage.getItem("token"); }

export default function PaymentCancel({ setActivePage }) {
  const [bill,     setBill]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [visible,  setVisible]  = useState(false);

  // ✅ FIX: khai báo billId ở ngoài useEffect để dùng được trong dep array
  const billId = new URLSearchParams(window.location.search).get("billId")
    || localStorage.getItem("lastBillId");

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);

    if (!billId) { setLoading(false); return; }

    const token = getToken();
    fetch(`${API_BASE}/api/user/bill/${billId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setBill(d); })
      .finally(() => setLoading(false));
  }, [billId]); // ✅ FIX: thêm billId vào dependency array (giải quyết warning)

  const handleRetry = async () => {
    if (!billId) return;
    setRetrying(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/payment/create/${billId}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
      else alert("❌ Không thể tạo lại link thanh toán");
    } catch {
      alert("❌ Lỗi kết nối, vui lòng thử lại");
    } finally {
      setRetrying(false);
    }
  };

  const orderCode   = billId ? `#TZ${String(billId).padStart(8, "0")}` : "#TZ--------";
  const total       = bill?.totalPayableAmount || bill?.totalAmount || 0;
  const items       = bill?.items || bill?.billItems || [];
  const method      = bill?.paymentMethod || "";
  const methodLabel = { COD:"Thanh toán khi nhận hàng", BANKING:"Chuyển khoản ngân hàng", MOMO:"Ví MoMo", VNPAY:"VNPay" }[method] || method;

  const getItemName  = (i) => i.productColor?.product?.name || i.name || "Sản phẩm";
  const getItemImg   = (i) => i.productColor?.product?.image || i.productColor?.image || null;
  const getItemPrice = (i) => i.price || i.productColor?.product?.price || 0;
  const getItemQty   = (i) => i.quantity || i.qty || 1;

  return (
    <div style={s.wrap}>
      <div style={s.gridBg} />
      <div style={s.glowOrange} />

      <div style={{ ...s.inner, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: "opacity .6s ease, transform .6s ease" }}>

        {/* ── Icon ── */}
        <div style={s.iconWrap}>
          <div style={s.iconRing1} />
          <div style={s.iconRing2} />
          <div style={s.iconCircle}>
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <path d="M11 11L27 27M27 11L11 27" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"
                style={{ strokeDasharray:50, strokeDashoffset: visible?0:50, transition:"stroke-dashoffset .65s .25s ease" }}/>
            </svg>
          </div>
        </div>

        {/* ── Heading ── */}
        <div style={s.tagLine}>THANH TOÁN BỊ HỦY</div>
        <h1 style={s.heading}>GIAO DỊCH<br/>CHƯA HOÀN TẤT</h1>
        <div style={s.accent}><div style={s.aBar}/><div style={s.aDot}/><div style={s.aBar}/></div>

        <p style={s.subtitle}>
          Đơn hàng của bạn <strong style={{color:"#F0F0F0"}}>{orderCode}</strong> vẫn còn đó.
          Bạn có thể thử thanh toán lại bất cứ lúc nào.
        </p>

        {/* ── Reasons ── */}
        <div style={s.reasonBox}>
          <div style={s.reasonLabel}>⚠️ LÝ DO CÓ THỂ XẢY RA</div>
          <div style={s.reasonGrid}>
            {[
              ["💳", "Thẻ/tài khoản không đủ số dư"],
              ["⏱️", "Phiên thanh toán hết hạn"],
              ["🚫", "Bạn chủ động hủy giao dịch"],
              ["🔌", "Lỗi kết nối trong quá trình thanh toán"],
            ].map(([icon, text]) => (
              <div key={text} style={s.reasonItem}>
                <span style={s.reasonIcon}>{icon}</span>
                <span style={s.reasonText}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bill info ── */}
        {!loading && bill && (
          <div style={s.card}>
            <div style={s.cardHeader}>
              <span style={s.cardHeaderLabel}>📋 THÔNG TIN ĐƠN HÀNG</span>
              <span style={s.pendingBadge}>⏳ CHỜ THANH TOÁN</span>
            </div>

            {items.length > 0 && (
              <div style={s.itemList}>
                {items.map((item, i) => (
                  <div key={i} style={s.itemRow}>
                    <div style={s.itemThumb}>
                      {getItemImg(item)
                        ? <img src={`${API_BASE}${getItemImg(item)}`} alt="" style={s.itemImg}/>
                        : <span style={{fontSize:18}}>📦</span>
                      }
                    </div>
                    <div style={s.itemName}>{getItemName(item)}</div>
                    <div style={s.itemQty}>× {getItemQty(item)}</div>
                    <div style={s.itemPrice}>{fmt(getItemPrice(item) * getItemQty(item))}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={s.cardDivider} />

            <div style={s.cardMeta}>
              {bill.recipientName && (
                <div style={s.metaRow}>
                  <span style={s.metaKey}>👤 NGƯỜI NHẬN</span>
                  <span style={s.metaVal}>{bill.recipientName} · {bill.recipientPhone}</span>
                </div>
              )}
              {methodLabel && (
                <div style={s.metaRow}>
                  <span style={s.metaKey}>💳 PHƯƠNG THỨC</span>
                  <span style={s.metaVal}>{methodLabel}</span>
                </div>
              )}
            </div>

            <div style={s.totalRow}>
              <span style={s.totalLabel}>TỔNG THANH TOÁN</span>
              <span style={s.totalAmt}>{fmt(total)}</span>
            </div>
          </div>
        )}

        {loading && billId && (
          <div style={s.loadRow}><div style={s.spin}/><span style={s.gray}>ĐANG TẢI ĐƠN HÀNG...</span></div>
        )}

        {/* ── Actions ── */}
        <div style={s.actions}>
          {billId && (
            <button
              style={{ ...s.btnRetry, ...(retrying ? s.btnRetryDisabled : {}) }}
              onClick={handleRetry}
              disabled={retrying}
            >
              {retrying
                ? <><div style={s.spinWhite}/> ĐANG XỬ LÝ...</>
                : "🔄 THỬ THANH TOÁN LẠI"
              }
            </button>
          )}
          <button style={s.btnHome}   onClick={() => setActivePage && setActivePage("home")}>
            🏠 VỀ TRANG CHỦ
          </button>
          <button style={s.btnOrders} onClick={() => setActivePage && setActivePage("profile")}>
            📦 XEM ĐƠN HÀNG
          </button>
        </div>

        {/* ── Support ── */}
        <div style={s.support}>
          <span style={s.supportText}>Cần hỗ trợ? Liên hệ:</span>
          <span style={s.supportContact}>📞 1800 xxxx</span>
          <span style={s.supportDot}>·</span>
          <span style={s.supportContact}>✉️ support@smartshop.vn</span>
        </div>
      </div>

      <style>{`
        @keyframes spin      { to { transform: rotate(360deg); } }
        @keyframes ringPulse { 0%,100%{transform:scale(1);opacity:.45} 50%{transform:scale(1.1);opacity:.18} }
      `}</style>
    </div>
  );
}

const ORANGE = "#f59e0b";

const s = {
  wrap:       { background:"#070707", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px", position:"relative", overflow:"hidden" },
  gridBg:     { position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(245,158,11,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,.018) 1px,transparent 1px)", backgroundSize:"44px 44px", pointerEvents:"none" },
  glowOrange: { position:"absolute", top:"8%", left:"50%", transform:"translateX(-50%)", width:560, height:560, borderRadius:"50%", background:`radial-gradient(circle,rgba(245,158,11,.06) 0%,transparent 70%)`, pointerEvents:"none" },

  inner: { width:"100%", maxWidth:580, display:"flex", flexDirection:"column", alignItems:"center", position:"relative", zIndex:1 },

  iconWrap:   { position:"relative", width:96, height:96, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:26 },
  iconRing1:  { position:"absolute", inset:-10, borderRadius:"50%", border:`1px solid rgba(245,158,11,.3)`, animation:"ringPulse 2.4s ease-in-out infinite" },
  iconRing2:  { position:"absolute", inset:-22, borderRadius:"50%", border:`1px solid rgba(245,158,11,.12)`, animation:"ringPulse 2.4s .5s ease-in-out infinite" },
  iconCircle: { width:96, height:96, borderRadius:"50%", background:"linear-gradient(135deg,#1a1000,#2d1f00)", border:`2px solid ${ORANGE}`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 28px rgba(245,158,11,.3), inset 0 0 18px rgba(245,158,11,.07)` },

  tagLine:  { fontFamily:"'Orbitron',monospace", fontSize:9.5, letterSpacing:4, color:ORANGE, marginBottom:11, textAlign:"center" },
  heading:  { fontFamily:"'Bebas Neue',cursive", fontSize:"clamp(36px,6.5vw,54px)", letterSpacing:4, color:"#F0F0F0", lineHeight:1.1, textAlign:"center", marginBottom:16 },
  accent:   { display:"flex", alignItems:"center", gap:10, marginBottom:18 },
  aBar:     { width:44, height:2, background:`linear-gradient(90deg,transparent,${ORANGE})` },
  aDot:     { width:6, height:6, borderRadius:"50%", background:ORANGE, boxShadow:`0 0 10px rgba(245,158,11,.9)` },
  subtitle: { fontFamily:"'Rajdhani',sans-serif", fontSize:14, color:"#555", lineHeight:1.75, textAlign:"center", marginBottom:22, maxWidth:440 },

  reasonBox:   { width:"100%", background:"rgba(245,158,11,.04)", border:`1px solid rgba(245,158,11,.12)`, borderRadius:6, padding:"16px 20px", marginBottom:20 },
  reasonLabel: { fontFamily:"'Orbitron',monospace", fontSize:8, letterSpacing:2, color:ORANGE, marginBottom:13, opacity:.8 },
  reasonGrid:  { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px 14px" },
  reasonItem:  { display:"flex", alignItems:"center", gap:9 },
  reasonIcon:  { fontSize:16, flexShrink:0 },
  reasonText:  { fontFamily:"'Rajdhani',sans-serif", fontSize:12.5, color:"#555", lineHeight:1.5 },

  card:        { width:"100%", background:"#0A0A0A", border:"1px solid #1a1a1a", borderRadius:8, overflow:"hidden", marginBottom:18 },
  cardHeader:  { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 18px", borderBottom:"1px solid #141414" },
  cardHeaderLabel: { fontFamily:"'Orbitron',monospace", fontSize:8, letterSpacing:2, color:"#444" },
  pendingBadge:{ background:`rgba(245,158,11,.1)`, border:`1px solid rgba(245,158,11,.25)`, color:ORANGE, fontFamily:"'Orbitron',monospace", fontSize:7.5, padding:"2px 9px", borderRadius:2, letterSpacing:1 },

  itemList:   { padding:"10px 18px", display:"flex", flexDirection:"column", gap:8 },
  itemRow:    { display:"flex", alignItems:"center", gap:11, padding:"6px 0", borderBottom:"1px solid #0f0f0f" },
  itemThumb:  { width:38, height:38, background:"#141414", borderRadius:3, border:"1px solid #1e1e1e", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, overflow:"hidden" },
  itemImg:    { width:"100%", height:"100%", objectFit:"cover" },
  itemName:   { flex:1, fontSize:12.5, fontWeight:600, color:"#888", fontFamily:"'Rajdhani',sans-serif", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" },
  itemQty:    { fontFamily:"'Orbitron',monospace", fontSize:9.5, color:"#3a3a3a", flexShrink:0 },
  itemPrice:  { fontFamily:"'Orbitron',monospace", fontSize:11, color:"#666", flexShrink:0, minWidth:76, textAlign:"right" },

  cardDivider:{ height:1, background:"linear-gradient(90deg,transparent,#1a1a1a,transparent)" },
  cardMeta:   { padding:"12px 18px", display:"flex", flexDirection:"column", gap:8 },
  metaRow:    { display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:12 },
  metaKey:    { fontFamily:"'Orbitron',monospace", fontSize:7.5, color:"#333", letterSpacing:1.5 },
  metaVal:    { fontFamily:"'Rajdhani',sans-serif", fontSize:13, color:"#666", fontWeight:600 },

  totalRow:   { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 18px", background:"#070707", borderTop:"1px solid #141414" },
  totalLabel: { fontFamily:"'Orbitron',monospace", fontSize:8.5, color:"#333", letterSpacing:2 },
  totalAmt:   { fontFamily:"'Orbitron',monospace", fontSize:19, fontWeight:900, color:ORANGE },

  loadRow: { display:"flex", alignItems:"center", gap:12, padding:"24px 0" },
  spin:    { width:17, height:17, border:"2px solid #1a1a1a", borderTop:`2px solid ${ORANGE}`, borderRadius:"50%", animation:"spin .8s linear infinite" },
  gray:    { fontFamily:"'Orbitron',monospace", fontSize:9, color:"#333", letterSpacing:2 },

  actions:         { display:"flex", gap:10, width:"100%", flexWrap:"wrap", marginBottom:20 },
  btnRetry:        { flex:"1 1 100%", background:`linear-gradient(135deg,${ORANGE},#b45309)`, border:"none", color:"#000", fontFamily:"'Orbitron',monospace", fontSize:10, fontWeight:900, letterSpacing:1.5, padding:"14px 0", borderRadius:4, cursor:"pointer", boxShadow:`0 6px 22px rgba(245,158,11,.3)`, display:"flex", alignItems:"center", justifyContent:"center", gap:10, transition:"opacity .2s" },
  btnRetryDisabled:{ opacity:.6, cursor:"not-allowed" },
  spinWhite:       { width:15, height:15, border:"2px solid rgba(0,0,0,.2)", borderTop:"2px solid #000", borderRadius:"50%", animation:"spin .8s linear infinite" },
  btnHome:         { flex:1, minWidth:130, background:"none", border:"1px solid #222", color:"#555", fontFamily:"'Orbitron',monospace", fontSize:9.5, fontWeight:700, letterSpacing:1.2, padding:"12px 0", borderRadius:4, cursor:"pointer" },
  btnOrders:       { flex:1, minWidth:130, background:"none", border:`1px solid rgba(245,158,11,.2)`, color:ORANGE, fontFamily:"'Orbitron',monospace", fontSize:9.5, fontWeight:700, letterSpacing:1.2, padding:"12px 0", borderRadius:4, cursor:"pointer", opacity:.8 },

  support:        { display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", justifyContent:"center" },
  supportText:    { fontFamily:"'Orbitron',monospace", fontSize:8, color:"#2a2a2a", letterSpacing:1 },
  supportContact: { fontFamily:"'Rajdhani',sans-serif", fontSize:13, color:"#444", fontWeight:600 },
  supportDot:     { color:"#222", fontSize:16 },
};
