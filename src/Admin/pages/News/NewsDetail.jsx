import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNewsById } from "../../api/News/newsApi";
import {
  Home,
  Package,
  LayoutGrid,
  Newspaper,
  ShoppingCart,
  Users,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import "../../css/NewsDetail.css";

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await getNewsById(id);
    setNews(res.data);
  };

  if (!news) return <div className="loading">Đang tải...</div>;

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
          <a onClick={() => navigate("/admin/login")}>
            <LogOut /> Đăng xuất
          </a>
        </div>
      </aside>

      {/* ===== CONTENT ===== */}
      <main className="news-content">
        <div className="news-detail-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Quay lại
          </button>
          <h2>Chi tiết tin tức</h2>
        </div>

        <div className="news-detail-card">
          <h1>{news.title}</h1>

          {news.thumbnail && (
            <img
              src={`http://localhost:8080/uploads/news/${news.thumbnail}`}
              alt={news.title}
              className="news-detail-image"
            />
          )}

          <div
            className="news-detail-content"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>
      </main>
    </div>
  );
}