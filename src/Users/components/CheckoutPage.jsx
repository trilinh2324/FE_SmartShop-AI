import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8080/api";

const lb  = { display:"block", fontFamily:"'Orbitron',monospace", fontSize:8, letterSpacing:1.5, color:"#555", marginBottom:6, textTransform:"uppercase" };
const inp = { width:"100%", background:"#111", border:"1px solid #1e1e1e", borderRadius:3, padding:"10px 13px", color:"#F0F0F0", fontFamily:"'Rajdhani',sans-serif", fontSize:13, outline:"none", transition:"border-color .2s", boxSizing:"border-box" };

const PROVINCES = ["TP. Hồ Chí Minh","Hà Nội","Đà Nẵng","Cần Thơ","Hải Phòng","Bình Dương","Đồng Nai"];
const DISTRICTS = ["Quận 1","Quận 2","Quận 3","Quận 4","Quận 5","Bình Thạnh","Gò Vấp","Tân Bình"];
const WARDS     = ["Phường Bến Nghé","Phường Bến Thành","Phường Cầu Ông Lãnh","Phường Cô Giang"];

const formatPrice = (n) => new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(n);

function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

async function authFetch(url, options = {}) {
  const token = getToken();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}

export default function CheckoutPage({ setActivePage }) {
  const [step,       setStep]       = useState(1);
  const [form,       setForm]       = useState({ name:"", phone:"", email:"", province:"", district:"", ward:"", address:"", note:"" });
  const [payment,    setPayment]    = useState("cod");
  const [errors,     setErrors]     = useState({});
  const [processing, setProcessing] = useState(false);

  const [cart,        setCart]        = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError,   setCartError]   = useState("");
  const [billResult,  setBillResult]  = useState(null);

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    setCartLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/user/cart`);
      if (!res.ok) throw new Error("Không thể tải giỏ hàng");
      const data = await res.json();
      setCart(data);
    } catch (e) {
      setCartError(e.message);
    } finally {
      setCartLoading(false);
    }
  };

  const getItemImage = (item) => {
    const path = item.productColor?.image || item.productColor?.product?.image;
    return path ? `http://localhost:8080${path}` : null;
  };
  const getItemName  = (item) => item.productColor?.product?.name || item.name || "Sản phẩm";
  const getItemColor = (item) => item.productColor?.color?.name || "";
  const getItemPrice = (item) => item.productColor?.product?.price || item.price || 0;
  const getItemQty   = (item) => item.quantity || item.qty || 1;
  const getItemTotal = (item) => getItemPrice(item) * getItemQty(item);

  const subtotal = cart.reduce((s, i) => s + getItemTotal(i), 0);
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const total    = subtotal + shipping;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())                              e.name     = "Vui lòng nhập họ tên";
    if (!form.phone.trim())                             e.phone    = "Vui lòng nhập số điện thoại";
    else if (!/^0[3-9]\d{8}$/.test(form.phone.trim())) e.phone    = "Số điện thoại không hợp lệ";
    if (!form.province)                                 e.province = "Vui lòng chọn tỉnh/thành";
    if (!form.address.trim())                           e.address  = "Vui lòng nhập địa chỉ cụ thể";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const createBill = async () => {
    const items = cart.map(item => ({
      productColorId: item.productColor?.id || item.productColorId,
      quantity: getItemQty(item),
    }));

    const body = {
      recipientName:    form.name,
      recipientPhone:   form.phone,
      recipientEmail:   form.email,
      recipientAddress: form.address,
      selectedProvince: form.province,
      selectedDistrict: form.district,
      selectedCountry:  "Việt Nam",
      paymentMethod:    payment.toUpperCase(),
      shippingMethod:   "STANDARD",
      description:      form.note,
      items,
    };

    const res = await authFetch(`${API_BASE}/user/bill/create`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Tạo đơn hàng thất bại");
    }
    return res.json();
  };

  const createPayment = async (billId) => {
    const res = await authFetch(`${API_BASE}/payment/create/${billId}`, { method: "POST" });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Tạo link thanh toán thất bại");
    }
    return res.json();
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    try {
      const billData = await createBill();
      const billId   = billData.billId;
      localStorage.setItem("lastBillId", billId);

      if (payment === "cod") {
        // COD → thành công ngay
        setBillResult(billData);
        setCart([]);
        setStep(3);
      } else {
        // banking + banking_online → đều dùng PayOS
        const payData = await createPayment(billId);
        window.location.href = payData.checkoutUrl;
      }
    } catch (e) {
      alert("❌ " + e.message);
    } finally {
      setProcessing(false);
    }
  };

  /* ─── SUCCESS ─────────────────────────────────────── */
  if (step === 3 && billResult) return (
    <div style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
      <div style={{ textAlign:"center", maxWidth:500 }}>
        <div style={{ width:88, height:88, background:"radial-gradient(circle,rgba(232,0,13,.2),transparent)", border:"2px solid #E8000D", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", fontSize:36 }}>✓</div>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:"#E8000D", letterSpacing:4, marginBottom:10 }}>ĐẶT HÀNG THÀNH CÔNG</div>
        <h2 style={{ fontFamily:"'Bebas Neue',cursive", fontSize:44, letterSpacing:4, color:"#F0F0F0", marginBottom:14 }}>CẢM ƠN BẠN!</h2>
        <p style={{ color:"#555", fontSize:14, lineHeight:1.8, marginBottom:8 }}>
          Đơn hàng <span style={{ color:"#E8000D", fontFamily:"'Orbitron',monospace", fontWeight:700 }}>#{billResult.billId}</span> đã xác nhận.
        </p>
        <p style={{ color:"#444", fontSize:13, marginBottom:32 }}>
          Chúng tôi sẽ liên hệ qua <b style={{color:"#F0F0F0"}}>{form.phone}</b> trong 30 phút.
        </p>
        <div style={{ background:"#0F0F0F", border:"1px solid #1e1e1e", borderRadius:5, padding:"18px 20px", marginBottom:28, textAlign:"left" }}>
          {cart.map((item, i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid #141414", fontSize:13 }}>
              <span style={{ color:"#666" }}>{getItemName(item)} {getItemColor(item) ? `(${getItemColor(item)})` : ""} × {getItemQty(item)}</span>
              <span style={{ color:"#E8000D", fontFamily:"'Orbitron',monospace", fontSize:11, fontWeight:700 }}>{formatPrice(getItemTotal(item))}</span>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", paddingTop:12, fontFamily:"'Orbitron',monospace", fontSize:14, fontWeight:900 }}>
            <span style={{color:"#555"}}>TỔNG</span>
            <span style={{color:"#E8000D"}}>{formatPrice(billResult.totalAmount || total)}</span>
          </div>
        </div>
        <button onClick={() => setActivePage && setActivePage("home")}
          style={{ background:"linear-gradient(135deg,#E8000D,#8B0000)", border:"none", color:"#fff", fontFamily:"'Orbitron',monospace", fontSize:10, fontWeight:700, letterSpacing:1.5, padding:"13px 32px", borderRadius:4, cursor:"pointer" }}>
          TIẾP TỤC MUA HÀNG →
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"40px 20px" }}>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:8.5, letterSpacing:4, color:"#E8000D", marginBottom:7 }}>SMARTSHOP / THANH TOÁN</div>
        <h1 style={{ fontFamily:"'Bebas Neue',cursive", fontSize:38, letterSpacing:4, color:"#F0F0F0", lineHeight:1 }}>ĐẶT HÀNG</h1>
      </div>

      {/* Progress */}
      <div style={{ display:"flex", alignItems:"center", marginBottom:36 }}>
        {[["01","Thông tin nhận hàng",1],["02","Phương thức thanh toán",2]].map(([num,label,s],i) => (
          <div key={s} style={{ display:"flex", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:step>=s?"#E8000D":"#0F0F0F", border:`2px solid ${step>=s?"#E8000D":"#222"}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Orbitron',monospace", fontSize:9, fontWeight:700, color:step>=s?"#fff":"#333", transition:"all .3s" }}>
                {step>s?"✓":num}
              </div>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:8, letterSpacing:1.5, color:step>=s?"#E8000D":"#333" }}>{label}</div>
            </div>
            {i<1 && <div style={{ width:48, height:1, background:step>s?"#E8000D":"#1e1e1e", margin:"0 14px", transition:"background .3s" }}/>}
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 370px", gap:22, alignItems:"start" }}>

        {/* ── LEFT ── */}
        <div>
          {/* STEP 1 */}
          {step===1 && (
            <div style={{ background:"#0A0A0A", border:"1px solid #1a1a1a", borderRadius:6, padding:"24px" }}>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, letterSpacing:2, color:"#E8000D", marginBottom:20, paddingBottom:12, borderBottom:"1px solid #161616" }}>📦 THÔNG TIN NHẬN HÀNG</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13 }}>
                <div style={{gridColumn:"1/-1"}}>
                  <label style={lb}>Họ và tên *</label>
                  <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Nguyễn Văn An" style={{...inp,borderColor:errors.name?"#E8000D":"#1e1e1e"}}/>
                  {errors.name && <div style={{ fontSize:10, color:"#E8000D", marginTop:4 }}>{errors.name}</div>}
                </div>
                <div>
                  <label style={lb}>Số điện thoại *</label>
                  <input value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="0901234567" style={{...inp,borderColor:errors.phone?"#E8000D":"#1e1e1e"}}/>
                  {errors.phone && <div style={{ fontSize:10, color:"#E8000D", marginTop:4 }}>{errors.phone}</div>}
                </div>
                <div>
                  <label style={lb}>Email</label>
                  <input value={form.email} onChange={e=>set("email",e.target.value)} placeholder="email@example.com" style={inp}/>
                </div>
                <div>
                  <label style={lb}>Tỉnh / Thành phố *</label>
                  <select value={form.province} onChange={e=>set("province",e.target.value)} style={{...inp,borderColor:errors.province?"#E8000D":"#1e1e1e"}}>
                    <option value="">Chọn tỉnh/thành</option>
                    {PROVINCES.map(p=><option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.province && <div style={{ fontSize:10, color:"#E8000D", marginTop:4 }}>{errors.province}</div>}
                </div>
                <div>
                  <label style={lb}>Quận / Huyện</label>
                  <select value={form.district} onChange={e=>set("district",e.target.value)} style={inp}>
                    <option value="">Chọn quận/huyện</option>
                    {DISTRICTS.map(d=><option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lb}>Phường / Xã</label>
                  <select value={form.ward} onChange={e=>set("ward",e.target.value)} style={inp}>
                    <option value="">Chọn phường/xã</option>
                    {WARDS.map(w=><option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div style={{gridColumn:"1/-1"}}>
                  <label style={lb}>Địa chỉ cụ thể *</label>
                  <input value={form.address} onChange={e=>set("address",e.target.value)} placeholder="Số nhà, tên đường..." style={{...inp,borderColor:errors.address?"#E8000D":"#1e1e1e"}}/>
                  {errors.address && <div style={{ fontSize:10, color:"#E8000D", marginTop:4 }}>{errors.address}</div>}
                </div>
                <div style={{gridColumn:"1/-1"}}>
                  <label style={lb}>Ghi chú đơn hàng</label>
                  <textarea value={form.note} onChange={e=>set("note",e.target.value)} placeholder="Giao giờ hành chính, gọi trước khi giao..." rows={3} style={{...inp,resize:"vertical",minHeight:74}}/>
                </div>
              </div>
              <button onClick={()=>{ if(validate()) setStep(2); }} style={{ width:"100%", marginTop:20, background:"linear-gradient(135deg,#E8000D,#8B0000)", border:"none", color:"#fff", fontFamily:"'Orbitron',monospace", fontSize:10.5, fontWeight:700, letterSpacing:1.5, padding:"14px 0", borderRadius:4, cursor:"pointer", boxShadow:"0 6px 22px rgba(232,0,13,.35)" }}>
                TIẾP THEO: PHƯƠNG THỨC THANH TOÁN →
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step===2 && (
            <div>
              <div style={{ background:"#0A0A0A", border:"1px solid #1a1a1a", borderRadius:5, padding:"15px 20px", marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:7.5, color:"#E8000D", letterSpacing:2, marginBottom:5 }}>ĐỊA CHỈ NHẬN HÀNG</div>
                  <div style={{ fontSize:14, fontWeight:700, color:"#F0F0F0" }}>{form.name} — {form.phone}</div>
                  <div style={{ fontSize:12, color:"#555", marginTop:2 }}>{form.address}{form.district&&`, ${form.district}`}{form.province&&`, ${form.province}`}</div>
                </div>
                <button onClick={()=>setStep(1)} style={{ background:"none", border:"1px solid #222", color:"#555", fontFamily:"'Orbitron',monospace", fontSize:7.5, letterSpacing:1, padding:"6px 14px", borderRadius:3, cursor:"pointer", flexShrink:0 }}>✏️ SỬA</button>
              </div>

              <div style={{ background:"#0A0A0A", border:"1px solid #1a1a1a", borderRadius:6, padding:"24px" }}>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, letterSpacing:2, color:"#E8000D", marginBottom:18, paddingBottom:12, borderBottom:"1px solid #161616" }}>💳 PHƯƠNG THỨC THANH TOÁN</div>

                {/* ✅ 3 phương thức: COD, Ngân hàng (chuyển khoản thủ công), Ngân hàng online (PayOS) */}
                {[
                  {
                    key:   "cod",
                    icon:  "🚚",
                    title: "Thanh toán khi nhận hàng (COD)",
                    desc:  "Trả tiền mặt khi giao hàng đến tay bạn",
                  },
                  {
                    key:   "banking",
                    icon:  "🏦",
                    title: "Chuyển khoản ngân hàng (PayOS)",
                    desc:  "Quét QR hoặc chuyển khoản qua cổng PayOS – nhanh & tự động xác nhận",
                  },
                  {
                    key:   "banking_online",
                    icon:  "💳",
                    title: "Ngân hàng online / Thẻ ATM / Visa (PayOS)",
                    desc:  "Thanh toán nhanh qua cổng PayOS – hỗ trợ tất cả ngân hàng",
                  },
                ].map(m => (
                  <div
                    key={m.key}
                    onClick={() => setPayment(m.key)}
                    style={{
                      background:  payment===m.key ? "#130909" : "#111",
                      border:      `1px solid ${payment===m.key ? "#E8000D" : "#1e1e1e"}`,
                      borderRadius: 4,
                      padding:     "14px 16px",
                      cursor:      "pointer",
                      display:     "flex",
                      alignItems:  "center",
                      gap:         13,
                      marginBottom: 9,
                      transition:  "all .2s",
                      boxShadow:   payment===m.key ? "0 0 14px rgba(232,0,13,.12)" : "none",
                    }}
                  >
                    <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${payment===m.key?"#E8000D":"#2a2a2a"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {payment===m.key && <div style={{ width:8, height:8, borderRadius:"50%", background:"#E8000D", boxShadow:"0 0 6px rgba(232,0,13,.8)" }}/>}
                    </div>
                    <span style={{ fontSize:20, flexShrink:0 }}>{m.icon}</span>
                    <div>
                      <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:14, color:"#F0F0F0" }}>{m.title}</div>
                      <div style={{ fontSize:11, color:"#555" }}>{m.desc}</div>
                    </div>
                  </div>
                ))}

                {/* Thông báo PayOS – hiện cho banking và banking_online */}
                {(payment==="banking" || payment==="banking_online") && (
                  <div style={{ background:"#0F0F0F", border:"1px solid #333", borderRadius:4, padding:"13px 16px", marginBottom:6, fontSize:12, color:"#555", display:"flex", alignItems:"center", gap:8 }}>
                    <span>🔗</span>
                    <span>Sau khi đặt hàng bạn sẽ được chuyển đến trang <span style={{color:"#F0F0F0"}}>PayOS</span> để hoàn tất thanh toán</span>
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={processing || cart.length===0}
                  style={{ width:"100%", marginTop:16, background:processing?"#2a0005":"linear-gradient(135deg,#E8000D,#8B0000)", border:"none", color:"#fff", fontFamily:"'Orbitron',monospace", fontSize:11, fontWeight:700, letterSpacing:1.5, padding:"15px 0", borderRadius:4, cursor:processing?"not-allowed":"pointer", boxShadow:"0 6px 22px rgba(232,0,13,.35)", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                  {processing
                    ? <><span style={{ display:"inline-block", width:15, height:15, border:"2px solid rgba(255,255,255,.25)", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .8s linear infinite" }}/> XỬ LÝ...</>
                    : `ĐẶT HÀNG — ${formatPrice(total)}`
                  }
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Order Summary ── */}
        <div style={{ position:"sticky", top:20 }}>
          <div style={{ background:"#0A0A0A", border:"1px solid #1a1a1a", borderRadius:6, overflow:"hidden" }}>
            <div style={{ padding:"16px 20px", borderBottom:"1px solid #161616", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, letterSpacing:2, color:"#E8000D" }}>ĐƠN HÀNG</div>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:8, color:"#333" }}>
                {cartLoading ? "..." : `${cart.reduce((s,i)=>s+getItemQty(i),0)} SP`}
              </div>
            </div>

            {cartLoading ? (
              <div style={{ padding:"30px 20px", textAlign:"center", color:"#333", fontFamily:"'Orbitron',monospace", fontSize:9, letterSpacing:2 }}>ĐANG TẢI...</div>
            ) : cartError ? (
              <div style={{ padding:"20px", textAlign:"center", color:"#E8000D", fontSize:12 }}>⚠️ {cartError}</div>
            ) : cart.length===0 ? (
              <div style={{ padding:"30px 20px", textAlign:"center", fontFamily:"'Orbitron',monospace", fontSize:10, color:"#222", letterSpacing:2 }}>GIỎ HÀNG TRỐNG</div>
            ) : (
              <div style={{ maxHeight:300, overflowY:"auto", padding:"10px 20px" }}>
                {cart.map((item, i) => (
                  <div key={i} style={{ display:"flex", gap:11, padding:"9px 0", borderBottom:"1px solid #111", alignItems:"center" }}>
                    <div style={{ width:44, height:44, background:"#141414", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0, border:"1px solid #1e1e1e", overflow:"hidden" }}>
                      {getItemImage(item)
                        ? <img src={getItemImage(item)} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                        : "📦"
                      }
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:600, color:"#F0F0F0", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{getItemName(item)}</div>
                      {getItemColor(item) && <div style={{ fontSize:10, color:"#666" }}>{getItemColor(item)}</div>}
                      <div style={{ fontSize:10, color:"#444", fontFamily:"'Orbitron',monospace" }}>× {getItemQty(item)}</div>
                    </div>
                    <div style={{ fontSize:11, color:"#E8000D", fontFamily:"'Orbitron',monospace", fontWeight:700, flexShrink:0 }}>{formatPrice(getItemTotal(item))}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Coupon */}
            <div style={{ padding:"13px 20px", borderTop:"1px solid #161616", borderBottom:"1px solid #161616" }}>
              <div style={{ display:"flex", gap:7 }}>
                <input placeholder="Mã giảm giá..." style={{ flex:1, background:"#0F0F0F", border:"1px solid #1e1e1e", borderRadius:3, padding:"8px 11px", color:"#F0F0F0", fontFamily:"'Rajdhani',sans-serif", fontSize:12, outline:"none" }}/>
                <button style={{ background:"none", border:"1px solid #E8000D", color:"#E8000D", fontFamily:"'Orbitron',monospace", fontSize:7.5, fontWeight:700, padding:"0 13px", borderRadius:3, cursor:"pointer", letterSpacing:1, whiteSpace:"nowrap" }}>ÁP DỤNG</button>
              </div>
            </div>

            {/* Totals */}
            <div style={{ padding:"15px 20px" }}>
              {[
                ["Tạm tính", formatPrice(subtotal)],
                ["Phí ship",  shipping===0 ? "🎉 Miễn phí" : formatPrice(shipping)],
              ].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13 }}>
                  <span style={{color:"#555"}}>{k}</span>
                  <span style={{color:String(v).includes("Miễn")?"#22c55e":"#F0F0F0", fontWeight:600}}>{v}</span>
                </div>
              ))}
              {shipping===0 && subtotal>0 && (
                <div style={{ fontSize:10, color:"#22c55e", textAlign:"right", marginBottom:8 }}>✓ Đủ điều kiện free ship</div>
              )}
              <div style={{ height:1, background:"linear-gradient(90deg,transparent,#E8000D,transparent)", margin:"11px 0" }}/>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                <span style={{ fontFamily:"'Orbitron',monospace", fontSize:8, color:"#555", letterSpacing:1 }}>TỔNG CỘNG</span>
                <span style={{ fontFamily:"'Orbitron',monospace", fontSize:20, fontWeight:900, color:"#E8000D" }}>{formatPrice(total)}</span>
              </div>
            </div>

            <div style={{ padding:"13px 20px", borderTop:"1px solid #161616", background:"#070707" }}>
              {[
                ["🛡️","Bảo hành 24 tháng chính hãng"],
                ["🔄","Đổi trả 30 ngày miễn phí"],
                ["🔒","Thanh toán bảo mật 100%"],
              ].map(([icon,text]) => (
                <div key={text} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, fontSize:11, color:"#333" }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
