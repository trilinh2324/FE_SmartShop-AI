import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Package,
  DollarSign,
  Layers,
  Palette,
  Menu,
  X,
  Home,
  ShoppingCart,
  Users,
  LogOut,
  LayoutGrid,
  Newspaper, 
} from "lucide-react";
import "../../css/ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [p, setP] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${id}`)
      .then((res) => setP(res.data))
      .catch(console.error);
  }, [id]);

  if (!p) return <p className="loading">Loading...</p>;

  return (
    <div className="admin">
      {/* ===== SIDEBAR MOBILE ===== */}
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
              className="sidebar mobile"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
            >
              <div className="sb-top">
                <span>SMARTSHOP</span>
                <X onClick={() => setOpen(false)} />
              </div>

              <nav>
                <a onClick={() => navigate("/admin/home")}><Home /> Dashboard</a>
                <a onClick={() => navigate("/admin/products")}><Package /> Sản phẩm</a>
                <a onClick={() => navigate("/admin/categorys")}><LayoutGrid /> Danh mục</a>
                <a onClick={() => navigate("/admin/newslist")}><Newspaper  /> Tin Tức </a>
                <a onClick={() => navigate("/admin/orders")}><ShoppingCart /> Đơn hàng</a>
                <a onClick={() => navigate("/admin/users")}><Users /> Người dùng</a>
              </nav>

              <div className="logout">
                <a onClick={() => navigate("/admin/login")}>
                  <LogOut /> Đăng xuất
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ===== SIDEBAR DESKTOP ===== */}
      <aside className="sidebar desktop">
        <h2>SMARTSHOP</h2>

        <nav>
          <a onClick={() => navigate("/admin/home")}><Home /> Dashboard</a>
          <a className="active" onClick={() => navigate("/admin/products")}><Package /> Sản phẩm</a>
          <a onClick={() => navigate("/admin/categorys")}><LayoutGrid /> Danh mục</a>
          <a onClick={() => navigate("/admin/newslist")}><Newspaper  /> Tin Tức </a>
          <a onClick={() => navigate("/admin/orders")}><ShoppingCart /> Đơn hàng</a>
          <a onClick={() => navigate("/admin/users")}><Users /> Người dùng</a>
        </nav>

        <div className="logout">
          <a onClick={() => navigate("/admin/login")}><LogOut /> Đăng xuất</a>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <main>
        <header className="header">
          <Menu className="menu" onClick={() => setOpen(true)} />
          <h3>Chi tiết sản phẩm</h3>
        </header>

        <section className="pd-page">
          <button className="btn-back" onClick={() => navigate("/admin/products")}>
            <ArrowLeft /> Quay lại danh sách
          </button>

          {/* ===== STATS ===== */}
          <div className="pd-stats">
            <Stat icon={<Package />} label="Tên sản phẩm" value={p.name} />
            <Stat icon={<DollarSign />} label="Giá bán" value={`${p.price?.toLocaleString()} ₫`} />
            <Stat icon={<Layers />} label="Danh mục" value={p.category?.name} />
          </div>

          {/* ===== INFO ===== */}
          <div className="pd-card">
            <h3>Thông tin chung</h3>
            <div className="pd-info">
              <span>Hãng sản xuất : {p.brand} </span>
             
            </div>
          </div>

          {/* ===== TECH ===== */}
          {p.productDetail && (
            <div className="pd-card">
              <h3>Thông số kỹ thuật</h3>
              <div className="pd-grid">
                {Object.entries(p.productDetail)
                  .filter(([k]) => k !== "id")
                  .map(([k, v]) => (
                    <div key={k} className="pd-box">
                      <span>{k}</span>
                      <strong>{v}</strong>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ===== COLORS ===== */}
          <div className="pd-card">
            <h3 className="color-title">
              <Palette size={18} /> Màu sắc sản phẩm
            </h3>

            <div className="color-grid">
              {p.colors?.map((c, i) => (
                <motion.div
                  key={i}
                  className="color-card"
                  whileHover={{ scale: 1.04 }}
                >
                  <div className="color-img">
                    {c.image ? (
                      <img src={`http://localhost:8080${c.image}`} alt={c.colorName} />
                    ) : (
                      <div className="no-img">NO IMAGE</div>
                    )}
                  </div>

                  <div className="color-info">
                    <strong>{c.colorName}</strong>
                    <span>Số lượng: {c.quantity}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ===== STAT ===== */
const Stat = ({ icon, label, value }) => (
  <motion.div className="pd-stat" whileHover={{ scale: 1.03 }}>
    <div className="icon">{icon}</div>
    <div className="stat-info">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  </motion.div>
);
