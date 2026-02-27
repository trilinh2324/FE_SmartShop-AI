# Hướng dẫn sử dụng dữ liệu Hành chính Việt Nam

## Thông tin được cung cấp

File này chứa đầy đủ dữ liệu về:
- **5 Thành phố trực thuộc Trung ương**: Hà Nội, TP. Hồ Chí Minh, Đà Nẵng, Hải Phòng, Cần Thơ
- **63 Tỉnh**: An Giang, Bắc Giang, Bắc Kạn... Yên Bái
- **Quận/Huyện**: Toàn bộ quận/huyện của các thành phố và tỉnh
- **Phường/Xã**: Chi tiết các phường và xã

## Cách sử dụng

### 1. Import các functions

```javascript
import { 
  VIETNAM_CITIES,           // Danh sách tất cả thành phố và tỉnh
  DISTRICT_BY_CITY,         // Danh sách quận/huyện theo thành phố/tỉnh
  WARD_BY_DISTRICT,         // Danh sách phường/xã theo quận/huyện
  getDistricts,             // Hàm lấy quận/huyện
  getWards,                 // Hàm lấy phường/xã
  getCityName,              // Hàm lấy tên thành phố/tỉnh
  getDistrictName,          // Hàm lấy tên quận/huyện
  getWardName               // Hàm lấy tên phường/xã
} from './vietnamLocationData';
```

### 2. Lấy danh sách tất cả thành phố/tỉnh

```javascript
// Kết quả: Mảng 68 thành phố/tỉnh
const cities = VIETNAM_CITIES;

// Duyệt qua từng thành phố
cities.forEach(city => {
  console.log(city.id);    // VD: "hn", "hcm"
  console.log(city.name);  // VD: "Hà Nội", "TP. Hồ Chí Minh"
  console.log(city.type);  // "Thành phố" hoặc "Tỉnh"
});
```

### 3. Lấy danh sách quận/huyện của một thành phố

```javascript
// Lấy quận/huyện của Hà Nội
const hanoidDistricts = getDistricts('hn');
// VD: [{id: "ba", name: "Quận Ba Đình"}, ...]

// Hoặc truy cập trực tiếp
const hcmDistricts = DISTRICT_BY_CITY['hcm'];
```

### 4. Lấy danh sách phường/xã của một quận/huyện

```javascript
// Lấy phường/xã của Quận Ba Đình (Hà Nội)
const badinh_wards = getWards('ba');
// VD: [{id: "p1", name: "Phường Trúc Bạch"}, ...]

// Hoặc truy cập trực tiếp
const wards = WARD_BY_DISTRICT['ba'];
```

### 5. Lấy tên từ ID

```javascript
// Lấy tên thành phố từ ID
const cityName = getCityName('hn'); // "Hà Nội"

// Lấy tên quận/huyện
const districtName = getDistrictName('hn', 'ba'); // "Quận Ba Đình"

// Lấy tên phường/xã
const wardName = getWardName('ba', 'p1'); // "Phường Trúc Bạch"
```

## Ví dụ React Component

```javascript
import React, { useState } from 'react';
import { VIETNAM_CITIES, getDistricts, getWards } from './vietnamLocationData';

function LocationSelector() {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  const districts = selectedCity ? getDistricts(selectedCity) : [];
  const wards = selectedDistrict ? getWards(selectedDistrict) : [];

  return (
    <div>
      {/* Chọn Thành phố/Tỉnh */}
      <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
        <option value="">-- Chọn Thành phố/Tỉnh --</option>
        {VIETNAM_CITIES.map(city => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>

      {/* Chọn Quận/Huyện */}
      <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
        <option value="">-- Chọn Quận/Huyện --</option>
        {districts.map(district => (
          <option key={district.id} value={district.id}>
            {district.name}
          </option>
        ))}
      </select>

      {/* Chọn Phường/Xã */}
      <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)}>
        <option value="">-- Chọn Phường/Xã --</option>
        {wards.map(ward => (
          <option key={ward.id} value={ward.id}>
            {ward.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LocationSelector;
```

## ID Thành phố/Tỉnh

| ID | Tên | Loại |
|---|---|---|
| hn | Hà Nội | Thành phố |
| hcm | TP. Hồ Chí Minh | Thành phố |
| dn | Đà Nẵng | Thành phố |
| hp | Hải Phòng | Thành phố |
| ct | Cần Thơ | Thành phố |
| ag | An Giang | Tỉnh |
| bg | Bắc Giang | Tỉnh |
| bk | Bắc Kạn | Tỉnh |
| bl | Bạc Liêu | Tỉnh |
| bn | Bắc Ninh | Tỉnh |
| ... | (và 53 tỉnh khác) | Tỉnh |

## Cấu trúc dữ liệu

### VIETNAM_CITIES
```javascript
[
  { id: "hn", name: "Hà Nội", type: "Thành phố" },
  { id: "hcm", name: "TP. Hồ Chí Minh", type: "Thành phố" },
  ...
]
```

### DISTRICT_BY_CITY
```javascript
{
  hn: [
    { id: "ba", name: "Quận Ba Đình" },
    { id: "hk", name: "Quận Hoàn Kiếm" },
    ...
  ],
  hcm: [...]
}
```

### WARD_BY_DISTRICT
```javascript
{
  ba: [
    { id: "p1", name: "Phường Trúc Bạch" },
    { id: "p2", name: "Phường Cống Vị" },
    ...
  ],
  hk: [...]
}
```

## Ghi chú

- Dữ liệu được cập nhật đầy đủ cho tất cả thành phố và tỉnh
- Mỗi quận/huyện có danh sách đầy đủ các phường/xã
- ID được sử dụng là mã viết tắt để dễ sử dụng
- Dữ liệu được tổ chức để dễ dàng tích hợp với form hoặc dropdown selects
