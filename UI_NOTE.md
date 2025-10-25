# CertiChain - Hướng dẫn sử dụng UI với Mock Data

## 🚀 Khởi động dự án

```bash
# Cài đặt dependencies (với --legacy-peer-deps cho React 19)
npm install --legacy-peer-deps

# Hoặc sử dụng script có sẵn
npm run install:all

# Chạy development server
npm run dev
```

Ứng dụng chạy tại `http://localhost:3000`

## 📁 Mock Data Location
Mock data được lưu tại: `src/mockData/`

## 🧪 Quick Test

### 1. Xác minh chứng chỉ (Verify)
- Truy cập: `/verify`
- Nhập hash để test:
  ```
  0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
  ```
  ✅ Kết quả: Hợp lệ - Chứng chỉ của Nguyễn Văn An

### 2. Dashboard - Xem danh sách chứng chỉ
- Truy cập: `/dashboard`
- Hiển thị 5 chứng chỉ mẫu với thống kê
- Trạng thái: Verified (3), Pending (2)

### 3. Tạo chứng chỉ mới
- Truy cập: `/certificates/create`
- Điền form:
  - Tên sinh viên
  - Mã sinh viên
  - Tên khóa học
  - Upload file chứng chỉ
- Mock API sẽ tạo chứng chỉ mới với delay 1-3 giây

### 4. Chi tiết chứng chỉ
- Truy cập: `/certificates/1` hoặc `/certificates/2`, v.v.
- Xem thông tin chi tiết + QR code
- Click "Xem chứng chỉ" để xem giao diện chứng chỉ đẹp
- Các ID có sẵn: 1, 2, 3, 4, 5

### 5. Xem & Tải chứng chỉ (Certificate Display)
- Truy cập: `/certificates/view/1` hoặc click "Xem chứng chỉ" từ trang chi tiết
- Hiển thị chứng chỉ với thiết kế đẹp mắt, chuẩn chứng chỉ thật
- Các trường thông tin động:
  - Tên sinh viên
  - Mã sinh viên
  - Tên khóa học
  - Ngày cấp
  - File Hash
  - Transaction Hash (nếu có)
  - Link xác minh
  - QR Code
- Chức năng:
  - **Tải PDF**: Xuất chứng chỉ ra PDF để in
  - **Chia sẻ**: Share chứng chỉ với link xác minh
  - **QR Code**: Quét mã QR để xác minh

## 📊 Test Data

### Các hash hợp lệ:
- `0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef` → Verified
- `0x2345678901bcdef2345678901bcdef2345678901bcdef2345678901bcdef234567` → Verified
- `0x4567890123def4567890123def4567890123def4567890123def456789012345` → Verified

### Các hash không hợp lệ:
- `0x3456789012cdef3456789012cdef3456789012cdef3456789012cdef34567890` → Not found
- `0x5678901234ef5678901234ef5678901234ef5678901234ef5678901234ef567890` → Pending

## 🔧 Mock API Behavior
- Delay ngẫu nhiên 0.5-3 giây
- Tỷ lệ lỗi: 5%
- Không cần kết nối thực tế với blockchain

## 📝 Lưu ý
- Tất cả chức năng hoạt động offline với mock data
- Sử dụng development mode mặc định
- Không cần cấu hình blockchain

## 🎨 Thiết kế Chứng chỉ
- Hiển thị chứng chỉ với thiết kế đẹp mắt, chuẩn chứng chỉ quốc tế
- Format PDF A4 landscape
- Các trường thông tin tự động điền từ mock data
- QR Code tích hợp để xác minh trên blockchain
- Footer có link xác minh và hash để tra cứu

## 🛠️ Libraries sử dụng
- `react-to-print`: Xuất chứng chỉ ra PDF
- `qrcode.react`: Tạo mã QR code
- `jspdf` & `html2canvas`: Backup PDF export (nếu cần)