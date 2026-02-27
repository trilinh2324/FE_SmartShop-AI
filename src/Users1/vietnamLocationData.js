import { WARD_BY_DISTRICT } from './vietnamWardsData';

// Thành phố trực thuộc trung ương và các tỉnh
export const VIETNAM_CITIES = [
  // Thành phố trực thuộc trung ương
  { id: "hn", name: "Hà Nội", type: "Thành phố" },
  { id: "hcm", name: "TP. Hồ Chí Minh", type: "Thành phố" },
  { id: "dn", name: "Đà Nẵng", type: "Thành phố" },
  { id: "hp", name: "Hải Phòng", type: "Thành phố" },
  { id: "ct", name: "Cần Thơ", type: "Thành phố" },
  
  // Các tỉnh
  { id: "ag", name: "An Giang", type: "Tỉnh" },
  { id: "bg", name: "Bắc Giang", type: "Tỉnh" },
  { id: "bk", name: "Bắc Kạn", type: "Tỉnh" },
  { id: "bl", name: "Bạc Liêu", type: "Tỉnh" },
  { id: "bn", name: "Bắc Ninh", type: "Tỉnh" },
  { id: "bp", name: "Bình Phước", type: "Tỉnh" },
  { id: "bd", name: "Bình Định", type: "Tỉnh" },
  { id: "bt", name: "Bình Thuận", type: "Tỉnh" },
  { id: "bd2", name: "Bình Dương", type: "Tỉnh" },
  { id: "cb", name: "Cao Bằng", type: "Tỉnh" },
  { id: "cm", name: "Cà Mau", type: "Tỉnh" },
  { id: "dl", name: "Đắk Lắk", type: "Tỉnh" },
  { id: "dn2", name: "Đắk Nông", type: "Tỉnh" },
  { id: "db", name: "Điện Biên", type: "Tỉnh" },
  { id: "dt", name: "Đồng Tháp", type: "Tỉnh" },
  { id: "dn3", name: "Đồng Nai", type: "Tỉnh" },
  { id: "gl", name: "Gia Lai", type: "Tỉnh" },
  { id: "hg", name: "Hà Giang", type: "Tỉnh" },
  { id: "ht", name: "Hà Tĩnh", type: "Tỉnh" },
  { id: "hd", name: "Hải Dương", type: "Tỉnh" },
  { id: "hg2", name: "Hậu Giang", type: "Tỉnh" },
  { id: "hb", name: "Hòa Bình", type: "Tỉnh" },
  { id: "kh", name: "Khánh Hòa", type: "Tỉnh" },
  { id: "kg", name: "Kiên Giang", type: "Tỉnh" },
  { id: "kt", name: "Kon Tum", type: "Tỉnh" },
  { id: "lc", name: "Lai Châu", type: "Tỉnh" },
  { id: "ld", name: "Lâm Đồng", type: "Tỉnh" },
  { id: "ls", name: "Lạng Sơn", type: "Tỉnh" },
  { id: "lc2", name: "Lào Cai", type: "Tỉnh" },
  { id: "la", name: "Long An", type: "Tỉnh" },
  { id: "nd", name: "Nam Định", type: "Tỉnh" },
  { id: "na", name: "Nghệ An", type: "Tỉnh" },
  { id: "nt", name: "Ninh Thuận", type: "Tỉnh" },
  { id: "nb", name: "Ninh Bình", type: "Tỉnh" },
  { id: "pt", name: "Phú Thọ", type: "Tỉnh" },
  { id: "py", name: "Phú Yên", type: "Tỉnh" },
  { id: "qb", name: "Quảng Bình", type: "Tỉnh" },
  { id: "qn", name: "Quảng Nam", type: "Tỉnh" },
  { id: "qng", name: "Quảng Ngãi", type: "Tỉnh" },
  { id: "qn2", name: "Quảng Ninh", type: "Tỉnh" },
  { id: "qt", name: "Quảng Trị", type: "Tỉnh" },
  { id: "th", name: "Thanh Hóa", type: "Tỉnh" },
  { id: "th2", name: "Thừa Thiên Huế", type: "Tỉnh" },
  { id: "tg", name: "Tiền Giang", type: "Tỉnh" },
  { id: "tv", name: "Trà Vinh", type: "Tỉnh" },
  { id: "tq", name: "Tuyên Quang", type: "Tỉnh" },
  { id: "vl", name: "Vĩnh Long", type: "Tỉnh" },
  { id: "vp", name: "Vĩnh Phúc", type: "Tỉnh" },
  { id: "yb", name: "Yên Bái", type: "Tỉnh" },
  { id: "sg", name: "Sóc Trăng", type: "Tỉnh" },
  { id: "sl", name: "Sơn La", type: "Tỉnh" },
  { id: "tn", name: "Tây Ninh", type: "Tỉnh" },
  { id: "thb", name: "Thái Bình", type: "Tỉnh" },
  { id: "thn", name: "Thái Nguyên", type: "Tỉnh" },
];

export const DISTRICT_BY_CITY = {
  hn: [
    { id: "ba", name: "Quận Ba Đình" },
    { id: "hk", name: "Quận Hoàn Kiếm" },
    { id: "th", name: "Quận Tây Hồ" },
    { id: "cg", name: "Quận Cầu Giấy" },
    { id: "dd", name: "Quận Đống Đa" },
    { id: "hbt", name: "Quận Hai Bà Trưng" },
    { id: "hm", name: "Quận Hoàng Mai" },
    { id: "lb", name: "Quận Long Biên" },
    { id: "tc", name: "Quận Thanh Xuân" },
    { id: "htb", name: "Huyện Hoài Đức" },
    { id: "gl", name: "Huyện Gia Lâm" },
    { id: "ss", name: "Huyện Sóc Sơn" },
    { id: "da", name: "Huyện Đông Anh" },
    { id: "qo", name: "Huyện Quốc Oai" },
    { id: "tt", name: "Huyện Thạch Thất" },
    { id: "cm", name: "Huyện Chương Mỹ" },
    { id: "pt", name: "Huyện Phúc Thọ" },
    { id: "dp", name: "Huyện Đan Phương" },
    { id: "md", name: "Huyện Mỹ Đức" },
  ],
  hcm: [
    { id: "q1", name: "Quận 1" },
    { id: "q2", name: "Quận 2" },
    { id: "q3", name: "Quận 3" },
    { id: "q4", name: "Quận 4" },
    { id: "q5", name: "Quận 5" },
    { id: "q6", name: "Quận 6" },
    { id: "q7", name: "Quận 7" },
    { id: "q8", name: "Quận 8" },
    { id: "q9", name: "Quận 9" },
    { id: "q10", name: "Quận 10" },
    { id: "q11", name: "Quận 11" },
    { id: "q12", name: "Quận 12" },
    { id: "tbu", name: "Quận Tân Bình" },
    { id: "tph", name: "Quận Tân Phú" },
    { id: "gv", name: "Quận Gò Vấp" },
    { id: "bt", name: "Quận Bình Tân" },
    { id: "bta", name: "Quận Bình Thạnh" },
    { id: "cc", name: "Huyện Củ Chi" },
    { id: "hm2", name: "Huyện Hóc Môn" },
    { id: "nv", name: "Huyện Nhà Bè" },
    { id: "cg2", name: "Huyện Cần Giờ" },
  ],
  dn: [
    { id: "hc", name: "Quận Hải Châu" },
    { id: "thk", name: "Quận Thanh Khe" },
    { id: "st", name: "Quận Sơn Trà" },
    { id: "cl", name: "Quận Cẩm Lệ" },
    { id: "nhs", name: "Huyện Ngũ Hành Sơn" },
    { id: "lc", name: "Huyện Liên Chiểu" },
    { id: "hv", name: "Huyện Hòa Vang" },
  ],
  hp: [
    { id: "hb", name: "Quận Hồng Bàng" },
    { id: "nq", name: "Quận Ngô Quyền" },
    { id: "lch", name: "Quận Lê Chân" },
    { id: "ka", name: "Quận Kiến An" },
    { id: "thh", name: "Quận Thái Hòa" },
  ],
  ct: [
    { id: "nk", name: "Quận Ninh Kiều" },
    { id: "cr", name: "Quận Cái Răng" },
    { id: "om", name: "Quận Ô Môn" },
    { id: "tn", name: "Quận Thốt Nốt" },
  ],
  ag: [
    { id: "lt", name: "Thành phố Long Xuyên" },
    { id: "cd", name: "Thành phố Châu Đốc" },
    { id: "chm", name: "Huyện Chợ Mới" },
    { id: "tb", name: "Huyện Tịnh Biên" },
    { id: "pt_ag", name: "Huyện Phú Tân" },
    { id: "ap", name: "Huyện An Phú" },
    { id: "cp", name: "Huyện Châu Phú" },
    { id: "ch", name: "Huyện Chợ Chùa" },
  ],
  bg: [
    { id: "bg", name: "Thành phố Bắc Giang" },
    { id: "lg_bg", name: "Huyện Lạng Giang" },
    { id: "yt_bg", name: "Huyện Yên Thế" },
    { id: "ty_bg", name: "Huyện Tân Yên" },
    { id: "vy_bg", name: "Huyện Việt Yên" },
  ],
  bk: [
    { id: "bk", name: "Thành phố Bắc Kạn" },
    { id: "bk_hc", name: "Huyện Bắc Kạn" },
    { id: "bb", name: "Huyện Ba Bể" },
    { id: "cd_bk", name: "Huyện Chợ Đồn" },
    { id: "tng", name: "Huyện Thái Nguyên" },
  ],
  bl: [
    { id: "bl", name: "Thành phố Bạc Liêu" },
    { id: "bl_hc", name: "Huyện Bạc Liêu" },
    { id: "hb_bl", name: "Huyện Hòa Bình" },
  ],
  bn: [
    { id: "bn", name: "Thành phố Bắc Ninh" },
    { id: "bn_hc", name: "Huyện Bắc Ninh" },
    { id: "yp_bn", name: "Huyện Yên Phong" },
  ],
  bp: [
    { id: "dx", name: "Thành phố Đồng Xoài" },
    { id: "bd_bp", name: "Huyện Bù Đắp" },
    { id: "ct_bp", name: "Huyện Chơn Thành" },
    { id: "ln", name: "Huyện Lộc Ninh" },
  ],
  bd: [
    { id: "qn", name: "Thành phố Quy Nhơn" },
    { id: "pc", name: "Huyện Phù Cát" },
    { id: "ts_bd", name: "Huyện Tây Sơn" },
  ],
  bt: [
    { id: "pt_bt", name: "Thành phố Phan Thiết" },
    { id: "tp_bt", name: "Huyện Tuy Phong" },
    { id: "htn", name: "Huyện Hàm Thuận Nam" },
    { id: "htb_bt", name: "Huyện Hàm Thuận Bắc" },
  ],
  bd2: [
    { id: "tdm", name: "Thành phố Thủ Dầu Một" },
    { id: "bc_bd", name: "Huyện Bến Cát" },
    { id: "bb_bd", name: "Huyện Bàu Bàng" },
    { id: "pg", name: "Huyện Phú Giáo" },
  ],
  cb: [
    { id: "cb", name: "Thành phố Cao Bằng" },
    { id: "bl_cb", name: "Huyện Bảo Lâm" },
    { id: "tng_cb", name: "Huyện Thái Nguyên" },
    { id: "hl_cb", name: "Huyện Hạ Lang" },
  ],
  cm: [
    { id: "cm", name: "Thành phố Cà Mau" },
    { id: "cm_hc", name: "Huyện Cà Mau" },
    { id: "nc_cm", name: "Huyện Năm Căn" },
    { id: "um", name: "Huyện U Minh" },
  ],
  dl: [
    { id: "dl", name: "Thành phố Buôn Ma Thuột" },
    { id: "kn", name: "Huyện Krông Năng" },
    { id: "kb", name: "Huyện Krông Bông" },
    { id: "lak", name: "Huyện Lắk" },
  ],
  dn2: [
    { id: "gn", name: "Thành phố Gia Nghĩa" },
    { id: "td3", name: "Huyện Tân Dung" },
  ],
  db: [
    { id: "db", name: "Thành phố Điện Biên Phủ" },
    { id: "ma", name: "Huyện Mường Ảng" },
    { id: "mch", name: "Huyện Mường Chà" },
    { id: "tch", name: "Huyện Tủa Chùa" },
  ],
  dt: [
    { id: "dt", name: "Thành phố Cao Lãnh" },
    { id: "hn_dt", name: "Huyện Hồng Ngu" },
    { id: "lv", name: "Huyện Lấp Vò" },
    { id: "tm", name: "Huyện Tháp Mười" },
  ],
  dn3: [
    { id: "dn", name: "Thành phố Biên Hòa" },
    { id: "tn_dn", name: "Huyện Thống Nhất" },
    { id: "tb_dn", name: "Huyện Trảng Bom" },
    { id: "lt_dn", name: "Huyện Long Thành" },
  ],
  gl: [
    { id: "gl", name: "Thành phố Pleiku" },
    { id: "cs", name: "Huyện Chư Sê" },
    { id: "cp_gl", name: "Huyện Chư Prông" },
    { id: "kp", name: "Huyện Krông Pa" },
  ],
  hg: [
    { id: "hg", name: "Thành phố Hà Giang" },
    { id: "dv_hg", name: "Huyện Đông Văn" },
    { id: "mv", name: "Huyện Mèo Vạc" },
    { id: "ym", name: "Huyện Yên Minh" },
  ],
  ht: [
    { id: "ht", name: "Thành phố Hà Tĩnh" },
    { id: "hk_ht", name: "Huyện Hương Khê" },
    { id: "ka_ht", name: "Huyện Kỳ Anh" },
    { id: "th_ht", name: "Huyện Thạch Hà" },
  ],
  hd: [
    { id: "hd", name: "Thành phố Hải Dương" },
    { id: "cl_hd", name: "Huyện Chí Linh" },
    { id: "kx", name: "Huyện Kiến Xương" },
    { id: "th_hd", name: "Huyện Thanh Hà" },
  ],
  hg2: [
    { id: "hg2", name: "Thành phố Vị Thanh" },
    { id: "hg2_hc", name: "Huyện Hậu Giang" },
    { id: "ph", name: "Huyện Phụng Hiệp" },
  ],
  hb: [
    { id: "hb", name: "Thành phố Hòa Bình" },
    { id: "kb_hb", name: "Huyện Kim Bôi" },
    { id: "ls_hb", name: "Huyện Lạc Sơn" },
    { id: "tl_hb", name: "Huyện Tân Lạc" },
  ],
  kh: [
    { id: "kh", name: "Thành phố Nha Trang" },
    { id: "cr", name: "Huyện Cam Ranh" },
    { id: "dk_kh", name: "Huyện Diên Khánh" },
    { id: "vn_kh", name: "Huyện Vạn Ninh" },
  ],
  kg: [
    { id: "kg", name: "Thành phố Rạch Giá" },
    { id: "hd_kg", name: "Huyện Hòn Đất" },
    { id: "th_kg", name: "Huyện Tân Hiệp" },
    { id: "kl", name: "Huyện Kiên Lương" },
  ],
  kt: [
    { id: "kt", name: "Thành phố Kon Tum" },
    { id: "kpl", name: "Huyện Kon Plong" },
    { id: "dg", name: "Huyện Đắk Glei" },
  ],
  lc: [
    { id: "lc", name: "Thành phố Lai Châu" },
  ],
  ld: [
    { id: "dl", name: "Thành phố Đà Lạt" },
    { id: "dd_ld", name: "Huyện Đất Đỏ" },
    { id: "lh_ld", name: "Huyện Lâm Hà" },
  ],
  ls: [
    { id: "ls", name: "Thành phố Lạng Sơn" },
    { id: "chil", name: "Huyện Chi Lăng" },
    { id: "nq_ls", name: "Huyện Nà Qua" },
  ],
  lc2: [
    { id: "lc2", name: "Thành phố Lào Cai" },
    { id: "bh_lc", name: "Huyện Bạc Hà" },
    { id: "bt_lc", name: "Huyện Bảo Thắng" },
  ],
  la: [
    { id: "la", name: "Thành phố Tân An" },
    { id: "cg_la", name: "Huyện Cần Giuộc" },
    { id: "cd_la", name: "Huyện Cần Đước" },
  ],
  nd: [
    { id: "nd", name: "Thành phố Nam Định" },
    { id: "yy", name: "Huyện Ý Yên" },
    { id: "gt", name: "Huyện Giao Thủy" },
  ],
  na: [
    { id: "na", name: "Thành phố Vinh" },
    { id: "hn_na", name: "Huyện Hưng Nguyên" },
    { id: "as", name: "Huyện Anh Sơn" },
  ],
  nt: [
    { id: "nt", name: "Huyện Ninh Thượng" },
    { id: "nh", name: "Huyện Ninh Hải" },
  ],
  nb: [
    { id: "nb", name: "Thành phố Ninh Bình" },
    { id: "gv_nb", name: "Huyện Gia Viễn" },
  ],
  pt: [
    { id: "pt", name: "Thành phố Phú Thọ" },
    { id: "tb_pt", name: "Huyện Thanh Ba" },
  ],
  py: [
    { id: "py", name: "Thành phố Tuy Hòa" },
    { id: "ph_py", name: "Huyện Phú Hòa" },
  ],
  qb: [
    { id: "qb", name: "Thành phố Quảng Bình" },
    { id: "qb_hc", name: "Huyện Quảng Bình" },
  ],
  qn: [
    { id: "qa", name: "Thành phố Hội An" },
    { id: "tb_qa", name: "Huyện Thăng Bình" },
  ],
  qng: [
    { id: "qn", name: "Thành phố Quảng Ngãi" },
    { id: "qn_hc", name: "Huyện Quảng Ngãi" },
  ],
  qn2: [
    { id: "qn2", name: "Thành phố Hạ Long" },
    { id: "ct_qn", name: "Huyện Cô Tô" },
  ],
  qt: [
    { id: "qt", name: "Thành phố Đông Hà" },
    { id: "qt_hc", name: "Huyện Quảng Trị" },
  ],
  th: [
    { id: "th_tp", name: "Thành phố Thanh Hóa" },
    { id: "bm_tp", name: "Thành phố Bỉm Sơn" },
    { id: "ss_tp", name: "Thành phố Sâm Sơn" },
    { id: "hl_hc", name: "Huyện Hậu Lộc" },
    { id: "hh_hc", name: "Huyện Hoằng Hóa" },
    { id: "tg_hc", name: "Huyện Tĩnh Gia" },
    { id: "yd_hc", name: "Huyện Yên Định" },
    { id: "nc_hc", name: "Huyện Nông Cống" },
    { id: "vl_hc", name: "Huyện Vĩnh Lộc" },
    { id: "qx_hc", name: "Huyện Quảng Xương" },
    { id: "ds_hc", name: "Huyện Đông Sơn" },
    { id: "nx_hc", name: "Huyện Như Xuân" },
    { id: "ct_hc", name: "Huyện Cẩm Thủy" },
  ],
  th2: [
    { id: "hue_ct", name: "Thành phố Huế" },
    { id: "pl", name: "Huyện Phú Lộc" },
  ],
  tg: [
    { id: "mt_ct", name: "Thành phố Mỹ Tho" },
    { id: "cb_tg", name: "Huyện Cái Bè" },
  ],
  tv: [
    { id: "tv_ct", name: "Thành phố Trà Vinh" },
    { id: "tv_hc", name: "Huyện Trà Vinh" },
  ],
  tq: [
    { id: "tq_ct", name: "Thành phố Tuyên Quang" },
    { id: "tq_hc", name: "Huyện Tuyên Quang" },
  ],
  vl: [
    { id: "vl_ct", name: "Thành phố Vĩnh Long" },
    { id: "vl_hc", name: "Huyện Vĩnh Long" },
  ],
  vp: [
    { id: "vp_ct", name: "Thành phố Vĩnh Phúc" },
    { id: "vp_hc", name: "Huyện Vĩnh Phúc" },
  ],
  yb: [
    { id: "yb_ct", name: "Thành phố Yên Bái" },
    { id: "yb_hc", name: "Huyện Yên Bái" },
  ],
  sg: [
    { id: "sg_ct", name: "Thành phố Sóc Trăng" },
    { id: "sg_hc", name: "Huyện Sóc Trăng" },
  ],
  sl: [
    { id: "sl_ct", name: "Thành phố Sơn La" },
    { id: "sl_hc", name: "Huyện Sơn La" },
  ],
  tn: [
    { id: "tn_ct", name: "Thành phố Tây Ninh" },
    { id: "tn_hc", name: "Huyện Tây Ninh" },
  ],
  thb: [
    { id: "thb_ct", name: "Thành phố Thái Bình" },
    { id: "thb_hc", name: "Huyện Thái Bình" },
  ],
  thn: [
    { id: "thn_ct", name: "Thành phố Thái Nguyên" },
    { id: "thn_hc", name: "Huyện Thái Nguyên" },
  ],
};

export const getDistricts = (cityId) => {
  return DISTRICT_BY_CITY[cityId] || [];
};

export const getWards = (districtId) => {
  return WARD_BY_DISTRICT[districtId] || [];
};

export const getCityName = (cityId) => {
  const city = VIETNAM_CITIES.find(c => c.id === cityId);
  return city ? city.name : '';
};

export const getDistrictName = (cityId, districtId) => {
  const districts = getDistricts(cityId);
  const district = districts.find(d => d.id === districtId);
  return district ? district.name : '';
};

export const getWardName = (districtId, wardId) => {
  const wards = getWards(districtId);
  const ward = wards.find(w => w.id === wardId);
  return ward ? ward.name : '';
};

export { WARD_BY_DISTRICT };