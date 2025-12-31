import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const [p, setP] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${id}`)
      .then((res) => setP(res.data))
      .catch(console.error);
  }, [id]);

  if (!p) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 1000, margin: "auto", padding: 20 }}>
      <h2>{p.name}</h2>

      <p><b>Hãng:</b> {p.brand}</p>
      <p><b>Giá:</b> {p.price?.toLocaleString()} ₫</p>
      <p><b>Danh mục:</b> {p.category?.name}</p>

      {/* PRODUCT DETAIL */}
      <h3>Thông số</h3>
      {p.productDetail &&
        Object.entries(p.productDetail).map(([k, v]) => (
          <p key={k}>
            <b>{k}:</b> {v}
          </p>
        ))}

      {/* COLORS */}
      <h3>Màu sắc</h3>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {p.colors?.map((c, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #ddd",
              padding: 10,
              width: 140,
              textAlign: "center",
              borderRadius: 6,
            }}
          >
            <p><b>{c.colorName}</b></p>

            {c.image ? (
              <img
                src={`http://localhost:8080${c.image}`}
                alt={c.colorName}
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
            ) : (
              <p style={{ color: "red" }}>Không có ảnh</p>
            )}

            <p>Số lượng: {c.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
