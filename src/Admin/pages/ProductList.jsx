import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Eye,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import "../css/ProductList.css";

const ITEMS_PER_PAGE = 10;

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/api/products").then((res) => {
      setProducts(res.data);
    });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = products.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const deleteProduct = async (id) => {
    if (!window.confirm("Xoá sản phẩm?")) return;
    await axios.delete(`http://localhost:8080/api/products/${id}`);
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="admin">
      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <h2>SMARTSHOP</h2>

        <nav>
          <NavLink to="/"><Home /> Dashboard</NavLink>
          <NavLink to="/products"><Package /> Sản phẩm</NavLink>
          <NavLink to="/orders"><ShoppingCart /> Đơn hàng</NavLink>
          <NavLink to="/users"><Users /> Người dùng</NavLink>
        </nav>

        <div className="logout">
          <a onClick={handleLogout}>
            <LogOut /> Đăng xuất
          </a>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <main>
        <header className="header">
          <h3>Quản lý sản phẩm</h3>
        </header>

        <div className="product-page">
          <div className="product-header">
            <h2>Danh sách sản phẩm</h2>
            <button
              className="btn-add"
              onClick={() => navigate("/productscreate")}
            >
              <Plus size={18} /> Thêm sản phẩm
            </button>
          </div>

          <div className="table-card">
            <table className="product-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên</th>
                  <th>Hãng</th>
                  <th>Giá</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((p, index) => (
                  <tr key={p.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{p.name}</td>
                    <td>{p.brand}</td>
                    <td className="price">
                      {p.price?.toLocaleString()} ₫
                    </td>
                    <td className="actions">
                      <button onClick={() => navigate(`/products/detail/${p.id}`)}>
                        <Eye />
                      </button>
                      <button onClick={() => navigate(`/products/update/${p.id}`)}>
                        <Pencil />
                      </button>
                      <button onClick={() => deleteProduct(p.id)}>
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={page === i + 1 ? "active" : ""}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>›</button>
          </div>
        </div>
      </main>
    </div>
  );
}
