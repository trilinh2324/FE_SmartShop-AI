import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Home, Package, ShoppingCart, Users,
  DollarSign, LogOut, LayoutGrid, Newspaper,
  TrendingUp, TrendingDown, Calendar, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Dashboard.css";

const API_BASE = "http://localhost:8080";

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

const fmtAxis = (n) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}B`;
  if (n >= 1)    return `${n.toFixed(0)}M`;
  return `${(n * 1000).toFixed(0)}K`;
};

/* ── SVG Area Chart ── */
function MiniAreaChart({ data, dataKey, color }) {
  if (!data || data.length < 2) {
    return (
      <div style={{ height: 160, display: "flex", alignItems: "center",
        justifyContent: "center", color: "#cbd5e1", fontSize: 13 }}>
        Không có dữ liệu
      </div>
    );
  }
  const values = data.map(d => d[dataKey]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const W = 560, H = 160;
  const pad = { t: 10, r: 10, b: 30, l: 50 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const x  = (i) => pad.l + (i / (data.length - 1)) * iw;
  const y  = (v) => pad.t + ih - ((v - min) / (max - min || 1)) * ih;
  const pts  = data.map((d, i) => `${x(i)},${y(d[dataKey])}`).join(" ");
  const area = `${x(0)},${H - pad.b} ${pts} ${x(data.length - 1)},${H - pad.b}`;
  const step = Math.ceil(data.length / 12);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 160 }}
      preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
        const yy  = pad.t + ih * (1 - f);
        const val = min + (max - min) * f;
        return (
          <g key={i}>
            <line x1={pad.l} y1={yy} x2={W - pad.r} y2={yy}
              stroke="#f1f5f9" strokeWidth="1" />
            <text x={pad.l - 6} y={yy + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
              {dataKey === "revenue" ? fmtAxis(val) : Math.round(val)}
            </text>
          </g>
        );
      })}
      {data.map((d, i) =>
        i % step === 0 && (
          <text key={i} x={x(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="#94a3b8">
            {d.label}
          </text>
        )
      )}
      <polygon points={area} fill={`url(#grad-${dataKey})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />
      {data.length <= 31 && data.map((d, i) => (
        <circle key={i} cx={x(i)} cy={y(d[dataKey])} r="2.5"
          fill={color} stroke="#fff" strokeWidth="1.5" opacity="0.7" />
      ))}
      <circle cx={x(data.length - 1)} cy={y(values[values.length - 1])} r="4"
        fill={color} stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

/* ── Donut Chart ── */
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

/* ── Period Selector ── */
function PeriodSelector({ period, date, onPeriod, onDate }) {
  const d = new Date(date + "T00:00:00");

  const label = () => {
    if (period === "day")
      return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    if (period === "month")
      return d.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
    return `Năm ${d.getFullYear()}`;
  };

  const shift = (dir) => {
    const nd = new Date(d);
    if (period === "day")   nd.setDate(nd.getDate() + dir);
    if (period === "month") nd.setMonth(nd.getMonth() + dir);
    if (period === "year")  nd.setFullYear(nd.getFullYear() + dir);
    onDate(nd.toISOString().split("T")[0]);
  };

  return (
    <div className="period-bar">
      <div className="period-tabs">
        {[{ key: "day", label: "Ngày" }, { key: "month", label: "Tháng" }, { key: "year", label: "Năm" }]
          .map(p => (
            <button key={p.key}
              className={`period-tab ${period === p.key ? "active" : ""}`}
              onClick={() => onPeriod(p.key)}>
              {p.label}
            </button>
          ))}
      </div>
      <div className="date-nav">
        <button className="dnav-btn" onClick={() => shift(-1)}><ChevronLeft size={14} /></button>
        <span className="dnav-label"><Calendar size={12} />{label()}</span>
        <button className="dnav-btn" onClick={() => shift(1)}><ChevronRight size={14} /></button>
      </div>
    </div>
  );
}

/* ── Dashboard ── */
export default function Dashboard() {
  const [open,      setOpen]      = useState(false);
  const [tab,       setTab]       = useState("Revenue");
  const [period,    setPeriod]    = useState("month");
  const [date,      setDate]      = useState(new Date().toISOString().split("T")[0]);
  const [stats,     setStats]     = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  const getToken = () => localStorage.getItem("token");

  const fetchSummary = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/stats/summary?period=${period}&date=${date}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) return;
      const json = await res.json();
      const d    = json.data ?? json;
      setStats({
        revenue:    d.revenue    ?? 0,
        orders:     d.orders     ?? 0,
        products:   d.products   ?? 0,
        users:      d.users      ?? 0,
        revChange:  d.revChange  ?? 0,
        ordChange:  d.ordChange  ?? 0,
        prodChange: d.prodChange ?? 0,
        usrChange:  d.usrChange  ?? 0,
      });
    } catch (_) {}
  }, [period, date]);

  const fetchChart = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/stats/revenue-chart?period=${period}&date=${date}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const json = await res.json();
        setChartData(json.data ?? json ?? []);
      }
    } catch (_) {}
    setLoading(false);
  }, [period, date]);

  useEffect(() => {
    if (!getToken()) { navigate("/admin/login", { replace: true }); return; }
    fetchSummary();
    fetchChart();
  }, [period, date, navigate, fetchSummary, fetchChart]);

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

  const s = stats ?? {
    revenue: 0, orders: 0, products: 0, users: 0,
    revChange: 0, ordChange: 0, prodChange: 0, usrChange: 0,
  };

  const periodSuffix =
    period === "day" ? "hôm nay" : period === "month" ? "tháng này" : "năm nay";

  const statCards = [
    { icon: <DollarSign />,   label: `Doanh thu ${periodSuffix}`, value: fmt(s.revenue),  change: s.revChange,  color: "#ef4444" },
    { icon: <ShoppingCart />, label: `Đơn hàng ${periodSuffix}`,  value: s.orders,        change: s.ordChange,  color: "#3b82f6" },
    { icon: <Package />,      label: "Tổng sản phẩm",             value: s.products,      change: s.prodChange, color: "#8b5cf6" },
    { icon: <Users />,        label: "Tổng người dùng",           value: s.users,         change: s.usrChange,  color: "#f59e0b" },
  ];

  const chartDataKey = tab === "Revenue" ? "revenue" : "orders";
  const chartColor   = tab === "Revenue" ? "#ef4444" : "#3b82f6";
  const chartSubtitle =
    period === "day"   ? "Theo giờ trong ngày"   :
    period === "month" ? "Theo ngày trong tháng" : "Theo tháng trong năm";

  return (
    <div className="admin">

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

      <div className="admin-main">
        <header className="admin-header">
          <button className="menu-btn" onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="header-left"><h3>Dashboard</h3></div>
          <img src="https://i.pravatar.cc/40" alt="admin" />
        </header>

        <div className="dash-body">

          <PeriodSelector
            period={period} date={date}
            onPeriod={setPeriod} onDate={setDate}
          />

          <div className="stat-grid">
            {statCards.map((c, i) => (
              <motion.div key={i} className="stat-card"
                whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <div className="stat-top">
                  <div className="stat-icon" style={{ background: c.color + "18", color: c.color }}>
                    {c.icon}
                  </div>
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
                      <stop offset="0%"   stopColor={c.color} stopOpacity="0.2"/>
                      <stop offset="100%" stopColor={c.color} stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <polygon
                    points={`0,28 ${[18,14,16,10,12,8,10,6,8,4,6,3].map((v,j)=>`${j*(80/11)},${v}`).join(" ")} 80,28`}
                    fill={`url(#sg${i})`} />
                  <polyline
                    points={[18,14,16,10,12,8,10,6,8,4,6,3].map((v,j)=>`${j*(80/11)},${v}`).join(" ")}
                    fill="none" stroke={c.color} strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="stat-footer">so với kỳ trước</div>
              </motion.div>
            ))}
          </div>

          <div className="dash-row">
            <div className="chart-card">
              <div className="card-head">
                <div>
                  <div className="card-title">Biểu đồ tổng quan</div>
                  <div className="card-sub">{chartSubtitle}</div>
                </div>
                <div className="tab-group">
                  {[{ key: "Revenue", label: "Doanh thu" }, { key: "Orders", label: "Đơn hàng" }].map(t => (
                    <button key={t.key}
                      className={`tab-btn ${tab === t.key ? "active" : ""}`}
                      onClick={() => setTab(t.key)}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              {loading ? (
                <div className="chart-loading">
                  <span className="chart-spinner" />
                  Đang tải dữ liệu…
                </div>
              ) : (
                <MiniAreaChart data={chartData} dataKey={chartDataKey} color={chartColor} />
              )}
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
