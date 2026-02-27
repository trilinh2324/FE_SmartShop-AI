import React from 'react';
import '../../css/Breadcrumb.css';

export default function Breadcrumb() {
  return (
    <div className="breadcrumb">
      <div className="breadcrumb-container">
        <a href="#" className="breadcrumb-item">Trang chủ</a>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-item active">Sản phẩm yêu thích</span>
      </div>
    </div>
  );
}