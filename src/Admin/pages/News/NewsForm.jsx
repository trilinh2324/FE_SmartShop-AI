import React, { useEffect, useState } from "react";
import { createNews, getNewsById, updateNews } from "../../api/News/newsApi";
import { useNavigate, useParams } from "react-router-dom";

const NewsForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null); // để hiển thị ảnh preview

  const { id } = useParams();
  const navigate = useNavigate();

  // Load data khi edit
  useEffect(() => {
    if (id) {
      getNewsById(id).then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
        if (res.data.thumbnail) {
          setPreview(`http://localhost:8080/uploads/news/${res.data.thumbnail}`);
        }
      });
    }
  }, [id]);

  // Handle chọn file
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // hiển thị preview ảnh
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify({ title, content })], { type: "application/json" })
    );

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      if (id) {
        await updateNews(id, formData);
      } else {
        await createNews(formData);
      }
      navigate("/news");
    } catch (error) {
      console.error("Lỗi khi lưu bài viết:", error);
      alert("Lỗi khi lưu bài viết. Kiểm tra console.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Cập nhật" : "Thêm"} bài viết</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Tiêu đề</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Ảnh thumbnail</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleThumbnailChange}
          />
          {preview && (
            <div className="mt-2">
              <img src={preview} alt="Preview" width={150} />
            </div>
          )}
        </div>

        <div className="mb-3">
          <label>Nội dung</label>
          <textarea
            className="form-control"
            rows="6"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <button className="btn btn-success">{id ? "Cập nhật" : "Thêm"}</button>
      </form>
    </div>
  );
};

export default NewsForm;
