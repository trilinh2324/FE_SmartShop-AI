import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  LayoutGrid,
  Newspaper,
  ArrowLeft,
  Tag,
  CheckCircle2,
} from "lucide-react";
import "../../css/CategoryCreate.css";

export default function CategoryCreate() {
  const [name, setName]     = useState("");
  const [open, setOpen]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    if (!window.confirm("Bạn có chắc muốn đăng xuất?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login", { replace: true });
    setTimeout(() => window.location.reload(), 100);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Tên danh mục không được để trống");
      return;
    }
    if (name.trim().length > 60) {
      setError("Tên danh mục không được vượt quá 60 ký tự");
      return;
    }
    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/categories", { name: name.trim() });
      alert("✅ Thêm danh mục thành công");
      navigate("/admin/categorys");
    } catch (err) {
      setError("Thêm danh mục thất bại: " + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const navLinks = [
    { label: "Dashboard",    icon: <Home size={18} />,        path: "/admin/home" },
    { label: "Sản phẩm",    icon: <Package size={18} />,      path: "/admin/products" },
    { label: "Danh mục",    icon: <LayoutGrid size={18} />,   path: null, active: true },
    { label: "Tin tức",     icon: <Newspaper size={18} />,    path: "/admin/newslist" },
    { label: "Đơn hàng",    icon: <ShoppingCart size={18} />, path: "/admin/orders" },
    { label: "Người dùng",  icon: <Users size={18} />,        path: "/admin/users" },
  ];

  const SidebarNav = () => (
    <>
      <nav>
        {navLinks.map((link) => (
          <a
            key={link.label}
            className={link.active ? "active" : ""}
            onClick={() => link.path && navigate(link.path)}
          >
            {link.icon} {link.label}
          </a>
        ))}
      </nav>
      <div className="logout">
        <a onClick={handleLogout}>
          <LogOut size={18} /> Đăng xuất
        </a>
      </div>
    </>
  );

  return (
    <div className="cat-create-wrap">
      <div className="admin-layout">

        {/* ── MOBILE HEADER ── */}
        <header className="mobile-header">
          <Menu size={22} onClick={() => setOpen(true)} />
          <h3>SMARTSHOP</h3>
        </header>

        {/* ── MOBILE SIDEBAR ── */}
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
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "tween", duration: 0.25 }}
              >
                <div className="sb-top">
                  <span>SMARTSHOP</span>
                  <X size={20} onClick={() => setOpen(false)} />
                </div>
                <SidebarNav />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ── DESKTOP SIDEBAR ── */}
        <aside className="sidebar desktop">
          <h2>SMARTSHOP</h2>
          <SidebarNav />
        </aside>

        {/* ── MAIN ── */}
        <main className="main-content">

          {/* TOP BAR */}
          <div className="top-bar">
            <div className="top-bar-left">
              <div className="top-bar-icon">
                <LayoutGrid size={22} />
              </div>
              <div>
                <p className="top-bar-title">Thêm danh mục</p>
                <p className="top-bar-sub">Tạo danh mục sản phẩm mới</p>
              </div>
            </div>
            <button className="btn-back" onClick={() => navigate("/admin/categorys")}>
              <ArrowLeft size={16} /> Quay lại
            </button>
          </div>

          {/* PAGE BODY */}
          <div className="page-body">

            {/* INFO BANNER */}
            <div className="info-banner">
              <Tag size={17} />
              Tên danh mục sẽ hiển thị trên trang sản phẩm và dùng để phân loại hàng hóa.
            </div>

            {/* FORM CARD */}
            <div className="form-card">

              <div className="form-card-header">
                <div className="form-card-header-icon">
                  <LayoutGrid size={22} />
                </div>
                <div>
                  <h3>Thông tin danh mục</h3>
                  <p>Điền đầy đủ thông tin bên dưới</p>
                </div>
              </div>

              <div className="form-body">
                <div className="field-label">
                  Tên danh mục <span className="required">*</span>
                </div>
                <div className="input-wrapper">
                  <input
                    className={`field-input${error ? " has-error" : ""}`}
                    placeholder="Nhập tên danh mục..."
                    value={name}
                    maxLength={60}
                    onChange={(e) => { setName(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    autoFocus
                  />
                  <span className="char-count">{name.length}/60</span>
                </div>
                {error && <div className="error-msg">{error}</div>}
              </div>

              <div className="form-actions">
                <button className="btn-cancel" onClick={() => navigate("/admin/categorys")}>
                  Hủy
                </button>
                <button className="btn-save" onClick={handleSubmit} disabled={loading}>
                  <CheckCircle2 size={16} />
                  {loading ? "Đang lưu..." : "Lưu danh mục"}
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
