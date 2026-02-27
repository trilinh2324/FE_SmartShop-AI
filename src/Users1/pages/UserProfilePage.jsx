import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/home/Header";
import Footer from "../components/home/Footer";
import "../../Users/css/login.css";
import "../css/UserProfile.css";
import { VIETNAM_CITIES, DISTRICT_BY_CITY, WARD_BY_DISTRICT } from "../vietnamLocationData";
import avatarImg from "./anh-gai-2k5.webp";

const ADDRESSES_STORAGE_KEY = "user_addresses";

export default function UserProfilePage() {
  const [user, setUser] = useState({
    id: 1,
    fullName: "Nguyễn Văn A",
    email: "user@example.com",
    phone: "0987654321",
    address: "123 Đường ABC, Quận 1, TP. HCM",
    avatar: "https://via.placeholder.com/120",
    memberSince: "2024-01-15",
    status: "active",
  });

  const [orders] = useState([
    {
      id: "#ORD001",
      date: "2024-02-15",
      total: 1500000,
      status: "delivered",
      items: 3,
      details: [
        { name: "Sản phẩm 1", qty: 2, price: 500000 },
        { name: "Sản phẩm 2", qty: 1, price: 500000 },
      ],
    },
    {
      id: "#ORD002",
      date: "2024-02-10",
      total: 850000,
      status: "processing",
      items: 2,
      details: [
        { name: "Sản phẩm 3", qty: 1, price: 850000 },
      ],
    },
    {
      id: "#ORD003",
      date: "2024-02-01",
      total: 2100000,
      status: "delivered",
      items: 5,
      details: [
        { name: "Sản phẩm 4", qty: 2, price: 800000 },
        { name: "Sản phẩm 5", qty: 3, price: 500000 },
      ],
    },
  ]);

  const [addresses, setAddresses] = useState(() => {
    try {
      const stored = localStorage.getItem(ADDRESSES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [
        {
          id: 1,
          fullName: "Nguyễn Văn A",
          email: "user@example.com",
          phone: "0987654321",
          city: "TP. HCM",
          district: "Quận 1",
          address: "123 Đường ABC",
          isDefault: true,
        },
      ];
    } catch (e) {
      return [];
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...user });
  const [activeTab, setActiveTab] = useState("profile");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [searchDistrict, setSearchDistrict] = useState("");
  const [searchWard, setSearchWard] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showWardDropdown, setShowWardDropdown] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    fullName: "", email: "", phone: "", city: "", district: "", ward: "", address: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") setShowOrderModal(false); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (showOrderModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showOrderModal]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleViewOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;
    setAddressFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "city") { updated.district = ""; updated.ward = ""; setSearchDistrict(""); setSearchWard(""); }
      if (name === "district") { updated.ward = ""; setSearchWard(""); }
      return updated;
    });
  };

  const filteredCities = VIETNAM_CITIES.filter((city) =>
    city.name.toLowerCase().includes(searchCity.toLowerCase())
  );
  const filteredDistricts = addressFormData.city
    ? (DISTRICT_BY_CITY[addressFormData.city] || []).filter((d) =>
        d.name.toLowerCase().includes(searchDistrict.toLowerCase()))
    : [];
  const filteredWards = addressFormData.district
    ? (WARD_BY_DISTRICT[addressFormData.district] || []).filter((w) =>
        w.name.toLowerCase().includes(searchWard.toLowerCase()))
    : [];

  const handleSaveAddress = () => {
    if (!addressFormData.fullName || !addressFormData.email || !addressFormData.phone || !addressFormData.address) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (editingAddress) {
      setAddresses((prev) => prev.map((a) => a.id === editingAddress.id ? { ...a, ...addressFormData } : a));
    } else {
      setAddresses((prev) => [...prev, { id: Date.now(), ...addressFormData, isDefault: prev.length === 0 }]);
    }
    resetAddressForm();
  };

  const resetAddressForm = () => {
    setAddressFormData({ fullName: "", email: "", phone: "", city: "", district: "", ward: "", address: "" });
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressFormData(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      setAddresses((prev) => {
        const updated = prev.filter((a) => a.id !== id);
        if (updated.length > 0 && prev.find((a) => a.id === id)?.isDefault) updated[0].isDefault = true;
        return updated;
      });
    }
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const handleSaveProfile = () => {
    setUser(editData);
    setIsEditing(false);
    alert("Thông tin đã được cập nhật!");
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("user");
      navigate("/users/login");
    }
  };

  const getStatusLabel = (status) => {
    const labels = { delivered: "Đã giao", processing: "Đang xử lý", pending: "Chờ xử lý", cancelled: "Đã hủy" };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = { delivered: "#16a34a", processing: "#d97706", pending: "#0891b2", cancelled: "#dc2626" };
    return colors[status] || "#666";
  };

  const getStatusBg = (status) => {
    const bgs = { delivered: "#dcfce7", processing: "#fef3c7", pending: "#cffafe", cancelled: "#fee2e2" };
    return bgs[status] || "#f3f4f6";
  };

  return (
    <div className="user-profile-wrapper">
      <Header />
      <main className="user-profile-main">
        <div className="user-profile-container">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-card">
              <img src={avatarImg} alt="Avatar" className="profile-avatar" />
              <h2>{user.fullName}</h2>
              <p className="profile-email">{user.email}</p>
              <div className="profile-status">
                <span className="status-badge active">Hoạt động</span>
              </div>
              <p className="member-since">Thành viên từ {new Date(user.memberSince).toLocaleDateString("vi-VN")}</p>
              <div className="profile-actions">
                <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>Chỉnh sửa thông tin</button>
                <button className="btn-logout" onClick={handleLogout}>Đăng xuất</button>
              </div>
            </div>
            <div className="profile-quick-stats">
              <div className="stat-box">
                <div className="stat-number">{orders.length}</div>
                <div className="stat-label">Đơn hàng</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">{orders.filter((o) => o.status === "delivered").length}</div>
                <div className="stat-label">Đã giao</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">0</div>
                <div className="stat-label">Yêu thích</div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="profile-content">
            <div className="profile-tabs">
              {["profile", "orders", "address"].map((tab) => (
                <button
                  key={tab}
                  className={`tab-button ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "profile" ? "Thông tin cá nhân" : tab === "orders" ? "Lịch sử đơn hàng" : "Địa chỉ giao hàng"}
                </button>
              ))}
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="tab-content">
                {isEditing ? (
                  <div className="edit-form">
                    <h3>Chỉnh sửa thông tin</h3>
                    {[["fullName", "Họ và tên", "text"], ["email", "Email", "email"], ["phone", "Số điện thoại", "tel"], ["address", "Địa chỉ", "text"]].map(([name, label, type]) => (
                      <div className="form-group" key={name}>
                        <label>{label}</label>
                        <input type={type} name={name} value={editData[name]} onChange={handleEditChange} />
                      </div>
                    ))}
                    <div className="form-actions">
                      <button className="btn-save" onClick={handleSaveProfile}>Lưu</button>
                      <button className="btn-cancel" onClick={() => setIsEditing(false)}>Hủy</button>
                    </div>
                  </div>
                ) : (
                  <div className="profile-info">
                    <h3>Thông tin tài khoản</h3>
                    <div className="info-grid">
                      {[["Họ và tên", user.fullName], ["Email", user.email], ["Số điện thoại", user.phone], ["Địa chỉ", user.address]].map(([label, value]) => (
                        <div className="info-item" key={label}>
                          <label>{label}</label>
                          <p>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="tab-content">
                <h3>Lịch sử đơn hàng</h3>
                {orders.length > 0 ? (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div className="order-id-date">
                            <strong>{order.id}</strong>
                            <span>{new Date(order.date).toLocaleDateString("vi-VN")}</span>
                          </div>
                          <span
                            className="order-status-pill"
                            style={{ color: getStatusColor(order.status), background: getStatusBg(order.status) }}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        <div className="order-details">
                          <p>{order.items} sản phẩm</p>
                          <p className="order-total">{formatCurrency(order.total)}</p>
                        </div>
                        <button className="btn-view-order" onClick={() => handleViewOrderDetail(order)}>
                          Xem chi tiết
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">Bạn chưa có đơn hàng nào.</p>
                )}
              </div>
            )}

            {/* Address Tab */}
            {activeTab === "address" && (
              <div className="tab-content">
                <h3>Địa chỉ giao hàng</h3>
                <div className="address-section">
                  {showAddressForm ? (
                    <div className="address-form">
                      <h4>{editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}</h4>
                      <div className="form-group">
                        <label>Họ và tên *</label>
                        <input type="text" name="fullName" value={addressFormData.fullName} onChange={handleAddressFormChange} placeholder="Nhập họ và tên" />
                      </div>
                      <div className="form-group">
                        <label>Email *</label>
                        <input type="email" name="email" value={addressFormData.email} onChange={handleAddressFormChange} placeholder="example@email.com" />
                      </div>
                      <div className="form-group">
                        <label>Số điện thoại *</label>
                        <input type="tel" name="phone" value={addressFormData.phone} onChange={handleAddressFormChange} placeholder="0987654321" />
                      </div>
                      <div className="form-row">
                        {/* City */}
                        <div className="form-group">
                          <label>Thành phố/Tỉnh *</label>
                          <div className="custom-select-wrapper">
                            <div className="custom-select-header" onClick={() => { setShowCityDropdown(!showCityDropdown); setSearchCity(""); }}>
                              {addressFormData.city ? VIETNAM_CITIES.find((c) => c.id === addressFormData.city)?.name : "-- Chọn Thành phố/Tỉnh --"}
                              <span className="arrow">▼</span>
                            </div>
                            {showCityDropdown && (
                              <div className="custom-select-dropdown">
                                <input type="text" placeholder="Tìm kiếm..." value={searchCity} onChange={(e) => setSearchCity(e.target.value)} className="dropdown-search" onClick={(e) => e.stopPropagation()} />
                                <div className="dropdown-options">
                                  {filteredCities.map((city) => (
                                    <div key={city.id} className={`dropdown-option ${addressFormData.city === city.id ? "selected" : ""}`}
                                      onClick={() => { setAddressFormData((prev) => ({ ...prev, city: city.id, district: "" })); setShowCityDropdown(false); setSearchCity(""); setSearchDistrict(""); }}>
                                      {city.name}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* District */}
                        <div className="form-group">
                          <label>Quận/Huyện *</label>
                          <div className="custom-select-wrapper">
                            <div className={`custom-select-header ${!addressFormData.city ? "disabled" : ""}`}
                              onClick={() => { if (addressFormData.city) { setShowDistrictDropdown(!showDistrictDropdown); setSearchDistrict(""); } }}>
                              {addressFormData.district
                                ? DISTRICT_BY_CITY[addressFormData.city]?.find((d) => d.id === addressFormData.district)?.name
                                : "-- Chọn Quận/Huyện --"}
                              <span className="arrow">▼</span>
                            </div>
                            {showDistrictDropdown && addressFormData.city && (
                              <div className="custom-select-dropdown">
                                <input type="text" placeholder="Tìm kiếm..." value={searchDistrict} onChange={(e) => setSearchDistrict(e.target.value)} className="dropdown-search" onClick={(e) => e.stopPropagation()} />
                                <div className="dropdown-options">
                                  {filteredDistricts.length > 0 ? filteredDistricts.map((district) => (
                                    <div key={district.id} className={`dropdown-option ${addressFormData.district === district.id ? "selected" : ""}`}
                                      onClick={() => { setAddressFormData((prev) => ({ ...prev, district: district.id })); setShowDistrictDropdown(false); setSearchDistrict(""); }}>
                                      {district.name}
                                    </div>
                                  )) : <div className="no-results">Không tìm thấy kết quả</div>}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Ward */}
                        <div className="form-group">
                          <label>Phường/Xã *</label>
                          <div className="custom-select-wrapper">
                            <div className={`custom-select-header ${!addressFormData.district ? "disabled" : ""}`}
                              onClick={() => { if (addressFormData.district) { setShowWardDropdown(!showWardDropdown); setSearchWard(""); } }}>
                              {addressFormData.ward
                                ? WARD_BY_DISTRICT[addressFormData.district]?.find((w) => w.id === addressFormData.ward)?.name
                                : "-- Chọn Phường/Xã --"}
                              <span className="arrow">▼</span>
                            </div>
                            {showWardDropdown && addressFormData.district && (
                              <div className="custom-select-dropdown">
                                <input type="text" placeholder="Tìm kiếm..." value={searchWard} onChange={(e) => setSearchWard(e.target.value)} className="dropdown-search" onClick={(e) => e.stopPropagation()} />
                                <div className="dropdown-options">
                                  {filteredWards.length > 0 ? filteredWards.map((ward) => (
                                    <div key={ward.id} className={`dropdown-option ${addressFormData.ward === ward.id ? "selected" : ""}`}
                                      onClick={() => { setAddressFormData((prev) => ({ ...prev, ward: ward.id })); setShowWardDropdown(false); setSearchWard(""); }}>
                                      {ward.name}
                                    </div>
                                  )) : <div className="no-results">Không tìm thấy kết quả</div>}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Số nhà, tên đường *</label>
                        <input type="text" name="address" value={addressFormData.address} onChange={handleAddressFormChange} placeholder="123 Đường ABC" />
                      </div>
                      <div className="form-actions">
                        <button className="btn-save" onClick={handleSaveAddress}>{editingAddress ? "Cập nhật" : "Thêm"}</button>
                        <button className="btn-cancel" onClick={resetAddressForm}>Hủy</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="addresses-list">
                        {addresses.map((addr) => (
                          <div key={addr.id} className={`address-card ${addr.isDefault ? "default" : ""}`}>
                            {addr.isDefault && <span className="default-badge">Mặc định</span>}
                            <div className="address-info">
                              <p className="address-name"><strong>{addr.fullName}</strong></p>
                              <p className="address-phone">{addr.phone} | {addr.email}</p>
                              <p className="address-location">{addr.address}, {addr.district}, {addr.city}</p>
                            </div>
                            <div className="address-actions">
                              {!addr.isDefault && (
                                <button className="btn-default" onClick={() => handleSetDefaultAddress(addr.id)}>Đặt mặc định</button>
                              )}
                              <button className="btn-edit" onClick={() => handleEditAddress(addr)}>Chỉnh sửa</button>
                              <button className="btn-delete" onClick={() => handleDeleteAddress(addr.id)}>Xóa</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="btn-add-address" onClick={() => setShowAddressForm(true)}>+ Thêm địa chỉ mới</button>
                    </>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ✅ Modal - đặt ngoài cùng, fixed overlay */}
      {showOrderModal && selectedOrder && (
        <div
          className="modal-overlay"
          onClick={() => setShowOrderModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "16px",
            animation: "overlayFadeIn 0.2s ease",
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "560px",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
              animation: "modalSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 24px",
              borderBottom: "1px solid #f1f5f9",
              background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
              borderRadius: "16px 16px 0 0",
            }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                  Chi tiết đơn hàng
                </div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "#fff" }}>
                  {selectedOrder.id}
                </div>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#fff",
                  fontSize: "18px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px" }}>
              {/* Status & Date Row */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "24px",
              }}>
                <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "14px 16px" }}>
                  <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Ngày đặt</div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "#1e293b" }}>
                    📅 {new Date(selectedOrder.date).toLocaleDateString("vi-VN")}
                  </div>
                </div>
                <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "14px 16px" }}>
                  <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Trạng thái</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span style={{
                      display: "inline-block",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: getStatusColor(selectedOrder.status),
                    }} />
                    <span style={{ fontSize: "14px", fontWeight: 600, color: getStatusColor(selectedOrder.status) }}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                  Sản phẩm
                </div>
                <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
                  {/* Table header */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1.2fr 1.2fr",
                    background: "#f8fafc",
                    padding: "10px 16px",
                    borderBottom: "1px solid #e2e8f0",
                  }}>
                    {["Sản phẩm", "SL", "Đơn giá", "Thành tiền"].map((h) => (
                      <div key={h} style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</div>
                    ))}
                  </div>
                  {/* Table rows */}
                  {selectedOrder.details.map((item, idx) => (
                    <div key={idx} style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1.2fr 1.2fr",
                      padding: "14px 16px",
                      borderBottom: idx < selectedOrder.details.length - 1 ? "1px solid #f1f5f9" : "none",
                      alignItems: "center",
                      transition: "background 0.15s",
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "14px" }}>{item.name}</div>
                      <div style={{ color: "#64748b", fontSize: "14px" }}>×{item.qty}</div>
                      <div style={{ color: "#64748b", fontSize: "14px" }}>{formatCurrency(item.price)}</div>
                      <div style={{ fontWeight: 700, color: "#1e40af", fontSize: "14px" }}>{formatCurrency(item.price * item.qty)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                borderRadius: "10px",
                padding: "16px 20px",
                border: "1px solid #bfdbfe",
              }}>
                <span style={{ fontWeight: 600, color: "#1e40af", fontSize: "15px" }}>Tổng thanh toán</span>
                <span style={{ fontWeight: 800, color: "#1e40af", fontSize: "20px" }}>
                  {formatCurrency(selectedOrder.total)}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: "16px 24px",
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "flex-end",
            }}>
              <button
                onClick={() => setShowOrderModal(false)}
                style={{
                  background: "linear-gradient(135deg, #1e40af, #3b82f6)",
                  color: "#fff",
                  border: "none",
                  padding: "10px 28px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                  transition: "opacity 0.2s, transform 0.1s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { transform: translateY(30px) scale(0.97); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>

      <Footer />
    </div>
  );
}

function formatCurrency(value) {
  if (value == null) return "0 ₫";
  try {
    return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  } catch (e) {
    return value + " ₫";
  }
}
