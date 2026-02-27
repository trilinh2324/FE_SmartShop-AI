import React from 'react';
import ProductCard from './ProductCard';
import '../../css/ProductSection.css';

export default function ProductSection() {
  const products = [
    {
      id: 1,
      name: 'Bộ quần áo sơ sinh tính năng ngắn, vải lụa Anime',
      price: 95000,
      originalPrice: 150000,
      discount: 37,
      image: '👶'
    },
    {
      id: 2,
      name: 'Giày bé gái phát sáng Anime',
      price: 135000,
      originalPrice: 200000,
      discount: 32,
      image: '👟'
    },
    {
      id: 3,
      name: 'Xe mô hình nhân vật Kangaroo mẹ loài con',
      price: 112000,
      originalPrice: 180000,
      discount: 38,
      image: '🦘'
    },
    {
      id: 4,
      name: 'Bàn chơi cơ năng thẳng khối cho bé',
      price: 267000,
      originalPrice: 400000,
      discount: 33,
      image: '🎮'
    },
    {
      id: 5,
      name: 'Bộ quần áo bé gái chất lượng cao',
      price: 89000,
      originalPrice: 140000,
      discount: 36,
      image: '👗'
    },
    {
      id: 6,
      name: 'Giầy tập đi cho bé',
      price: 125000,
      originalPrice: 190000,
      discount: 34,
      image: '👶'
    },
    {
      id: 7,
      name: 'Đồ chơi phát triển trí tuệ bé',
      price: 145000,
      originalPrice: 220000,
      discount: 34,
      image: '🎨'
    },
    {
      id: 8,
      name: 'Tã dán cho bé sơ sinh',
      price: 185000,
      originalPrice: 280000,
      discount: 34,
      image: '🧷'
    },
  ];

  return (
    <section className="product-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">SẢN PHẨM YÊU THÍCH</h2>
          <div className="section-underline"></div>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}
        </div>

        <div className="section-footer">
          <button className="view-more-btn">XEM THÊM</button>
        </div>
      </div>
    </section>
  );
}