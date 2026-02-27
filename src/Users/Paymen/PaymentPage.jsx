import React from "react";
import axios from "axios";
import "../css/PaymentPage.css";

const PaymentPage = ({ billId, totalAmount }) => {

  const handleVNPayPayment = async () => {
    try {
      const res = await axios.post(
        `/api/payments/pay/vnpay/${billId}`
      );

      // Redirect sang trang VNPay
      window.location.href = res.data;

    } catch (error) {
      console.error("Thanh toán thất bại:", error);
      alert("Không thể tạo thanh toán. Vui lòng thử lại!");
    }
  };

  return (
    <div className="payment-container">
      <h2>Thanh toán đơn hàng</h2>

      <div className="payment-box">
        <p>
          <strong>Mã đơn hàng:</strong> #{billId}
        </p>
        <p>
          <strong>Tổng tiền:</strong>{" "}
          {totalAmount.toLocaleString("vi-VN")} đ
        </p>

        <button className="vnpay-btn" onClick={handleVNPayPayment}>
          Thanh toán bằng VNPay
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
