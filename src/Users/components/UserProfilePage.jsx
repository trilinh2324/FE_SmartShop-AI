import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8080/api";

const lb  = { display:"block", fontFamily:"'Orbitron',monospace", fontSize:8, letterSpacing:1.5, color:"#555", marginBottom:6, textTransform:"uppercase" };
const inp = { width:"100%", background:"#111", border:"1px solid #1e1e1e", borderRadius:3, padding:"10px 13px", color:"#F0F0F0", fontFamily:"'Rajdhani',sans-serif", fontSize:13, outline:"none", transition:"border-color .2s", boxSizing:"border-box" };

const SC = { shipping:"#f59e0b", SHIPPING:"#f59e0b", done:"#22c55e", DONE:"#22c55e", DELIVERED:"#22c55e", cancel:"#E8000D", CANCELLED:"#E8000D", pending:"#6366f1", PENDING:"#6366f1" };
const SL = { PENDING:"Chờ xác nhận", SHIPPING:"Đang giao", DELIVERED:"Đã giao", CANCELLED:"Đã hủy" };

const PROVINCES = ["TP. Hồ Chí Minh","Hà Nội","Đà Nẵng","Cần Thơ","Hải Phòng","Bình Dương","Đồng Nai"];
const DISTRICTS = ["Quận 1","Quận 2","Quận 3","Quận 4","Quận 5","Bình Thạnh","Gò Vấp","Tân Bình"];
const WARDS     = ["Phường Bến Nghé","Phường Bến Thành","Phường Cầu Ông Lãnh","Phường Cô Giang","Phường Phạm Ngũ Lão"];

const formatPrice = (n) => new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(n||0);

function getToken() { return localStorage.getItem("token"); }

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

const handleLogout = async () => {
  try {
    const token = getToken();
    if (token) {
      await fetch(`${API_BASE}/user/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch (e) {
    console.error("Logout error:", e);
  } finally {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/users/login";
  }
};

export default function UserProfilePage({ setActivePage }) {
  const [tab, setTab] = useState("profile");

  /* ── Profile state ── */
  const [profile,  setProfile]  = useState(null);
  const [editing,  setEditing]  = useState(false);
  const [pForm,    setPForm]    = useState({});
  const [pLoading, setPLoading] = useState(true);
  const [pSaving,  setPSaving]  = useState(false);
  const [pError,   setPError]   = useState("");
  const [pSuccess, setPSuccess] = useState("");

  /* ── Orders state ── */
  const [orders,  setOrders]  = useState([]);
  const [oLoad,   setOLoad]   = useState(true);
  const [oError,  setOError]  = useState("");
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");

  /* ── Password state ── */
  const [pwForm, setPwForm] = useState({ currentPassword:"", newPassword:"", confirmPassword:"" });
  const [pwMsg,  setPwMsg]  = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  /* ── Address state (local for now) ── */
  const [addresses, setAddresses] = useState([
    { id:1, name:"", phone:"", province:"TP. Hồ Chí Minh", district:"Quận 1", ward:"Phường Bến Nghé", address:"", isDefault:true },
  ]);
  const [modal, setModal] = useState(null);
  const [aForm, setAForm] = useState({ name:"", phone:"", province:"", district:"", ward:"", address:"", isDefault:false });

  const TABS = [
    { key:"profile",  icon:"👤", label:"Thông tin cá nhân" },
    { key:"orders",   icon:"📦", label:"Lịch sử đơn hàng"  },
    { key:"address",  icon:"📍", label:"Địa chỉ giao hàng"  },
    { key:"security", icon:"🔒", label:"Bảo mật"            },
  ];

  /* ── Fetch profile ── */
  useEffect(() => {
    fetchProfile();
  }, []);

  /* ── Fetch orders when tab changes ── */
  useEffect(() => {
    if (tab === "orders") fetchOrders();
  }, [tab]);

  const fetchProfile = async () => {
    setPLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/user/auth/me`);
      if (!res.ok) throw new Error("Không thể tải thông tin");
      const data = await res.json();
      // Map fields — adjust to your User model
      const mapped = {
        name:     data.username  || data.name || "",
        phone:    data.phoneNumber || data.phone || "",
        email:    data.email || "",
        birthday: data.birthday || "",
        gender:   data.gender || "male",
        address:  data.address || "",
      };
      setProfile(mapped);
      setPForm(mapped);
      // Prefill address if available
      if (data.address) {
        setAddresses([{ id:1, name:mapped.name, phone:mapped.phone, address:data.address, province:"", district:"", ward:"", isDefault:true }]);
      }
    } catch (e) {
      setPError(e.message);
    } finally {
      setPLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOLoad(true);
    setOError("");
    try {
      // Nếu backend có endpoint lịch sử đơn hàng của user
      const res = await authFetch(`${API_BASE}/user/bill/history`);
      if (!res.ok) throw new Error("Không thể tải lịch sử đơn hàng");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.content || []);
    } catch (e) {
      setOError(e.message);
      // Fallback to empty — remove this mock in production
      setOrders([]);
    } finally {
      setOLoad(false);
    }
  };

  const saveProfile = async () => {
    setPSaving(true);
    setPSuccess("");
    setPError("");
    try {
      const body = {
        address:     pForm.address || "",
        gender:      pForm.gender,
        phoneNumber: pForm.phone,
      };
      const res = await authFetch(`${API_BASE}/user/auth/update-profile`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Cập nhật thất bại");
      }
      setProfile({...pForm});
      setEditing(false);
      setPSuccess("✓ Cập nhật thông tin thành công!");
      setTimeout(() => setPSuccess(""), 3000);
    } catch (e) {
      setPError(e.message);
    } finally {
      setPSaving(false);
    }
  };

  const savePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg("❌ Mật khẩu xác nhận không khớp"); return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwMsg("❌ Mật khẩu mới ít nhất 6 ký tự"); return;
    }
    setPwSaving(true);
    setPwMsg("");
    try {
      const res = await authFetch(`${API_BASE}/user/auth/change-password`, {
        method: "POST",
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đổi mật khẩu thất bại");
      setPwMsg("✓ Đổi mật khẩu thành công!");
      setPwForm({ currentPassword:"", newPassword:"", confirmPassword:"" });
      setTimeout(() => setPwMsg(""), 3000);
    } catch (e) {
      setPwMsg("❌ " + e.message);
    } finally {
      setPwSaving(false);
    }
  };

  /* ── Address helpers ── */
  const openAdd  = () => { setAForm({ name:profile?.name||"", phone:profile?.phone||"", province:"", district:"", ward:"", address:"", isDefault:false }); setModal("add"); };
  const openEdit = (a) => { setAForm({...a}); setModal(a); };
  const saveAddr = () => {
    if (modal==="add") {
      const n = {...aForm, id:Date.now()};
      setAddresses(p => aForm.isDefault ? [...p.map(a=>({...a,isDefault:false})), n] : [...p, n]);
    } else {
      setAddresses(p => p.map(a => {
        if (a.id===modal.id) return {...aForm};
        return aForm.isDefault ? {...a,isDefault:false} : a;
      }));
    }
    setModal(null);
  };
  const deleteAddr = (id) => setAddresses(p => p.filter(a=>a.id!==id));
  const setDefault = (id) => setAddresses(p => p.map(a=>({...a, isDefault:a.id===id})));

  /* ── Order helpers ── */
  const getOrderStatus = (o) => o.paymentStatus || o.status || "PENDING";
  const getOrderLabel  = (o) => SL[getOrderStatus(o)] || getOrderStatus(o);
  const getOrderColor  = (o) => SC[getOrderStatus(o)] || "#6366f1";
  const getOrderDate   = (o) => {
    if (o.createdAt) return new Date(o.createdAt).toLocaleDateString("vi-VN");
    return o.date || "—";
  };
  const getOrderItems  = (o) => o.items || o.billItems || [];
  const getItemName    = (item) => item.productColor?.product?.name || item.name || "Sản phẩm";
  const getItemQty     = (item) => item.quantity || item.qty || 1;
  const getItemPrice   = (item) => item.price || item.productColor?.product?.price || 0;
  const getItemImage   = (item) => item.productColor?.image || "📦";

  const filtered = orders.filter(o => {
    const s = getOrderStatus(o);
    const mf = filter==="all" || s===filter || s.toLowerCase()===filter;
    const oid = String(o.id || "").toLowerCase();
    const ms = oid.includes(search.toLowerCase()) || getOrderItems(o).some(i=>getItemName(i).toLowerCase().includes(search.toLowerCase()));
    return mf && ms;
  });

  const displayName = profile?.name || "Người dùng";
  const displayEmail = profile?.email || "";
  const displayPhone = profile?.phone || "";

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 20px" }}>

      {/* Hero banner */}
      <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:26, padding:"22px 28px", background:"#0A0A0A", border:"1px solid #1a1a1a", borderRadius:8, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(232,0,13,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(232,0,13,.025) 1px,transparent 1px)", backgroundSize:"38px 38px", pointerEvents:"none" }}/>
        <div style={{ width:68, height:68, borderRadius:"50%", background:"linear-gradient(135deg,#1a0000,#2d0005)", border:"2px solid #E8000D", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0, boxShadow:"0 0 22px rgba(232,0,13,.25)" }}>👤</div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:7.5, letterSpacing:3, color:"#E8000D", marginBottom:4 }}>NGƯỜI DÙNG SMARTSHOP</div>
          <div style={{ fontFamily:"'Bebas Neue',cursive", fontSize:26, letterSpacing:3, color:"#F0F0F0", lineHeight:1 }}>{displayName}</div>
          <div style={{ fontSize:12, color:"#444", marginTop:3 }}>{displayEmail}{displayEmail && displayPhone ? " · " : ""}{displayPhone}</div>
        </div>
        <div style={{ display:"flex", gap:24 }}>
          {[[orders.filter(o=>getOrderStatus(o)!=="CANCELLED").length,"Đơn hàng"],[addresses.length,"Địa chỉ"],["0","Voucher"]].map(([n,l]) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:22, fontWeight:900, color:"#E8000D", lineHeight:1 }}>{n}</div>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:7, color:"#333", letterSpacing:1, marginTop:3 }}>{String(l).toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"210px 1fr", gap:18, alignItems:"start" }}>

        {/* Sidebar */}
        <div style={{ background:"#0A0A0A", border:"1px solid #1a1a1a", borderRadius:6, overflow:"hidden" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={()=>setTab(t.key)} style={{ width:"100%", background:tab===t.key?"#130909":"transparent", border:"none", borderLeft:`3px solid ${tab===t.key?"#E8000D":"transparent"}`, color:tab===t.key?"#E8000D":"#555", fontFamily:"'Rajdhani',sans-serif", fontSize:13, fontWeight:600, padding:"13px 16px", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:9, borderBottom:"1px solid #111", transition:"all .2s" }}>
              <span style={{fontSize:16}}>{t.icon}</span>{t.label}
            </button>
          ))}
          <button onClick={handleLogout} style={{ width:"100%", background:"none", border:"none", borderLeft:"3px solid transparent", color:"#333", fontFamily:"'Rajdhani',sans-serif", fontSize:13, fontWeight:600, padding:"13px 16px", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:9 }}>
            <span style={{fontSize:16}}>🚪</span>Đăng xuất
          </button>
        </div>

        {/* Content */}
        <div>

          {/* ── PROFILE TAB ── */}
          {tab==="profile" && (
            <div style={{ background:"#0A0A0A", border:"1px solid #1a1a1a", borderRadius:6, padding:"22px 24px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, paddingBottom:13, borderBottom:"1px solid #161616" }}>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, letterSpacing:2, color:"#E8000D" }}>👤 THÔNG TIN CÁ NHÂN</div>
                {!pLoading && (
                  <button onClick={()=>{setEditing(!editing); setPForm({...profile}); setPError(""); setPSuccess("");}} style={{ background:"none", border:"1px solid #222", color:"#555", fontFamily:"'Orbitron',monospace", fontSize:7.5, letterSpacing:1, padding:"6px 14px", borderRadius:3, cursor:"pointer" }}>
                    {editing?"HỦY":"✏️ CHỈNH SỬA"}
                  </button>
                )}
              </div>

              {pLoading ? (
                <div style={{ textAlign:"center", padding:"40px 0", fontFamily:"'Orbitron',monospace", fontSize:9, color:"#333", letterSpacing:2 }}>ĐANG TẢI...</div>
              ) : pError && !profile ? (
                <div style={{ textAlign:"center", padding:"30px 0", color:"#E8000D", fontSize:13 }}>⚠️ {pError}</div>
              ) : editing ? (
                <div>
                  {pError && <div style={{ color:"#E8000D", fontSize:12, marginBottom:12, padding:"8px 12px", background:"rgba(232,0,13,.08)", borderRadius:3 }}>⚠️ {pError}</div>}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13 }}>
                    <div>
                      <label style={lb}>Số điện thoại</label>
                      <input value={pForm.phone||""} onChange={e=>setPForm(f=>({...f,phone:e.target.value}))} style={inp}/>
                    </div>
                    <div>
                      <label style={lb}>Giới tính</label>
                      <select value={pForm.gender||"male"} onChange={e=>setPForm(f=>({...f,gender:e.target.value}))} style={inp}>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                    <div style={{gridColumn:"1/-1"}}>
                      <label style={lb}>Địa chỉ</label>
                      <input value={pForm.address||""} onChange={e=>setPForm(f=>({...f,address:e.target.value}))} placeholder="Địa chỉ của bạn..." style={inp}/>
                    </div>
                    <div>
                      <label style={lb}>Ngày sinh</label>
                      <input type="date" value={pForm.birthday||""} onChange={e=>setPForm(f=>({...f,birthday:e.target.value}))} style={inp}/>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:18 }}>
                    <button onClick={()=>setEditing(false)} style={{ background:"none", border:"1px solid #222", color:"#555", fontFamily:"'Orbitron',monospace", fontSize:8, padding:"9px 20px", borderRadius:3, cursor:"pointer" }}>HỦY</button>
                    <button onClick={saveProfile} disabled={pSaving} style={{ background:pSaving?"#2a0005":"linear-gradient(135deg,#E8000D,#8B0000)", border:"none", color:"#fff", fontFamily:"'Orbitron',monospace", fontSize:8, fontWeight:700, letterSpacing:1, padding:"9px 24px", borderRadius:3, cursor:"pointer" }}>
                      {pSaving?"ĐANG LƯU...":"LƯU THAY ĐỔI"}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {pSuccess && <div style={{ color:"#22c55e", fontSize:12, marginBottom:12, padding:"8px 12px", background:"rgba(34,197,94,.08)", borderRadius:3 }}>{pSuccess}</div>}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    {[
                      ["Tên người dùng", profile?.name],
                      ["Số điện thoại",  profile?.phone],
                      ["Email",          profile?.email],
                      ["Ngày sinh",      profile?.birthday],
                      ["Giới tính",      profile?.gender==="male"?"Nam":profile?.gender==="female"?"Nữ":"Khác"],
                      ["Địa chỉ",        profile?.address],
                    ].map(([label,val]) => (
                      <div key={label} style={{ padding:"11px 14px", background:"#0F0F0F", border:"1px solid #161616", borderRadius:4 }}>
                        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:7, color:"#333", letterSpacing:1.5, marginBottom:4 }}>{label.toUpperCase()}</div>
                        <div style={{ fontSize:14, fontWeight:600, color:"#F0F0F0" }}>{val||"—"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── ORDERS TAB ── */}
          {tab==="orders" && (
            <div>
              <div style={{ background:"#0A0A0A", border:"1px solid #1a1a1a", borderRadius:6, padding:"20px 24px" }}>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, letterSpacing:2, color:"#E8000D", marginBottom:16 }}>📦 LỊCH SỬ ĐƠN HÀNG</div>

                <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm mã đơn, tên sản phẩm..." style={{ flex:1, minWidth:170, background:"#111", border:"1px solid #1e1e1e", borderRadius:3, padding:"8px 12px", color:"#F0F0F0", fontFamily:"'Rajdhani',sans-serif", fontSize:12, outline:"none" }}/>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {[["all","Tất cả"],["PENDING","Chờ xác nhận"],["SHIPPING","Đang giao"],["DELIVERED","Đã giao"],["CANCELLED","Đã hủy"]].map(([k,l]) => (
                      <button key={k} onClick={()=>setFilter(k)} style={{ background:filter===k?"#E8000D":"transparent", border:filter===k?"1px solid #E8000D":"1px solid #1e1e1e", color:filter===k?"#fff":"#555", fontFamily:"'Orbitron',monospace", fontSize:7.5, fontWeight:700, padding:"6px 11px", borderRadius:3, cursor:"pointer", letterSpacing:.8, whiteSpace:"nowrap" }}>{l}</button>
                    ))}
                  </div>
                </div>

                {oLoad ? (
                  <div style={{ textAlign:"center", padding:"50px 0", fontFamily:"'Orbitron',monospace", fontSize:9, color:"#333", letterSpacing:2 }}>ĐANG TẢI ĐƠN HÀNG...</div>
                ) : oError ? (
                  <div style={{ textAlign:"center", padding:"30px 0" }}>
                    <div style={{ color:"#E8000D", fontSize:13, marginBottom:10 }}>⚠️ {oError}</div>
                    <button onClick={fetchOrders} style={{ background:"none", border:"1px solid #E8000D", color:"#E8000D", fontFamily:"'Orbitron',monospace", fontSize:8, padding:"7px 18px", borderRadius:3, cursor:"pointer" }}>THỬ LẠI</button>
                  </div>
                ) : filtered.length===0 ? (
                  <div style={{ textAlign:"center", padding:"50px 0" }}>
                    <div style={{ fontSize:40, marginBottom:12 }}>📦</div>
                    <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:"#222", letterSpacing:2 }}>KHÔNG TÌM THẤY ĐƠN HÀNG</div>
                  </div>
                ) : filtered.map(order => (
                  <div key={order.id} style={{ background:"#0F0F0F", border:"1px solid #161616", borderRadius:5, padding:"15px 18px", marginBottom:11 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:11 }}>
                      <div>
                        <span style={{ fontFamily:"'Orbitron',monospace", fontSize:11, fontWeight:700, color:"#F0F0F0" }}>#{order.id}</span>
                        <span style={{ marginLeft:10, fontSize:11, color:"#3a3a3a" }}>📅 {getOrderDate(order)}</span>
                      </div>
                      <span style={{ background:`${getOrderColor(order)}18`, border:`1px solid ${getOrderColor(order)}55`, color:getOrderColor(order), fontFamily:"'Orbitron',monospace", fontSize:8, fontWeight:700, padding:"3px 10px", borderRadius:2, letterSpacing:1 }}>{getOrderLabel(order)}</span>
                    </div>

                    {getOrderItems(order).map((item, i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:11, padding:"8px 0", borderTop:"1px solid #111" }}>
                        <div style={{ width:38, height:38, background:"#141414", borderRadius:3, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, border:"1px solid #1e1e1e", overflow:"hidden", flexShrink:0 }}>
                          {typeof getItemImage(item) === "string" && getItemImage(item).startsWith("http")
                            ? <img src={getItemImage(item)} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                            : getItemImage(item)
                          }
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:13, fontWeight:600, color:"#F0F0F0" }}>{getItemName(item)}</div>
                          <div style={{ fontSize:11, color:"#444" }}>× {getItemQty(item)}</div>
                        </div>
                        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:11, color:"#E8000D", fontWeight:700 }}>{formatPrice(getItemPrice(item) * getItemQty(item))}</div>
                      </div>
                    ))}

                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:11, paddingTop:10, borderTop:"1px solid #111" }}>
                      <div style={{ fontSize:12, color:"#555" }}>Tổng: <span style={{ fontFamily:"'Orbitron',monospace", fontSize:13, color:"#E8000D", fontWeight:700 }}>{formatPrice(order.totalAmount || order.totalPayableAmount)}</span></div>
                      <div style={{ display:"flex", gap:7 }}>
                        {/* Nếu chưa thanh toán (PayOS) → cho phép thanh toán lại */}
                        {(order.paymentMethod !== "COD" && order.paymentMethod !== "BANKING") && getOrderStatus(order)==="PENDING" && (
                          <button onClick={async () => {
                            try {
                              const res = await authFetch(`${API_BASE}/payment/create/${order.id}`, { method:"POST" });
                              const data = await res.json();
                              if (data.checkoutUrl) window.location.href = data.checkoutUrl;
                              else alert("❌ " + (data.error || "Không thể tạo link thanh toán"));
                            } catch(e) { alert("❌ " + e.message); }
                          }} style={{ background:"linear-gradient(135deg,#E8000D,#8B0000)", border:"none", color:"#fff", fontFamily:"'Orbitron',monospace", fontSize:7.5, padding:"5px 12px", borderRadius:3, cursor:"pointer", letterSpacing:1 }}>💳 THANH TOÁN</button>
                        )}
                        {getOrderStatus(order)==="DELIVERED" && (
                          <button onClick={()=>setActivePage&&setActivePage("home")} style={{ background:"none", border:"1px solid #E8000D", color:"#E8000D", fontFamily:"'Orbitron',monospace", fontSize:7.5, padding:"5px 12px", borderRadius:3, cursor:"pointer", letterSpacing:1 }}>MUA LẠI</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ADDRESS TAB ── */}
          {tab==="address" && (
            <div>
              <div style={{ background:"#0A0A0A", border:"1px solid #1a1a1a", borderRadius:6, padding:"20px 24px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, paddingBottom:13, borderBottom:"1px solid #161616" }}>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, letterSpacing:2, color:"#E8000D" }}>📍 ĐỊA CHỈ GIAO HÀNG</div>
                  <button onClick={openAdd} style={{ background:"linear-gradient(135deg,#E8000D,#8B0000)", border:"none", color:"#fff", fontFamily:"'Orbitron',monospace", fontSize:8, fontWeight:700, letterSpacing:1, padding:"8px 18px", borderRadius:3, cursor:"pointer" }}>+ THÊM ĐỊA CHỈ</button>
                </div>
                {addresses.length===0 ? (
                  <div style={{ textAlign:"center", padding:"50px 0" }}>
                    <div style={{ fontSize:40, marginBottom:12 }}>📍</div>
                    <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:"#222", letterSpacing:2 }}>CHƯA CÓ ĐỊA CHỈ NÀO</div>
                  </div>
                ) : addresses.map(addr => (
                  <div key={addr.id} style={{ background:"#0F0F0F", border:"1px solid #161616", borderRadius:5, padding:"15px 18px", marginBottom:11, position:"relative" }}>
                    {addr.isDefault && (
                      <div style={{ position:"absolute", top:12, right:12, background:"rgba(232,0,13,.12)", border:"1px solid rgba(232,0,13,.3)", color:"#E8000D", fontSize:7.5, fontFamily:"'Orbitron',monospace", padding:"2px 9px", borderRadius:2, letterSpacing:1 }}>MẶC ĐỊNH</div>
                    )}
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                      <span style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:14, color:"#F0F0F0" }}>{addr.name}</span>
                      {addr.phone && <><span style={{color:"#333"}}>|</span><span style={{ fontSize:12, color:"#555" }}>{addr.phone}</span></>}
                    </div>
                    <div style={{ fontSize:13, color:"#444", marginBottom:13 }}>
                      {[addr.address, addr.ward, addr.district, addr.province].filter(Boolean).join(", ")}
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={()=>openEdit(addr)} style={{ background:"none", border:"1px solid #222", color:"#666", fontFamily:"'Orbitron',monospace", fontSize:7.5, padding:"5px 13px", borderRadius:3, cursor:"pointer", letterSpacing:1 }}>✏️ SỬA</button>
                      {!addr.isDefault && (
                        <>
                          <button onClick={()=>setDefault(addr.id)} style={{ background:"none", border:"1px solid #222", color:"#666", fontFamily:"'Orbitron',monospace", fontSize:7.5, padding:"5px 13px", borderRadius:3, cursor:"pointer", letterSpacing:1 }}>⭐ ĐẶT MẶC ĐỊNH</button>
                          <button onClick={()=>deleteAddr(addr.id)} style={{ background:"none", border:"1px solid #2a2a2a", color:"#E8000D", fontFamily:"'Orbitron',monospace", fontSize:7.5, padding:"5px 13px", borderRadius:3, cursor:"pointer", letterSpacing:1 }}>🗑️ XÓA</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SECURITY TAB ── */}
          {tab==="security" && (
            <div style={{ background:"#0A0A0A", border:"1px solid #1a1a1a", borderRadius:6, padding:"22px 24px" }}>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, letterSpacing:2, color:"#E8000D", marginBottom:20, paddingBottom:13, borderBottom:"1px solid #161616" }}>🔒 BẢO MẬT TÀI KHOẢN</div>
              <div style={{ marginBottom:28 }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#F0F0F0", marginBottom:14 }}>Đổi mật khẩu</div>
                {pwMsg && (
                  <div style={{ fontSize:12, marginBottom:12, padding:"8px 12px", borderRadius:3, background:pwMsg.startsWith("✓")?"rgba(34,197,94,.08)":"rgba(232,0,13,.08)", color:pwMsg.startsWith("✓")?"#22c55e":"#E8000D" }}>{pwMsg}</div>
                )}
                {[["Mật khẩu hiện tại","currentPassword"],["Mật khẩu mới","newPassword"],["Xác nhận mật khẩu mới","confirmPassword"]].map(([label,key]) => (
                  <div key={key} style={{ marginBottom:12 }}>
                    <label style={lb}>{label}</label>
                    <input type="password" value={pwForm[key]} onChange={e=>setPwForm(f=>({...f,[key]:e.target.value}))} placeholder="••••••••" style={inp}/>
                  </div>
                ))}
                <button onClick={savePassword} disabled={pwSaving} style={{ background:pwSaving?"#2a0005":"linear-gradient(135deg,#E8000D,#8B0000)", border:"none", color:"#fff", fontFamily:"'Orbitron',monospace", fontSize:9, fontWeight:700, letterSpacing:1.5, padding:"11px 26px", borderRadius:3, cursor:"pointer", marginTop:6 }}>
                  {pwSaving?"ĐANG XỬ LÝ...":"CẬP NHẬT MẬT KHẨU"}
                </button>
              </div>
              <div style={{ borderTop:"1px solid #161616", paddingTop:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:"#F0F0F0", marginBottom:4 }}>Phiên đăng nhập</div>
                    <div style={{ fontSize:12, color:"#555" }}>Đang đăng nhập trên thiết bị này</div>
                  </div>
                  <button onClick={handleLogout} style={{ background:"none", border:"1px solid #E8000D", color:"#E8000D", fontFamily:"'Orbitron',monospace", fontSize:7.5, padding:"6px 14px", borderRadius:3, cursor:"pointer", letterSpacing:1 }}>ĐĂNG XUẤT</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── ADDRESS MODAL ── */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.86)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"#0A0A0A", border:"1px solid #E8000D", borderRadius:8, padding:"26px", width:"100%", maxWidth:520, boxShadow:"0 24px 80px rgba(232,0,13,.2)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, paddingBottom:13, borderBottom:"1px solid #1a1a1a" }}>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, letterSpacing:2, color:"#E8000D" }}>{modal==="add"?"➕ THÊM ĐỊA CHỈ MỚI":"✏️ CHỈNH SỬA ĐỊA CHỈ"}</div>
              <button onClick={()=>setModal(null)} style={{ background:"none", border:"none", color:"#444", fontSize:20, cursor:"pointer", lineHeight:1 }}>✕</button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[["Họ và tên *","name","text"],["Số điện thoại *","phone","tel"]].map(([label,key,type]) => (
                <div key={key}>
                  <label style={lb}>{label}</label>
                  <input type={type} value={aForm[key]} onChange={e=>setAForm(f=>({...f,[key]:e.target.value}))} style={inp}/>
                </div>
              ))}
              <div>
                <label style={lb}>Tỉnh / Thành phố *</label>
                <select value={aForm.province} onChange={e=>setAForm(f=>({...f,province:e.target.value}))} style={inp}>
                  <option value="">Chọn tỉnh/thành</option>
                  {PROVINCES.map(p=><option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={lb}>Quận / Huyện</label>
                <select value={aForm.district} onChange={e=>setAForm(f=>({...f,district:e.target.value}))} style={inp}>
                  <option value="">Chọn quận/huyện</option>
                  {DISTRICTS.map(d=><option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={lb}>Phường / Xã</label>
                <select value={aForm.ward} onChange={e=>setAForm(f=>({...f,ward:e.target.value}))} style={inp}>
                  <option value="">Chọn phường/xã</option>
                  {WARDS.map(w=><option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div style={{gridColumn:"1/-1"}}>
                <label style={lb}>Địa chỉ cụ thể *</label>
                <input value={aForm.address} onChange={e=>setAForm(f=>({...f,address:e.target.value}))} placeholder="Số nhà, tên đường..." style={inp}/>
              </div>
              <div style={{ gridColumn:"1/-1", display:"flex", alignItems:"center", gap:9 }}>
                <input type="checkbox" id="isDefault" checked={aForm.isDefault} onChange={e=>setAForm(f=>({...f,isDefault:e.target.checked}))} style={{ accentColor:"#E8000D", width:15, height:15, cursor:"pointer" }}/>
                <label htmlFor="isDefault" style={{ fontSize:13, color:"#777", cursor:"pointer" }}>Đặt làm địa chỉ mặc định</label>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:20 }}>
              <button onClick={()=>setModal(null)} style={{ background:"none", border:"1px solid #222", color:"#555", fontFamily:"'Orbitron',monospace", fontSize:8, padding:"10px 22px", borderRadius:3, cursor:"pointer" }}>HỦY</button>
              <button onClick={saveAddr} style={{ background:"linear-gradient(135deg,#E8000D,#8B0000)", border:"none", color:"#fff", fontFamily:"'Orbitron',monospace", fontSize:8, fontWeight:700, letterSpacing:1, padding:"10px 28px", borderRadius:3, cursor:"pointer" }}>LƯU ĐỊA CHỈ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
