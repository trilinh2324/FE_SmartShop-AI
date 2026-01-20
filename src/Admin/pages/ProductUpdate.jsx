import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../css/ProductUpdate.css";

const ProductUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    oldPrice: "",
    rating: "",
    soldQuantity: "",
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

  /* ================= LOAD CATEGORY ================= */
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories")
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${id}`)
      .then((res) => {
        const p = res.data;
        setForm({
          name: p.name || "",
          brand: p.brand || "",
          price: p.price ? String(p.price) : "",
          oldPrice: p.oldPrice ? String(p.oldPrice) : "",
          rating: p.rating || "",
          soldQuantity: p.soldQuantity || "",
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
      })
      .catch(() => alert("❌ Không tìm thấy sản phẩm"));
  }, [id]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setErrors({ ...errors, [e.target.name]: null });
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDetailChange = (e) => {
    setErrors({ ...errors, [`detail_${e.target.name}`]: null });
    setForm({
      ...form,
      productDetail: {
        ...form.productDetail,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleColorChange = (i, e) => {
    const colors = [...form.colors];
    colors[i][e.target.name] = e.target.value;
    setForm({ ...form, colors });
  };

  const addColor = () =>
    setForm({
      ...form,
      colors: [...form.colors, { colorName: "", quantity: 0, image: "" }],
    });

  /* ================= IMAGE UPLOAD ================= */
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
    const path = await uploadImage(file);
    const colors = [...form.colors];
    colors[i].image = path;
    setForm({ ...form, colors });
  };

  /* ================= VALIDATE ================= */
  const validate = () => {
    let e = {};

    if (!form.name.trim()) e.name = "Tên sản phẩm không được để trống";
    if (!form.brand.trim()) e.brand = "Hãng không được để trống";
    if (!form.price) e.price = "Giá bán không hợp lệ";
    if (!form.oldPrice) e.oldPrice = "Giá cũ không hợp lệ";
    if (!form.categoryName) e.categoryName = "Chưa chọn danh mục";

    Object.entries(form.productDetail).forEach(([k, v]) => {
      if (!v.trim()) e[`detail_${k}`] = "Không được để trống";
    });

    if (form.colors.length === 0)
      e.colors = "Phải có ít nhất 1 màu";

    form.colors.forEach((c, i) => {
      if (!c.colorName)
        e[`colorName_${i}`] = "Chưa nhập tên màu";
      if (!c.image)
        e[`image_${i}`] = "Ảnh màu là bắt buộc";
      if (!c.quantity || c.quantity <= 0)
        e[`quantity_${i}`] = "Số lượng phải > 0";
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= SUBMIT ================= */
  const submit = async () => {
    if (!validate()) return;

    try {
      await axios.put(`http://localhost:8080/api/products/${id}`, {
        name: form.name,
        brand: form.brand,
        price: Number(form.price),
        oldPrice: Number(form.oldPrice),
        rating: Number(form.rating || 0),
        soldQuantity: Number(form.soldQuantity || 0),
        categoryName: form.categoryName, // ✅ CATEGORY

        productDetail: form.productDetail,
        colors: form.colors.map((c) => ({
          colorName: c.colorName,
          quantity: Number(c.quantity),
          image: c.image,
        })),
      });

      alert("✅ Cập nhật sản phẩm thành công");
      navigate("/products");
    } catch (err) {
      const msg = err.response?.data;
      if (typeof msg === "string" && msg.includes("Tên sản phẩm")) {
        setErrors({ name: msg });
      } else {
        alert("❌ Cập nhật thất bại");
      }
    }
  };

  /* ================= LABEL ================= */
  const detailLabels = {
    screen: "Màn hình",
    cpu: "CPU",
    gpu: "GPU",
    ram: "RAM",
    storage: "Bộ nhớ",
    camera: "Camera",
    battery: "Pin",
    os: "Hệ điều hành",
    weight: "Trọng lượng",
    description: "Mô tả",
  };

  return (
    <div className="admin-update">
      <div className="admin-card">
        <button className="btn-back" onClick={() => navigate("/products")}>
          <ArrowLeft size={18} /> Quay lại
        </button>

        <h2>✏️ Cập nhật sản phẩm</h2>

        {/* BASIC */}
        <div className="grid-2">
          <div className="form-group">
            <label>Tên sản phẩm</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? "error-input" : ""}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Hãng</label>
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              className={errors.brand ? "error-input" : ""}
            />
            {errors.brand && <p className="error-text">{errors.brand}</p>}
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

          <div className="form-group">
            <label>Giá bán</label>
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
            <label>Giá cũ</label>
            <input
              value={formatVND(form.oldPrice)}
              onChange={(e) =>
                setForm({ ...form, oldPrice: parseVND(e.target.value) })
              }
              className={errors.oldPrice ? "error-input" : ""}
            />
            {errors.oldPrice && <p className="error-text">{errors.oldPrice}</p>}
          </div>
        </div>

        {/* DETAIL */}
        <h3>Chi tiết sản phẩm</h3>
        <div className="detail-grid">
          {Object.entries(detailLabels).map(([k, label]) => (
            <div className="form-group" key={k}>
              <label>{label}</label>
              <input
                name={k}
                value={form.productDetail[k]}
                onChange={handleDetailChange}
                className={errors[`detail_${k}`] ? "error-input" : ""}
              />
              {errors[`detail_${k}`] && (
                <p className="error-text">{errors[`detail_${k}`]}</p>
              )}
            </div>
          ))}
        </div>

        {/* COLORS */}
<h3>Màu sắc & tồn kho</h3>

<div className="color-table">
  <div className="color-header">
    <span>Ảnh</span>
    <span>Tên màu</span>
    <span>Số lượng</span>
    <span>Upload</span>
  </div>

  {form.colors.map((c, i) => (
    <div className="color-row" key={i}>
      <div className="color-preview">
        {c.image ? (
          <img src={`http://localhost:8080${c.image}`} alt="color" />
        ) : (
          <div className="no-image">No image</div>
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
        placeholder="SL"
        value={c.quantity}
        onChange={(e) => handleColorChange(i, e)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleColorImageChange(i, e.target.files[0])}
      />
    </div>
  ))}
</div>

<button className="btn-add" onClick={addColor}>➕ Thêm màu</button>

        <br /><br />
        <button className="btn-save" onClick={submit}>💾 Lưu thay đổi</button>
      </div>
    </div>
  );
};

const formatVND = (v) => (v ? Number(v).toLocaleString("vi-VN") : "");
const parseVND = (v) => v.replace(/\D/g, "");

export default ProductUpdate;
