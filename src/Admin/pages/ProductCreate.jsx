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

  // ================= LOAD PRODUCT =================
  useEffect(() => {
    axios.get(`http://localhost:8080/api/products/${id}`).then((res) => {
      const p = res.data;

      setForm({
        name: p.name || "",
        brand: p.brand || "",
        price: p.price || "",
        oldPrice: p.oldPrice || "",
        rating: p.rating || "",
        soldQuantity: p.soldQuantity || 0,
        categoryName: p.category?.name || "",
        productDetail: p.productDetail || {},
        colors:
          p.colors?.map((c) => ({
            colorName: c.colorName,
            image: c.image,       // "/uploads/products/xxx.png"
            imageFile: null,      // dùng cho preview khi đổi ảnh
            quantity: c.quantity,
          })) || [],
      });
    });
  }, [id]);

  // ================= HANDLERS =================
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

  const handleColorChange = (index, e) => {
    const colors = [...form.colors];
    colors[index][e.target.name] = e.target.value;
    setForm({ ...form, colors });
  };

  // ================= ADD COLOR (GIỐNG CREATE) =================
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

  // ================= UPLOAD IMAGE =================
  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await axios.post(
      "http://localhost:8080/api/uploads/products",
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    // backend trả: /uploads/products/xxx.png
    return res.data;
  };

  // ================= HANDLE IMAGE =================
  const handleColorImageChange = async (index, file) => {
    if (!file) return;

    const colors = [...form.colors];

    // preview
    colors[index].imageFile = file;
    setForm((prev) => ({ ...prev, colors }));

    try {
      const imagePath = await uploadImage(file);
      colors[index].image = imagePath;

      setForm((prev) => ({ ...prev, colors }));
    } catch (err) {
      alert("❌ Upload ảnh thất bại");
      console.error(err);
    }
  };

  // ================= SUBMIT =================
  const submit = async () => {
    // ✅ VALIDATE GIỐNG CREATE
    for (const c of form.colors) {
      if (!c.colorName || !c.image) {
        alert("❌ Mỗi màu phải có tên và ảnh");
        return;
      }
    }

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
  };

  // ================= UI =================
  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <h2>✏️ Cập nhật sản phẩm</h2>

      <input name="name" value={form.name} placeholder="Tên" onChange={handleChange} />
      <input name="brand" value={form.brand} placeholder="Hãng" onChange={handleChange} />
      <input name="price" type="number" value={form.price} placeholder="Giá" onChange={handleChange} />
      <input name="oldPrice" type="number" value={form.oldPrice} placeholder="Giá cũ" onChange={handleChange} />
      <input name="categoryName" value={form.categoryName} placeholder="Danh mục" onChange={handleChange} />

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
        <div
          key={i}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <input
            name="colorName"
            value={c.colorName}
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
            placeholder="Số lượng"
            onChange={(e) => handleColorChange(i, e)}
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
