import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const loadProducts = async () => {
    const res = await axios.get("http://localhost:8080/api/products");
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm("Xoá sản phẩm này?")) return;
    await axios.delete(`http://localhost:8080/api/products/${id}`);
    loadProducts();
  };

  return (
    <div style={{ maxWidth: 1100, margin: "auto" }}>
      <h2>Danh sách sản phẩm</h2>

      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên</th>
            <th>Hãng</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p, index) => (
            <tr key={p.id}>
              <td>{index + 1}</td>
              <td>{p.name}</td>
              <td>{p.brand}</td>
              <td>{p.price?.toLocaleString()} ₫</td>
              <td>{p.category?.name || p.categoryName}</td>
              <td>
                <button onClick={() => navigate(`/products/detail/${p.id}`)}>
                  👁 Chi tiết
                </button>
                <button
                  style={{ marginLeft: 5 }}
                  onClick={() => navigate(`/products/update/${p.id}`)}
                >
                  ✏️ Sửa
                </button>
                <button
                  style={{ marginLeft: 5 }}
                  onClick={() => deleteProduct(p.id)}
                >
                  🗑 Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
