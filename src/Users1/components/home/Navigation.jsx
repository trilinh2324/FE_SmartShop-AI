import React from 'react';
import '../../css/Navigation.css';

export default function Navigation() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-menu">
          <a href="#" className="nav-item active">Trang chủ</a>
          <a href="#" className="nav-item">Giới thiệu</a>
          <div className="nav-item dropdown">
            <button className="dropdown-toggle">Sản phẩm</button>
            <div className="dropdown-menu">
              <a href="#">Quần áo bé gái</a>
              <a href="#">Quần áo bé trai</a>
              <a href="#">Đồ chơi</a>
              <a href="#">Phụ kiện</a>
            </div>
          </div>
          <a href="#" className="nav-item">Cửa hàng thương giáp</a>
          <a href="#" className="nav-item">Tạp chí Baby</a>
          <a href="#" className="nav-item">Liên hệ</a>
        </div>
      </div>
    </nav>
  );
}