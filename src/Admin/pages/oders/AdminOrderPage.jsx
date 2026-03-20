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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "../../css/AdminOrderPage.css";

const API_URL = "/api/admin/orders";

const STATUS_OPTIONS = [
  { value: "PENDING_CONFIRMATION", label: "Chờ xác nhận" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "SHIPPING", label: "Đang giao" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã huỷ" },
];

const STATUS_LABEL = {
  PENDING_CONFIRMATION: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã huỷ",
};
const PAYMENT_STATUS_LABEL = {
  PENDING: "Chưa thanh toán",
  PAID: "Thanh toán thành công",
  FAILED: "Thanh toán thất bại",
  CANCELLED: "Đã huỷ",
};

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Reset về trang 1 khi đổi filter hoặc pageSize
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, pageSize]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await instance.get(API_URL);
      const data = Array.isArray(res.data) ? res.data : [];

      // Sắp xếp mới nhất lên đầu theo orderDate (hoặc id nếu không có date)
      const sorted = [...data].sort((a, b) => {
        if (a.orderDate && b.orderDate) {
          return new Date(b.orderDate) - new Date(a.orderDate);
        }
        return b.id - a.id;
      });

      setOrders(sorted);
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
      alert("Cập nhật trạng thái thất bại");
    }
  };

  // Lọc theo trạng thái
  const filteredOrders =
    statusFilter === "ALL"
      ? orders
      : orders.filter((o) => o.orderStatus === statusFilter);

  // Phân trang
  const totalItems = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const pagedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);

  // Tạo danh sách số trang hiển thị (tối đa 5 trang xung quanh trang hiện tại)
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, safeCurrentPage - delta);
      i <= Math.min(totalPages - 1, safeCurrentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (safeCurrentPage - delta > 2) range.unshift("...");
    if (safeCurrentPage + delta < totalPages - 1) range.push("...");

    rangeWithDots.push(1);
    range.forEach((r) => rangeWithDots.push(r));
    if (totalPages > 1) rangeWithDots.push(totalPages);

    return rangeWithDots;
  };

  return (
    <div className="admin-wrapper">

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div>
          <div className="logo">SMARTSHOP</div>
          <nav>
            <NavLink to="/admin/home"><Home size={20} /><span>Dashboard</span></NavLink>
            <NavLink to="/admin/products"><Package size={20} /><span>Sản phẩm</span></NavLink>
            <NavLink to="/admin/categorys"><LayoutGrid size={20} /><span>Danh mục</span></NavLink>
            <NavLink to="/admin/newslist"><Newspaper size={20} /><span>Tin Tức</span></NavLink>
            <NavLink to="/admin/orders"><ShoppingCart size={20} /><span>Đơn hàng</span></NavLink>
            <NavLink to="/admin/users"><Users size={20} /><span>Người dùng</span></NavLink>
          </nav>
        </div>
        <div className="logout" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <h2>Quản lý đơn hàng</h2>
        </header>

        <div className="admin-order">

          {/* Filter + Page size */}
          <div className="order-filter">
            <label>Trạng thái:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ALL">Tất cả</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            <div className="filter-divider" />

            <label>Hiển thị:</label>
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n} dòng</option>
              ))}
            </select>

            <span className="total-count">
              Tổng: <strong>{totalItems}</strong> đơn hàng
            </span>
          </div>

          {loading ? (
            <p className="loading-text">Đang tải dữ liệu...</p>
          ) : (
            <>
              <div className="table-wrapper">
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Người nhận</th>
                      <th>Email</th>
                      <th>Thanh toán</th>
                      <th>Trạng thái TT</th>
                      <th>Trạng thái</th>
                      <th>Ngày đặt</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedOrders.length > 0 ? (
                      pagedOrders.map((o) => (
                        <tr key={o.id}>
                          <td>#{o.id}</td>
                          <td>{o.recipientName}</td>
                          <td>{o.recipientEmail}</td>
                          <td>{o.paymentMethod}</td>
                          <td>{PAYMENT_STATUS_LABEL[o.paymentStatus] ?? o.paymentStatus}</td>
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

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="pagination">
                  <span className="page-info">
                    {startIndex + 1}–{Math.min(startIndex + pageSize, totalItems)} / {totalItems}
                  </span>

                  <div className="page-controls">
                    <button
                      className="page-btn"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={safeCurrentPage === 1}
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {getPageNumbers().map((page, idx) =>
                      page === "..." ? (
                        <span key={`dots-${idx}`} className="page-dots">…</span>
                      ) : (
                        <button
                          key={page}
                          className={`page-btn ${safeCurrentPage === page ? "active" : ""}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      className="page-btn"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safeCurrentPage === totalPages}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
