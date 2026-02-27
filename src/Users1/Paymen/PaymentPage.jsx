import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/home/Header";
import Footer from "../components/home/Footer";
import "../css/PaymentPage.css";

const STORAGE_KEY = "smartshop_cart";

export default function PaymentPage() {
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
  });
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setCart(JSON.parse(raw));
      } else {
        navigate("/cart");
      }
    } catch (e) {
      navigate("/cart");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = cart.reduce((s, p) => s + (p.price || 0) * (p.qty || 1), 0);
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shipping;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOrderError("");

    try {
      // Validate form
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.phone ||
        !formData.address
      ) {
        setOrderError("Vui lòng điền đầy đủ thông tin.");
        setLoading(false);
        return;
      }

      const orderData = {
        customer: formData,
        cart: cart,
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        shipping: shipping,
        total: total,
        createdAt: new Date().toISOString(),
      };

      if (paymentMethod === "cod") {
        // COD: Lưu đơn hàng và xóa giỏ
        console.log("COD Order:", orderData);
        // TODO: Gửi API POST /api/orders
        alert("Đơn hàng của bạn đã được xác nhận!\nPhương thức: Thanh toán khi nhận hàng");
        localStorage.removeItem(STORAGE_KEY);
        navigate("/");
      } else if (paymentMethod === "online") {
        // Online: Gửi yêu cầu thanh toán
        console.log("Online Payment Order:", orderData);
        // TODO: Gửi API POST /api/payments/create
        alert("Chuyển hướng đến cổng thanh toán...");
        // Mô phỏng chuyển hướng
        setTimeout(() => {
          alert("Thanh toán thành công!");
          localStorage.removeItem(STORAGE_KEY);
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      setOrderError(error.message || "Lỗi xử lý đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="payment-page-wrapper">
        <Header />
        <div className="payment-container">
          <h2>Thanh toán</h2>
          <p>Giỏ hàng trống. Vui lòng thêm sản phẩm trước.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="payment-page-wrapper">
      <Header />
      <div className="payment-page">
      <div className="payment-container">
        <h1>Thanh toán</h1>

        <div className="payment-grid">
          {/* Form nhập thông tin */}
          <div className="payment-form-section">
            <h2>Thông tin giao hàng</h2>
            <form onSubmit={handleSubmitOrder} className="payment-form">
              <div className="form-group">
                <label>Họ và tên *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="0987654321"
                  required
                />
              </div>

              <div className="form-group">
                <label>Địa chỉ *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Số nhà, tên đường"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Thành phố/Tỉnh</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Thành phố"
                  />
                </div>
                <div className="form-group">
                  <label>Quận/Huyện</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="Quận/Huyện"
                  />
                </div>
              </div>

              <h2 style={{ marginTop: "30px" }}>Phương thức thanh toán</h2>

              {/* COD Option */}
              <div className="payment-method">
                <label className="method-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="method-icon cod-icon">💵</span>
                  <div className="method-info">
                    <strong>Thanh toán khi nhận hàng (COD)</strong>
                    <p>Bạn sẽ thanh toán khi nhận được hàng từ nhân viên giao hàng.</p>
                  </div>
                </label>
              </div>

              {/* Online Payment Option */}
              <div className="payment-method">
                <label className="method-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="method-icon online-icon">💳</span>
                  <div className="method-info">
                    <strong>Thanh toán trực tiếp</strong>
                    <p>Sử dụng thẻ tín dụng, thẻ ghi nợ hoặc ví điện tử.</p>
                  </div>
                </label>
              </div>

              {orderError && <div className="error-message">{orderError}</div>}

              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Xác nhận đơn hàng"}
              </button>
            </form>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="payment-summary-section">
            <div className="payment-summary">
              <h2>Tóm tắt đơn hàng</h2>

              <div className="summary-items">
                {cart.map((item) => (
                  <div key={item.id} className="summary-item">
                    <img src={item.image} alt={item.title} />
                    <div className="item-details">
                      <p className="item-title">{item.title}</p>
                      <p className="item-qty">x{item.qty || 1}</p>
                    </div>
                    <p className="item-price">
                      {formatCurrency((item.price || 0) * (item.qty || 1))}
                    </p>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row">
                <span>Tạm tính</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span className={shipping === 0 ? "free-shipping" : ""}>
                  {shipping === 0 ? "Miễn phí" : formatCurrency(shipping)}
                </span>
              </div>

              <div className="summary-row total">
                <strong>Tổng cộng</strong>
      </div>
      <Footer />
                <strong>{formatCurrency(total)}</strong>
              </div>
            </div>
          </div>
        </div>
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
