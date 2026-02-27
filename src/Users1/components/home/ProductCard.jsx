import React from 'react';
import '../../css/ProductCard.css';

export default function ProductCard({
  name,
  price,
  originalPrice,
  discount,
  image,
}) {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <div className="product-image-placeholder">{image}</div>
        
        {discount > 0 && (
          <div className="discount-badge">-{discount}%</div>
        )}

        <button className="wishlist-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <div className="product-content">
        <h3 className="product-name">{name}</h3>

        <div className="product-price">
          <span className="price">{price.toLocaleString('vi-VN')}đ</span>
          {originalPrice > price && (
            <span className="original-price">{originalPrice.toLocaleString('vi-VN')}đ</span>
          )}
        </div>

        <button className="add-to-cart-btn">Thêm vào giỏ</button>
      </div>
    </div>
  );
}