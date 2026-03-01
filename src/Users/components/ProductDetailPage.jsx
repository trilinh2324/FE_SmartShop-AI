import { useState, useEffect, useRef } from "react";
import { formatPrice } from "../api/data";

const BASE_URL = "http://localhost:8080/api/user/products";

export default function ProductDetailPage({ productId, setActivePage = () => {}, onAddCart = () => {} }) {
  const [product,      setProduct]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [activeImg,    setActiveImg]    = useState(0);
  const [qty,          setQty]          = useState(1);
  const [tab,          setTab]          = useState("specs");
  const [addedAnim,    setAddedAnim]    = useState(false);
  const [cartLoading,  setCartLoading]  = useState(false);
  const [zoom,         setZoom]         = useState(false);
  const [zoomPos,      setZoomPos]      = useState({ x:50, y:50 });
  const [relatedProds, setRelatedProds] = useState([]);
  const imgRef = useRef(null);

  /* ── Fetch product detail ─────────────────────────────── */
  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    fetch(`${BASE_URL}/${productId}`)
      .then(r => { if (!r.ok) throw new Error("Không tìm thấy sản phẩm"); return r.json(); })
      .then(data => {
        setProduct(data);
        setLoading(false);
        if (data.category?.name) {
          fetch(`${BASE_URL}/category/${encodeURIComponent(data.category.name)}`)
            .then(r => r.json())
            .then(list => setRelatedProds(list.filter(p => p.id !== data.id).slice(0, 4)))
            .catch(() => {});
        }
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [productId]);

  /* ── Image list: ưu tiên colors[].image từ BE ─────────── */
  const images = product?.colors?.length > 0
    ? product.colors.map(c => c.image ? `http://localhost:8080${c.image}` : null)
    : (product?.images?.length > 0
        ? product.images.map(img => img.url || img)
        : [null]);

  /* ── Zoom handler ─────────────────────────────────────── */
  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - left) / width)  * 100,
      y: ((e.clientY - top)  / height) * 100,
    });
  };

  /* ── Add to cart ──────────────────────────────────────── */
  const handleAddCart = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) { alert("Vui lòng đăng nhập!"); return; }

    const selectedColor  = product?.colors?.[activeImg] || product?.colors?.[0];
    const productColorId = selectedColor?.id;
    if (!productColorId) { alert("Sản phẩm chưa có màu!"); return; }

    try {
      setCartLoading(true);
      const res = await fetch(
        `http://localhost:8080/api/user/cart/add?productColorId=${productColorId}&quantity=${qty}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
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

  /* ── Discount ─────────────────────────────────────────── */
  const discount = product?.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  /* ── LOADING ──────────────────────────────────────────── */
  if (loading) return (
    <div style={{ minHeight:"70vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20 }}>
      <div style={{ width:56, height:56, border:"3px solid #1a1a1a", borderTop:"3px solid #E8000D", borderRadius:"50%", animation:"spin .8s linear infinite" }}/>
      <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:"#333", letterSpacing:3 }}>ĐANG TẢI...</div>
    </div>
  );

  /* ── ERROR ────────────────────────────────────────────── */
  if (error) return (
    <div style={{ minHeight:"60vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
      <div style={{ fontSize:52 }}>⚠️</div>
      <div style={{ fontFamily:"'Orbitron',monospace", fontSize:13, color:"#E8000D", letterSpacing:2 }}>{error}</div>
      <button onClick={() => setActivePage("home")} style={btnOutline}>← QUAY LẠI</button>
    </div>
  );

  if (!product) return null;

  /* ── ProductDetail từ BE — field: product.productDetail ── */
  const pd = product.productDetail || {};

  /* Danh sách thông số ánh xạ từ ProductDetail entity */
  const specRows = [
    ["Màn hình",      pd.screen],
    ["CPU / Chip",    pd.cpu],
    ["GPU",           pd.gpu],
    ["RAM",           pd.ram],
    ["Bộ nhớ trong",  pd.storage],
    ["Camera",        pd.camera],
    ["Pin",           pd.battery],
    ["Hệ điều hành",  pd.os],
    ["Trọng lượng",   pd.weight],
  ].filter(([, v]) => v); // bỏ qua dòng nào BE trả null/empty

  return (
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 20px 60px", fontFamily:"'Rajdhani',sans-serif" }}>

      {/* Breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:26, fontSize:12, color:"#444", fontFamily:"'Orbitron',monospace", letterSpacing:1 }}>
        <span style={{ cursor:"pointer", color:"#E8000D" }} onClick={() => setActivePage("home")}>SMARSHOP</span>
        <span style={{ color:"#222" }}>›</span>
        <span style={{ cursor:"pointer" }} onClick={() => setActivePage(
          product.category?.name === "Điện Thoại" ? "phone" :
          product.category?.name === "Laptop"     ? "laptop" : "ipad"
        )}>
          {product.category?.name || "SẢN PHẨM"}
        </span>
        <span style={{ color:"#222" }}>›</span>
        <span style={{ color:"#666", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:300 }}>{product.name}</span>
      </div>

      {/* ── MAIN SECTION ──────────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"start", marginBottom:48 }}>

        {/* ── LEFT: Image Gallery ── */}
        <div style={{ animation:"fadeInUp .5s ease" }}>
          {/* Main image */}
          <div
            ref={imgRef}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}
            style={{ position:"relative", background:"linear-gradient(135deg,#141414,#0A0A0A)", border:`1px solid ${zoom?"#E8000D":"#1e1e1e"}`, borderRadius:8, overflow:"hidden", height:420, display:"flex", alignItems:"center", justifyContent:"center", cursor:"crosshair", marginBottom:14, transition:"border-color .2s" }}
          >
            {discount > 0 && (
              <div style={{ position:"absolute", top:16, left:16, zIndex:3, background:"#E8000D", color:"#fff", fontFamily:"'Orbitron',monospace", fontSize:11, fontWeight:700, padding:"4px 11px", borderRadius:3, boxShadow:"0 4px 14px rgba(232,0,13,.5)" }}>
                -{discount}%
              </div>
            )}
            {product.tag && (
              <div style={{ position:"absolute", top:16, right:16, zIndex:3, background:"rgba(232,0,13,.15)", border:"1px solid rgba(232,0,13,.4)", color:"#E8000D", fontFamily:"'Orbitron',monospace", fontSize:9, fontWeight:700, padding:"3px 10px", borderRadius:2, letterSpacing:1 }}>
                {product.tag}
              </div>
            )}
            {images[activeImg] ? (
              <img
                src={images[activeImg]}
                alt={product.name}
                style={{ width:"100%", height:"100%", objectFit:"contain", transformOrigin:`${zoomPos.x}% ${zoomPos.y}%`, transform:zoom?"scale(1.8)":"scale(1)", transition:zoom?"none":"transform .3s" }}
              />
            ) : (
              <div style={{ fontSize:140, transform:zoom?"scale(1.15)":"scale(1)", transition:"transform .3s", filter:"drop-shadow(0 0 40px rgba(232,0,13,.15))" }}>
                📦
              </div>
            )}
            {!zoom && (
              <div style={{ position:"absolute", bottom:12, right:12, fontFamily:"'Orbitron',monospace", fontSize:7.5, color:"#2a2a2a", letterSpacing:1 }}>🔍 HOVER ĐỂ PHÓNG TO</div>
            )}
          </div>

          {/* Thumbnails */}
          <div style={{ display:"flex", gap:9, overflowX:"auto", paddingBottom:4 }}>
            {(product?.colors?.length > 0 ? product.colors : [null]).map((color, i) => {
              const thumbUrl = color?.image ? `http://localhost:8080${color.image}` : null;
              return (
                <div
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{ position:"relative", flexShrink:0, width:74, height:74, background:"#111", border:`2px solid ${activeImg===i?"#E8000D":"#1e1e1e"}`, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all .2s", boxShadow:activeImg===i?"0 0 12px rgba(232,0,13,.4)":"none", overflow:"hidden" }}
                >
                  {thumbUrl ? (
                    <img src={thumbUrl} alt={color?.colorName || `Ảnh ${i+1}`} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  ) : (
                    <span style={{ fontSize:28 }}>📦</span>
                  )}
                  {color?.colorName && (
                    <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(0,0,0,.75)", fontSize:8, color:"#aaa", textAlign:"center", padding:"2px 0", fontFamily:"'Rajdhani',sans-serif" }}>
                      {color.colorName}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Share + Wishlist */}
          <div style={{ display:"flex", gap:8, marginTop:14 }}>
            {[["❤️","YÊU THÍCH"],["🔗","CHIA SẺ"],["⚖️","SO SÁNH"]].map(([icon,label]) => (
              <button key={label} style={{ flex:1, background:"none", border:"1px solid #1e1e1e", color:"#555", fontFamily:"'Orbitron',monospace", fontSize:7.5, fontWeight:700, padding:"8px 0", borderRadius:3, cursor:"pointer", letterSpacing:.8, display:"flex", alignItems:"center", justifyContent:"center", gap:5, transition:"all .2s" }}
                onMouseOver={e=>{e.currentTarget.style.borderColor="#E8000D";e.currentTarget.style.color="#E8000D"}}
                onMouseOut={e=>{e.currentTarget.style.borderColor="#1e1e1e";e.currentTarget.style.color="#555"}}>
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Product Info ── */}
        <div style={{ animation:"fadeInUp .55s ease" }}>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:8.5, color:"#E8000D", letterSpacing:3, marginBottom:10 }}>
            {product.category?.name?.toUpperCase() || "SẢN PHẨM"}
          </div>

          <h1 style={{ fontFamily:"'Bebas Neue',cursive", fontSize:36, letterSpacing:3, color:"#F0F0F0", lineHeight:1.05, marginBottom:14 }}>
            {product.name}
          </h1>

          {/* Rating + Sold + SKU */}
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:18, flexWrap:"wrap" }}>
            {product.rating && (
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} style={{ color:s<=Math.round(product.rating)?"#f59e0b":"#2a2a2a", fontSize:15 }}>★</span>
                ))}
                <span style={{ fontFamily:"'Orbitron',monospace", fontSize:9.5, color:"#666", marginLeft:3 }}>{product.rating}</span>
              </div>
            )}
            {(product.soldQuantity || product.sold) && (
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:"#444", letterSpacing:.5 }}>
                Đã bán: <span style={{color:"#666"}}>{(product.soldQuantity || product.sold)?.toLocaleString()}</span>
              </div>
            )}
            {product.id && (
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:"#2a2a2a", letterSpacing:.5 }}>
                SKU: #{String(product.id).padStart(6,"0")}
              </div>
            )}
          </div>

          {/* Price block */}
          <div style={{ background:"linear-gradient(135deg,#0D0000,#0A0A0A)", border:"1px solid rgba(232,0,13,.18)", borderRadius:6, padding:"18px 20px", marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"baseline", gap:14, flexWrap:"wrap" }}>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:32, fontWeight:900, color:"#E8000D", lineHeight:1, textShadow:"0 0 24px rgba(232,0,13,.35)" }}>
                {formatPrice(product.price)}
              </div>
              {product.oldPrice && (
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:16, color:"#333", textDecoration:"line-through" }}>
                  {formatPrice(product.oldPrice)}
                </div>
              )}
              {discount > 0 && (
                <div style={{ background:"#E8000D", color:"#fff", fontFamily:"'Orbitron',monospace", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:2 }}>
                  TIẾT KIỆM {formatPrice(product.oldPrice - product.price)}
                </div>
              )}
            </div>
            {product.installment && (
              <div style={{ marginTop:10, fontSize:12, color:"#555" }}>
                💳 Trả góp 0% từ <span style={{color:"#F0F0F0", fontWeight:700}}>{formatPrice(Math.round(product.price/12))}</span>/tháng
              </div>
            )}
          </div>

          {/* Short description từ ProductDetail */}
          {(pd.description || product.description) && (
            <div style={{ fontSize:14, color:"#666", lineHeight:1.7, marginBottom:20, padding:"0 2px" }}>
              {pd.description || product.description}
            </div>
          )}

          {/* Quick specs preview — hiển thị 3 thông số nổi bật */}
          {specRows.length > 0 && (
            <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
              {specRows.slice(0, 3).map(([k, v]) => (
                <div key={k} style={{ background:"#111", border:"1px solid #1e1e1e", borderRadius:4, padding:"7px 12px", fontSize:11 }}>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:7.5, color:"#555", letterSpacing:.5, marginBottom:2 }}>{k.toUpperCase()}</div>
                  <div style={{ color:"#F0F0F0", fontWeight:700 }}>{v}</div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity selector */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:8.5, color:"#444", letterSpacing:1.5 }}>SỐ LƯỢNG</div>
            <div style={{ display:"flex", alignItems:"center", border:"1px solid #1e1e1e", borderRadius:4, overflow:"hidden" }}>
              <button onClick={() => setQty(q => Math.max(1,q-1))} style={{ width:38, height:38, background:"#111", border:"none", color:"#E8000D", fontSize:18, fontWeight:700, cursor:"pointer", transition:"background .2s" }}
                onMouseOver={e=>e.currentTarget.style.background="#1a0000"}
                onMouseOut={e=>e.currentTarget.style.background="#111"}>−</button>
              <div style={{ width:44, textAlign:"center", fontFamily:"'Orbitron',monospace", fontSize:14, color:"#F0F0F0", borderLeft:"1px solid #1e1e1e", borderRight:"1px solid #1e1e1e", height:38, lineHeight:"38px" }}>{qty}</div>
              <button onClick={() => setQty(q => q+1)} style={{ width:38, height:38, background:"#111", border:"none", color:"#E8000D", fontSize:18, fontWeight:700, cursor:"pointer", transition:"background .2s" }}
                onMouseOver={e=>e.currentTarget.style.background="#1a0000"}
                onMouseOut={e=>e.currentTarget.style.background="#111"}>+</button>
            </div>
            {product.stock !== undefined && (
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:8.5, color:product.stock>0?"#22c55e":"#E8000D", letterSpacing:1 }}>
                {product.stock > 0 ? `✓ CÒN ${product.stock} SP` : "✕ HẾT HÀNG"}
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div style={{ display:"flex", gap:10, marginBottom:22 }}>
            <button
              onClick={handleAddCart}
              disabled={cartLoading || product.stock===0}
              style={{ flex:1, background:addedAnim?"linear-gradient(135deg,#22c55e,#16a34a)":"linear-gradient(135deg,#E8000D,#8B0000)", border:"none", color:"#fff", fontFamily:"'Orbitron',monospace", fontSize:11, fontWeight:700, letterSpacing:1.5, padding:"15px 0", borderRadius:4, cursor:cartLoading?"not-allowed":"pointer", boxShadow:addedAnim?"0 6px 22px rgba(34,197,94,.4)":"0 6px 22px rgba(232,0,13,.35)", transition:"all .3s", display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity:cartLoading?0.7:1 }}
            >
              {cartLoading
                ? <><div style={{ width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spin .8s linear infinite" }}/> ĐANG THÊM...</>
                : addedAnim
                  ? <><span style={{fontSize:16}}>✓</span> ĐÃ THÊM VÀO GIỎ!</>
                  : <><span style={{fontSize:16}}>🛒</span> THÊM VÀO GIỎ HÀNG</>}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={cartLoading}
              style={{ flex:1, background:"transparent", border:"2px solid #E8000D", color:"#E8000D", fontFamily:"'Orbitron',monospace", fontSize:11, fontWeight:700, letterSpacing:1.5, padding:"15px 0", borderRadius:4, cursor:"pointer", transition:"all .2s" }}
              onMouseOver={e=>{e.currentTarget.style.background="rgba(232,0,13,.08)"}}
              onMouseOut={e=>{e.currentTarget.style.background="transparent"}}
            >
              ⚡ MUA NGAY
            </button>
          </div>

          {/* Guarantees */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {[["🛡️","Bảo hành 24 tháng","Chính hãng toàn quốc"],["🔄","Đổi trả 30 ngày","Miễn phí, không lý do"],["🚚","Giao hàng nhanh","Toàn quốc 2-3 ngày"],["💳","Trả góp 0%","12-24 tháng"]].map(([icon,title,desc]) => (
              <div key={title} style={{ display:"flex", alignItems:"flex-start", gap:9, padding:"11px 12px", background:"#0F0F0F", border:"1px solid #161616", borderRadius:4 }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{icon}</span>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:"#F0F0F0" }}>{title}</div>
                  <div style={{ fontSize:11, color:"#444" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TABS ──────────────────────────────────────────── */}
      <div style={{ marginBottom:48 }}>
        <div style={{ display:"flex", borderBottom:"2px solid #1a1a1a", marginBottom:28, gap:0, overflowX:"auto" }}>
          {[["specs","📋 Thông số kỹ thuật"],["description","📝 Mô tả sản phẩm"],["reviews","⭐ Đánh giá"],["policy","📦 Chính sách"]].map(([key,label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              background:"none", border:"none", borderBottom:`3px solid ${tab===key?"#E8000D":"transparent"}`,
              color:tab===key?"#E8000D":"#555",
              fontFamily:"'Orbitron',monospace", fontSize:9.5, fontWeight:700,
              padding:"14px 22px", cursor:"pointer", letterSpacing:1,
              whiteSpace:"nowrap", marginBottom:-2, transition:"all .2s",
            }}>{label}</button>
          ))}
        </div>

        {/* ── SPECS TAB — dùng ProductDetail entity từ BE ── */}
        {tab==="specs" && (
          <div style={{ animation:"fadeIn .3s ease" }}>
            {specRows.length > 0 ? (
              <div style={{ border:"1px solid #1a1a1a", borderRadius:6, overflow:"hidden" }}>
                {/* Header row */}
                <div style={{ background:"linear-gradient(135deg,#1a0000,#0D0000)", padding:"12px 20px", borderBottom:"1px solid #2a0000", display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:16 }}>📋</span>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, fontWeight:700, color:"#E8000D", letterSpacing:2 }}>THÔNG SỐ KỸ THUẬT ĐẦY ĐỦ</div>
                </div>

                {/* Spec rows - lấy từ ProductDetail */}
                {[
                  ["🖥️",  "Màn hình",      pd.screen],
                  ["⚡",   "CPU / Chip",    pd.cpu],
                  ["🎮",   "GPU",           pd.gpu],
                  ["💾",   "RAM",           pd.ram],
                  ["📀",   "Bộ nhớ trong",  pd.storage],
                  ["📷",   "Camera",        pd.camera],
                  ["🔋",   "Pin",           pd.battery],
                  ["💿",   "Hệ điều hành",  pd.os],
                  ["⚖️",   "Trọng lượng",   pd.weight],
                ].filter(([,,v]) => v).map(([icon, label, value], i) => (
                  <div key={label} style={{
                    display:"grid", gridTemplateColumns:"200px 1fr",
                    background: i % 2 === 0 ? "#0A0A0A" : "#0F0F0F",
                    borderBottom:"1px solid #141414",
                  }}>
                    {/* Label cell */}
                    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 20px", borderRight:"1px solid #141414" }}>
                      <span style={{ fontSize:16, flexShrink:0 }}>{icon}</span>
                      <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:"#555", letterSpacing:.5 }}>{label.toUpperCase()}</div>
                    </div>
                    {/* Value cell */}
                    <div style={{ padding:"14px 20px", fontSize:13.5, color:"#F0F0F0", fontWeight:600, lineHeight:1.5 }}>
                      {value}
                    </div>
                  </div>
                ))}

                {/* Thông tin cơ bản nếu specs trống */}
                {specRows.length === 0 && (
                  <>
                    {[
                      ["🏷️", "Tên sản phẩm", product.name],
                      ["📁", "Danh mục",     product.category?.name || "—"],
                      ["💰", "Giá bán",      formatPrice(product.price)],
                      ["⭐", "Đánh giá",     product.rating ? `${product.rating}/5` : "—"],
                    ].map(([icon, label, value], i) => (
                      <div key={label} style={{ display:"grid", gridTemplateColumns:"200px 1fr", background:i%2===0?"#0A0A0A":"#0F0F0F", borderBottom:"1px solid #141414" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 20px", borderRight:"1px solid #141414" }}>
                          <span style={{ fontSize:16 }}>{icon}</span>
                          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:"#555", letterSpacing:.5 }}>{label.toUpperCase()}</div>
                        </div>
                        <div style={{ padding:"14px 20px", fontSize:13.5, color:"#F0F0F0", fontWeight:600 }}>{value}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ) : (
              <div style={{ textAlign:"center", padding:"60px 0", fontFamily:"'Orbitron',monospace", fontSize:10, color:"#222", letterSpacing:2 }}>
                <div style={{ fontSize:40, marginBottom:14 }}>📋</div>
                CHƯA CÓ THÔNG SỐ KỸ THUẬT
              </div>
            )}
          </div>
        )}

        {/* DESCRIPTION tab */}
        {tab==="description" && (
          <div style={{ animation:"fadeIn .3s ease", maxWidth:800 }}>
            <div style={{ background:"#0A0A0A", border:"1px solid #1a1a1a", borderRadius:6, padding:"28px 32px" }}>
              {(pd.description || product.description) ? (
                <div style={{ fontSize:14, color:"#888", lineHeight:1.85 }}>
                  {(pd.description || product.description).split("\n").map((p, i) => (
                    <p key={i} style={{ marginBottom:14 }}>{p}</p>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign:"center", padding:"40px 0", fontFamily:"'Orbitron',monospace", fontSize:10, color:"#222", letterSpacing:2 }}>CHƯA CÓ MÔ TẢ</div>
              )}
            </div>
          </div>
        )}

        {/* REVIEWS tab */}
        {tab==="reviews" && (
          <div style={{ animation:"fadeIn .3s ease" }}>
            <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:24, marginBottom:28 }}>
              <div style={{ background:"#0A0A0A", border:"1px solid #1a1a1a", borderRadius:6, padding:"24px", textAlign:"center" }}>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:52, fontWeight:900, color:"#E8000D", lineHeight:1 }}>{product.rating || "—"}</div>
                <div style={{ display:"flex", justifyContent:"center", gap:3, margin:"10px 0 6px" }}>
                  {[1,2,3,4,5].map(s=><span key={s} style={{ color:s<=Math.round(product.rating||0)?"#f59e0b":"#222", fontSize:18 }}>★</span>)}
                </div>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:8.5, color:"#444", letterSpacing:1 }}>ĐÁNH GIÁ TRUNG BÌNH</div>
              </div>
              <div style={{ background:"#0A0A0A", border:"1px solid #1a1a1a", borderRadius:6, padding:"20px 24px" }}>
                {[5,4,3,2,1].map(s => {
                  const pct = s===5?70:s===4?20:s===3?6:s===2?3:1;
                  return (
                    <div key={s} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:9 }}>
                      <span style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:"#f59e0b", whiteSpace:"nowrap" }}>{s} ★</span>
                      <div style={{ flex:1, height:6, background:"#111", borderRadius:3, overflow:"hidden" }}>
                        <div style={{ width:`${pct}%`, height:"100%", background:"linear-gradient(90deg,#E8000D,#f59e0b)", borderRadius:3 }}/>
                      </div>
                      <span style={{ fontFamily:"'Orbitron',monospace", fontSize:8.5, color:"#444", width:28, textAlign:"right" }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {[
              { name:"Nguyễn Văn A", rating:5, date:"20/02/2026", text:"Sản phẩm rất tốt, đúng như mô tả. Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ shop lần sau!", verified:true },
              { name:"Trần Thị B",   rating:4, date:"15/02/2026", text:"Hàng chính hãng, chạy mượt. Màu đẹp hơn ảnh. Chỉ tiếc là không có quà tặng kèm.",         verified:true },
              { name:"Lê Văn C",     rating:5, date:"10/02/2026", text:"Mua lần 2 rồi vẫn không thất vọng. Dịch vụ hậu mãi tốt, nhân viên tư vấn nhiệt tình.",  verified:false },
            ].map((r,i) => (
              <div key={i} style={{ background:"#0A0A0A", border:"1px solid #1a1a1a", borderRadius:5, padding:"18px 20px", marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#1a0000,#2d0005)", border:"1px solid #E8000D", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>👤</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:13, color:"#F0F0F0" }}>{r.name}</div>
                      <div style={{ display:"flex", gap:2, marginTop:2 }}>
                        {[1,2,3,4,5].map(s=><span key={s} style={{ color:s<=r.rating?"#f59e0b":"#2a2a2a", fontSize:12 }}>★</span>)}
                      </div>
                    </div>
                    {r.verified && <span style={{ background:"rgba(34,197,94,.1)", border:"1px solid rgba(34,197,94,.3)", color:"#22c55e", fontFamily:"'Orbitron',monospace", fontSize:7, padding:"2px 7px", borderRadius:2, letterSpacing:1 }}>✓ ĐÃ MUA</span>}
                  </div>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:8.5, color:"#333" }}>{r.date}</div>
                </div>
                <div style={{ fontSize:13, color:"#666", lineHeight:1.7 }}>{r.text}</div>
              </div>
            ))}
          </div>
        )}

        {/* POLICY tab */}
        {tab==="policy" && (
          <div style={{ animation:"fadeIn .3s ease", display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            {[
              { icon:"🛡️", title:"Bảo hành chính hãng", content:"Bảo hành 24 tháng tại 50+ trung tâm bảo hành toàn quốc. Miễn phí sửa chữa lỗi phần cứng trong thời gian bảo hành." },
              { icon:"🔄", title:"Chính sách đổi trả",  content:"Đổi trả miễn phí trong 30 ngày nếu sản phẩm lỗi, sai mẫu mã. Hoàn tiền 100% hoặc đổi sản phẩm mới." },
              { icon:"🚚", title:"Giao hàng toàn quốc", content:"Giao trong 24h tại TP.HCM & Hà Nội. Tỉnh thành khác 2-3 ngày làm việc. Miễn phí vận chuyển đơn từ 500.000đ." },
              { icon:"💳", title:"Phương thức thanh toán", content:"COD, chuyển khoản, thẻ ATM/Visa/Master, ví MoMo, VNPay. Trả góp 0% lãi suất qua thẻ tín dụng 12-24 tháng." },
            ].map(p => (
              <div key={p.title} style={{ background:"#0A0A0A", border:"1px solid #1a1a1a", borderRadius:5, padding:"20px 22px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <span style={{ fontSize:22 }}>{p.icon}</span>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, fontWeight:700, color:"#E8000D", letterSpacing:1 }}>{p.title}</div>
                </div>
                <div style={{ fontSize:13, color:"#555", lineHeight:1.75 }}>{p.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── RELATED PRODUCTS ──────────────────────────────── */}
      {relatedProds.length > 0 && (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
            <div style={{ fontFamily:"'Bebas Neue',cursive", fontSize:28, letterSpacing:3, color:"#F0F0F0" }}>SẢN PHẨM LIÊN QUAN</div>
            <div style={{ flex:1, height:1, background:"linear-gradient(90deg,#E8000D,transparent)" }}/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
            {relatedProds.map(p => (
              <div
                key={p.id}
                onClick={() => setActivePage(`detail-${p.id}`)}
                style={{ background:"#0F0F0F", border:"1px solid #1a1a1a", borderRadius:5, overflow:"hidden", cursor:"pointer", transition:"all .25s" }}
                onMouseOver={e=>{e.currentTarget.style.borderColor="#E8000D";e.currentTarget.style.boxShadow="0 6px 22px rgba(232,0,13,.1)"}}
                onMouseOut={e=>{e.currentTarget.style.borderColor="#1a1a1a";e.currentTarget.style.boxShadow="none"}}
              >
                <div style={{ height:110, background:"#141414", display:"flex", alignItems:"center", justifyContent:"center", borderBottom:"1px solid #161616", overflow:"hidden" }}>
                  {p.colors?.[0]?.image ? (
                    <img src={`http://localhost:8080${p.colors[0].image}`} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"contain" }}/>
                  ) : (
                    <span style={{ fontSize:52 }}>📦</span>
                  )}
                </div>
                <div style={{ padding:"12px 13px" }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#F0F0F0", marginBottom:6, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</div>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:12, color:"#E8000D", fontWeight:700 }}>{formatPrice(p.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const btnOutline = {
  background:"none", border:"1px solid #E8000D", color:"#E8000D",
  fontFamily:"'Orbitron',monospace", fontSize:9, fontWeight:700,
  letterSpacing:1.5, padding:"10px 24px", borderRadius:3, cursor:"pointer",
};
