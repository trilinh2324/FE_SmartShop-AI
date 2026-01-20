import React, { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import "../css/Login.css";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: gọi API login admin
    console.log("Login admin");
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>ADMIN LOGIN</h2>
        <p>SmartShop Admin Panel</p>

        <form onSubmit={handleSubmit}>
          {/* USERNAME */}
          <div className="input-group">
            <User size={18} />
            <input
              type="text"
              placeholder="Tên đăng nhập"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <Lock size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button type="submit" className="login-btn">
            ĐĂNG NHẬP
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
