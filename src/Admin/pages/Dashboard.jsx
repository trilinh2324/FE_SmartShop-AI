import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Home, Package, ShoppingCart, Users,
  DollarSign, LogOut, LayoutGrid, Newspaper,
  TrendingUp, TrendingDown,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Dashboard.css";

const API_BASE = "http://localhost:8080";

const areaData = [
  { month: "Jan", revenue: 18, orders: 120 },
  { month: "Feb", revenue: 22, orders: 145 },
  { month: "Mar", revenue: 19, orders: 130 },
  { month: "Apr", revenue: 31, orders: 200 },
  { month: "May", revenue: 27, orders: 175 },
  { month: "Jun", revenue: 35, orders: 220 },
  { month: "Jul", revenue: 40, orders: 260 },
  { month: "Aug", revenue: 38, orders: 245 },
  { month: "Sep", revenue: 45, orders: 290 },
  { month: "Oct", revenue: 52, orders: 320 },
  { month: "Nov", revenue: 48, orders: 305 },
  { month: "Dec", revenue: 60, orders: 380 },
];

const trafficData = [
  { name: "Direct",   value: 36, color: "#ef4444" },
  { name: "Organic",  value: 26, color: "#3b82f6" },
  { name: "Referral", value: 20, color: "#8b5cf6" },
  { name: "Social",   value: 18, color: "#f59e0b" },
];

const goals = [
  { label: "Total Revenue",   current: 85, color: "#ef4444" },
  { label: "New Customers",   current: 62, color: "#f59e0b" },
  { label: "Conversion Rate", current: 45, color: "#3b82f6" },
];

const fmt = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

/* ── SVG Area Chart ── */
function MiniAreaChart({ data, dataKey, color }) {
  const values = data.map(d => d[dataKey]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const W = 560, H = 160;
  const pad = { t: 10, r: 10, b: 30, l: 44 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const x = (i) => pad.l + (i / (data.length - 1)) * iw;
  const y = (v) => pad.t + ih - ((v - min) / (max - min || 1)) * ih;
  const pts  = data.map((d, i) => `${x(i)},${y(d[dataKey])}`).join(" ");
  const area = `${x(0)},${H - pad.b} ` + pts + ` ${x(data.length - 1)},${H - pad.b}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 160 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
        const yy  = pad.t + ih * (1 - f);
        const val = min + (max - min) * f;
        return (
          <g key={i}>
            <line x1={pad.l} y1={yy} x2={W - pad.r} y2={yy} stroke="#f1f5f9" strokeWidth="1" />
            <text x={pad.l - 6} y={yy + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
              {dataKey === "revenue" ? `${val.toFixed(0)}M` : Math.round(val)}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => (
        <text key={i} x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#94a3b8">
          {d.month}
        </text>
      ))}
      <polygon points={area} fill={`url(#grad-${dataKey})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(data.length - 1)} cy={y(values[values.length - 1])} r="4"
        fill={color} stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

/* ── SVG Donut Chart ── */
function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 38, cx = 55, cy = 55, stroke = 16;
  let offset = 0;
  const circ = 2 * Math.PI * r;
  return (
    <svg width="110" height="110" viewBox="0 0 110 110">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      {data.map((d, i) => {
        const pct    = d.value / total;
        const dash   = pct * circ;
        const gap    = circ - dash;
        const rotate = (offset / total) * 360 - 90;
        offset += d.value;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={d.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={0}
            transform={`rotate(${rotate} ${cx} ${cy})`}
            strokeLinecap="butt"
          />
        );
      })}
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#111827">
        {total}%
      </text>
    </svg>
  );
}

export default function Dashboard() {
  const [open,  setOpen]  = useState(false);
  const [tab,   setTab]   = useState("Revenue");
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/admin/login", { replace: true }); return; }
    Promise.all([
      fetch(`${API_BASE}/api/admin/stats/revenue`,  { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${API_BASE}/api/admin/stats/orders`,   { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${API_BASE}/api/admin/stats/products`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${API_BASE}/api/admin/stats/users`,    { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([rev, ord, prod, usr]) => {
      setStats({
        revenue:    rev?.total   ?? 120000000,
        orders:     ord?.total   ?? 320,
        products:   prod?.total  ?? 150,
        users:      usr?.total   ?? 78,
        revChange:  rev?.change  ?? 4.89,
        ordChange:  ord?.change  ?? 4.63,
        prodChange: prod?.change ?? -3.62,
        usrChange:  usr?.change  ?? 44.71,
      });
    });
  }, [navigate]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [open]);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/admin/home",      label: "Dashboard",   icon: <Home /> },
    { path: "/admin/products",  label: "Sản phẩm",   icon: <Package /> },
    { path: "/admin/categorys", label: "Danh mục",   icon: <LayoutGrid /> },
    { path: "/admin/newslist",  label: "Tin tức",     icon: <Newspaper /> },
    { path: "/admin/orders",    label: "Đơn hàng",   icon: <ShoppingCart /> },
    { path: "/admin/users",     label: "Người dùng", icon: <Users /> },
  ];

  const handleLogout = () => {
    if (!window.confirm("Bạn có chắc muốn đăng xuất?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login", { replace: true });
    setTimeout(() => window.location.reload(), 100);
  };

  const s = stats || { revenue: 120000000, orders: 320, products: 150, users: 78, revChange: 4.89, ordChange: 4.63, prodChange: -3.62, usrChange: 44.71 };

  const statCards = [
    { icon: <DollarSign />,  label: "Doanh thu",   value: fmt(s.revenue),  change: s.revChange,  color: "#ef4444" },
    { icon: <ShoppingCart />,label: "Đơn hàng",   value: s.orders,        change: s.ordChange,  color: "#3b82f6" },
    { icon: <Package />,     label: "Sản phẩm",   value: s.products,      change: s.prodChange, color: "#8b5cf6" },
    { icon: <Users />,       label: "Người dùng", value: s.users,         change: s.usrChange,  color: "#f59e0b" },
  ];

  const chartDataKey = tab === "Revenue" ? "revenue" : "orders";
  const chartColor   = tab === "Revenue" ? "#ef4444" : "#3b82f6";

  return (
    <div className="admin">

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="overlay" onClick={() => setOpen(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.aside className="mobile-nav"
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}>
              <div className="sb-top">
                <span>SMARTSHOP</span>
                <X onClick={() => setOpen(false)} />
              </div>
              <nav>
                {menuItems.map(item => (
                  <a key={item.path} className={isActive(item.path) ? "active" : ""}
                    onClick={() => { navigate(item.path); setOpen(false); }}>
                    {item.icon}{item.label}
                  </a>
                ))}
              </nav>
              <div className="logout"><a onClick={handleLogout}><LogOut />Đăng xuất</a></div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <aside className="sidebar desktop">
        <h2>SMARTSHOP</h2>
        <nav>
          {menuItems.map(item => (
            <a key={item.path} className={isActive(item.path) ? "active" : ""}
              onClick={() => navigate(item.path)}>
              {item.icon}{item.label}
            </a>
          ))}
        </nav>
        <div className="logout"><a onClick={handleLogout}><LogOut />Đăng xuất</a></div>
      </aside>

      {/* MAIN — dùng class admin-main thay vì <main> bare */}
      <div className="admin-main">
        <header className="admin-header">
          <button className="menu-btn" onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="header-left">
            <h3>Dashboard</h3>
          </div>
          <img src="https://i.pravatar.cc/40" alt="admin" />
        </header>

        <div className="dash-body">

          {/* STAT CARDS */}
          <div className="stat-grid">
            {statCards.map((c, i) => (
              <motion.div key={i} className="stat-card" whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <div className="stat-top">
                  <div className="stat-icon" style={{ background: c.color + "18", color: c.color }}>{c.icon}</div>
                  <span className={`stat-change ${c.change >= 0 ? "up" : "down"}`}>
                    {c.change >= 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                    {Math.abs(c.change)}%
                  </span>
                </div>
                <div className="stat-value">{c.value}</div>
                <div className="stat-label">{c.label}</div>
                <svg className="sparkline" viewBox="0 0 80 28" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`sg${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c.color} stopOpacity="0.2"/>
                      <stop offset="100%" stopColor={c.color} stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <polygon
                    points={`0,28 ${[18,14,16,10,12,8,10,6,8,4,6,3].map((v,j)=>`${j*(80/11)},${v}`).join(" ")} 80,28`}
                    fill={`url(#sg${i})`}
                  />
                  <polyline
                    points={[18,14,16,10,12,8,10,6,8,4,6,3].map((v,j)=>`${j*(80/11)},${v}`).join(" ")}
                    fill="none" stroke={c.color} strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
                <div className="stat-footer">vs last month</div>
              </motion.div>
            ))}
          </div>

          {/* BOTTOM ROW */}
          <div className="dash-row">
            <div className="chart-card">
              <div className="card-head">
                <div>
                  <div className="card-title">Overview</div>
                  <div className="card-sub">Monthly performance for the current year</div>
                </div>
                <div className="tab-group">
                  {["Revenue", "Orders"].map(t => (
                    <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`}
                      onClick={() => setTab(t)}>{t}</button>
                  ))}
                </div>
              </div>
              <MiniAreaChart data={areaData} dataKey={chartDataKey} color={chartColor} />
            </div>

            <div className="right-col">
              <div className="pie-card">
                <div className="card-title">Traffic Sources</div>
                <div className="card-sub" style={{ marginBottom: 12 }}>Where your visitors come from</div>
                <div className="pie-row">
                  <DonutChart data={trafficData} />
                  <div className="pie-legend">
                    {trafficData.map((d, i) => (
                      <div key={i} className="legend-row">
                        <span className="legend-dot" style={{ background: d.color }}/>
                        <span className="legend-name">{d.name}</span>
                        <span className="legend-pct">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="goals-card">
                <div className="card-title">Monthly Goals</div>
                <div className="card-sub" style={{ marginBottom: 14 }}>Track your progress to goals</div>
                {goals.map((g, i) => (
                  <div key={i} className="goal-item">
                    <div className="goal-head">
                      <span className="goal-label">{g.label}</span>
                      <span className="goal-pct" style={{ color: g.color }}>{g.current}%</span>
                    </div>
                    <div className="goal-bar-bg">
                      <motion.div className="goal-bar-fill"
                        style={{ background: g.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${g.current}%` }}
                        transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
