import React, { useEffect, useState } from "react";
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
  Eye,
  Pencil,
  Trash2,
  Plus,
  Search,
} from "lucide-react";
import "../../css/CategoryList.css";

const ITEMS_PER_PAGE = 5;

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ LOAD CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8080/api/categories");
        console.log("Categories loaded:", res.data);
        setCategories(Array.isArray(res.data) ? res.data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Không thể tải danh sách danh mục");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ✅ FILTER & SEARCH
  const filteredCategories = categories.filter((c) =>
    (c.name?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredCategories.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // ✅ DELETE CATEGORY
  const deleteCategory = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa danh mục này?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/categories/${id}`);
      setCategories(categories.filter((c) => c.id !== id));
      alert("✅ Xóa danh mục thành công");
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Xóa danh mục thất bại: " + (err.response?.data || err.message));
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };
    const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Bạn có chắc muốn đăng xuất?"
    );
    if (!confirmLogout) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login", { replace: true });
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  return (
    <div className="category-admin">
      <div className="admin">
        {/* ===== MOBILE HEADER ===== */}
        <header className="mobile-header">
          <Menu onClick={() => setOpen(true)} />
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
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
              >
                <div className="sb-top">
                  <span>SMARTSHOP</span>
                  <X onClick={() => setOpen(false)} />
                </div>

                <nav>
                  <a onClick={() => navigate("/admin/home")}>
                    <Home /> Dashboard
                  </a>
                  <a onClick={() => navigate("/admin/products")}>
                    <Package /> Sản phẩm
                  </a>
                  <a className="active">
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
                   <a onClick={handleLogout}>
                                                   <LogOut />
                                                   Đăng xuất
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
            <a className="active">
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
            <a onClick={logout}>
              <LogOut /> Đăng xuất
            </a>
          </div>
        </aside>

        {/* ===== MAIN ===== */}
        <main>
          <div className="category-page">
            <div className="page-header">
              <h2>Danh sách danh mục</h2>

              <div className="page-actions">
                <div className="search-box">
                  <Search size={18} />
                  <input
                    placeholder="Tìm theo tên hoặc hãng..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>

                <button
                  className="btn-add-outline"
                  onClick={() => navigate("/admin/categorys/creates")}
                >
                  <Plus size={18} /> Thêm
                </button>
              </div>
            </div>

            {/* ✅ LOADING STATE */}
            {loading && (
              <div className="table-card">
                <p style={{ textAlign: "center", padding: 40 }}>
                  ⏳ Đang tải dữ liệu...
                </p>
              </div>
            )}

            {/* ✅ ERROR STATE */}
            {error && !loading && (
              <div className="table-card">
                <p style={{ textAlign: "center", padding: 40, color: "red" }}>
                  ❌ {error}
                </p>
              </div>
            )}

            {/* ✅ CATEGORY TABLE */}
            {!loading && !error && (
              <div className="table-card">
                <table className="category-table">
                  <thead>
                    <tr>
                      <th style={{ width: "60px" }}>#</th>
                      <th>Tên danh mục</th>
                      <th style={{ width: "160px", textAlign: "center" }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan="3" style={{ textAlign: "center", padding: 40 }}>
                          📭 Không tìm thấy danh mục
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((c, index) => (
                        <tr key={c.id}>
                          <td style={{ fontWeight: "600", color: "#666" }}>
                            {startIndex + index + 1}
                          </td>
                          <td style={{ fontSize: "16px", fontWeight: "700" }}>
                            {c.name || "N/A"}
                          </td>
                          <td>
                            <div className="actions">
                          
                              <button
                                title="Chỉnh sửa"
                                onClick={() =>
                                  navigate(`/admin/categorys/updates/${c.id}`)
                                }
                              >
                                <Pencil size={25} />
                              </button>
                              <button
                                title="Xóa"
                                onClick={() => deleteCategory(c.id)}
                              >
                                <Trash2 size={25} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ✅ PAGINATION */}
            {!loading && !error && totalPages > 1 && (
              <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                  ‹
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={page === i + 1 ? "active" : ""}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}