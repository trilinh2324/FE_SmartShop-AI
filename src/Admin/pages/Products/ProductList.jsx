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
import "../../css/ProductList.css";

const ITEMS_PER_PAGE = 8;

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


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

  // ✅ LOAD PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8080/api/products");
        console.log("Products loaded:", res.data);
        setProducts(Array.isArray(res.data) ? res.data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Không thể tải danh sách sản phẩm");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ FILTER & SEARCH
  const filteredProducts = products.filter((p) =>
    (p.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (p.brand?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // ✅ DELETE PRODUCT
  const deleteProduct = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;
    
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      alert("✅ Xóa sản phẩm thành công");
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Xóa sản phẩm thất bại: " + (err.response?.data || err.message));
    }
  };


  return (
    <div className="product-admin">
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
                  <a className="active">
                    <Package /> Sản phẩm
                  </a>
                  <a onClick={() => navigate("/admin/categorys")}>
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
            <a className="active">
              <Package /> Sản phẩm
            </a>
            <a onClick={() => navigate("/admin/categorys")}>
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
        </aside>

        {/* ===== MAIN ===== */}
        <main>
          <div className="product-page">
            <div className="page-header">
              <h2>Danh sách sản phẩm</h2>

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
                  onClick={() => navigate("/admin/productscreate")}
                >
                  <Plus size={18} /> Thêm
                </button>
              </div>
            </div>

            {/* ✅ LOADING STATE */}
            {loading && (
              <div className="table-card">
                <p style={{ textAlign: "center", padding: 20 }}>
                  ⏳ Đang tải dữ liệu...
                </p>
              </div>
            )}

            {/* ✅ ERROR STATE */}
            {error && !loading && (
              <div className="table-card">
                <p style={{ textAlign: "center", padding: 20, color: "red" }}>
                  ❌ {error}
                </p>
              </div>
            )}

            {/* ✅ PRODUCT TABLE */}
            {!loading && !error && (
              <div className="table-card">
                <table className="product-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tên sản phẩm</th>
                      <th>Hãng</th>
                      <th>Giá</th>
                      <th>Danh mục</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center", padding: 20 }}>
                          📭 Không tìm thấy sản phẩm
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((p, index) => (
                        <tr key={p.id}>
                          <td>{startIndex + index + 1}</td>
                          <td>
                            <strong>{p.name || "N/A"}</strong>
                          </td>
                          <td>{p.brand || "N/A"}</td>
                          <td className="price">
                            {p.price ? p.price.toLocaleString("vi-VN") : "0"} ₫
                          </td>
                          <td>{p.category?.name || p.categoryName || "N/A"}</td>
                          <td className="actions">
                            <button
                              title="Xem chi tiết"
                              onClick={() =>
                                navigate(`/admin/products/detail/${p.id}`)
                              }
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              title="Chỉnh sửa"
                              onClick={() =>
                                navigate(`/admin/products/update/${p.id}`)
                              }
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              title="Xóa"
                              onClick={() => deleteProduct(p.id)}
                              style={{ color: "red" }}
                            >
                              <Trash2 size={16} />
                            </button>
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
