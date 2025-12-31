import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ProductUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    axios.get(`http://localhost:8080/api/products/${id}`).then((res) => {
      const p = res.data;

      setForm({
        name: p.name || "",
        brand: p.brand || "",
        price: p.price || "",
        oldPrice: p.oldPrice || "",
        rating: p.rating || "",
        soldQuantity: p.soldQuantity || "",
        categoryName: p.category?.name || "",
        productDetail: p.productDetail || {},
        colors:
          p.colors?.map((c) => ({
            colorName: c.colorName,
            image: c.image,
            imageFile: null,
            quantity: c.quantity,
          })) || [],
      });
    });
  }, [id]);

  /* ================= HANDLERS ================= */
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

  /* ======= CHẶN TRÙNG MÀU KHI GÕ ======= */
  const handleColorChange = (index, e) => {
    if (e.target.name === "colorName") {
      const value = e.target.value.trim().toLowerCase();
      const exists = form.colors.some(
        (c, i) =>
          i !== index &&
          c.colorName?.trim().toLowerCase() === value
      );

      if (exists) {
        alert("❌ Màu này đã tồn tại");
        return;
      }
    }

    const colors = [...form.colors];
    colors[index][e.target.name] = e.target.value;
    setForm({ ...form, colors });
  };

  /* ================= ADD COLOR ================= */
  const addColor = () => {
    setForm({
      ...form,
      colors: [
        ...form.colors,
        {
          colorName: "",
          image: "",
          imageFile: null,
          quantity: 0,
        },
      ],
    });
  };

  /* ================= UPLOAD IMAGE ================= */
  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await axios.post(
      "http://localhost:8080/api/uploads/products",
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return res.data; // "/uploads/products/xxx.png"
  };

  const handleColorImageChange = async (index, file) => {
    if (!file) return;

    const colors = [...form.colors];
    colors[index].imageFile = file;
    setForm({ ...form, colors });

    try {
      const path = await uploadImage(file);
      colors[index].image = path;
      setForm({ ...form, colors });
    } catch {
      alert("❌ Upload ảnh thất bại");
    }
  };

  /* ======= CHECK TRÙNG MÀU TRƯỚC SUBMIT ======= */
  const hasDuplicateColors = () => {
    const names = form.colors
      .map((c) => c.colorName?.trim().toLowerCase())
      .filter(Boolean);

    return new Set(names).size !== names.length;
  };

  /* ================= SUBMIT ================= */
  const submit = async () => {
    if (hasDuplicateColors()) {
      alert("❌ Không được trùng màu");
      return;
    }

    for (const c of form.colors) {
      if (!c.colorName || !c.image) {
        alert("❌ Mỗi màu phải có tên và ảnh");
        return;
      }
    }

    try {
      await axios.put(`http://localhost:8080/api/products/${id}`, {
        ...form,
        price: Number(form.price),
        oldPrice: Number(form.oldPrice),
        rating: Number(form.rating),
        soldQuantity: Number(form.soldQuantity),
        colors: form.colors.map((c) => ({
          colorName: c.colorName,
          image: c.image,
          quantity: Number(c.quantity),
        })),
      });

      alert("✅ Cập nhật thành công");
      navigate("/products");
    } catch (err) {
      alert(err.response?.data || "❌ Lỗi khi cập nhật");
    }
  };

  /* ================= UI ================= */
  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <h2>✏️ Cập nhật sản phẩm</h2>

      <input name="name" value={form.name} onChange={handleChange} placeholder="Tên" />
      <input name="brand" value={form.brand} onChange={handleChange} placeholder="Hãng" />
      <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Giá" />
      <input name="oldPrice" type="number" value={form.oldPrice} onChange={handleChange} placeholder="Giá cũ" />
      <input name="categoryName" value={form.categoryName} onChange={handleChange} placeholder="Danh mục" />

      <h3>Chi tiết</h3>
      {Object.entries(form.productDetail).map(([k, v]) => (
        <input
          key={k}
          name={k}
          value={v || ""}
          placeholder={k}
          onChange={handleDetailChange}
        />
      ))}

      <h3>Màu sắc</h3>
      {form.colors.map((c, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <input
            name="colorName"
            value={c.colorName || ""}
            placeholder="Tên màu"
            onChange={(e) => handleColorChange(i, e)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleColorImageChange(i, e.target.files[0])}
          />

          {(c.imageFile || c.image) && (
            <img
              src={
                c.imageFile
                  ? URL.createObjectURL(c.imageFile)
                  : `http://localhost:8080${c.image}`
              }
              alt="preview"
              style={{ width: 60, height: 60, objectFit: "cover" }}
            />
          )}

          <input
            name="quantity"
            type="number"
            value={c.quantity}
            onChange={(e) => handleColorChange(i, e)}
            placeholder="Số lượng"
          />
        </div>
      ))}

      <button onClick={addColor}>➕ Thêm màu</button>
      <br /><br />
      <button onClick={submit}>💾 Lưu</button>
    </div>
  );
};

export default ProductUpdate;
