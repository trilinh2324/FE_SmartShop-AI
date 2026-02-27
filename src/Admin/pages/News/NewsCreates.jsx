import React, { useEffect, useState } from "react";
import { createNews, getNewsById, updateNews } from "../../api/News/newsApi";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import "../../css/NewsForm.css";

const NewsForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  // Load khi edit
  useEffect(() => {
    if (id) {
      getNewsById(id)
        .then((res) => {
          setTitle(res.data.title);
          setContent(res.data.content);

          if (res.data.thumbnail) {
            setPreview(
              `http://localhost:8080/uploads/news/${res.data.thumbnail}`
            );
          }
        })
        .catch((err) => {
          console.error("Lỗi load tin tức:", err);
        });
    }
  }, [id]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Vui lòng nhập tiêu đề");
      return;
    }

    const formData = new FormData();

    formData.append(
      "data",
      new Blob([JSON.stringify({ title, content })], {
        type: "application/json",
      })
    );

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      if (id) {
        await updateNews(id, formData);
        alert("Cập nhật thành công");
      } else {
        await createNews(formData);
        alert("Thêm mới thành công");
      }

      navigate("/admin/newslist");
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("Lưu thất bại. Kiểm tra backend.");
    }
  };

  return (
    <div className="news-wrapper">
      <div className="news-card">
        {/* Header */}
        <div className="news-header">
          <button
            className="back-btn"
            onClick={() => navigate("/admin/newslist")}
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>

          <h2>{id ? "Cập nhật bài viết" : "Thêm bài viết"}</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="news-form">
          <div className="form-group">
            <label>Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài viết..."
              required
            />
          </div>

          <div className="form-group">
            <label>Ảnh thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
            />

            {preview && (
              <div className="preview-box">
                <img src={preview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Nội dung</label>
            <textarea
              rows="6"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung bài viết..."
            />
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/admin/newslist")}
            >
              Hủy
            </button>

            <button type="submit" className="save-btn">
              <Save size={18} />
              {id ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsForm;