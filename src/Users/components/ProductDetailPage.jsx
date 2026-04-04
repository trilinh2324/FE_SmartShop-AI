import { useState, useEffect, useRef, useCallback } from "react";
import { formatPrice } from "../api/data";

const BASE_URL     = "http://localhost:8080/api/user/products";
const REVIEW_URL   = "http://localhost:8080/api/reviews";
const COMMENT_URL  = "http://localhost:8080/api/comments";

/* ── Helpers ───────────────────────────────────────────────────────── */
const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

/* ── Sub-components ────────────────────────────────────────────────── */
function StarSelector({ value, onChange, size = 28, disabled = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          onClick={() => !disabled && onChange(s)}
          onMouseEnter={() => !disabled && setHover(s)}
          onMouseLeave={() => !disabled && setHover(0)}
          style={{
            fontSize: size,
            cursor: disabled ? "default" : "pointer",
            color: s <= (hover || value) ? "#f59e0b" : "#2a2a2a",
            transition: "color .15s, transform .15s",
            transform: hover === s && !disabled ? "scale(1.25)" : "scale(1)",
            display: "inline-block",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

/* ── Merged Feedback Card (Review + Comment) ── */
function FeedbackCard({ item, isReview, onDelete, currentUserId, onMenuClick }) {
  const isOwner = item.userId && currentUserId && item.userId === currentUserId;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={{
        background: isOwner ? "linear-gradient(135deg,#0D0000,#0A0A0A)" : "#0A0A0A",
        border: `1px solid ${isOwner ? "rgba(232,0,13,.2)" : "#1a1a1a"}`,
        borderRadius: 5,
        padding: "18px 20px",
        marginBottom: 12,
        animation: "fadeIn .3s ease",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          {/* Avatar */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: isOwner
                ? "linear-gradient(135deg,#1a0000,#2d0005)"
                : "#111",
              border: `1px solid ${isOwner ? "#E8000D" : "#2a2a2a"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            {isReview ? "👤" : "💬"}
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 13, color: "#F0F0F0" }}>
                {item.userName || item.fullName || "Khách hàng"}
              </div>

              {isOwner && (
                <span
                  style={{
                    background: "rgba(232,0,13,.12)",
                    border: "1px solid rgba(232,0,13,.3)",
                    color: "#E8000D",
                    fontFamily: "'Orbitron',monospace",
                    fontSize: 7,
                    padding: "2px 8px",
                    borderRadius: 2,
                    letterSpacing: 1,
                  }}
                >
                  {isReview ? "ĐÁNH GIÁ CỦA BẠN" : "BÌNH LUẬN CỦA BẠN"}
                </span>
              )}

              {isReview && (
                <span
                  style={{
                    background: "rgba(34,197,94,.1)",
                    border: "1px solid rgba(34,197,94,.3)",
                    color: "#22c55e",
                    fontFamily: "'Orbitron',monospace",
                    fontSize: 7,
                    padding: "2px 8px",
                    borderRadius: 2,
                    letterSpacing: 1,
                  }}
                >
                  ✓ ĐÁNH GIÁ
                </span>
              )}
            </div>

            {/* Stars - chỉ review */}
            {isReview && (
              <div style={{ display: "flex", gap: 2, marginBottom: 3 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    style={{
                      color: s <= item.rating ? "#f59e0b" : "#2a2a2a",
                      fontSize: 13,
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            )}

            {/* Date */}
            <div
              style={{
                fontFamily: "'Orbitron',monospace",
                fontSize: 8,
                color: "#333",
              }}
            >
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                : ""}
            </div>
          </div>
        </div>

        {/* Menu 3 chấm */}
        {isOwner && (
          <div style={{ position: "relative" }} ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "none",
                border: "none",
                color: "#666",
                fontSize: 20,
                cursor: "pointer",
                padding: "0 4px",
                transition: "color .2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#E8000D")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#666")}
            >
              ⋮
            </button>

            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: 28,
                  right: 0,
                  background: "#0A0A0A",
                  border: "1px solid #E8000D",
                  borderRadius: 4,
                  overflow: "hidden",
                  zIndex: 100,
                  minWidth: 140,
                  boxShadow: "0 4px 16px rgba(232,0,13,.3)",
                }}
              >
                <button
                  onClick={() => {
                    onMenuClick("edit", item);
                    setMenuOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                    background: "none",
                    border: "none",
                    color: "#888",
                    padding: "10px 14px",
                    fontSize: 12,
                    fontFamily: "'Rajdhani',sans-serif",
                    cursor: "pointer",
                    borderBottom: "1px solid #1a1a1a",
                    transition: "all .2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(232,0,13,.08)";
                    e.currentTarget.style.color = "#E8000D";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "none";
                    e.currentTarget.style.color = "#888";
                  }}
                >
                  ✏️ Sửa
                </button>

                <button
                  onClick={() => {
                    onDelete(item.id);
                    setMenuOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                    background: "none",
                    border: "none",
                    color: "#E8000D",
                    padding: "10px 14px",
                    fontSize: 12,
                    fontFamily: "'Rajdhani',sans-serif",
                    cursor: "pointer",
                    transition: "all .2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "rgba(232,0,13,.12)")
                  }
                  onMouseOut={(e) => (e.currentTarget.style.background = "none")}
                >
                  🗑️ Xóa
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ fontSize: 13, color: "#888", lineHeight: 1.7, marginBottom: 10 }}>
        {item.content || item.reviewContent || item.comment || ""}
      </div>

      {/* Admin Reply - chỉ comment */}
      {!isReview && item.adminReply && (
        <div
          style={{
            marginTop: 10,
            padding: "10px 14px",
            background: "rgba(34,197,94,.08)",
            border: "1px solid rgba(34,197,94,.2)",
            borderRadius: 4,
          }}
        >
          <div
            style={{
              fontFamily: "'Orbitron',monospace",
              fontSize: 8,
              color: "#22c55e",
              letterSpacing: 1,
              marginBottom: 5,
            }}
          >
            ✓ SMARTSHOP PHẢN HỒI
          </div>
          <div style={{ fontSize: 12, color: "#22c55e", lineHeight: 1.6 }}>
            {item.adminReply}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main component ────────────────────────────────────────────────── */
export default function ProductDetailPage({
  productId,
  setActivePage = () => {},
  onAddCart = () => {},
}) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("specs");
  const [addedAnim, setAddedAnim] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [relatedProds, setRelatedProds] = useState([]);
  const imgRef = useRef(null);

  /* ── Merged feedback states ── */
  const [reviewSummary, setReviewSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [allFeedback, setAllFeedback] = useState([]);
  const [expandedFeedback, setExpandedFeedback] = useState(false);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  /* ── Form states ── */
  const [myRating, setMyRating] = useState(0);
  const [myContent, setMyContent] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("success");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [hasUserFeedback, setHasUserFeedback] = useState(false);

  /* ── Fetch product ── */
  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    fetch(`${BASE_URL}/${productId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Không tìm thấy sản phẩm");
        return r.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
        if (data.category?.name) {
          fetch(
            `${BASE_URL}/category/${encodeURIComponent(data.category.name)}`
          )
            .then((r) => r.json())
            .then((list) =>
              setRelatedProds(list.filter((p) => p.id !== data.id).slice(0, 4))
            )
            .catch(() => {});
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [productId]);

  /* ── Fetch all feedback ── */
  const fetchAllFeedback = useCallback(
    async (showAll = false) => {
      if (!productId) return;
      setFeedbackLoading(true);
      try {
        const [summaryRes, reviewsRes, commentsRes] = await Promise.all([
          fetch(`${REVIEW_URL}/summary/${productId}`),
          fetch(`${REVIEW_URL}/product/${productId}?page=0&size=100`),
          fetch(`${COMMENT_URL}/product/${productId}?page=0&size=100`),
        ]);

        // Fetch summary
        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          console.log("📊 Summary Data:", summaryData);
          setReviewSummary(summaryData);
        }

        let allItems = [];
        let totalReviewCount = 0;
        let totalCommentCount = 0;

        // Fetch reviews - CHỈ call .json() 1 lần
        if (reviewsRes.ok) {
          const reviewData = await reviewsRes.json();
          const reviewList = reviewData.content ?? reviewData;
          const reviewsWithType = (Array.isArray(reviewList) ? reviewList : []).map(
            (r) => ({ ...r, _type: "review" })
          );
          setReviews(reviewList);
          allItems.push(...reviewsWithType);
          
          // Get total count từ cùng reviewData - KHÔNG gọi .json() lần 2
          totalReviewCount = reviewData.totalElements ?? reviewList.length ?? 0;
          console.log("📝 Reviews:", { count: totalReviewCount, list: reviewList });
        }

        // Fetch comments - CHỈ call .json() 1 lần
        if (commentsRes.ok) {
          const commentData = await commentsRes.json();
          const commentList = commentData.comments ?? commentData.content ?? commentData;
          const commentsWithType = (Array.isArray(commentList) ? commentList : []).map(
            (c) => ({ ...c, _type: "comment" })
          );
          setComments(commentList);
          allItems.push(...commentsWithType);
          
          // Get total count từ cùng commentData - KHÔNG gọi .json() lần 2
          totalCommentCount = commentData.totalElements ?? 
                             commentData.totalComments ?? 
                             commentList.length ?? 0;
          console.log("💬 Comments:", { count: totalCommentCount, list: commentList });
        }

        // Sort by createdAt (newest first)
        allItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAllFeedback(allItems);

        setTotalFeedback(totalReviewCount + totalCommentCount);
      } catch (e) {
        console.error("❌ Fetch Feedback Error:", e);
      } finally {
        setFeedbackLoading(false);
      }
    },
    [productId]
  );

  useEffect(() => {
    if (tab === "reviews") {
      fetchAllFeedback();
      try {
        const token = getToken();
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setCurrentUserId(Number(payload.sub || payload.userId || payload.id));
        }
      } catch (_) {}
    }
  }, [tab, productId, fetchAllFeedback]);

  /* ── Check if user has feedback ── */
  useEffect(() => {
    if (!currentUserId) {
      setHasUserFeedback(false);
      return;
    }

    const userHasFeedback =
      allFeedback.some((item) => Number(item.userId) === Number(currentUserId));
    setHasUserFeedback(userHasFeedback);
  }, [allFeedback, currentUserId]);

  /* ── Submit feedback ── */
  const handleSubmitFeedback = async () => {
    if (!getToken()) {
      alert("Vui lòng đăng nhập!");
      return;
    }

    const isReview = myRating > 0;

    if (isReview && !myContent.trim()) {
      setFeedback("Vui lòng nhập nội dung đánh giá!");
      setFeedbackType("error");
      return;
    }

    if (!isReview && !myContent.trim()) {
      setFeedback("Vui lòng nhập nội dung bình luận!");
      setFeedbackType("error");
      return;
    }

    setSubmitLoading(true);
    setFeedback("");

    try {
      const baseUrl = isReview ? REVIEW_URL : COMMENT_URL;
      const url = editingItem ? `${baseUrl}/${editingItem.id}` : baseUrl;
      const method = editingItem ? "PUT" : "POST";

      const payload = isReview
        ? {
            productId: Number(productId),
            rating: myRating,
            reviewTitle: "",
            reviewContent: myContent.trim(),
          }
        : {
            productId: Number(productId),
            content: myContent.trim(),
            parentCommentId: null,
          };

      const res = await fetch(url, {
        method,
        headers: authHeader(),
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        alert("Phiên đăng nhập hết hạn!");
        return;
      }

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Gửi thất bại");
      }

      setMyRating(0);
      setMyContent("");
      setEditingItem(null);
      setFeedback(editingItem ? "✓ Cập nhật thành công!" : "✓ Gửi thành công!");
      setFeedbackType("success");
      setTimeout(() => {
        setFeedback("");
        fetchAllFeedback();
      }, 2000);
    } catch (e) {
      setFeedback(e.message || "Đã có lỗi xảy ra!");
      setFeedbackType("error");
    } finally {
      setSubmitLoading(false);
    }
  };

  /* ── Delete feedback ── */
  const handleDeleteFeedback = async (itemId, isReview) => {
    if (!window.confirm("Xoá không?")) return;
    try {
      const url = isReview ? `${REVIEW_URL}/${itemId}` : `${COMMENT_URL}/${itemId}`;
      await fetch(url, {
        method: "DELETE",
        headers: authHeader(),
      });
      fetchAllFeedback();
    } catch (e) {
      console.error(e);
    }
  };

  /* ── Handle menu click ── */
  const handleMenuClick = (action, item) => {
    if (action === "edit") {
      setEditingItem(item);
      setMyRating(item.rating || 0);
      setMyContent(item.content || item.reviewContent || item.comment || "");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /* ── Images ── */
  const images =
    product?.colors?.length > 0
      ? product.colors.map((c) =>
          c.image ? `http://localhost:8080${c.image}` : null
        )
      : product?.images?.length > 0
      ? product.images.map((img) => img.url || img)
      : [null];

  /* ── Zoom ── */
  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const { left, top, width, height } =
      imgRef.current.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100,
    });
  };

  /* ── Add to cart ── */
  const handleAddCart = async () => {
    if (!getToken()) {
      alert("Vui lòng đăng nhập!");
      return;
    }
    const selectedColor =
      product?.colors?.[activeImg] || product?.colors?.[0];
    const productColorId = selectedColor?.id;
    if (!productColorId) {
      alert("Sản phẩm chưa có màu!");
      return;
    }
    try {
      setCartLoading(true);
      const res = await fetch(
        `http://localhost:8080/api/user/cart/add?productColorId=${productColorId}&quantity=${qty}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      if (!res.ok) {
        if (res.status === 401) alert("Phiên đăng nhập đã hết hạn!");
        throw new Error("Thêm giỏ thất bại");
      }
      setAddedAnim(true);
      setTimeout(() => setAddedAnim(false), 1800);
    } catch (err) {
      console.error(err);
      alert("Thêm vào giỏ thất bại!");
    } finally {
      setCartLoading(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddCart();
    setActivePage("checkout");
  };

  const discount = product?.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  /* ── LOADING ── */
  if (loading)
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            border: "3px solid #1a1a1a",
            borderTop: "3px solid #E8000D",
            borderRadius: "50%",
            animation: "spin .8s linear infinite",
          }}
        />
        <div
          style={{
            fontFamily: "'Orbitron',monospace",
            fontSize: 10,
            color: "#333",
            letterSpacing: 3,
          }}
        >
          ĐANG TẢI...
        </div>
      </div>
    );

  /* ── ERROR ── */
  if (error)
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 52 }}>⚠️</div>
        <div
          style={{
            fontFamily: "'Orbitron',monospace",
            fontSize: 13,
            color: "#E8000D",
            letterSpacing: 2,
          }}
        >
          {error}
        </div>
        <button onClick={() => setActivePage("home")} style={btnOutline}>
          ← QUAY LẠI
        </button>
      </div>
    );

  if (!product) return null;

  const pd = product.productDetail || {};

  const specRows = [
    ["Màn hình", pd.screen],
    ["CPU / Chip", pd.cpu],
    ["GPU", pd.gpu],
    ["RAM", pd.ram],
    ["Bộ nhớ trong", pd.storage],
    ["Camera", pd.camera],
    ["Pin", pd.battery],
    ["Hệ điều hành", pd.os],
    ["Trọng lượng", pd.weight],
  ].filter(([, v]) => v);

  // ✅ FIX: Properly calculate ratingDist with fallback calculation
  let ratingDist = reviewSummary?.ratingDistribution ?? 
                   reviewSummary?.distribution ?? 
                   reviewSummary?.rating_distribution ?? 
                   {};

  // Nếu không có distribution data từ API, tính từ reviews array
  if (Object.values(ratingDist).every(v => !v) && reviews.length > 0) {
    ratingDist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const rating = Math.round(Number(r.rating) || 0);
      if (rating >= 1 && rating <= 5) {
        ratingDist[rating] = (ratingDist[rating] || 0) + 1;
      }
    });
    console.log("✅ Calculated ratingDist from reviews:", ratingDist);
  }

  // Fallback mặc định
  if (!ratingDist || Object.keys(ratingDist).length === 0) {
    ratingDist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  }

  const totalReviews =
    reviewSummary?.totalReviews ?? 
    reviewSummary?.total ?? 
    reviewSummary?.totalElements ??
    reviews.length ?? 
    0;

  const avgRating =
    reviewSummary?.averageRating ??
    reviewSummary?.average ??
    (totalReviews > 0 ? 
      Object.entries(ratingDist).reduce((sum, [star, count]) => 
        sum + (parseInt(star) * count), 0) / totalReviews 
      : 0) ??
    product.rating ??
    0;

  console.log("🌟 Final Rating Data:", { totalReviews, avgRating, ratingDist });

  const getRatingPct = (star) => {
    const count = ratingDist[star] ?? ratingDist[String(star)] ?? 0;
    return totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
  };

  /* Display feedback - limited to 3 or all if expanded */
  const displayedFeedback = expandedFeedback ? allFeedback : allFeedback.slice(0, 3);

  return (
    <div
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "32px 20px 60px",
        fontFamily: "'Rajdhani',sans-serif",
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 26,
          fontSize: 12,
          color: "#444",
          fontFamily: "'Orbitron',monospace",
          letterSpacing: 1,
        }}
      >
        <span
          style={{ cursor: "pointer", color: "#E8000D" }}
          onClick={() => setActivePage("home")}
        >
          SMARSHOP
        </span>
        <span style={{ color: "#222" }}>›</span>
        <span
          style={{ cursor: "pointer" }}
          onClick={() =>
            setActivePage(
              product.category?.name === "Điện Thoại"
                ? "phone"
                : product.category?.name === "Laptop"
                ? "laptop"
                : "ipad"
            )
          }
        >
          {product.category?.name || "SẢN PHẨM"}
        </span>
        <span style={{ color: "#222" }}>›</span>
        <span
          style={{
            color: "#666",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 300,
          }}
        >
          {product.name}
        </span>
      </div>

      {/* MAIN SECTION */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          alignItems: "start",
          marginBottom: 48,
        }}
      >
        {/* LEFT: Image Gallery */}
        <div style={{ animation: "fadeInUp .5s ease" }}>
          <div
            ref={imgRef}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}
            style={{
              position: "relative",
              background: "linear-gradient(135deg,#141414,#0A0A0A)",
              border: `1px solid ${zoom ? "#E8000D" : "#1e1e1e"}`,
              borderRadius: 8,
              overflow: "hidden",
              height: 420,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "crosshair",
              marginBottom: 14,
              transition: "border-color .2s",
            }}
          >
            {discount > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  zIndex: 3,
                  background: "#E8000D",
                  color: "#fff",
                  fontFamily: "'Orbitron',monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 11px",
                  borderRadius: 3,
                  boxShadow: "0 4px 14px rgba(232,0,13,.5)",
                }}
              >
                -{discount}%
              </div>
            )}
            {product.tag && (
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  zIndex: 3,
                  background: "rgba(232,0,13,.15)",
                  border: "1px solid rgba(232,0,13,.4)",
                  color: "#E8000D",
                  fontFamily: "'Orbitron',monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 2,
                  letterSpacing: 1,
                }}
              >
                {product.tag}
              </div>
            )}
            {images[activeImg] ? (
              <img
                src={images[activeImg]}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: zoom ? "scale(1.8)" : "scale(1)",
                  transition: zoom ? "none" : "transform .3s",
                }}
              />
            ) : (
              <div
                style={{
                  fontSize: 140,
                  transform: zoom ? "scale(1.15)" : "scale(1)",
                  transition: "transform .3s",
                  filter: "drop-shadow(0 0 40px rgba(232,0,13,.15))",
                }}
              >
                📦
              </div>
            )}
            {!zoom && (
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  fontFamily: "'Orbitron',monospace",
                  fontSize: 7.5,
                  color: "#2a2a2a",
                  letterSpacing: 1,
                }}
              >
                🔍 HOVER ĐỂ PHÓNG TO
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div
            style={{
              display: "flex",
              gap: 9,
              overflowX: "auto",
              paddingBottom: 4,
            }}
          >
            {(product?.colors?.length > 0 ? product.colors : [null]).map(
              (color, i) => {
                const thumbUrl = color?.image
                  ? `http://localhost:8080${color.image}`
                  : null;
                return (
                  <div
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      position: "relative",
                      flexShrink: 0,
                      width: 74,
                      height: 74,
                      background: "#111",
                      border: `2px solid ${
                        activeImg === i ? "#E8000D" : "#1e1e1e"
                      }`,
                      borderRadius: 5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all .2s",
                      boxShadow:
                        activeImg === i
                          ? "0 0 12px rgba(232,0,13,.4)"
                          : "none",
                      overflow: "hidden",
                    }}
                  >
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={color?.colorName || `Ảnh ${i + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: 28 }}>📦</span>
                    )}
                    {color?.colorName && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: "rgba(0,0,0,.75)",
                          fontSize: 8,
                          color: "#aaa",
                          textAlign: "center",
                          padding: "2px 0",
                          fontFamily: "'Rajdhani',sans-serif",
                        }}
                      >
                        {color.colorName}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>

          {/* Share + Wishlist */}
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            {[
              ["❤️", "YÊU THÍCH"],
              ["🔗", "CHIA SẺ"],
              ["⚖️", "SO SÁNH"],
            ].map(([icon, label]) => (
              <button
                key={label}
                style={{
                  flex: 1,
                  background: "none",
                  border: "1px solid #1e1e1e",
                  color: "#555",
                  fontFamily: "'Orbitron',monospace",
                  fontSize: 7.5,
                  fontWeight: 700,
                  padding: "8px 0",
                  borderRadius: 3,
                  cursor: "pointer",
                  letterSpacing: 0.8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  transition: "all .2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#E8000D";
                  e.currentTarget.style.color = "#E8000D";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#1e1e1e";
                  e.currentTarget.style.color = "#555";
                }}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div style={{ animation: "fadeInUp .55s ease" }}>
          <div
            style={{
              fontFamily: "'Orbitron',monospace",
              fontSize: 8.5,
              color: "#E8000D",
              letterSpacing: 3,
              marginBottom: 10,
            }}
          >
            {product.category?.name?.toUpperCase() || "SẢN PHẨM"}
          </div>

          <h1
            style={{
              fontFamily: "'Bebas Neue',cursive",
              fontSize: 36,
              letterSpacing: 3,
              color: "#F0F0F0",
              lineHeight: 1.05,
              marginBottom: 14,
            }}
          >
            {product.name}
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            {product.rating && (
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    style={{
                      color:
                        s <= Math.round(product.rating)
                          ? "#f59e0b"
                          : "#2a2a2a",
                      fontSize: 15,
                    }}
                  >
                    ★
                  </span>
                ))}
                <span
                  style={{
                    fontFamily: "'Orbitron',monospace",
                    fontSize: 9.5,
                    color: "#666",
                    marginLeft: 3,
                  }}
                >
                  {product.rating}
                </span>
              </div>
            )}
            {(product.soldQuantity || product.sold) && (
              <div
                style={{
                  fontFamily: "'Orbitron',monospace",
                  fontSize: 9,
                  color: "#444",
                  letterSpacing: 0.5,
                }}
              >
                Đã bán:{" "}
                <span style={{ color: "#666" }}>
                  {(
                    product.soldQuantity || product.sold
                  )?.toLocaleString()}
                </span>
              </div>
            )}
            {product.id && (
              <div
                style={{
                  fontFamily: "'Orbitron',monospace",
                  fontSize: 9,
                  color: "#2a2a2a",
                  letterSpacing: 0.5,
                }}
              >
                SKU: #{String(product.id).padStart(6, "0")}
              </div>
            )}
          </div>

          {/* Price block */}
          <div
            style={{
              background:
                "linear-gradient(135deg,#0D0000,#0A0A0A)",
              border: "1px solid rgba(232,0,13,.18)",
              borderRadius: 6,
              padding: "18px 20px",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontFamily: "'Orbitron',monospace",
                  fontSize: 32,
                  fontWeight: 900,
                  color: "#E8000D",
                  lineHeight: 1,
                  textShadow: "0 0 24px rgba(232,0,13,.35)",
                }}
              >
                {formatPrice(product.price)}
              </div>
              {product.oldPrice && (
                <div
                  style={{
                    fontFamily: "'Orbitron',monospace",
                    fontSize: 16,
                    color: "#333",
                    textDecoration: "line-through",
                  }}
                >
                  {formatPrice(product.oldPrice)}
                </div>
              )}
              {discount > 0 && (
                <div
                  style={{
                    background: "#E8000D",
                    color: "#fff",
                    fontFamily: "'Orbitron',monospace",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 2,
                  }}
                >
                  TIẾT KIỆM{" "}
                  {formatPrice(product.oldPrice - product.price)}
                </div>
              )}
            </div>
            {product.installment && (
              <div
                style={{ marginTop: 10, fontSize: 12, color: "#555" }}
              >
                💳 Trả góp 0% từ{" "}
                <span style={{ color: "#F0F0F0", fontWeight: 700 }}>
                  {formatPrice(Math.round(product.price / 12))}
                </span>
                /tháng
              </div>
            )}
          </div>

          {(pd.description || product.description) && (
            <div
              style={{
                fontSize: 14,
                color: "#666",
                lineHeight: 1.7,
                marginBottom: 20,
                padding: "0 2px",
              }}
            >
              {pd.description || product.description}
            </div>
          )}

          {specRows.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              {specRows.slice(0, 3).map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    background: "#111",
                    border: "1px solid #1e1e1e",
                    borderRadius: 4,
                    padding: "7px 12px",
                    fontSize: 11,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Orbitron',monospace",
                      fontSize: 7.5,
                      color: "#555",
                      letterSpacing: 0.5,
                      marginBottom: 2,
                    }}
                  >
                    {k.toUpperCase()}
                  </div>
                  <div style={{ color: "#F0F0F0", fontWeight: 700 }}>
                    {v}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontFamily: "'Orbitron',monospace",
                fontSize: 8.5,
                color: "#444",
                letterSpacing: 1.5,
              }}
            >
              SỐ LƯỢNG
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #1e1e1e",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={{
                  width: 38,
                  height: 38,
                  background: "#111",
                  border: "none",
                  color: "#E8000D",
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "background .2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#1a0000")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "#111")
                }
              >
                −
              </button>
              <div
                style={{
                  width: 44,
                  textAlign: "center",
                  fontFamily: "'Orbitron',monospace",
                  fontSize: 14,
                  color: "#F0F0F0",
                  borderLeft: "1px solid #1e1e1e",
                  borderRight: "1px solid #1e1e1e",
                  height: 38,
                  lineHeight: "38px",
                }}
              >
                {qty}
              </div>
              <button
                onClick={() => setQty((q) => q + 1)}
                style={{
                  width: 38,
                  height: 38,
                  background: "#111",
                  border: "none",
                  color: "#E8000D",
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "background .2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#1a0000")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "#111")
                }
              >
                +
              </button>
            </div>
            {product.stock !== undefined && (
              <div
                style={{
                  fontFamily: "'Orbitron',monospace",
                  fontSize: 8.5,
                  color: product.stock > 0 ? "#22c55e" : "#E8000D",
                  letterSpacing: 1,
                }}
              >
                {product.stock > 0
                  ? `✓ CÒN ${product.stock} SP`
                  : "✕ HẾT HÀNG"}
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
            <button
              onClick={handleAddCart}
              disabled={cartLoading || product.stock === 0}
              style={{
                flex: 1,
                background: addedAnim
                  ? "linear-gradient(135deg,#22c55e,#16a34a)"
                  : "linear-gradient(135deg,#E8000D,#8B0000)",
                border: "none",
                color: "#fff",
                fontFamily: "'Orbitron',monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.5,
                padding: "15px 0",
                borderRadius: 4,
                cursor: cartLoading ? "not-allowed" : "pointer",
                boxShadow: addedAnim
                  ? "0 6px 22px rgba(34,197,94,.4)"
                  : "0 6px 22px rgba(232,0,13,.35)",
                transition: "all .3s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: cartLoading ? 0.7 : 1,
              }}
            >
              {cartLoading ? (
                <>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      border: "2px solid rgba(255,255,255,.3)",
                      borderTop: "2px solid #fff",
                      borderRadius: "50%",
                      animation: "spin .8s linear infinite",
                    }}
                  />
                  ĐANG THÊM...
                </>
              ) : addedAnim ? (
                <>
                  <span style={{ fontSize: 16 }}>✓</span> ĐÃ THÊM VÀO
                  GIỎ!
                </>
              ) : (
                <>
                  <span style={{ fontSize: 16 }}>🛒</span> THÊM VÀO GIỎ
                  HÀNG
                </>
              )}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={cartLoading}
              style={{
                flex: 1,
                background: "transparent",
                border: "2px solid #E8000D",
                color: "#E8000D",
                fontFamily: "'Orbitron',monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.5,
                padding: "15px 0",
                borderRadius: 4,
                cursor: "pointer",
                transition: "all .2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background =
                  "rgba(232,0,13,.08)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              ⚡ MUA NGAY
            </button>
          </div>

          {/* Guarantees */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            {[
              ["🛡️", "Bảo hành 24 tháng", "Chính hãng toàn quốc"],
              ["🔄", "Đổi trả 30 ngày", "Miễn phí, không lý do"],
              ["🚚", "Giao hàng nhanh", "Toàn quốc 2-3 ngày"],
              ["💳", "Trả góp 0%", "12-24 tháng"],
            ].map(([icon, title, desc]) => (
              <div
                key={title}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 9,
                  padding: "11px 12px",
                  background: "#0F0F0F",
                  border: "1px solid #161616",
                  borderRadius: 4,
                }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>
                  {icon}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#F0F0F0",
                    }}
                  >
                    {title}
                  </div>
                  <div style={{ fontSize: 11, color: "#444" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ marginBottom: 48 }}>
        <div
          style={{
            display: "flex",
            borderBottom: "2px solid #1a1a1a",
            marginBottom: 28,
            gap: 0,
            overflowX: "auto",
          }}
        >
          {[
            ["specs", "📋 Thông số kỹ thuật"],
            ["description", "📝 Mô tả sản phẩm"],
            ["reviews", "⭐ Đánh giá & Bình luận"],
            ["policy", "📦 Chính sách"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                background: "none",
                border: "none",
                borderBottom: `3px solid ${
                  tab === key ? "#E8000D" : "transparent"
                }`,
                color: tab === key ? "#E8000D" : "#555",
                fontFamily: "'Orbitron',monospace",
                fontSize: 9.5,
                fontWeight: 700,
                padding: "14px 22px",
                cursor: "pointer",
                letterSpacing: 1,
                whiteSpace: "nowrap",
                marginBottom: -2,
                transition: "all .2s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* SPECS TAB */}
        {tab === "specs" && (
          <div style={{ animation: "fadeIn .3s ease" }}>
            {specRows.length > 0 ? (
              <div
                style={{
                  border: "1px solid #1a1a1a",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background:
                      "linear-gradient(135deg,#1a0000,#0D0000)",
                    padding: "12px 20px",
                    borderBottom: "1px solid #2a0000",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 16 }}>📋</span>
                  <div
                    style={{
                      fontFamily: "'Orbitron',monospace",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#E8000D",
                      letterSpacing: 2,
                    }}
                  >
                    THÔNG SỐ KỸ THUẬT ĐẦY ĐỦ
                  </div>
                </div>
                {[
                  ["🖥️", "Màn hình", pd.screen],
                  ["⚡", "CPU / Chip", pd.cpu],
                  ["🎮", "GPU", pd.gpu],
                  ["💾", "RAM", pd.ram],
                  ["📀", "Bộ nhớ trong", pd.storage],
                  ["📷", "Camera", pd.camera],
                  ["🔋", "Pin", pd.battery],
                  ["💿", "Hệ điều hành", pd.os],
                  ["⚖️", "Trọng lượng", pd.weight],
                ]
                  .filter(([, , v]) => v)
                  .map(([icon, label, value], i) => (
                    <div
                      key={label}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "200px 1fr",
                        background: i % 2 === 0 ? "#0A0A0A" : "#0F0F0F",
                        borderBottom: "1px solid #141414",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "14px 20px",
                          borderRight: "1px solid #141414",
                        }}
                      >
                        <span style={{ fontSize: 16, flexShrink: 0 }}>
                          {icon}
                        </span>
                        <div
                          style={{
                            fontFamily: "'Orbitron',monospace",
                            fontSize: 9,
                            color: "#555",
                            letterSpacing: 0.5,
                          }}
                        >
                          {label.toUpperCase()}
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "14px 20px",
                          fontSize: 13.5,
                          color: "#F0F0F0",
                          fontWeight: 600,
                          lineHeight: 1.5,
                        }}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  fontFamily: "'Orbitron',monospace",
                  fontSize: 10,
                  color: "#222",
                  letterSpacing: 2,
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 14 }}>📋</div>
                CHƯA CÓ THÔNG SỐ KỸ THUẬT
              </div>
            )}
          </div>
        )}

        {/* DESCRIPTION TAB */}
        {tab === "description" && (
          <div
            style={{ animation: "fadeIn .3s ease", maxWidth: 800 }}
          >
            <div
              style={{
                background: "#0A0A0A",
                border: "1px solid #1a1a1a",
                borderRadius: 6,
                padding: "28px 32px",
              }}
            >
              {pd.description || product.description ? (
                <div
                  style={{
                    fontSize: 14,
                    color: "#888",
                    lineHeight: 1.85,
                  }}
                >
                  {(pd.description || product.description)
                    .split("\n")
                    .map((p, i) => (
                      <p key={i} style={{ marginBottom: 14 }}>
                        {p}
                      </p>
                    ))}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 0",
                    fontFamily: "'Orbitron',monospace",
                    fontSize: 10,
                    color: "#222",
                    letterSpacing: 2,
                  }}
                >
                  CHƯA CÓ MÔ TẢ
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            REVIEWS & COMMENTS TAB — MERGED
            ═══════════════════════════════════════════════════════ */}
        {tab === "reviews" && (
          <div style={{ animation: "fadeIn .3s ease" }}>

            {/* ── Rating Summary ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "180px 1fr",
                gap: 16,
                marginBottom: 28,
              }}
            >
              {/* Average score */}
              <div
                style={{
                  background: "#0A0A0A",
                  border: "1px solid #1a1a1a",
                  borderRadius: 6,
                  padding: "24px 16px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Orbitron',monospace",
                    fontSize: 48,
                    fontWeight: 900,
                    color: "#E8000D",
                    lineHeight: 1,
                  }}
                >
                  {avgRating ? Number(avgRating).toFixed(1) : "0"}
                </div>
                <div style={{ display: "flex", gap: 3 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      style={{
                        color:
                          s <= Math.round(avgRating)
                            ? "#f59e0b"
                            : "#222",
                        fontSize: 18,
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    fontFamily: "'Orbitron',monospace",
                    fontSize: 8,
                    color: "#444",
                    letterSpacing: 0.8,
                  }}
                >
                  {totalReviews} ĐÁNH GIÁ
                </div>
              </div>

              {/* Star distribution */}
              <div
                style={{
                  background: "#0A0A0A",
                  border: "1px solid #1a1a1a",
                  borderRadius: 6,
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {[5, 4, 3, 2, 1].map((s) => {
                  const pct = getRatingPct(s);
                  const count = ratingDist[s] ?? ratingDist[String(s)] ?? 0;
                  return (
                    <div
                      key={s}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Orbitron',monospace",
                          fontSize: 9,
                          color: "#f59e0b",
                          whiteSpace: "nowrap",
                          width: 28,
                        }}
                      >
                        {s} ★
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 6,
                          background: "#111",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: "100%",
                            background:
                              "linear-gradient(90deg,#E8000D,#f59e0b)",
                            borderRadius: 3,
                            transition: "width .6s ease",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontFamily: "'Orbitron',monospace",
                          fontSize: 8.5,
                          color: "#444",
                          width: 50,
                          textAlign: "right",
                        }}
                      >
                        {pct}% ({count})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Feedback Count ── */}
            <div
              style={{
                fontFamily: "'Orbitron',monospace",
                fontSize: 9,
                color: "#444",
                letterSpacing: 2,
                marginBottom: 14,
              }}
            >
              TỔNG CỘNG: {totalFeedback} ĐÁNH GIÁ & BÌNH LUẬN
            </div>

            {/* ── MERGED FORM - Only show if user hasn't left feedback ── */}
            {!hasUserFeedback && !editingItem && (
              <div
                style={{
                  background: "linear-gradient(135deg,#0D0000,#0A0A0A)",
                  border: "1px solid rgba(232,0,13,.2)",
                  borderRadius: 6,
                  padding: "22px 24px",
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Orbitron',monospace",
                    fontSize: 9.5,
                    fontWeight: 700,
                    color: "#E8000D",
                    letterSpacing: 2,
                    marginBottom: 16,
                  }}
                >
                  ⭐ VIẾT ĐÁNH GIÁ VÀ BÌNH LUẬN
                </div>

                {/* Star picker */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Orbitron',monospace",
                      fontSize: 8,
                      color: "#555",
                      letterSpacing: 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    CHỌN SAO (TUỲ CHỌN):
                  </div>
                  <StarSelector
                    value={myRating}
                    onChange={setMyRating}
                    size={30}
                    disabled={submitLoading}
                  />
                  {myRating > 0 && (
                    <div
                      style={{
                        fontFamily: "'Orbitron',monospace",
                        fontSize: 9,
                        color: "#f59e0b",
                      }}
                    >
                      {
                        [
                          "",
                          "Rất tệ",
                          "Tệ",
                          "Bình thường",
                          "Tốt",
                          "Xuất sắc",
                        ][myRating]
                      }
                    </div>
                  )}
                </div>

                {/* Content textarea */}
                <textarea
                  value={myContent}
                  onChange={(e) => setMyContent(e.target.value)}
                  placeholder="Viết đánh giá hoặc bình luận của bạn..."
                  disabled={submitLoading}
                  style={{
                    width: "100%",
                    minHeight: 100,
                    background: "#0A0A0A",
                    border: "1px solid #1e1e1e",
                    borderRadius: 4,
                    color: "#F0F0F0",
                    fontSize: 13,
                    fontFamily: "'Rajdhani',sans-serif",
                    padding: "12px 14px",
                    resize: "vertical",
                    outline: "none",
                    boxSizing: "border-box",
                    marginBottom: 12,
                    transition: "border-color .2s",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(232,0,13,.4)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "#1e1e1e")}
                />

                {feedback && (
                  <div
                    style={{
                      color: feedbackType === "error" ? "#E8000D" : "#22c55e",
                      fontSize: 12,
                      fontFamily: "'Orbitron',monospace",
                      marginBottom: 10,
                    }}
                  >
                    {feedback}
                  </div>
                )}

                <button
                  onClick={handleSubmitFeedback}
                  disabled={submitLoading}
                  style={{
                    background: submitLoading
                      ? "#1a1a1a"
                      : "linear-gradient(135deg,#E8000D,#8B0000)",
                    border: "none",
                    color: "#fff",
                    fontFamily: "'Orbitron',monospace",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 1.5,
                    padding: "11px 28px",
                    borderRadius: 4,
                    cursor: submitLoading ? "not-allowed" : "pointer",
                    boxShadow: submitLoading
                      ? "none"
                      : "0 4px 18px rgba(232,0,13,.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "all .2s",
                    opacity: submitLoading ? 0.6 : 1,
                  }}
                >
                  {submitLoading ? (
                    <>
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          border: "2px solid rgba(255,255,255,.3)",
                          borderTop: "2px solid #fff",
                          borderRadius: "50%",
                          animation: "spin .8s linear infinite",
                        }}
                      />
                      ĐANG GỬI...
                    </>
                  ) : (
                    "📤 GỬI"
                  )}
                </button>
              </div>
            )}

            {/* ── User has feedback - Show edit form ── */}
            {hasUserFeedback && editingItem && (
              <div
                style={{
                  background: "linear-gradient(135deg,#0D0000,#0A0A0A)",
                  border: "1px solid rgba(232,0,13,.2)",
                  borderRadius: 6,
                  padding: "22px 24px",
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Orbitron',monospace",
                    fontSize: 9.5,
                    fontWeight: 700,
                    color: "#E8000D",
                    letterSpacing: 2,
                    marginBottom: 16,
                  }}
                >
                  ✏ CHỈNH SỬA
                </div>

                {/* Star picker */}
                {editingItem._type === "review" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Orbitron',monospace",
                        fontSize: 8,
                        color: "#555",
                        letterSpacing: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      CHỌN SAO:
                    </div>
                    <StarSelector
                      value={myRating}
                      onChange={setMyRating}
                      size={30}
                      disabled={submitLoading}
                    />
                  </div>
                )}

                {/* Content textarea */}
                <textarea
                  value={myContent}
                  onChange={(e) => setMyContent(e.target.value)}
                  placeholder="Chỉnh sửa nội dung..."
                  disabled={submitLoading}
                  style={{
                    width: "100%",
                    minHeight: 100,
                    background: "#0A0A0A",
                    border: "1px solid #1e1e1e",
                    borderRadius: 4,
                    color: "#F0F0F0",
                    fontSize: 13,
                    fontFamily: "'Rajdhani',sans-serif",
                    padding: "12px 14px",
                    resize: "vertical",
                    outline: "none",
                    boxSizing: "border-box",
                    marginBottom: 12,
                    transition: "border-color .2s",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(232,0,13,.4)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "#1e1e1e")}
                />

                {feedback && (
                  <div
                    style={{
                      color: feedbackType === "error" ? "#E8000D" : "#22c55e",
                      fontSize: 12,
                      fontFamily: "'Orbitron',monospace",
                      marginBottom: 10,
                    }}
                  >
                    {feedback}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={submitLoading}
                    style={{
                      background: submitLoading
                        ? "#1a1a1a"
                        : "linear-gradient(135deg,#E8000D,#8B0000)",
                      border: "none",
                      color: "#fff",
                      fontFamily: "'Orbitron',monospace",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      padding: "11px 28px",
                      borderRadius: 4,
                      cursor: submitLoading ? "not-allowed" : "pointer",
                      boxShadow: submitLoading
                        ? "none"
                        : "0 4px 18px rgba(232,0,13,.3)",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "all .2s",
                      opacity: submitLoading ? 0.6 : 1,
                    }}
                  >
                    {submitLoading ? (
                      <>
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            border: "2px solid rgba(255,255,255,.3)",
                            borderTop: "2px solid #fff",
                            borderRadius: "50%",
                            animation: "spin .8s linear infinite",
                          }}
                        />
                        ĐANG GỬI...
                      </>
                    ) : (
                      "💾 LƯU THAY ĐỔI"
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setMyRating(0);
                      setMyContent("");
                    }}
                    disabled={submitLoading}
                    style={{
                      background: "none",
                      border: "1px solid #2a2a2a",
                      color: "#555",
                      fontFamily: "'Orbitron',monospace",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 1,
                      padding: "11px 20px",
                      borderRadius: 4,
                      cursor: "pointer",
                      transition: "all .2s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = "#555";
                      e.currentTarget.style.color = "#888";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = "#2a2a2a";
                      e.currentTarget.style.color = "#555";
                    }}
                  >
                    HUỶ
                  </button>
                </div>
              </div>
            )}

            {/* ── Feedback List ── */}
            {feedbackLoading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    border: "2px solid #1a1a1a",
                    borderTop: "2px solid #E8000D",
                    borderRadius: "50%",
                    animation: "spin .8s linear infinite",
                  }}
                />
              </div>
            ) : allFeedback.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  fontFamily: "'Orbitron',monospace",
                  fontSize: 10,
                  color: "#222",
                  letterSpacing: 2,
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 10 }}>⭐</div>
                CHƯA CÓ ĐÁNH GIÁ NÀO. HÃY LÀ NGƯỜI ĐẦU TIÊN! 
              </div>
            ) : (
              <>
                {displayedFeedback.map((item) => (
                  <FeedbackCard
                    key={`${item._type}-${item.id}`}
                    item={item}
                    isReview={item._type === "review"}
                    currentUserId={currentUserId}
                    onDelete={(id) =>
                      handleDeleteFeedback(id, item._type === "review")
                    }
                    onMenuClick={handleMenuClick}
                  />
                ))}

                {/* Show More Button */}
                {!expandedFeedback && allFeedback.length > 3 && (
                  <div style={{ textAlign: "center", marginTop: 20 }}>
                    <button
                      onClick={() => setExpandedFeedback(true)}
                      style={{
                        background: "none",
                        border: "1px solid #E8000D",
                        color: "#E8000D",
                        fontFamily: "'Orbitron',monospace",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        padding: "10px 28px",
                        borderRadius: 4,
                        cursor: "pointer",
                        transition: "all .2s",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "rgba(232,0,13,.08)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "none";
                      }}
                    >
                      XEM THÊM ({allFeedback.length - 3} còn lại)
                    </button>
                  </div>
                )}

                {expandedFeedback && allFeedback.length > 3 && (
                  <div style={{ textAlign: "center", marginTop: 20 }}>
                    <button
                      onClick={() => setExpandedFeedback(false)}
                      style={{
                        background: "none",
                        border: "1px solid #555",
                        color: "#555",
                        fontFamily: "'Orbitron',monospace",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        padding: "10px 28px",
                        borderRadius: 4,
                        cursor: "pointer",
                        transition: "all .2s",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = "#888";
                        e.currentTarget.style.color = "#888";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = "#555";
                        e.currentTarget.style.color = "#555";
                      }}
                    >
                      RÚT GỌN
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* POLICY TAB */}
        {tab === "policy" && (
          <div
            style={{
              animation: "fadeIn .3s ease",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            {[
              {
                icon: "🛡️",
                title: "Bảo hành chính hãng",
                content:
                  "Bảo hành 24 tháng tại 50+ trung tâm bảo hành toàn quốc. Miễn phí sửa chữa lỗi phần cứng trong thời gian bảo hành.",
              },
              {
                icon: "🔄",
                title: "Chính sách đổi trả",
                content:
                  "Đổi trả miễn phí trong 30 ngày nếu sản phẩm lỗi, sai mẫu mã. Hoàn tiền 100% hoặc đổi sản phẩm mới.",
              },
              {
                icon: "🚚",
                title: "Giao hàng toàn quốc",
                content:
                  "Giao trong 24h tại TP.HCM & Hà Nội. Tỉnh thành khác 2-3 ngày làm việc. Miễn phí vận chuyển đơn từ 500.000đ.",
              },
              {
                icon: "💳",
                title: "Phương thức thanh toán",
                content:
                  "COD, chuyển khoản, thẻ ATM/Visa/Master, ví MoMo, VNPay. Trả góp 0% lãi suất qua thẻ tín dụng 12-24 tháng.",
              },
            ].map((p) => (
              <div
                key={p.title}
                style={{
                  background: "#0A0A0A",
                  border: "1px solid #1a1a1a",
                  borderRadius: 5,
                  padding: "20px 22px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <span style={{ fontSize: 22 }}>{p.icon}</span>
                  <div
                    style={{
                      fontFamily: "'Orbitron',monospace",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#E8000D",
                      letterSpacing: 1,
                    }}
                  >
                    {p.title}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#555",
                    lineHeight: 1.75,
                  }}
                >
                  {p.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProds.length > 0 && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontFamily: "'Bebas Neue',cursive",
                fontSize: 28,
                letterSpacing: 3,
                color: "#F0F0F0",
              }}
            >
              SẢN PHẨM LIÊN QUAN
            </div>
            <div
              style={{
                flex: 1,
                height: 1,
                background:
                  "linear-gradient(90deg,#E8000D,transparent)",
              }}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 14,
            }}
          >
            {relatedProds.map((p) => (
              <div
                key={p.id}
                onClick={() => setActivePage(`detail-${p.id}`)}
                style={{
                  background: "#0F0F0F",
                  border: "1px solid #1a1a1a",
                  borderRadius: 5,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all .25s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#E8000D";
                  e.currentTarget.style.boxShadow =
                    "0 6px 22px rgba(232,0,13,.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#1a1a1a";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    height: 110,
                    background: "#141414",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid #161616",
                    overflow: "hidden",
                  }}
                >
                  {p.colors?.[0]?.image ? (
                    <img
                      src={`http://localhost:8080${p.colors[0].image}`}
                      alt={p.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: 52 }}>📦</span>
                  )}
                </div>
                <div style={{ padding: "12px 13px" }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#F0F0F0",
                      marginBottom: 6,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Orbitron',monospace",
                      fontSize: 12,
                      color: "#E8000D",
                      fontWeight: 700,
                    }}
                  >
                    {formatPrice(p.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Shared styles ── */
const btnOutline = {
  background: "none",
  border: "1px solid #E8000D",
  color: "#E8000D",
  fontFamily: "'Orbitron',monospace",
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: 1.5,
  padding: "10px 24px",
  borderRadius: 3,
  cursor: "pointer",
};
