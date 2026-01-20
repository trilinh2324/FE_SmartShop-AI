import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Package,
  ShoppingCart,
  Users,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../css/ProductCreate.css";

const ProductCreate = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    oldPrice: "",
    rating: "",
    soldQuantity: 0,
    categoryName: "",
    productDetail: {
      screen: "",
      cpu: "",
      gpu: "",
      ram: "",
      storage: "",
      camera: "",
      battery: "",
      os: "",
      weight: "",
      description: "",
    },
    colors: [],
  });

  // ===== LOAD CATEGORY =====
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories")
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  // ===== HANDLERS =====
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleDetailChange = (e) =>
    setForm({
      ...form,
      productDetail: {
        ...form.productDetail,
        [e.target.name]: e.target.value,
      },
    });

  const handleColorChange = (i, e) => {
    const colors = [...form.colors];
    colors[i][e.target.name] = e.target.value;
    setForm({ ...form, colors });
  };

  const addColor = () =>
    setForm({
      ...form,
      colors: [
        ...form.colors,
        { colorName: "", quantity: 0, image: "", imageFile: null },
      ],
    });

  // ===== IMAGE UPLOAD =====
  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await axios.post(
      "http://localhost:8080/api/uploads/products",
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  };

  const handleColorImageChange = async (i, file) => {
    if (!file) return;
    const colors = [...form.colors];
    colors[i].imageFile = file;
    setForm({ ...form, colors });

    const path = await uploadImage(file);
    colors[i].image = path;
    setForm({ ...form, colors });
  };

  // ===== PRICE FORMAT =====
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const clean = value.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, [name]: clean }));
  };

  const formatVND = (v) => (v ? Number(v).toLocaleString("vi-VN") : "");

  // ===== VALIDATE =====
  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Vui lòng nhập tên sản phẩm";
    if (!form.brand.trim()) e.brand = "Vui lòng nhập hãng";
    if (!form.price) e.price = "Vui lòng nhập giá";
    if (!form.oldPrice) e.oldPrice = "Vui lòng nhập giá cũ";
    if (!form.categoryName) e.categoryName = "Chưa chọn danh mục";

    Object.entries(form.productDetail).forEach(([k, v]) => {
      if (!v.trim()) e[`detail_${k}`] = "Không được để trống";
    });

    if (form.colors.length === 0) e.colors = "Phải thêm ít nhất 1 màu";

    form.colors.forEach((c, i) => {
      if (!c.colorName.trim()) e[`colorName_${i}`] = "Chưa nhập tên màu";
      if (!c.quantity || c.quantity <= 0)
        e[`quantity_${i}`] = "Số lượng phải > 0";
      if (!c.image) e[`image_${i}`] = "Chưa upload ảnh";
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ===== SUBMIT =====
  const submit = async () => {
    if (!validate()) {
      alert("❌ Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      oldPrice: Number(form.oldPrice),
      soldQuantity: Number(form.soldQuantity),
      colors: form.colors.map((c) => ({
        colorName: c.colorName,
        image: c.image,
        quantity: Number(c.quantity),
      })),
    };

    try {
      await axios.post("http://localhost:8080/api/products", payload);
      alert("🎉 Thêm sản phẩm thành công");
      navigate("/products");
     } catch (err) {
      const msg = err.response?.data;
      if (typeof msg === "string" && msg.includes("tồn tại")) {
        setErrors({ name: msg });
      } else {
        alert("❌ Thêm sản phẩm thất bại");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin">
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="overlay"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="sidebar mobile"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
            >
              <div className="sb-top">
                <span>SMARTSHOP</span>
                <X onClick={() => setOpen(false)} />
              </div>
              <nav>
                <a onClick={() => navigate("/admin")}>
                  <Home /> Dashboard
                </a>
                <a onClick={() => navigate("/products")}>
                  <Package /> Sản phẩm
                </a>
                <a onClick={() => navigate("/orders")}>
                  <ShoppingCart /> Đơn hàng
                </a>
                <a onClick={() => navigate("/users")}>
                  <Users /> Người dùng
                </a>
              </nav>
              <div className="logout">
                <a onClick={handleLogout}>
                  <LogOut /> Đăng xuất
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="sidebar desktop">
        <h2>SMARTSHOP</h2>
        <nav>
          <a onClick={() => navigate("/admin")}>
            <Home /> Dashboard
          </a>
          <a className="active">
            <Package /> Sản phẩm
          </a>
          <a onClick={() => navigate("/orders")}>
            <ShoppingCart /> Đơn hàng
          </a>
          <a onClick={() => navigate("/users")}>
            <Users /> Người dùng
          </a>
        </nav>
        <div className="logout">
          <a onClick={handleLogout}>
            <LogOut /> Đăng xuất
          </a>
        </div>
      </aside>

      <main>
        <header className="header">
          <Menu className="menu" onClick={() => setOpen(true)} />
          <h3>SMARTSHOP</h3>
        </header>

        <div className="create-page">
          <div className="create-card">
            <button className="btn-back" onClick={() => navigate("/products")}>
              ← Quay lại danh sách
            </button>

            <h2>Thông tin sản phẩm</h2>

            <div className="grid-2">
              {[
                ["name", "Tên sản phẩm"],
                ["brand", "Hãng"],
              ].map(([k, label]) => (
                <div className="form-group" key={k}>
                  <label>{label}</label>
                  <input
                    name={k}
                    value={form[k]}
                    onChange={handleChange}
                    className={errors[k] ? "error-input" : ""}
                  />
                  {errors[k] && <p className="error-text">{errors[k]}</p>}
                </div>
              ))}

              <div className="form-group">
                <label>Giá (VND)</label>
                <input
                  name="price"
                  value={formatVND(form.price)}
                  onChange={handlePriceChange}
                  className={errors.price ? "error-input" : ""}
                />
                {errors.price && (
                  <p className="error-text">{errors.price}</p>
                )}
              </div>

              <div className="form-group">
                <label>Giá cũ (VND)</label>
                <input
                  name="oldPrice"
                  value={formatVND(form.oldPrice)}
                  onChange={handlePriceChange}
                  className={errors.oldPrice ? "error-input" : ""}
                />
                {errors.oldPrice && (
                  <p className="error-text">{errors.oldPrice}</p>
                )}
              </div>

              <div className="form-group">
                <label>Danh mục</label>
                <select
                  name="categoryName"
                  value={form.categoryName}
                  onChange={handleChange}
                  className={errors.categoryName ? "error-input" : ""}
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.categoryName && (
                  <p className="error-text">{errors.categoryName}</p>
                )}
              </div>
            </div>

            <h3 className="section-title">Chi tiết</h3>
            <div className="detail-grid">
              {Object.keys(form.productDetail).map((k) => (
                <div className="form-group" key={k}>
                  <label>{k.toUpperCase()}</label>
                  {k === "description" ? (
                    <textarea
                      name={k}
                      value={form.productDetail[k]}
                      onChange={handleDetailChange}
                      className={errors[`detail_${k}`] ? "error-input" : ""}
                    />
                  ) : (
                    <input
                      name={k}
                      value={form.productDetail[k]}
                      onChange={handleDetailChange}
                      className={errors[`detail_${k}`] ? "error-input" : ""}
                    />
                  )}
                  {errors[`detail_${k}`] && (
                    <p className="error-text">
                      {errors[`detail_${k}`]}
                    </p>
                  )}
                </div>
              ))}
            </div>

           <h3 className="section-title">Màu sắc</h3>

            <div className="color-table">
              <div className="color-head">
                <span>Ảnh</span>
                <span>Tên màu</span>
                <span>Số lượng</span>
                <span>Upload</span>
              </div>

              {form.colors.map((c, i) => (
                <div className="color-row" key={i}>
                  <div className="preview">
                    {c.imageFile || c.image ? (
                      <img
                        src={
                          c.imageFile
                            ? URL.createObjectURL(c.imageFile)
                            : `http://localhost:8080${c.image}`
                        }
                        alt="preview"
                      />
                    ) : (
                      <div className="no-img">No Image</div>
                    )}
                  </div>

                  <input
                    name="colorName"
                    placeholder="Tên màu"
                    value={c.colorName}
                    onChange={(e) => handleColorChange(i, e)}
                  />
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Số lượng"
                    value={c.quantity}
                    onChange={(e) => handleColorChange(i, e)}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleColorImageChange(i, e.target.files[0])
                    }
                  />
                </div>
              ))}
            </div>

            <button className="btn-add" onClick={addColor}>
              ➕ Thêm màu
            </button>
            <button className="save-btn" onClick={submit}>
              💾 Lưu sản phẩm
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductCreate;