import { useState, useEffect } from "react";
import { useContext } from "react";
import { RefreshContext } from "../../App";

const API_BASE = "http://localhost:8080/api";


const formatPrice = (n) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n || 0);

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

const STATUS_COLOR = {
  PENDING_CONFIRMATION: "#6366f1",
  CONFIRMED:            "#3b82f6",
  SHIPPING:             "#f59e0b",
  DELIVERED:            "#22c55e",
  COMPLETED:            "#10b981",
  CANCELLED:            "#E8000D",
};

const STATUS_LABEL = {
  PENDING_CONFIRMATION: "Chờ xác nhận",
  CONFIRMED:            "Đã xác nhận",
  SHIPPING:             "Đang giao",
  DELIVERED:            "Đã giao",
  COMPLETED:            "Hoàn thành",
  CANCELLED:            "Đã hủy",
};

const inp = {
  width: "100%", background: "#0d0d0d", border: "1px solid #252525",
  borderRadius: 4, padding: "11px 14px", color: "#e8e8e8",
  fontFamily: "'Rajdhani',sans-serif", fontSize: 14, outline: "none",
  boxSizing: "border-box", transition: "border-color .2s",
};
const lb = {
  display: "block", fontFamily: "'Orbitron',monospace", fontSize: 7.5,
  letterSpacing: 1.8, color: "#444", marginBottom: 7, textTransform: "uppercase",
};
const btnRed = {
  background: "linear-gradient(135deg,#E8000D,#8B0000)", border: "none",
  color: "#fff", fontFamily: "'Orbitron',monospace", fontSize: 8, fontWeight: 700,
  letterSpacing: 1.2, padding: "11px 26px", borderRadius: 4, cursor: "pointer",
};
const btnGhost = {
  background: "none", border: "1px solid #252525", color: "#555",
  fontFamily: "'Orbitron',monospace", fontSize: 8, padding: "11px 22px",
  borderRadius: 4, cursor: "pointer",
};

const handleLogout = async () => {
  try {
    const token = getToken();
    if (token) await fetch(`${API_BASE}/user/auth/logout`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
  } catch (e) {}
  finally { localStorage.clear(); sessionStorage.clear(); window.location.href = "/users/login"; }
};

function Alert({ msg }) {
  if (!msg.text) return null;
  return (
    <div style={{ fontSize: 13, margin: "14px 0", padding: "10px 14px", borderRadius: 4, border: "1px solid", borderColor: msg.type === "ok" ? "rgba(34,197,94,.25)" : "rgba(232,0,13,.25)", background: msg.type === "ok" ? "rgba(34,197,94,.07)" : "rgba(232,0,13,.07)", color: msg.type === "ok" ? "#22c55e" : "#E8000D" }}>
      {msg.text}
    </div>
  );
}

// ── Inline message ngay dưới button ──────────────────────────
function InlineMsg({ msg }) {
  if (!msg.text) return null;
  const isOk = msg.type === "ok";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      marginTop: 12, padding: "10px 14px", borderRadius: 4,
      border: `1px solid ${isOk ? "rgba(34,197,94,.3)" : "rgba(232,0,13,.3)"}`,
      background: isOk ? "rgba(34,197,94,.06)" : "rgba(232,0,13,.06)",
      animation: "fadeSlideIn 0.25s ease both",
    }}>
      <span style={{ fontSize: 15, flexShrink: 0 }}>{isOk ? "✅" : "⚠️"}</span>
      <span style={{
        fontFamily: "'Rajdhani',sans-serif", fontSize: 13, fontWeight: 600,
        color: isOk ? "#22c55e" : "#E8000D",
      }}>{msg.text}</span>
    </div>
  );
}

export default function UserProfilePage({ setActivePage }) {

const refresh = useContext(RefreshContext);

useEffect(() => {
  fetchOrders();
}, [refresh]);

  const [tab, setTab] = useState("profile");

  // ── Profile
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [pForm, setPForm] = useState({ username: "", email: "", phone: "", gender: "male", address: "" });
  const [pLoading, setPLoading] = useState(true);
  const [pSaving, setPSaving] = useState(false);
  const [pMsg, setPMsg] = useState({ type: "", text: "" });

  // ── Orders
  const [orders, setOrders] = useState([]);
  const [oLoad, setOLoad] = useState(false);
  const [oError, setOError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);
  const [dLoad, setDLoad] = useState(false);

  // ── Password
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwMsg,  setPwMsg]  = useState({ type: "", text: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [showPw, setShowPw] = useState({ cur: false, nw: false, cf: false });

  // ── Field-level errors (hiện ngay dưới từng input)
  const [pwErrors, setPwErrors] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const TABS = [
    { key: "profile",  icon: "👤", label: "Thông tin cá nhân" },
    { key: "orders",   icon: "📦", label: "Lịch sử đơn hàng"  },
    { key: "security", icon: "🔒", label: "Đổi mật khẩu"      },
  ];

  useEffect(() => { fetchProfile(); }, []);
  useEffect(() => { fetchOrders(); }, []);
  useEffect(() => { if (tab === "orders") fetchOrders(); }, [tab]);

  const fetchProfile = async () => {
    setPLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/user/me`);
      if (!res.ok) throw new Error(`Không thể tải thông tin (${res.status})`);
      const d = await res.json();
      const mapped = {
        username: d.username || d.name || "",
        email:    d.email || "",
        phone:    d.phoneNumber || d.phone || "",
        gender:   d.gender || "male",
        address:  d.address || "",
      };
      setProfile(mapped);
      setPForm(mapped);
    } catch (e) {
      setPMsg({ type: "err", text: e.message });
    } finally {
      setPLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!pForm.username.trim()) { setPMsg({ type: "err", text: "Tên người dùng không được để trống" }); return; }
    if (!pForm.email.trim())    { setPMsg({ type: "err", text: "Email không được để trống" }); return; }
    setPSaving(true); setPMsg({ type: "", text: "" });
    try {
      const res = await authFetch(`${API_BASE}/user/me`, {
        method: "PUT",
        body: JSON.stringify({
          username:    pForm.username,
          email:       pForm.email,
          phoneNumber: pForm.phone,
          gender:      pForm.gender,
          address:     pForm.address,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(typeof err === "string" ? err : err.message || "Cập nhật thất bại");
      }
      setProfile({ ...pForm });
      setEditing(false);
      setPMsg({ type: "ok", text: "Cập nhật thông tin thành công!" });
      setTimeout(() => setPMsg({ type: "", text: "" }), 3000);
    } catch (e) {
      setPMsg({ type: "err", text: e.message });
    } finally {
      setPSaving(false);
    }
  };

  const fetchOrders = async () => {
    setOLoad(true); setOError("");
    try {
      const res = await authFetch(`${API_BASE}/user/bill/my-bills`);
      if (!res.ok) throw new Error(`Không thể tải lịch sử đơn hàng (${res.status})`);
      const d = await res.json();
      setOrders(Array.isArray(d) ? d : d.content || []);
    } catch (e) {
      setOError(e.message);
    } finally {
      setOLoad(false);
    }
  };

  const fetchDetail = async (id) => {
    setDLoad(true); setDetail(null);
    try {
      const res = await authFetch(`${API_BASE}/user/bill/${id}`);
      if (!res.ok) throw new Error("Không thể tải chi tiết");
      setDetail(await res.json());
    } catch (e) {
      alert("Lỗi: " + e.message);
      setDLoad(false);
    }
  };

  // ── Validate từng field realtime ─────────────────────────────
  const validateField = (key, value) => {
    switch (key) {
      case "currentPassword":
        return value ? "" : "Vui lòng nhập mật khẩu hiện tại";
      case "newPassword":
        if (!value) return "Vui lòng nhập mật khẩu mới";
        if (value.length < 6) return "Mật khẩu mới ít nhất 6 ký tự";
        return "";
      case "confirmPassword":
        if (!value) return "Vui lòng xác nhận mật khẩu mới";
        if (value !== pwForm.newPassword) return "Mật khẩu xác nhận không khớp";
        return "";
      default: return "";
    }
  };

  const handlePwChange = (key, value) => {
    setPwForm(f => ({ ...f, [key]: value }));
    // Xóa lỗi khi user đang gõ
    setPwErrors(e => ({ ...e, [key]: "" }));
    setPwMsg({ type: "", text: "" });
  };

  const handlePwBlur = (key) => {
    const err = validateField(key, pwForm[key]);
    setPwErrors(e => ({ ...e, [key]: err }));
    // Kiểm tra confirmPassword khi newPassword thay đổi
    if (key === "newPassword" && pwForm.confirmPassword) {
      const cfErr = pwForm.confirmPassword !== pwForm[key] ? "Mật khẩu xác nhận không khớp" : "";
      setPwErrors(e => ({ ...e, confirmPassword: cfErr }));
    }
  };

  const savePassword = async () => {
    // Validate tất cả fields trước khi submit
    const errors = {
      currentPassword: validateField("currentPassword", pwForm.currentPassword),
      newPassword:     validateField("newPassword",     pwForm.newPassword),
      confirmPassword: validateField("confirmPassword", pwForm.confirmPassword),
    };
    setPwErrors(errors);

    if (Object.values(errors).some(e => e)) return; // Có lỗi → dừng

    setPwSaving(true); setPwMsg({ type: "", text: "" });
    try {
      const res = await authFetch(`${API_BASE}/user/auth/change-password`, {
        method: "POST",
        body: JSON.stringify({
          currentPassword: pwForm.currentPassword,
          newPassword:     pwForm.newPassword,
        }),
      });
      const d = await res.json();
      if (!res.ok) {
        // Lỗi từ backend (vd: sai mật khẩu hiện tại)
        const msg = d.message || d || "Đổi mật khẩu thất bại";
        // Hiện lỗi đúng field nếu biết
        if (typeof msg === "string" && msg.toLowerCase().includes("hiện tại")) {
          setPwErrors(e => ({ ...e, currentPassword: msg }));
        } else {
          setPwMsg({ type: "err", text: msg });
        }
        return;
      }
      setPwMsg({ type: "ok", text: "🎉 Đổi mật khẩu thành công!" });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPwErrors({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPwMsg({ type: "", text: "" }), 4000);
    } catch (e) {
      setPwMsg({ type: "err", text: e.message });
    } finally {
      setPwSaving(false);
    }
  };

  // Order helpers
  const getStatus = (o) => o.orderStatus || o.paymentStatus || o.status || "PENDING_CONFIRMATION";
  const getItems  = (o) => o.items || o.billItems || [];
  const getIName  = (i) => i.productColor?.product?.name || i.name || "Sản phẩm";
  const getIQty   = (i) => i.quantity || i.qty || 1;
  const getIPrice = (i) => i.price || i.productColor?.product?.price || 0;
  const getIImg   = (i) => i.productColor?.image || null;
  const getDate   = (o) => o.createdAt ? new Date(o.createdAt).toLocaleDateString("vi-VN") : o.orderDate ? new Date(o.orderDate).toLocaleDateString("vi-VN") : "—";

  const FILTER_TABS = [
    { key: "all",                  label: "Tất cả"       },
    { key: "PENDING_CONFIRMATION", label: "Chờ xác nhận" },
    { key: "CONFIRMED",            label: "Đã xác nhận"  },
    { key: "SHIPPING",             label: "Đang giao"    },
    { key: "DELIVERED",            label: "Đã giao"      },
    { key: "COMPLETED",            label: "Hoàn thành"   },
    { key: "CANCELLED",            label: "Đã hủy"       },
  ];

  const filtered = orders.filter(o => {
    const matchFilter = filter === "all" || getStatus(o) === filter;
    const matchSearch = String(o.id || "").includes(search) ||
      getItems(o).some(i => getIName(i).toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  const pwStrength = !pwForm.newPassword ? 0 : pwForm.newPassword.length < 4 ? 1 : pwForm.newPassword.length < 7 ? 2 : pwForm.newPassword.length < 10 ? 3 : 4;
  const strengthLabel = ["", "Quá yếu", "Yếu", "Trung bình", "Mạnh"];
  const strengthColor = ["", "#E8000D", "#f59e0b", "#6366f1", "#22c55e"];

  const focusRed = (e) => (e.target.style.borderColor = "#E8000D");
  const blurGray = (e) => (e.target.style.borderColor = "#252525");
  const closeModal = () => { setDetail(null); setDLoad(false); };

  // ── Field error helper ────────────────────────────────────────
  const FieldError = ({ field }) => pwErrors[field] ? (
    <div style={{
      display: "flex", alignItems: "center", gap: 5,
      marginTop: 5, fontSize: 11.5, color: "#E8000D",
      fontFamily: "'Rajdhani',sans-serif", fontWeight: 600,
      animation: "fadeSlideIn 0.2s ease both",
    }}>
      <span style={{ fontSize: 12 }}>⚠</span>
      {pwErrors[field]}
    </div>
  ) : null;

  /* ═════════════════════ RENDER ═════════════════════ */
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 20px", fontFamily: "'Rajdhani',sans-serif" }}>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }
        .pw-input-error { border-color: #E8000D !important; }
        .pw-input-error:focus { border-color: #E8000D !important; }
      `}</style>

      {/* ── Hero banner ── */}
      <div style={{ position: "relative", marginBottom: 22, background: "#080808", border: "1px solid #1c1c1c", borderRadius: 10, padding: "26px 30px", overflow: "hidden", display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(232,0,13,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(232,0,13,.03) 1px,transparent 1px)", backgroundSize: "36px 36px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -60, left: -60, width: 200, height: 200, background: "radial-gradient(circle,rgba(232,0,13,.1),transparent 70%)", pointerEvents: "none" }} />

        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#1a0000,#2d0005)", border: "2px solid #E8000D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0, boxShadow: "0 0 24px rgba(232,0,13,.28)", position: "relative" }}>👤</div>

        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 7, letterSpacing: 3.5, color: "#E8000D", marginBottom: 5 }}>SMARTSHOP MEMBER</div>
          <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 30, letterSpacing: 3, color: "#F0F0F0", lineHeight: 1 }}>{profile?.username || "Người dùng"}</div>
          <div style={{ fontSize: 12, color: "#8d8888", marginTop: 4 }}>{profile?.email}</div>
        </div>

        <div style={{ display: "flex", gap: 28, position: "relative" }}>
          {[
            [orders.length, "Tổng đơn"],
            [orders.filter(o => ["DELIVERED","COMPLETED"].includes(getStatus(o))).length, "Đã nhận"],
            [orders.filter(o => ["PENDING_CONFIRMATION","CONFIRMED"].includes(getStatus(o))).length, "Chờ xử lý"],
          ].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 24, fontWeight: 900, color: "#E8000D", lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 6.5, color: "#efe8e8", letterSpacing: 1.2, marginTop: 4 }}>{l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "195px 1fr", gap: 16, alignItems: "start" }}>

        {/* ── Sidebar ── */}
        <div style={{ background: "#080808", border: "1px solid #1c1c1c", borderRadius: 8, overflow: "hidden" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ width: "100%", background: tab === t.key ? "rgba(232,0,13,.07)" : "transparent", border: "none", borderLeft: `3px solid ${tab === t.key ? "#E8000D" : "transparent"}`, color: tab === t.key ? "#E8000D" : "#484848", fontFamily: "'Rajdhani',sans-serif", fontSize: 13, fontWeight: 600, padding: "14px 16px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #0f0f0f", transition: "all .2s" }}>
              <span style={{ fontSize: 15 }}>{t.icon}</span>{t.label}
            </button>
          ))}
          <button onClick={handleLogout}
            style={{ width: "100%", background: "none", border: "none", borderLeft: "3px solid transparent", color: "#b7b5b5", fontFamily: "'Rajdhani',sans-serif", fontSize: 13, fontWeight: 600, padding: "14px 16px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid #111" }}>
            <span style={{ fontSize: 15 }}>🚪</span>Đăng xuất
          </button>
        </div>

        {/* ── Content ── */}
        <div>

          {/* ══════ PROFILE TAB ══════ */}
          {tab === "profile" && (
            <div style={{ background: "#080808", border: "1px solid #1c1c1c", borderRadius: 8, padding: "24px 28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, paddingBottom: 14, borderBottom: "1px solid #141414" }}>
                <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 9, letterSpacing: 2.5, color: "#E8000D" }}>👤 THÔNG TIN CÁ NHÂN</div>
                {!pLoading && (
                  <button onClick={() => { setEditing(!editing); setPForm({ ...profile }); setPMsg({ type: "", text: "" }); }}
                    style={{ ...btnGhost, padding: "7px 16px", fontSize: 7.5, border: `1px solid ${editing ? "#E8000D" : "#aaa7a7"}`, color: editing ? "#E8000D" : "#aaa7a7" }}>
                    {editing ? "✕ HỦY" : "✏️ CHỈNH SỬA"}
                  </button>
                )}
              </div>

              {pLoading ? (
                <div style={{ textAlign: "center", padding: "60px 0", fontFamily: "'Orbitron',monospace", fontSize: 9, color: "#aaa7a7", letterSpacing: 3 }}>ĐANG TẢI...</div>
              ) : (
                <>
                  <Alert msg={pMsg} />
                  {editing ? (
                    <div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div>
                          <label style={lb}>Tên người dùng</label>
                          <input value={pForm.username} onChange={e => setPForm(f => ({ ...f, username: e.target.value }))} style={inp} onFocus={focusRed} onBlur={blurGray} />
                        </div>
                        <div>
                          <label style={lb}>Email</label>
                          <input type="email" value={pForm.email} onChange={e => setPForm(f => ({ ...f, email: e.target.value }))} style={inp} onFocus={focusRed} onBlur={blurGray} />
                        </div>
                        <div>
                          <label style={lb}>Số điện thoại</label>
                          <input value={pForm.phone} onChange={e => setPForm(f => ({ ...f, phone: e.target.value }))} style={inp} onFocus={focusRed} onBlur={blurGray} />
                        </div>
                        <div>
                          <label style={lb}>Giới tính</label>
                          <select value={pForm.gender} onChange={e => setPForm(f => ({ ...f, gender: e.target.value }))} style={{ ...inp, appearance: "none" }} onFocus={focusRed} onBlur={blurGray}>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                          </select>
                        </div>
                        <div style={{ gridColumn: "1/-1" }}>
                          <label style={lb}>Địa chỉ</label>
                          <input value={pForm.address} onChange={e => setPForm(f => ({ ...f, address: e.target.value }))} placeholder="Số nhà, tên đường, phường/xã..." style={inp} onFocus={focusRed} onBlur={blurGray} />
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
                        <button onClick={() => setEditing(false)} style={btnGhost}>HỦY</button>
                        <button onClick={saveProfile} disabled={pSaving} style={{ ...btnRed, opacity: pSaving ? .6 : 1 }}>
                          {pSaving ? "ĐANG LƯU..." : "LƯU THAY ĐỔI"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {[
                        ["Tên người dùng", profile?.username, false],
                        ["Email",          profile?.email,    false],
                        ["Số điện thoại",  profile?.phone,    false],
                        ["Giới tính",      profile?.gender === "male" ? "Nam" : profile?.gender === "female" ? "Nữ" : "Khác", false],
                        ["Địa chỉ",        profile?.address,  true],
                      ].map(([label, val, full]) => (
                        <div key={label} style={{ padding: "13px 16px", background: "#0c0c0c", border: "1px solid #161616", borderRadius: 5, ...(full ? { gridColumn: "1/-1" } : {}) }}>
                          <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 7, color: "#cac2c2", letterSpacing: 1.5, marginBottom: 5 }}>{label.toUpperCase()}</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: val ? "#D0D0D0" : "#2a2a2a" }}>{val || "—"}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ══════ ORDERS TAB ══════ */}
          {tab === "orders" && (
            <div style={{ background: "#080808", border: "1px solid #1c1c1c", borderRadius: 8, padding: "24px 28px" }}>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 9, letterSpacing: 2.5, color: "#E8000D", marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid #141414" }}>
                📦 LỊCH SỬ ĐƠN HÀNG
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm mã đơn, tên sản phẩm..."
                  style={{ ...inp, flex: 1, minWidth: 160, padding: "8px 14px" }} onFocus={focusRed} onBlur={blurGray} />
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {FILTER_TABS.map(({ key, label }) => (
                    <button key={key} onClick={() => setFilter(key)}
                      style={{ background: filter === key ? "#E8000D" : "transparent", border: `1px solid ${filter === key ? "#E8000D" : "#d5cfcf"}`, color: filter === key ? "#fff" : "#c7c5c5", fontFamily: "'Orbitron',monospace", fontSize: 7.5, padding: "7px 11px", borderRadius: 4, cursor: "pointer", whiteSpace: "nowrap" }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {oLoad ? (
                <div style={{ textAlign: "center", padding: "60px 0", fontFamily: "'Orbitron',monospace", fontSize: 9, color: "#cac8c8", letterSpacing: 3 }}>ĐANG TẢI...</div>
              ) : oError ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ color: "#E8000D", fontSize: 13, marginBottom: 12 }}>⚠️ {oError}</div>
                  <button onClick={fetchOrders} style={{ ...btnRed, padding: "8px 20px" }}>THỬ LẠI</button>
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div style={{ fontSize: 50, marginBottom: 14 }}>📦</div>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 9, color: "#c4c1c1", letterSpacing: 2 }}>KHÔNG TÌM THẤY ĐƠN HÀNG</div>
                </div>
              ) : filtered.map(order => {
                const st    = getStatus(order);
                const color = STATUS_COLOR[st] || "#2d30e3";
                const label = STATUS_LABEL[st] || st;
                const items = getItems(order);
                return (
                  <div key={order.id} style={{ background: "#0c0c0c", border: "1px solid #161616", borderRadius: 6, padding: "16px 20px", marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontFamily: "'Orbitron',monospace", fontSize: 12, fontWeight: 700, color: "#F0F0F0" }}>#{order.id}</span>
                        <span style={{ fontSize: 11, color: "#a7a4a4" }}>📅 {getDate(order)}</span>
                      </div>
                      <span style={{ background: `${color}18`, border: `1px solid ${color}44`, color, fontFamily: "'Orbitron',monospace", fontSize: 8, fontWeight: 700, padding: "4px 11px", borderRadius: 3, letterSpacing: .8 }}>{label}</span>
                    </div>
                    {items.slice(0, 2).map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderTop: "1px solid #111" }}>
                        <div style={{ width: 42, height: 42, background: "#141414", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #1e1e1e", overflow: "hidden", flexShrink: 0 }}>
                          {getIImg(item)?.startsWith?.("http") ? <img src={getIImg(item)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 20 }}>📦</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#D8D8D8" }}>{getIName(item)}</div>
                          <div style={{ fontSize: 11, color: "#333" }}>× {getIQty(item)}</div>
                        </div>
                        <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 12, color: "#E8000D", fontWeight: 700 }}>{formatPrice(getIPrice(item) * getIQty(item))}</div>
                      </div>
                    ))}
                    {items.length > 2 && <div style={{ fontSize: 11, color: "#aca9a9", paddingTop: 8, borderTop: "1px solid #111" }}>+{items.length - 2} sản phẩm khác</div>}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 11, borderTop: "1px solid #111" }}>
                      <div style={{ fontSize: 12, color: "#c1bdbd" }}>
                        Tổng cộng: <span style={{ fontFamily: "'Orbitron',monospace", fontSize: 13, color: "#E8000D", fontWeight: 700 }}>{formatPrice(order.totalAmount || order.totalPayableAmount)}</span>
                      </div>
                      <button onClick={() => fetchDetail(order.id)} style={{ background: "none", border: "1px solid #252525", color: "#c2bdbd", fontFamily: "'Orbitron',monospace", fontSize: 7.5, padding: "6px 14px", borderRadius: 3, cursor: "pointer" }}>
                        🔍 CHI TIẾT
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ══════ SECURITY TAB ══════ */}
          {tab === "security" && (
            <div style={{ background: "#080808", border: "1px solid #1c1c1c", borderRadius: 8, padding: "24px 28px" }}>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 9, letterSpacing: 2.5, color: "#E8000D", marginBottom: 22, paddingBottom: 14, borderBottom: "1px solid #141414" }}>
                🔒 ĐỔI MẬT KHẨU
              </div>

              {/* ── 3 fields với lỗi ngay dưới mỗi field ── */}
              {[
                ["Mật khẩu hiện tại",     "currentPassword", "cur"],
                ["Mật khẩu mới",          "newPassword",      "nw" ],
                ["Xác nhận mật khẩu mới", "confirmPassword",  "cf" ],
              ].map(([label, key, sk]) => (
                <div key={key} style={{ marginBottom: 16 }}>
                  <label style={lb}>{label}</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw[sk] ? "text" : "password"}
                      value={pwForm[key]}
                      onChange={e => handlePwChange(key, e.target.value)}
                      onBlur={() => handlePwBlur(key)}
                      placeholder="••••••••"
                      className={pwErrors[key] ? "pw-input-error" : ""}
                      style={{
                        ...inp,
                        paddingRight: 46,
                        borderColor: pwErrors[key] ? "#E8000D" : "#252525",
                      }}
                      onFocus={e => e.target.style.borderColor = pwErrors[key] ? "#E8000D" : "#E8000D"}
                    />
                    <button onClick={() => setShowPw(p => ({ ...p, [sk]: !p[sk] }))}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#444", lineHeight: 1 }}>
                      {showPw[sk] ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {/* ✅ Lỗi ngay dưới từng input */}
                  <FieldError field={key} />
                </div>
              ))}

              {/* Password strength bar */}
              {pwForm.newPassword && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", gap: 5, marginBottom: 5 }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= pwStrength ? strengthColor[pwStrength] : "#1e1e1e", transition: "background .3s" }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: strengthColor[pwStrength] }}>{strengthLabel[pwStrength]}</div>
                </div>
              )}

              {/* ✅ Button + thông báo kết quả ngay bên dưới */}
              <div>
                <button
                  onClick={savePassword}
                  disabled={pwSaving}
                  style={{ ...btnRed, opacity: pwSaving ? .6 : 1, minWidth: 180 }}
                >
                  {pwSaving ? "ĐANG XỬ LÝ..." : "CẬP NHẬT MẬT KHẨU"}
                </button>

                {/* ✅ Thông báo thành công / lỗi ngay dưới button */}
                <InlineMsg msg={pwMsg} />
              </div>

              <div style={{ marginTop: 28, paddingTop: 22, borderTop: "1px solid #141414", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#C0C0C0", marginBottom: 3 }}>Phiên đăng nhập</div>
                  <div style={{ fontSize: 12, color: "#333" }}>Đang đăng nhập trên thiết bị này</div>
                </div>
                <button onClick={handleLogout} style={{ background: "none", border: "1px solid rgba(232,0,13,.4)", color: "#E8000D", fontFamily: "'Orbitron',monospace", fontSize: 7.5, padding: "8px 16px", borderRadius: 4, cursor: "pointer" }}>
                  ĐĂNG XUẤT
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ══════ Order Detail Modal ══════ */}
      {(detail || dLoad) && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.9)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={closeModal}>
          <div style={{ background: "#0A0A0A", border: "1px solid #E8000D", borderRadius: 10, padding: "28px", width: "100%", maxWidth: 560, boxShadow: "0 28px 80px rgba(232,0,13,.2)", maxHeight: "90vh", overflowY: "auto" }}
            onClick={e => e.stopPropagation()}>
            {dLoad && !detail ? (
              <div style={{ textAlign: "center", padding: "60px 0", fontFamily: "'Orbitron',monospace", fontSize: 9, color: "#252525", letterSpacing: 3 }}>ĐANG TẢI...</div>
            ) : detail && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #1a1a1a" }}>
                  <div>
                    <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 8, letterSpacing: 2, color: "#E8000D", marginBottom: 5 }}>CHI TIẾT ĐƠN HÀNG</div>
                    <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 20, fontWeight: 700, color: "#F0F0F0" }}>#{detail.id}</div>
                    <div style={{ fontSize: 11, color: "#2e2e2e", marginTop: 3 }}>📅 {getDate(detail)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {(() => {
                      const st = getStatus(detail);
                      const color = STATUS_COLOR[st] || "#6366f1";
                      const label = STATUS_LABEL[st] || st;
                      return <span style={{ background: `${color}18`, border: `1px solid ${color}44`, color, fontFamily: "'Orbitron',monospace", fontSize: 8, fontWeight: 700, padding: "5px 12px", borderRadius: 3 }}>{label}</span>;
                    })()}
                    <button onClick={closeModal} style={{ background: "none", border: "none", color: "#444", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>✕</button>
                  </div>
                </div>
                <div style={{ background: "#0d0d0d", border: "1px solid #161616", borderRadius: 6, padding: "14px 18px", marginBottom: 14 }}>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 7.5, letterSpacing: 1.5, color: "#2a2a2a", marginBottom: 12 }}>THÔNG TIN NGƯỜI NHẬN</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[
                      ["Họ tên",     detail.recipientName,  false],
                      ["Điện thoại", detail.recipientPhone, false],
                      ["Email",      detail.recipientEmail, false],
                      ["Thanh toán", detail.paymentMethod,  false],
                      ["Vận chuyển", detail.shippingMethod, false],
                      ["Địa chỉ",   [detail.recipientAddress, detail.selectedDistrict, detail.selectedProvince].filter(Boolean).join(", "), true],
                    ].filter(([, v]) => v).map(([l, v, full]) => (
                      <div key={l} style={{ ...(full ? { gridColumn: "1/-1" } : {}) }}>
                        <div style={{ fontSize: 10, color: "#2a2a2a", marginBottom: 3, fontFamily: "'Orbitron',monospace", letterSpacing: 1 }}>{l.toUpperCase()}</div>
                        <div style={{ fontSize: 13, color: "#B0B0B0", fontWeight: 600 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: "#0d0d0d", border: "1px solid #161616", borderRadius: 6, padding: "14px 18px", marginBottom: 14 }}>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 7.5, letterSpacing: 1.5, color: "#2a2a2a", marginBottom: 12 }}>SẢN PHẨM ({getItems(detail).length})</div>
                  {getItems(detail).map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderTop: i > 0 ? "1px solid #111" : "none" }}>
                      <div style={{ width: 44, height: 44, background: "#141414", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #1e1e1e", overflow: "hidden", flexShrink: 0 }}>
                        {getIImg(item)?.startsWith?.("http") ? <img src={getIImg(item)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 22 }}>📦</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#D8D8D8" }}>{getIName(item)}</div>
                        <div style={{ fontSize: 11, color: "#333" }}>× {getIQty(item)} &nbsp;·&nbsp; {formatPrice(getIPrice(item))}/cái</div>
                      </div>
                      <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 12, color: "#E8000D", fontWeight: 700, flexShrink: 0 }}>{formatPrice(getIPrice(item) * getIQty(item))}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: "rgba(232,0,13,.05)", border: "1px solid rgba(232,0,13,.15)", borderRadius: 6 }}>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 9, color: "#555", letterSpacing: 1.2 }}>TỔNG THANH TOÁN</div>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 20, color: "#E8000D", fontWeight: 900 }}>{formatPrice(detail.totalAmount || detail.totalPayableAmount)}</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
