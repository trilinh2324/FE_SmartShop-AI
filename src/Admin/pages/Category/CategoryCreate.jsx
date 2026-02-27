import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "../../api/utils/axiosConfig";
import {
  Home,
  Package,
  LayoutGrid,
  Newspaper,
  ShoppingCart,
  Users,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  Tag,
  CheckCircle,
} from "lucide-react";
import "../../css/CategoryCreate.css";

const navLinks = [
  { to: "/admin/home",      icon: <Home size={17} />,         label: "Dashboard"  },
  { to: "/admin/products",  icon: <Package size={17} />,      label: "Sản phẩm"   },
  { to: "/admin/categorys", icon: <LayoutGrid size={17} />,   label: "Danh mục",  active: true },
  { to: "/admin/newslist",  icon: <Newspaper size={17} />,    label: "Tin tức"    },
  { to: "/admin/orders",    icon: <ShoppingCart size={17} />, label: "Đơn hàng",  badge: 3 },
  { to: "/admin/users",     icon: <Users size={17} />,        label: "Người dùng" },
];

const CategoryCreate = () => {
  const navigate = useNavigate();
  const [name, setName]       = useState("");
  const [open, setOpen]       = useState(false);
  const [toast, setToast]     = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await axios.post("/api/categories", { name: name.trim() });
      setToast(true);
      setTimeout(() => navigate("/admin/categorys"), 1200);
    } catch (err) {
      alert("Token hết hạn hoặc không có quyền!");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  return (
    <div className="admin-container">
      {/* Mobile toggle */}
      <button className="mobile-btn" onClick={() => setOpen(!open)}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${open ? "show" : ""}`}>
        <div className="logo-wrap">
          <div className="logo-icon">S</div>
          <span className="logo-text">SMARTSHOP</span>
        </div>

        <div className="nav-section-label">Menu chính</div>

        <nav>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={link.active ? "active" : ""}
            >
              {link.icon}
              {link.label}
              {link.badge && <span className="nav-badge">{link.badge}</span>}
            </NavLink>
          ))}
        </nav>

        <button className="logout-btn" onClick={logout}>
          <LogOut size={17} /> Đăng xuất
        </button>
      </aside>

      {/* Main content */}
      <main className="main">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-icon">
              <LayoutGrid size={18} />
            </div>
            <div>
              <h1>Thêm danh mục</h1>
              <div className="topbar-subtitle">Tạo danh mục sản phẩm mới</div>
            </div>
          </div>
          <button className="btn-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={15} /> Quay lại
          </button>
        </div>

        {/* Form */}
        <div className="content">
          <div className="form-wrapper">
            <div className="form-hint">
              <Tag size={16} />
              <span>
                Tên danh mục sẽ hiển thị trên trang sản phẩm và dùng để phân
                loại hàng hóa.
              </span>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-header-icon">
                  <LayoutGrid size={20} />
                </div>
                <div className="card-header-text">
                  <h2>Thông tin danh mục</h2>
                  <p>Điền đầy đủ thông tin bên dưới</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    Tên danh mục <span className="required">*</span>
                  </label>
                  <div className="input-wrap">
                    <Tag size={16} className="input-icon" />
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Ví dụ: Điện thoại, Laptop, Thời trang..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={60}
                      autoFocus
                    />
                    <span className="input-count">{name.length}/60</span>
                  </div>
                </div>

                <div className="form-footer">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => navigate(-1)}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn-save"
                    disabled={!name.trim() || loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Lưu danh mục
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Toast notification */}
      {toast && (
        <div className="success-toast">
          <CheckCircle size={18} />
          Thêm danh mục thành công!
        </div>
      )}
    </div>
  );
};

export default CategoryCreate;
