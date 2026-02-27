import React, { useEffect, useState } from "react";
import axios from "../../api/utils/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  LayoutGrid,
  Newspaper,
  Eye,
  Pencil,
  Trash2,
  Plus,
  Search,ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../../css/ProductUpdate.css";

const ProductUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(-1);

  // ✅ FIX 1: thêm detailLabels
  const detailLabels = {
    screen: "Man hinh",
    cpu: "CPU",
    gpu: "GPU",
    ram: "RAM",
    storage: "Bo nho",
    camera: "Camera",
    battery: "Pin",
    os: "He dieu hanh",
    weight: "Trong luong",
    description: "Mo ta",
  };

  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    oldPrice: "",
    rating: 0,
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

  // LOAD CATEGORIES
  useEffect(() => {
    axios
      .get("/api/categories")
      .then((res) => setCategories(res.data || []))
      .catch(console.error);
  }, []);

  // LOAD PRODUCT
  useEffect(() => {
    axios
      .get(`/api/products/${id}`)
      .then((res) => {
        const p = res.data;
        setForm({
          name: p.name || "",
          brand: p.brand || "",
          price: p.price ? String(p.price) : "",
          oldPrice: p.oldPrice ? String(p.oldPrice) : "",
          rating: p.rating || 0,
          soldQuantity: p.soldQuantity || 0,
          categoryName: p.category?.name || "",
          productDetail: {
            screen: p.productDetail?.screen || "",
            cpu: p.productDetail?.cpu || "",
            gpu: p.productDetail?.gpu || "",
            ram: p.productDetail?.ram || "",
            storage: p.productDetail?.storage || "",
            camera: p.productDetail?.camera || "",
            battery: p.productDetail?.battery || "",
            os: p.productDetail?.os || "",
            weight: p.productDetail?.weight || "",
            description: p.productDetail?.description || "",
          },
          colors:
            p.colors?.map((c) => ({
              colorName: c.colorName,
              quantity: c.quantity,
              image: c.image,
            })) || [],
        });
        setLoading(false);
      })
      .catch(() => {
        alert("Khong tim thay san pham");
        navigate("/admin/products");
      });
  }, [id, navigate]);

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
    const { name, value } = e.target;
    const colors = [...form.colors];
    colors[i][name] = name === "quantity" ? Number(value) || 0 : value;
    setForm({ ...form, colors });
  };

  const addColor = () =>
    setForm({
      ...form,
      colors: [...form.colors, { colorName: "", quantity: 0, image: "" }],
    });

  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await axios.post("/api/uploads/products", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  };

  const handleColorImageChange = async (i, file) => {
    if (!file) return;
    setUploadingIndex(i);

    try {
      const path = await uploadImage(file);
      const colors = [...form.colors];
      colors[i].image = path;
      setForm({ ...form, colors });
    } catch {
      alert("Upload anh that bai");
    } finally {
      setUploadingIndex(-1);
    }
  };

  const validate = () => {
    let e = {};

    if (!form.name.trim()) e.name = "Ten khong duoc de trong";
    if (!form.brand.trim()) e.brand = "Hang khong duoc de trong";
    if (!form.price) e.price = "Gia khong hop le";
    if (!form.oldPrice) e.oldPrice = "Gia cu khong hop le";
    if (!form.categoryName) e.categoryName = "Chua chon danh muc";

    Object.entries(form.productDetail).forEach(([k, v]) => {
      if (!v.trim()) e[`detail_${k}`] = "Khong duoc de trong";
    });

    form.colors.forEach((c, i) => {
      if (!c.colorName.trim()) e[`colorName_${i}`] = "Chua nhap ten mau";
      if (!c.image) e[`image_${i}`] = "Chua upload anh";
      if (!c.quantity || c.quantity <= 0)
        e[`quantity_${i}`] = "So luong phai > 0";
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    setSubmitting(true);

    const payload = {
      ...form,
      price: Number(form.price),
      oldPrice: Number(form.oldPrice),
      rating: Number(form.rating) || 0,
      soldQuantity: Number(form.soldQuantity) || 0,
    };

    try {
      await axios.put(`/api/products/${id}`, payload);
      alert("Cap nhat thanh cong");
      navigate("/admin/products");
    } catch {
      alert("Cap nhat that bai");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ FIX 2: thêm lại handleLogout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  if (loading) return <p>Dang tai du lieu...</p>;

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
                <a onClick={() => navigate("/admin/home")}>
                  <Home /> Dashboard
                </a>
                <a onClick={() => navigate("/admin/products")}>
                  <Package /> San pham
                </a>
                <a onClick={() => navigate("/admin/categorys")}>
                  <LayoutGrid /> Danh muc
                </a>
                <a onClick={() => navigate("/admin/newslist")}>
                  <Newspaper /> Tin Tuc
                </a>
                            <a onClick={() => navigate("/admin/orders")}>
              <ShoppingCart /> Đơn hàng
            </a>
            <a onClick={() => navigate("/admin/users")}>
              <Users /> Người dùng
            </a>
              </nav>
              <div className="logout">
                <a onClick={handleLogout}>
                  <LogOut /> Dang xuat
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="sidebar desktop">
        <h2>SMARTSHOP</h2>
        <nav>
          <a onClick={() => navigate("/admin/home")}>
            <Home /> Dashboard
          </a>
          <a className="active">
            <Package /> San pham
          </a>
          <a onClick={() => navigate("/admin/categorys")}>
            <LayoutGrid /> Danh muc
          </a>
          <a onClick={() => navigate("/admin/newslist")}>
            <Newspaper /> Tin Tuc
          </a>
                      <a onClick={() => navigate("/admin/orders")}>
              <ShoppingCart /> Đơn hàng
            </a>
            <a onClick={() => navigate("/admin/users")}>
              <Users /> Người dùng
            </a>
        </nav>
        <div className="logout">
          <a onClick={handleLogout}>
            <LogOut /> Dang xuat
          </a>
        </div>
      </aside>

      <main>
        <header className="header">
          <Menu className="menu" onClick={() => setOpen(true)} />
          <h3>Cap nhat san pham</h3>
        </header>

        <div className="admin-update">
          <div className="admin-card">
            <button
              className="btn-back"
              onClick={() => navigate("/admin/products")}
            >
              <ArrowLeft size={18} /> Quay lai
            </button>

            <h2>Sua thong tin san pham</h2>

            <div className="grid-2">
              <div className="form-group">
                <label>Ten san pham</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={errors.name ? "error-input" : ""}
                />
                {errors.name && <p className="error-text">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label>Hang</label>
                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  className={errors.brand ? "error-input" : ""}
                />
                {errors.brand && <p className="error-text">{errors.brand}</p>}
              </div>

              <div className="form-group">
                <label>Danh muc</label>
                <select
                  name="categoryName"
                  value={form.categoryName}
                  onChange={handleChange}
                  className={errors.categoryName ? "error-input" : ""}
                >
                  <option value="">-- Chon danh muc --</option>
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

              <div className="form-group">
                <label>Gia ban</label>
                <input
                  value={formatVND(form.price)}
                  onChange={(e) =>
                    setForm({ ...form, price: parseVND(e.target.value) })
                  }
                  className={errors.price ? "error-input" : ""}
                />
                {errors.price && <p className="error-text">{errors.price}</p>}
              </div>

              <div className="form-group">
                <label>Gia cu</label>
                <input
                  value={formatVND(form.oldPrice)}
                  onChange={(e) =>
                    setForm({ ...form, oldPrice: parseVND(e.target.value) })
                  }
                  className={errors.oldPrice ? "error-input" : ""}
                />
                {errors.oldPrice && (
                  <p className="error-text">{errors.oldPrice}</p>
                )}
              </div>
            </div>

            <h3>Chi tiet san pham</h3>
            <div className="detail-grid">
              {Object.entries(detailLabels).map(([k, label]) => (
                <div className="form-group" key={k}>
                  <label>{label}</label>
                  {k === "description" ? (
                    <textarea
                      name={k}
                      value={form.productDetail[k]}
                      onChange={handleDetailChange}
                      className={errors[`detail_${k}`] ? "error-input" : ""}
                      rows="4"
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
                    <p className="error-text">{errors[`detail_${k}`]}</p>
                  )}
                </div>
              ))}
            </div>

            <h3>Mau sac va ton kho</h3>

            <div className="color-table">
              <div className="color-header">
                <span>Anh</span>
                <span>Ten mau</span>
                <span>So luong</span>
                <span>Upload</span>
              </div>

              {form.colors.map((c, i) => (
                <div className="color-row" key={i}>
                  <div className="color-preview">
                    {uploadingIndex === i ? (
                      <p>Uploading...</p>
                    ) : c.image ? (
                      <img src={`http://localhost:8080${c.image}`} alt="color" />
                    ) : (
                      <div className="no-image">No image</div>
                    )}
                  </div>

                  <div>
                    <input
                      name="colorName"
                      placeholder="Ten mau"
                      value={c.colorName}
                      onChange={(e) => handleColorChange(i, e)}
                      className={errors[`colorName_${i}`] ? "error-input" : ""}
                    />
                    {errors[`colorName_${i}`] && (
                      <p className="error-text">{errors[`colorName_${i}`]}</p>
                    )}
                  </div>

                  <input
                    type="number"
                    name="quantity"
                    placeholder="SL"
                    value={c.quantity}
                    onChange={(e) => handleColorChange(i, e)}
                    className={errors[`quantity_${i}`] ? "error-input" : ""}
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleColorImageChange(i, e.target.files[0])
                    }
                    disabled={uploadingIndex === i}
                  />
                  {errors[`image_${i}`] && (
                    <p className="error-text">{errors[`image_${i}`]}</p>
                  )}
                </div>
              ))}
            </div>

            <button className="btn-add" onClick={addColor}>
              Them mau
            </button>

            <br />
            <br />
            <button
              className="btn-save"
              onClick={submit}
              disabled={submitting || uploadingIndex !== -1}
            >
              {submitting
                ? "Dang luu..."
                : uploadingIndex !== -1
                ? "Dang upload..."
                : "Luu thay doi"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const formatVND = (v) => (v ? Number(v).toLocaleString("vi-VN") : "");
const parseVND = (v) => v.replace(/\D/g, "");

export default ProductUpdate;
