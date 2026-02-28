import React, { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Login.css";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data?.token) {
        const token = res.data.token;

        // ✅ Lưu token
        localStorage.setItem("token", token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("username", username);

        // set default Authorization header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        navigate("/admin/home");
      }

    } catch (err) {
      if (err.response?.status === 403) {
        setError("❌ Bạn không có quyền truy cập Admin Panel");
      } else if (err.response?.status === 401) {
        setError("❌ Sai tên đăng nhập hoặc mật khẩu");
      } else {
        setError("❌ Lỗi đăng nhập");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>ADMIN LOGIN</h2>
        <p>SmartShop Admin Panel</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <User size={18} />
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <Lock size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {error && <div className="error-text">{error}</div>}

          <button type="submit" className="login-btn">
            {loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
          </button>
        </form>

        <div className="login-footer">
          © 2026 SmartShop Admin
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;