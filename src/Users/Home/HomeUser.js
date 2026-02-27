// src/pages/HomeUser.js
import React from "react";
import "../css/HomeUser.css";

const HomeUser = () => {
  return (
    <div className="home-container">
      {/* ===== HEADER ===== */}
      <header className="home-header">
        <h1 className="logo">SmartShop AI</h1>

        <nav className="home-nav">
          <a href="#">Trang chủ</a>
          <a href="#">Sản phẩm</a>
          <a href="#">Đơn hàng</a>
          <a href="#">Hồ sơ</a>
          <a href="#">Đăng xuất</a>
        </nav>
      </header>

      {/* ===== HERO ===== */}
      <section className="hero">
        <h2>Mua sắm thông minh với AI 🚀</h2>
        <p>
          Gợi ý sản phẩm phù hợp – Giá tốt – Trải nghiệm mượt mà
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm bạn cần..."
          />
          <button>Tìm kiếm</button>
        </div>
      </section>

      {/* ===== FEATURE ===== */}
      <section className="features">
        <div className="feature-card">
          <h3>🤖 AI Gợi ý</h3>
          <p>Đề xuất sản phẩm phù hợp với bạn</p>
        </div>

        <div className="feature-card">
          <h3>⚡ Nhanh & Tiện</h3>
          <p>Tìm – mua – thanh toán chỉ vài giây</p>
        </div>

        <div className="feature-card">
          <h3>🔒 An toàn</h3>
          <p>Bảo mật thông tin tuyệt đối</p>
        </div>
      </section>

      {/* ===== PRODUCT DEMO ===== */}
      <section className="products">
        <h2>Sản phẩm nổi bật</h2>

        <div className="product-list">
          <div className="product-card">
            <img src="https://via.placeholder.com/200" alt="product" />
            <h4>Áo thun AI</h4>
            <p>199.000đ</p>
          </div>

          <div className="product-card">
            <img src="https://via.placeholder.com/200" alt="product" />
            <h4>Giày thông minh</h4>
            <p>899.000đ</p>
          </div>

          <div className="product-card">
            <img src="https://via.placeholder.com/200" alt="product" />
            <h4>Đồng hồ AI</h4>
            <p>1.299.000đ</p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="home-footer">
        © 2026 SmartShop AI | All rights reserved
      </footer>
    </div>
  );
};

export default HomeUser;
