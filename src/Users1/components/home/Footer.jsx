import React from 'react';
import '../../css/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 className="footer-title">Bean Baby</h3>
            <p className="footer-description">
              Cửa hàng bán sản phẩm chất lượng cho bé yêu với giá cả phải chăng.
            </p>
            <div className="social-links">
              <a href="#" title="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a6 6 0 0 0-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a2 2 0 0 1 2-2h1V2z"></path>
                </svg>
              </a>
              <a href="#" title="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7"></path>
                </svg>
              </a>
              <a href="#" title="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8A4 4 0 0116 11.37z" fill="white"></path>
                  <circle cx="17.5" cy="6.5" r="1.5" fill="white"></circle>
                </svg>
              </a>
              <a href="#" title="Email">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 6-8.97 5.7a1.94 1.94 0 01-2.06 0L2 6" stroke="white" strokeWidth="2" fill="none"></path>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-subtitle">Về chúng tôi</h4>
            <ul className="footer-links">
              <li><a href="#">Giới thiệu</a></li>
              <li><a href="#">Tin tức</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Sự kiện</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-subtitle">Sản phẩm</h4>
            <ul className="footer-links">
              <li><a href="#">Quần áo</a></li>
              <li><a href="#">Giầy dép</a></li>
              <li><a href="#">Đồ chơi</a></li>
              <li><a href="#">Tã dán</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-subtitle">Hỗ trợ</h4>
            <ul className="footer-links">
              <li><a href="#">Liên hệ</a></li>
              <li><a href="#">FAQ</a></li>
<li><a href="#">Chính sách bán hàng</a></li>
              <li><a href="#">Bảo mật</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>
        <p className="footer-copyright">
          © 2024 Bean Baby. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </footer>
  );
}