// src/pages/Login.js
import React from "react";
import "../css/login.css";

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">SmartShop AI</h1>
        <p className="login-subtitle">Đăng nhập để tiếp tục</p>

        <button className="google-login-btn" onClick={handleGoogleLogin}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="google-icon"
          />
          <span>Đăng nhập với Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
