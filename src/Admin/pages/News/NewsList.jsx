import React, { useEffect, useState } from "react";
import { getAllNews, deleteNews } from "../../api/News/newsApi";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  LayoutGrid,
  Newspaper,
  ShoppingCart,
  Users,
  LogOut,
  Eye,
  Pencil,
  Trash2,
  Plus,
  Search,
} from "lucide-react";
import "../../css/NewsList.css";

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await getAllNews();
    setNews(res.data);
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
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa bài viết?")) return;
    await deleteNews(id);
    loadData();
  };

  const filteredNews = news.filter((n) =>
    n.title.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="news-admin">
      {/* ===== SIDEBAR ===== */}
      <aside className="news-sidebar">
        <div className="news-logo">SMARTSHOP</div>

        <nav className="news-menu">
          <a onClick={() => navigate("/admin/home")}>
            <Home /> Dashboard
          </a>
          <a onClick={() => navigate("/admin/products")}>
            <Package /> Sản phẩm
          </a>
          <a onClick={() => navigate("/admin/categorys")}>
            <LayoutGrid /> Danh mục
          </a>
          <a className="active">
            <Newspaper /> Tin tức
          </a>
          <a onClick={() => navigate("/admin/orders")}>
            <ShoppingCart /> Đơn hàng
          </a>
          <a onClick={() => navigate("/admin/users")}>
            <Users /> Người dùng
          </a>
        </nav>

        <div className="news-logout">
          <a onClick={handleLogout}>
                                          <LogOut />
                                          Đăng xuất
                                        </a>
        </div>
      </aside>

      {/* ===== CONTENT ===== */}
      <main className="news-content">
        {/* HEADER */}
        <div className="news-header">
          <h2>Danh sách tin tức</h2>

          <div className="news-header-actions">
            <div className="news-search">
              <Search size={18} />
              <input
                placeholder="Tìm theo tiêu đề..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <Link to="/admin/news/create" className="news-add-btn">
              <Plus size={18} /> Thêm
            </Link>
          </div>
        </div>

        {/* TABLE */}
        <div className="news-table">
          <div className="news-table-head">
            <span>#</span>
            <span>Tiêu đề</span>
            <span>Ảnh</span>
            <span>Hành động</span>
          </div>

          {filteredNews.map((n, index) => (
            <div className="news-table-row" key={n.id}>
              <span>{index + 1}</span>

              <span className="news-title">{n.title}</span>

              <span className="news-image">
                {n.thumbnail && (
                  <img
                    src={`http://localhost:8080/uploads/news/${n.thumbnail}`}
                    alt={n.title}
                  />
                )}
              </span>

              <span className="news-actions">
               <Link to={`/admin/news/detail/${n.id}`} className="news-icon-btn">
  <Eye />
</Link>

                <Link
                  to={`/admin/news/edit/${n.id}`}
                  className="news-icon-btn"
                >
                  <Pencil />
                </Link>

                <button
                  className="news-icon-btn"
                  onClick={() => handleDelete(n.id)}
                >
                  <Trash2 />
                </button>
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
