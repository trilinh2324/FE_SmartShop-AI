import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import instance from "../../api/utils/axiosConfig";
import "../../css/AdminOrderDetail.css";

const API_URL = "/api/admin/orders";

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await instance.get(`${API_URL}/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
      alert("Không thể tải chi tiết đơn hàng");
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    if (!path.startsWith("/")) {
      return `http://localhost:8080/${path}`;
    }
    return `http://localhost:8080${path}`;
  };

  if (!order) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="order-detail-wrapper">

      {/* HEADER */}
      <div className="order-header">
        <button
          className="back-btn"
          onClick={() => navigate("/admin/orders")}
        >
          ← Quay lại
        </button>

        <h2>Chi tiết đơn hàng #{order.id}</h2>
      </div>

      {/* CUSTOMER INFO */}
      <div className="order-info-card">
        <div className="info-left">
          <p><strong>Người nhận:</strong> {order.recipientName}</p>
          <p><strong>SĐT:</strong> {order.recipientPhone}</p>
          <p><strong>Email:</strong> {order.recipientEmail}</p>
          <p><strong>Địa chỉ:</strong> {order.recipientAddress}</p>
        </div>

        <div className="info-right">
          <div className="total-box">
            <span>Tổng tiền</span>
            <h3>
              {Number(order.totalAmount).toLocaleString("vi-VN")} đ
            </h3>
          </div>
        </div>
      </div>

      {/* PRODUCT LIST */}
      <div className="product-section">
        <h3>Danh sách sản phẩm</h3>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Sản phẩm</th>
                <th>Thông tin</th>
                <th>Cấu hình</th>
                <th>SL</th>
                <th>Thành tiền</th>
              </tr>
            </thead>

            <tbody>
              {order.items?.map((item, index) => {
                const productColor = item.productColor;
                const product = productColor?.product;
                const image = productColor?.image;
                const detail = product?.productDetail;

                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>

                    {/* PRODUCT */}
                    <td>
                      <div className="product-info">
                        <div className="color-img">
                          {image ? (
                            <img
                              src={getImageUrl(image)}
                              alt={product?.name}
                              onError={(e) =>
                                (e.target.src = "/no-image.png")
                              }
                            />
                          ) : (
                            <div className="no-img">NO IMAGE</div>
                          )}
                        </div>

                        <div>
                          <div className="product-name">
                            {product?.name || "Không có tên"}
                          </div>
                          <div className="product-color">
                            Màu: {productColor?.colorName || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* INFO */}
                    <td className="info-cell">
                      <div>Hãng: {product?.brand || "N/A"}</div>
                      <div>
                        Danh mục: {product?.category?.name || "N/A"}
                      </div>
                      <div className="price">Đơn giá: 
                        {Number(product?.price || 0).toLocaleString(
                          "vi-VN"
                        )}{" "}
                        đ
                      </div>
                    </td>

                    {/* SPECS */}
<td className="spec-cell">
  <div><strong>Màn hình:</strong> {detail?.screen || "N/A"}</div>
  <div><strong>CPU:</strong> {detail?.cpu || "N/A"}</div>
  <div><strong>GPU:</strong> {detail?.gpu || "N/A"}</div>
  <div><strong>RAM:</strong> {detail?.ram || "N/A"}</div>
  <div><strong>Storage:</strong> {detail?.storage || "N/A"}</div>
  <div><strong>Camera:</strong> {detail?.camera || "N/A"}</div>
  <div><strong>Pin:</strong> {detail?.battery || "N/A"}</div>
  <div><strong>HĐH:</strong> {detail?.os || "N/A"}</div>
  <div><strong>Trọng lượng:</strong> {detail?.weight || "N/A"}</div>
</td>

                    {/* QUANTITY */}
                    <td>{item.quantity}</td>

                    {/* SUBTOTAL */}
                    <td className="subtotal">
                      {(item.price * item.quantity).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      đ
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}