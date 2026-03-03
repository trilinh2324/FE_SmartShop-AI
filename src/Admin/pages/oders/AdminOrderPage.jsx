import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import instance from "../../api/utils/axiosConfig";
import {
  Home,
  Package,
  LayoutGrid,
  Newspaper,
  ShoppingCart,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import "../../css/AdminOrderPage.css";

const API_URL = "/api/admin/orders";

const STATUS_OPTIONS = [
  { value: "PENDING_CONFIRMATION", label: "Chờ xác nhận" },
  { value: "CONFIRMED",            label: "Đã xác nhận"  },
  { value: "SHIPPING",             label: "Đang giao"    },
  { value: "COMPLETED",            label: "Hoàn thành"   },
  { value: "CANCELLED",            label: "Đã huỷ"       },
];

const STATUS_LABEL = {
  PENDING_CONFIRMATION: "Chờ xác nhận",
  CONFIRMED:            "Đã xác nhận",
  SHIPPING:             "Đang giao",
  COMPLETED:            "Hoàn thành",
  CANCELLED:            "Đã huỷ",
};

export default function AdminOrderPage() {
  const [orders, setOrders]           = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading]         = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await instance.get(API_URL);
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch {
      alert("Không thể tải danh sách đơn hàng");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (!window.confirm("Bạn có chắc muốn đăng xuất?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login", { replace: true });
    setTimeout(() => window.location.reload(), 100);
  };

  const handleChangeStatus = async (id, status) => {
    try {
      await instance.put(`${API_URL}/${id}/status`, { status });
      fetchOrders();
    } catch {
      alert("Cập nhật trạng thái thất bại");
    }
  };

  const filteredOrders =
    statusFilter === "ALL"
      ? orders
      : orders.filter((o) => o.orderStatus === statusFilter);

  return (
    <div className="admin-wrapper">

      {/* ===== SIDEBAR ===== */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div>
          <div className="logo">SMARTSHOP</div>
          <nav>
            <NavLink to="/admin/home" end>
              <Home size={20} /><span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin/products">
              <Package size={20} /><span>Sản phẩm</span>
            </NavLink>
            <NavLink to="/admin/categorys">
              <LayoutGrid size={20} /><span>Danh mục</span>
            </NavLink>
            <NavLink to="/admin/newslist">
              <Newspaper size={20} /><span>Tin Tức</span>
            </NavLink>
            <NavLink to="/admin/orders">
              <ShoppingCart size={20} /><span>Đơn hàng</span>
            </NavLink>
            <NavLink to="/admin/users">
              <Users size={20} /><span>Người dùng</span>
            </NavLink>
          </nav>
        </div>
        <div className="logout" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="main">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <h2>Quản lý đơn hàng</h2>
        </header>

        <div className="admin-order">

          {/* Filter bar */}
          <div className="order-filter">
            <label>Trạng thái:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ALL">Tất cả</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="loading-text">Đang tải dữ liệu...</p>
          ) : (
            <div className="table-wrapper">
              <table className="order-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Người nhận</th>
                    <th>Email</th>
                    <th>Thanh toán</th>
                    <th>Trạng thái</th>
                    <th>Ngày đặt</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((o) => (
                      <tr key={o.id}>
                        <td>#{o.id}</td>
                        <td>{o.recipientName}</td>
                        <td>{o.recipientEmail}</td>
                        <td>{o.paymentMethod}</td>
                        <td>
                          <span className={`status ${o.orderStatus?.toLowerCase()}`}>
                            {STATUS_LABEL[o.orderStatus] ?? o.orderStatus}
                          </span>
                        </td>
                        <td>
                          {o.orderDate
                            ? new Date(o.orderDate).toLocaleDateString("vi-VN")
                            : ""}
                        </td>
                        <td className="actions">
                          <button
                            className="view-btn"
                            onClick={() => navigate(`/admin/orders/${o.id}`)}
                          >
                            Xem
                          </button>
                          <select
                            value={o.orderStatus}
                            onChange={(e) => handleChangeStatus(o.id, e.target.value)}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="empty">Không có đơn hàng</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
