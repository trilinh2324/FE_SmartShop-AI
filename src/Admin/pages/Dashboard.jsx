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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin">
      {/* ===== MOBILE SIDEBAR ===== */}
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
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
            >
              <div className="sb-top">
                <span>SMARTSHOP</span>
                <X onClick={() => setOpen(false)} />
              </div>

              <nav>
                <a className={isActive("/admin") ? "active" : ""} onClick={() => navigate("/admin")}>
                  <Home /> Dashboard
                </a>
                <a onClick={() => navigate("/products")}>
                  <Package /> Sản phẩm
                </a>
                <a onClick={() => navigate("/categorys")}>
                  <LayoutGrid /> Danh mục
                </a>
                <a onClick={() => navigate("/newslist")}>
                <Newspaper size={18} /> Tin Tức
                </a>
                <a>
                  <ShoppingCart /> Đơn hàng
                </a>
                <a>
                  <Users /> Người dùng
                </a>
              </nav>

              <div className="logout">
                <a>
                  <LogOut /> Đăng xuất
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="sidebar desktop">
        <h2>SMARTSHOP</h2>
        <nav>
          <a className="active"><Home /> Dashboard</a>
          <a onClick={() => navigate("/products")}><Package /> Sản phẩm</a>
          <a onClick={() => navigate("/categorys")}><LayoutGrid /> Danh mục</a>
          <a onClick={() => navigate("/newslist")}><Newspaper  /> Tin Tức </a>
          <a><ShoppingCart /> Đơn hàng</a>
          <a><Users /> Người dùng</a>
        </nav>

        <div className="logout">
          <a><LogOut /> Đăng xuất</a>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <main>
        <header className="header">
          <Menu className="menu" onClick={() => setOpen(true)} />
          <h3>SMARTSHOP</h3>
          <img src="https://i.pravatar.cc/40" alt="admin" />
        </header>

        <section className="content">
          <Stat icon={<DollarSign />} label="Doanh thu" value="120.000.000 ₫" />
          <Stat icon={<ShoppingCart />} label="Đơn hàng" value="320" />
          <Stat icon={<Package />} label="Sản phẩm" value="150" />
          <Stat icon={<Users />} label="Người dùng" value="78" />
        </section>
      </main>
    </div>
  );
}

const Stat = ({ icon, label, value }) => (
  <motion.div className="stat" whileHover={{ scale: 1.03 }}>
    <div className="icon">{icon}</div>
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  </motion.div>
);
