import React, { useEffect, useState } from "react";
import { deleteNews, getAllNews } from "../../api/News/newsApi";
import { Link } from "react-router-dom";

const NewsList = () => {
  const [news, setNews] = useState([]);

  const loadData = async () => {
    try {
      const res = await getAllNews();
      setNews(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Xóa bài viết?")) {
      try {
        await deleteNews(id);
        loadData();
      } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Quản lý Tin Tức</h2>

      <Link to="/admin/news/create" className="btn btn-primary mb-3">
        Thêm bài viết
      </Link>

      <table className="table table-bordered align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Tiêu đề</th>
            <th width="180">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {news.map((n) => (
            <tr key={n.id}>
              <td>{n.id}</td>
             <td>
  {n.thumbnail && (
    <img
      src={`http://localhost:8080/uploads/news/${n.thumbnail}`}
      alt={n.title}
      width={200}
    />
  )}
</td>

              <td>{n.title}</td>
              <td>
                <Link
                  to={`/news/edit/${n.id}`}
                  className="btn btn-warning btn-sm me-2"
                >
                  Sửa
                </Link>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="btn btn-danger btn-sm"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewsList;
