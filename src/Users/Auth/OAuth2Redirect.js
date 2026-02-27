import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuth2Redirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy token từ URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Lưu JWT
      localStorage.setItem("token", token);

      // Chuyển sang trang user
      navigate("/users/home");

    }
  }, [navigate]);

  return <p>Đang đăng nhập...</p>;
};

export default OAuth2Redirect;
