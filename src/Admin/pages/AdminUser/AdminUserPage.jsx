import React, { useEffect, useState } from "react";
import instance from "../../api/utils/axiosConfig";
import "../../css/AdminUserPage.css";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  LayoutGrid,
  Newspaper,
  ShoppingCart,
  Users,
  LogOut,
  Menu,
} from "lucide-react";

const API_URL = "/api/admin/users";

export default function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await instance.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      console.error("Không thể tải danh sách user");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      username: "",
      email: "",
      password: "",
      role: "USER",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await instance.put(`${API_URL}/${editingId}`, form);
      } else {
        await instance.post(API_URL, form);
      }

      resetForm();
      fetchUsers();
    } catch (err) {
      alert("Có lỗi xảy ra!");
    }
  };

  /* ========================
     PHÂN QUYỀN
  ======================== */

  const canEditOrDelete = (role) => {
    return (
      role === "WAREHOUSE_STAFF" ||
      role === "STAFF" ||
      role === "MANAGER"
    );
  };

  const canBlock = (role) => {
    return role !== "ADMIN";
  };

  const handleEdit = (user) => {
    if (!canEditOrDelete(user.role)) return;

    setEditingId(user.id);
    setForm({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá?")) return;

    await instance.delete(`${API_URL}/${id}`);
    fetchUsers();
  };

  const handleBlock = async (id, isBlocked) => {
    if (isBlocked) {
      await instance.put(`${API_URL}/${id}/unblock`);
    } else {
      await instance.put(`${API_URL}/${id}/block`);
    }

    fetchUsers();
  };
    const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Bạn có chắc muốn đăng xuất?"
    );
    if (!confirmLogout) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login", { replace: true });
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  return (
    <div className="admin-layout">
      {/* ===== SIDEBAR ===== */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo">SMARTSHOP</div>

        <nav>
          <a onClick={() => navigate("/admin/home")}><Home size={20} /> Dashboard</a>
          <a onClick={() => navigate("/admin/products")}><Package size={20} /> Sản phẩm</a>
          <a onClick={() => navigate("/admin/categorys")}><LayoutGrid size={20} /> Danh mục</a>
          <a onClick={() => navigate("/admin/newslist")}><Newspaper size={20} /> Tin Tức</a>
          <a onClick={() => navigate("/admin/orders")}><ShoppingCart size={20} /> Đơn hàng</a>
          <a className="active"><Users size={20} /> Người dùng</a>
        </nav>

        <div className="logout">
         <a onClick={handleLogout}>
                                                   <LogOut />
                                                   Đăng xuất
                                                 </a>
        </div>
      </aside>

      {/* ===== CONTENT ===== */}
      <div className="main-content">
        {/* MOBILE HEADER */}
        <div className="mobile-header">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu />
          </button>
          <h3>Quản lý người dùng</h3>
        </div>

        {sidebarOpen && (
          <div
            className="overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="content-wrapper">
          <h2>Quản lý người dùng</h2>

          {/* ===== FORM ===== */}
          <form className="user-form" onSubmit={handleSubmit}>
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required={!editingId}
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="USER">USER</option>
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="WAREHOUSE_STAFF">WAREHOUSE_STAFF</option>
              <option value="STAFF">STAFF</option>
              <option value="MANAGER">MANAGER</option>
            </select>

            <button type="submit" className="btn-primary">
              {editingId ? "Cập nhật" : "Thêm user"}
            </button>
          </form>

          {/* ===== TABLE ===== */}
          <div className="table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>

                    <td>
                      <span
                        className={
                          u.status === "BLOCKED"
                            ? "status blocked"
                            : "status active"
                        }
                      >
                        {u.status === "BLOCKED"
                          ? "Bị khoá"
                          : "Hoạt động"}
                      </span>
                    </td>

                    <td className="actions">
                      {canEditOrDelete(u.role) && (
                        <>
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(u)}
                          >
                            Sửa
                          </button>

                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(u.id)}
                          >
                            Xoá
                          </button>
                        </>
                      )}

                      {canBlock(u.role) && (
                        <button
                          className={
                            u.status === "BLOCKED"
                              ? "btn-unblock"
                              : "btn-block"
                          }
                          onClick={() =>
                            handleBlock(
                              u.id,
                              u.status === "BLOCKED"
                            )
                          }
                        >
                          {u.status === "BLOCKED"
                            ? "Mở khoá"
                            : "Khoá"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}