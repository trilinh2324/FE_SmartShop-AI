import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/HomeCarts.css";

const STORAGE_KEY = "smartshop_cart";

function HomeCarts() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch (e) {
      setCart([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p))
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((s, p) => s + (p.price || 0) * (p.qty || 1), 0);

  const handleCheckout = () => {
    navigate("/payment");
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-container empty">
        <h2>Giỏ hàng</h2>
        <p>Không có sản phẩm trong giỏ hàng.</p>
        <div className="cart-actions">
          <Link to="/users/home">Tiếp tục mua sắm</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Giỏ hàng của bạn</h2>
      <div className="cart-grid">
        <table className="cart-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Tổng</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id} className="cart-item">
                <td className="product">
                  <img src={item.image} alt={item.title} />
                  <div className="product-info">
                    <div className="product-title">{item.title}</div>
                    {item.variant && (
                      <div className="product-variant">{item.variant}</div>
                    )}
                  </div>
                </td>
                <td className="price">{formatCurrency(item.price)}</td>
                <td className="qty">
                  <div className="qty-controls">
                    <button onClick={() => updateQty(item.id, (item.qty || 1) - 1)}>−</button>
                    <input
                      type="number"
                      min="1"
                      value={item.qty || 1}
                      onChange={(e) => updateQty(item.id, parseInt(e.target.value || "1", 10))}
                    />
                    <button onClick={() => updateQty(item.id, (item.qty || 1) + 1)}>+</button>
                  </div>
                </td>
                <td className="line-total">{formatCurrency((item.price || 0) * (item.qty || 1))}</td>
                <td className="remove">
                  <button className="remove-btn" onClick={() => removeItem(item.id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <aside className="cart-summary">
          <h3>Tóm tắt đơn hàng</h3>
          <div className="summary-row">
            <span>Tạm tính</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="summary-row total">
            <strong>Tổng</strong>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <div className="summary-actions">
            <button className="checkout" onClick={handleCheckout}>
              Thanh toán
            </button>
            <button className="clear" onClick={clearCart}>
              Xóa giỏ hàng
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function formatCurrency(value) {
  if (value == null) return "0 ₫";
  try {
    return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  } catch (e) {
    return value + " ₫";
  }
}

export default HomeCarts;
