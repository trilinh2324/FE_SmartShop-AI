import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  LogOut,
  LayoutGrid,
  Newspaper,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Dashboard.css";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  /* =============================
     🔐 CHECK TOKEN KHI VÀO TRANG
  ============================== */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  /* =============================
     MOBILE SCROLL LOCK
  ============================== */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const isActive = (path) => location.pathname === path;

  /* =============================
     MENU ITEMS
  ============================== */
  const menuItems = [
    { path: "/admin/home", label: "Dashboard", icon: <Home /> },
    { path: "/admin/products", label: "Sản phẩm", icon: <Package /> },
    { path: "/admin/categorys", label: "Danh mục", icon: <LayoutGrid /> },
    { path: "/admin/newslist", label: "Tin tức", icon: <Newspaper /> },
    { path: "/admin/orders", label: "Đơn hàng", icon: <ShoppingCart /> },
    { path: "/admin/users", label: "Người dùng", icon: <Users /> },
  ];

  /* =============================
     🚪 LOGOUT FUNCTION
  ============================== */
  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Bạn có chắc muốn đăng xuất?"
    );
    if (!confirmLogout) return;

    // Xóa dữ liệu đăng nhập
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Chuyển về login và xóa history
    navigate("/admin/login", { replace: true });

    // Reload để reset toàn bộ state app
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="admin">
      {/* ================= MOBILE SIDEBAR ================= */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="overlay"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.aside
              className="mobile-nav"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
            >
              <div className="sb-top">
                <span>SMARTSHOP</span>
                <X onClick={() => setOpen(false)} />
              </div>

              <nav>
                {menuItems.map((item) => (
                  <a
                    key={item.path}
                    className={isActive(item.path) ? "active" : ""}
                    onClick={() => {
                      navigate(item.path);
                      setOpen(false);
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="logout">
                <a onClick={handleLogout}>
                  <LogOut />
                  Đăng xuất
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="sidebar desktop">
        <h2>SMARTSHOP</h2>

        <nav>
          {menuItems.map((item) => (
            <a
              key={item.path}
              className={isActive(item.path) ? "active" : ""}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {item.label}
            </a>
          ))}
        </nav>

        <div className="logout">
          <a onClick={handleLogout}>
            <LogOut />
            Đăng xuất
          </a>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main>
        <header className="header">
          <Menu className="menu" onClick={() => setOpen(true)} />
          <h3>Dashboard</h3>
          <img src="https://i.pravatar.cc/40" alt="admin" />
        </header>

        <section className="content">
          <Stat
            icon={<DollarSign />}
            label="Doanh thu"
            value="120.000.000 ₫"
          />
          <Stat icon={<ShoppingCart />} label="Đơn hàng" value="320" />
          <Stat icon={<Package />} label="Sản phẩm" value="150" />
          <Stat icon={<Users />} label="Người dùng" value="78" />
        </section>
      </main>
    </div>
  );
}

/* =============================
   STAT COMPONENT
============================== */
const Stat = ({ icon, label, value }) => (
  <motion.div
    className="stat"
    whileHover={{ y: -4 }}
    transition={{ duration: 0.2 }}
  >
    <div className="icon">{icon}</div>
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  </motion.div>
);