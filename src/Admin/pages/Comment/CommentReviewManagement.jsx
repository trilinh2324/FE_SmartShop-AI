import { useState, useEffect } from "react";

// ─── Mock Data (thay bằng API call thực tế) ───────────────────────────────────
const MOCK_COMMENTS = [
  { id: 1, user: "Nguyễn Văn An", avatar: "NV", productName: "iPhone 15 Pro Max", productId: 3, content: "Sản phẩm đóng gói rất cẩn thận, giao hàng đúng hạn. Tuy nhiên tôi muốn hỏi thêm về chính sách bảo hành ạ?", createdAt: "2026-04-03T08:30:00", adminReply: null, isPublished: true },
  { id: 2, user: "Trần Thị Bích", avatar: "TB", productName: "Samsung Galaxy S24", productId: 2, content: "Điện thoại dùng ổn nhưng pin hơi yếu so với quảng cáo, mong shop kiểm tra lại.", createdAt: "2026-04-02T14:20:00", adminReply: "Chào bạn! Shop đã ghi nhận phản hồi và sẽ liên hệ bộ phận kỹ thuật kiểm tra. Cảm ơn bạn đã phản hồi nhé!", isPublished: true },
  { id: 3, user: "Lê Quốc Cường", avatar: "LC", productName: "MacBook Air M3", productId: 5, content: "Mình muốn biết laptop này có hỗ trợ xuất màn hình 4K không ạ? Mình cần dùng cho công việc thiết kế.", createdAt: "2026-04-02T09:10:00", adminReply: null, isPublished: true },
  { id: 4, user: "Phạm Hồng Diệu", avatar: "PD", productName: "AirPods Pro 2", productId: 4, content: "Tai nghe chống ồn rất tốt, âm thanh trong trẻo. Shop đóng gói đẹp và cẩn thận lắm ạ!", createdAt: "2026-04-01T16:45:00", adminReply: "Cảm ơn bạn đã tin tưởng và để lại bình luận tích cực! Chúc bạn trải nghiệm vui vẻ nhé.", isPublished: true },
  { id: 5, user: "Hoàng Minh Đức", avatar: "HĐ", productName: "iPad Pro 13\"", productId: 6, content: "Sản phẩm nhận được bị xước nhẹ ở góc, mình không biết là do vận chuyển hay do kho hàng.", createdAt: "2026-03-31T11:00:00", adminReply: null, isPublished: true },
  { id: 6, user: "Vũ Thanh Hà", avatar: "VH", productName: "Apple Watch Ultra 2", productId: 7, content: "Đồng hồ đẹp lắm, nhưng dây đeo hơi cứng so với bản Series thường ạ. Có cách nào thay dây mềm hơn không?", createdAt: "2026-03-30T10:20:00", adminReply: null, isPublished: true },
];

const MOCK_REVIEWS = [
  { id: 1, user: "Nguyễn Thu Hương", avatar: "NH", productName: "iPhone 15 Pro Max", productId: 3, rating: 5, reviewTitle: "Xuất sắc, đáng tiền!", reviewContent: "Mình đã dùng được 2 tuần và thực sự ấn tượng. Camera chụp đêm cực kỳ sắc nét, hiệu năng mạnh mẽ không giật lag. Rất đáng để đầu tư!", createdAt: "2026-04-03T07:15:00", adminReply: null, isPublished: true },
  { id: 2, user: "Bùi Văn Khánh", avatar: "BK", productName: "Samsung Galaxy S24", productId: 2, rating: 4, reviewTitle: "Tốt nhưng còn một số điểm cần cải thiện", reviewContent: "Camera đẹp, màn hình sắc nét. Tuy nhiên pin không được như kỳ vọng và máy hơi nóng khi chơi game nặng.", createdAt: "2026-04-02T13:00:00", adminReply: "Cảm ơn bạn đã đánh giá chi tiết! Chúng tôi sẽ chuyển phản hồi về pin đến bộ phận liên quan để cải thiện.", isPublished: true },
  { id: 3, user: "Đinh Lan Phương", avatar: "ĐP", productName: "MacBook Air M3", productId: 5, rating: 5, reviewTitle: "Mỏng nhẹ, hiệu năng đỉnh của chóp", reviewContent: "Dùng cho công việc thiết kế đồ họa, render nhanh hơn hẳn Intel. Pin trâu, dùng cả ngày không hết. Rất hài lòng!", createdAt: "2026-04-01T20:30:00", adminReply: null, isPublished: true },
  { id: 4, user: "Trương Quang Minh", avatar: "TM", productName: "AirPods Pro 2", productId: 4, rating: 3, reviewTitle: "Ổn nhưng giá hơi cao so với thực tế", reviewContent: "Chất âm thanh tốt, chống ồn hiệu quả. Nhưng với mức giá này mình kỳ vọng nhiều hơn về độ bền dài hạn.", createdAt: "2026-03-31T08:45:00", adminReply: null, isPublished: true },
  { id: 5, user: "Ngô Thị Nhung", avatar: "NN", productName: "iPad Pro 13\"", productId: 6, rating: 5, reviewTitle: "Perfect tablet for creative work", reviewContent: "Màn hình Liquid Retina XDR cực đẹp. Dùng với Apple Pencil để vẽ thì không có gì sánh được. Xứng đáng 5 sao!", createdAt: "2026-03-30T15:10:00", adminReply: "Cảm ơn bạn rất nhiều vì đánh giá 5 sao! Chúc bạn luôn có những trải nghiệm tuyệt vời nhé!", isPublished: true },
  { id: 6, user: "Lý Hoàng Long", avatar: "LL", productName: "Apple Watch Ultra 2", productId: 7, rating: 2, reviewTitle: "Thất vọng về dịch vụ giao hàng", reviewContent: "Sản phẩm ổn nhưng giao hàng chậm hơn dự kiến 3 ngày, hộp bị móp một góc. Mong shop cải thiện khâu đóng gói.", createdAt: "2026-03-29T12:00:00", adminReply: null, isPublished: true },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const avatarColors = [
  { bg: "#fde8e8", color: "#c0392b" },
  { bg: "#e8f4fd", color: "#1a6fa8" },
  { bg: "#e8fdf0", color: "#1a8a4a" },
  { bg: "#fdf5e8", color: "#a87c1a" },
  { bg: "#f0e8fd", color: "#6b2fa8" },
  { bg: "#fde8f5", color: "#a82f7c" },
];
function getAvatarColor(str) {
  return avatarColors[str.charCodeAt(0) % avatarColors.length];
}
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function Stars({ rating, size = 14 }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ fontSize: size, color: i <= rating ? "#f59e0b" : "#d1d5db" }}>★</span>
      ))}
    </span>
  );
}
function RatingBadge({ rating }) {
  const colors = { 5: ["#d1fae5", "#065f46"], 4: ["#dbeafe", "#1e3a5f"], 3: ["#fef3c7", "#78350f"], 2: ["#ffedd5", "#7c2d12"], 1: ["#fee2e2", "#7f1d1d"] };
  const [bg, fg] = colors[rating] || colors[3];
  return <span style={{ background: bg, color: fg, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20 }}>{rating} ★</span>;
}

// ─── Reply Modal ──────────────────────────────────────────────────────────────
function ReplyModal({ item, type, onClose, onSave }) {
  const [text, setText] = useState(item.adminReply || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!text.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600)); // Simulate API
    // API call thực tế:
    // await fetch(`/api/${type === "comment" ? "comments" : "reviews"}/${item.id}/reply`, {
    //   method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    //   body: JSON.stringify(text)
    // });
    onSave(item.id, text);
    setSaving(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1a2035", margin: 0 }}>
              {item.adminReply ? "Sửa phản hồi" : "Trả lời"} {type === "comment" ? "bình luận" : "đánh giá"}
            </h3>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>#{item.id} · {item.user} · {item.productName}</p>
          </div>
          <button onClick={onClose} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, color: "#6b7280", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        {/* Original content */}
        <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px 16px", marginBottom: 16, borderLeft: "3px solid #e5e7eb" }}>
          {type === "review" && item.rating && (
            <div style={{ marginBottom: 6 }}><Stars rating={item.rating} /></div>
          )}
          {type === "review" && item.reviewTitle && (
            <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: "0 0 4px" }}>{item.reviewTitle}</p>
          )}
          <p style={{ fontSize: 13, color: "#4b5563", margin: 0, lineHeight: 1.6 }}>
            {type === "comment" ? item.content : item.reviewContent}
          </p>
        </div>

        {/* Existing reply */}
        {item.adminReply && (
          <div style={{ background: "#fff7ed", borderRadius: 10, padding: "10px 14px", marginBottom: 16, borderLeft: "3px solid #f97316" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#c2410c", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>Phản hồi hiện tại</p>
            <p style={{ fontSize: 13, color: "#431407", margin: 0, lineHeight: 1.5 }}>{item.adminReply}</p>
          </div>
        )}

        {/* Reply textarea */}
        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Nội dung phản hồi *</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Nhập phản hồi của admin..."
          style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, color: "#1f2937", resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box", transition: "border-color .2s" }}
          onFocus={(e) => (e.target.style.borderColor = "#e53935")}
          onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
        />
        <p style={{ fontSize: 12, color: text.length > 500 ? "#e53935" : "#9ca3af", textAlign: "right", margin: "4px 0 16px" }}>{text.length}/500</p>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", color: "#4b5563", fontSize: 14, cursor: "pointer", fontWeight: 500 }}>
            Huỷ
          </button>
          <button
            onClick={handleSave}
            disabled={!text.trim() || saving}
            style={{ padding: "9px 24px", borderRadius: 10, border: "none", background: !text.trim() || saving ? "#f87171" : "#e53935", color: "#fff", fontSize: 14, cursor: !text.trim() || saving ? "not-allowed" : "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 8, transition: "background .2s" }}
          >
            {saving && <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin .6s linear infinite" }} />}
            {saving ? "Đang gửi..." : "Gửi phản hồi"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteModal({ item, type, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  const handleConfirm = async () => {
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 500));
    onConfirm(item.id);
    setDeleting(false);
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 420, padding: 28, textAlign: "center" }}>
        <div style={{ width: 52, height: 52, background: "#fee2e2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24 }}>🗑️</div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1a2035", margin: "0 0 8px" }}>Xác nhận xoá</h3>
        <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 6px" }}>
          Xoá {type === "comment" ? "bình luận" : "đánh giá"} của <strong>{item.user}</strong>?
        </p>
        <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 24px" }}>Hành động này không thể hoàn tác.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 14, cursor: "pointer", fontWeight: 500 }}>Huỷ</button>
          <button onClick={handleConfirm} disabled={deleting} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "#e53935", color: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 600 }}>
            {deleting ? "Đang xoá..." : "Xoá"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Item Card ────────────────────────────────────────────────────────────────
function ItemCard({ item, type, onReply, onDelete }) {
  const av = getAvatarColor(item.user);
  const hasReply = !!item.adminReply;
  const content = type === "comment" ? item.content : item.reviewContent;

  return (
    <div style={{ background: "#fff", border: "1.5px solid #f0f0f0", borderRadius: 14, padding: "18px 20px", transition: "box-shadow .2s, border-color .2s" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#fecaca"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(229,57,53,.06)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#f0f0f0"; e.currentTarget.style.boxShadow = "none"; }}>

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: av.bg, color: av.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
          {item.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1a2035" }}>{item.user}</span>
            {type === "review" && <RatingBadge rating={item.rating} />}
            <span style={{ background: hasReply ? "#d1fae5" : "#fef3c7", color: hasReply ? "#065f46" : "#78350f", fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20 }}>
              {hasReply ? "✓ Đã trả lời" : "⏳ Chờ phản hồi"}
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 3, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>{formatDate(item.createdAt)}</span>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>·</span>
            <span style={{ fontSize: 12, color: "#e53935", fontWeight: 500 }}>{item.productName}</span>
          </div>
        </div>
        {/* Actions */}
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={() => onReply(item)}
            style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e53935", background: hasReply ? "#fff" : "#e53935", color: hasReply ? "#e53935" : "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s" }}
            onMouseEnter={(e) => { if (hasReply) { e.currentTarget.style.background = "#e53935"; e.currentTarget.style.color = "#fff"; } }}
            onMouseLeave={(e) => { if (hasReply) { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#e53935"; } }}>
            {hasReply ? "✏️ Sửa" : "↩ Trả lời"}
          </button>
          <button onClick={() => onDelete(item)}
            style={{ padding: "7px 12px", borderRadius: 8, border: "1.5px solid #fee2e2", background: "#fff", color: "#e53935", fontSize: 13, cursor: "pointer", transition: "all .15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#fee2e2"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}>
            🗑️
          </button>
        </div>
      </div>

      {/* Review title */}
      {type === "review" && item.reviewTitle && (
        <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "0 0 6px" }}>{item.reviewTitle}</p>
      )}

      {/* Content */}
      <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.65, margin: "0 0 12px", paddingLeft: 52 }}>{content}</p>

      {/* Admin reply */}
      {hasReply && (
        <div style={{ marginLeft: 52, background: "#fff7ed", borderRadius: 10, padding: "10px 14px", borderLeft: "3px solid #f97316" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#c2410c", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>↳ Phản hồi Admin</p>
          <p style={{ fontSize: 13, color: "#431407", margin: 0, lineHeight: 1.55 }}>{item.adminReply}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CommentReviewManagement() {
  const [activeTab, setActiveTab] = useState("comments");
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [replyTarget, setReplyTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  useEffect(() => { setPage(1); }, [activeTab, search, filterStatus, filterRating]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const data = activeTab === "comments" ? comments : reviews;

  const filtered = data.filter((item) => {
    const hasReply = !!item.adminReply;
    if (filterStatus === "pending" && hasReply) return false;
    if (filterStatus === "replied" && !hasReply) return false;
    if (activeTab === "reviews" && filterRating !== "all" && item.rating !== parseInt(filterRating)) return false;
    if (search) {
      const q = search.toLowerCase();
      const searchable = [item.user, activeTab === "comment" ? item.content : item.reviewContent, item.productName].join(" ").toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Stats
  const pendingComments = comments.filter((c) => !c.adminReply).length;
  const pendingReviews = reviews.filter((r) => !r.adminReply).length;
  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : "0.0";

  const handleReplySave = (id, text) => {
    if (activeTab === "comments") {
      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, adminReply: text } : c)));
    } else {
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, adminReply: text } : r)));
    }
    setReplyTarget(null);
    showToast("Phản hồi đã được gửi thành công!");
  };

  const handleDeleteConfirm = (id) => {
    if (activeTab === "comments") {
      setComments((prev) => prev.filter((c) => c.id !== id));
    } else {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
    setDeleteTarget(null);
    showToast("Đã xoá thành công!", "error");
  };

  const inputStyle = {
    padding: "9px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb",
    fontSize: 13, color: "#1f2937", background: "#fff", outline: "none",
    fontFamily: "inherit", transition: "border-color .2s"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", fontFamily: "'Be Vietnam Pro', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background:#f1f1f1; }
        ::-webkit-scrollbar-thumb { background:#ccc; border-radius:3px; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Sidebar */}
      <div style={{ position: "fixed", left: 0, top: 0, width: 210, height: "100vh", background: "#1a2035", display: "flex", flexDirection: "column", zIndex: 100 }}>
        <div style={{ padding: "24px 20px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
            <div style={{ width: 8, height: 32, background: "#e53935", borderRadius: 4 }} />
            <span style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "0.05em" }}>SMARTSHOP</span>
          </div>
          {[
            { icon: "📊", label: "Dashboard", active: false },
            { icon: "📦", label: "Sản phẩm", active: false },
            { icon: "🗂️", label: "Danh mục", active: false },
            { icon: "📰", label: "Tin tức", active: false },
            { icon: "🛒", label: "Đơn hàng", active: false },
            { icon: "👥", label: "Người dùng", active: false },
            { icon: "💬", label: "Bình luận & Đánh giá", active: true },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, marginBottom: 4, background: item.active ? "#e53935" : "transparent", cursor: "pointer", transition: "background .15s" }}
              onMouseEnter={(e) => { if (!item.active) e.currentTarget.style.background = "rgba(255,255,255,.07)"; }}
              onMouseLeave={(e) => { if (!item.active) e.currentTarget.style.background = "transparent"; }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ fontSize: 13, color: item.active ? "#fff" : "#94a3b8", fontWeight: item.active ? 600 : 400 }}>{item.label}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.07)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            <span style={{ fontSize: 16 }}>🚪</span>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>Đăng xuất</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: 210, padding: "28px 32px", animation: "fadeIn .3s ease" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 4, height: 22, background: "#e53935", borderRadius: 2 }} />
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a2035", margin: 0 }}>Bình luận & Đánh giá</h1>
            </div>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0, paddingLeft: 12 }}>Quản lý và phản hồi bình luận, đánh giá sản phẩm</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {(pendingComments + pendingReviews) > 0 && (
              <div style={{ background: "#fee2e2", color: "#c0392b", fontSize: 13, fontWeight: 600, padding: "6px 14px", borderRadius: 20 }}>
                {pendingComments + pendingReviews} chờ phản hồi
              </div>
            )}
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#e53935", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700 }}>A</div>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Tổng bình luận", value: comments.length, icon: "💬", accent: "#3b82f6" },
            { label: "Chờ trả lời (BL)", value: pendingComments, icon: "⏳", accent: "#f59e0b" },
            { label: "Tổng đánh giá", value: reviews.length, icon: "⭐", accent: "#8b5cf6" },
            { label: "Chờ trả lời (ĐG)", value: pendingReviews, icon: "📝", accent: "#e53935" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1.5px solid #f0f0f0", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: s.accent + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{s.icon}</div>
              <div>
                <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 3px" }}>{s.label}</p>
                <p style={{ fontSize: 24, fontWeight: 700, color: s.value > 0 && s.label.includes("Chờ") ? s.accent : "#1a2035", margin: 0 }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Card container */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #f0f0f0", overflow: "hidden" }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1.5px solid #f0f0f0", padding: "0 20px" }}>
            {[
              { key: "comments", label: "💬 Bình luận", count: comments.length, pending: pendingComments },
              { key: "reviews", label: "⭐ Đánh giá", count: reviews.length, pending: pendingReviews },
            ].map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{ padding: "16px 20px", border: "none", background: "none", cursor: "pointer", fontSize: 14, fontWeight: activeTab === tab.key ? 700 : 500, color: activeTab === tab.key ? "#e53935" : "#6b7280", borderBottom: activeTab === tab.key ? "2px solid #e53935" : "2px solid transparent", marginBottom: -1.5, display: "flex", alignItems: "center", gap: 8, transition: "color .15s" }}>
                {tab.label}
                <span style={{ background: activeTab === tab.key ? "#fee2e2" : "#f3f4f6", color: activeTab === tab.key ? "#e53935" : "#6b7280", fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 20 }}>{tab.count}</span>
                {tab.pending > 0 && <span style={{ background: "#f59e0b", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 20 }}>{tab.pending}</span>}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div style={{ padding: "16px 20px", borderBottom: "1.5px solid #f0f0f0", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍  Tìm theo tên, nội dung, sản phẩm..."
              style={{ ...inputStyle, flex: 1, minWidth: 200 }}
              onFocus={(e) => (e.target.style.borderColor = "#e53935")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chưa trả lời</option>
              <option value="replied">Đã trả lời</option>
            </select>
            {activeTab === "reviews" && (
              <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="all">Tất cả sao</option>
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} sao</option>)}
              </select>
            )}
            <div style={{ marginLeft: "auto", fontSize: 13, color: "#9ca3af" }}>
              {filtered.length} kết quả
            </div>
          </div>

          {/* List */}
          <div style={{ padding: "16px 20px" }}>
            {paginated.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <p style={{ fontSize: 14 }}>Không có kết quả phù hợp.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "slideIn .2s ease" }}>
                {paginated.map((item) => (
                  <ItemCard key={item.id} item={item} type={activeTab === "comments" ? "comment" : "review"}
                    onReply={(i) => setReplyTarget(i)} onDelete={(i) => setDeleteTarget(i)} />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ padding: "12px 20px 20px", display: "flex", justifyContent: "center", gap: 6, borderTop: "1.5px solid #f0f0f0" }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                style={{ width: 34, height: 34, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1, fontSize: 14 }}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ width: 34, height: 34, borderRadius: 8, border: p === page ? "none" : "1.5px solid #e5e7eb", background: p === page ? "#e53935" : "#fff", color: p === page ? "#fff" : "#374151", cursor: "pointer", fontSize: 13, fontWeight: p === page ? 700 : 400 }}>{p}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ width: 34, height: 34, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1, fontSize: 14 }}>›</button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {replyTarget && (
        <ReplyModal item={replyTarget} type={activeTab === "comments" ? "comment" : "review"}
          onClose={() => setReplyTarget(null)} onSave={handleReplySave} />
      )}
      {deleteTarget && (
        <DeleteModal item={deleteTarget} type={activeTab === "comments" ? "comment" : "review"}
          onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteConfirm} />
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: toast.type === "error" ? "#1a2035" : "#16a34a", color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 14, fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,.2)", animation: "slideIn .25s ease", zIndex: 9999, display: "flex", alignItems: "center", gap: 8 }}>
          <span>{toast.type === "error" ? "🗑️" : "✅"}</span> {toast.msg}
        </div>
      )}
    </div>
  );
}
