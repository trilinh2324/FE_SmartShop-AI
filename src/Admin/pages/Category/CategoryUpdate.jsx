import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/utils/axiosConfig";
import {
  Home,
  Package,
  LayoutGrid,
  Newspaper,
  ShoppingCart,
  Users,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Save,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../../css/CategoryUpdate.css";

const CategoryUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/categories/${id}`)
      .then((res) => setName(res.data.name))
      .catch(() => {
        alert("Không tìm thấy danh mục");
        navigate("/admin/categorys");
      });
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Tên không được để trống");
      return;
    }

    try {
      await axios.put(`/api/categories/${id}`, {
        name: name.trim(),
      });
      alert("Cập nhật thành công");
      navigate("/admin/categorys");
    } catch {
      alert("Bạn không có quyền!");
    }
  };

  return (
    <div className="product-admin">
      <div className="admin">

        {/* ===== MOBILE HEADER ===== */}
        <header className="mobile-header">
          <Menu size={22} onClick={() => setOpen(true)} />
          <h3>SMARTSHOP</h3>
        </header>

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
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.3 }}
              >
                <div className="sb-top">
                  <span>SMARTSHOP</span>
                  <X size={20} onClick={() => setOpen(false)} />
                </div>

                <nav>
                  <a onClick={() => navigate("/admin/home")}>
                    <Home /> Dashboard
                  </a>
                  <a onClick={() => navigate("/admin/products")}>
                    <Package /> Sản phẩm
                  </a>
                  <a
                    className="active"
                    onClick={() => navigate("/admin/categorys")}
                  >
                    <LayoutGrid /> Danh mục
                  </a>
                  <a onClick={() => navigate("/admin/newslist")}>
                    <Newspaper /> Tin tức
                  </a>
                  <a onClick={() => navigate("/admin/orders")}>
                    <ShoppingCart /> Đơn hàng
                  </a>
                  <a onClick={() => navigate("/admin/users")}>
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
            <a onClick={() => navigate("/admin/home")}>
              <Home /> Dashboard
            </a>
            <a onClick={() => navigate("/admin/products")}>
              <Package /> Sản phẩm
            </a>
            <a
              className="active"
              onClick={() => navigate("/admin/categorys")}
            >
              <LayoutGrid /> Danh mục
            </a>
            <a onClick={() => navigate("/admin/newslist")}>
              <Newspaper /> Tin tức
            </a>
            <a onClick={() => navigate("/admin/orders")}>
              <ShoppingCart /> Đơn hàng
            </a>
            <a onClick={() => navigate("/admin/users")}>
              <Users /> Người dùng
            </a>
          </nav>

          <div className="logout">
            <a>
              <LogOut /> Đăng xuất
            </a>
          </div>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="content">
          <div className="update-card">

            <div className="card-header">
              <button
                className="btn-back"
                onClick={() => navigate("/admin/categorys")}
              >
                <ArrowLeft size={18} />
                Quay lại
              </button>

              <h2>Cập nhật danh mục</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Tên danh mục</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên danh mục..."
              />

  <div className="btn-group">
  <button
    type="button"
    className="btn-cancel"
    onClick={() => navigate("/admin/categorys")}
  >
    Huỷ
  </button>

  <button type="submit" className="btn-save">
    Cập nhật
  </button>
</div>
            </form>

          </div>
        </main>

      </div>
    </div>
  );
};

export default CategoryUpdate;