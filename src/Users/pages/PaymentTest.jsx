import React, { useState } from "react";
import axios from "axios";

function PaymentTest() {
  const [loading, setLoading] = useState(false);
  const billId = 2; // Hardcode test

  const handlePayment = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://localhost:8080/api/payment/create/${billId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const checkoutUrl = response.data;
      window.location.href = checkoutUrl;

    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo thanh toán");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h2>Test Thanh Toán PayOS</h2>

      <button onClick={handlePayment}>
        {loading ? "Đang xử lý..." : "Thanh toán"}
      </button>
    </div>
  );
}
console.log(localStorage.getItem("token"));
export default PaymentTest;