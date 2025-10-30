# CertiChain - Hướng dẫn sử dụng UI với Database

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

## 📁 Data Source
Dữ liệu được lấy từ API thật qua `/api/certificates`

## 🧪 Quick Test

### 1. Xác minh chứng chỉ (Verify)
- Truy cập: `/verify`
- Nhập hash để test:
  ```
  2efb9c8e48e3ae48c92778cf08fcea01ba8091cfdbacd2609d97747db3b34001
  ```
  ✅ Kết quả: Hợp lệ - Chứng chỉ của Danica Jane Maglayo

### 2. Dashboard - Xem danh sách chứng chỉ
- Truy cập: `/dashboard`
- Hiển thị 8 chứng chỉ từ database với thống kê
- Trạng thái: Tất cả đều Pending (chưa đăng ký blockchain)

### 3. Tạo chứng chỉ mới
- Truy cập: `/certificates/create`
- Điền form:
  - Tên sinh viên
  - Mã sinh viên
  - Tên khóa học
  - Upload file chứng chỉ
- API sẽ tạo chứng chỉ mới và lưu vào database

### 4. Chi tiết chứng chỉ
- Truy cập: `/certificates/1` đến `/certificates/8`
- Xem thông tin chi tiết + QR code
- Click "Xem chứng chỉ" để xem giao diện chứng chỉ đẹp
- Các ID có sẵn: 1, 2, 3, 4, 5, 6, 7, 8

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

## 📊 Test Data từ Database

### Các file hash có sẵn (tất cả đều Pending):
1. **Danica Jane Maglayo** - CPA Board Exam
   - Hash: `2efb9c8e48e3ae48c92778cf08fcea01ba8091cfdbacd2609d97747db3b34001`
   - Student ID: httt22001

2. **Jane Doe** - Blockchain Achievement
   - Hash: `24d3300b4cb276e7110527d6d5e7f3856c5b2f049c9ccc5a9d3080d9b610b11b`
   - Student ID: httt22002

3. **Jennifer Benbow** - CPA Board Exam
   - Hash: `cbddcf032651fc6983fb61ccbceb226e1e436dd41f697e9692f17377eb8d6e78`
   - Student ID: httt22003

4. **Liang Shu-Hsiang** - Toeic Certificate
   - Hash: `fc085bee6fa69a7fd8a93b25c75162acf7ebc9c5c0ee563d822d4a1683cc7f8b`
   - Student ID: httt22004

5. **Mariah Smith** - Blockchain Achievement
   - Hash: `d48d31973a2676fff595a3a4ab2c6a8735589b83d9b2c0619f16e7663e4d4321`
   - Student ID: httt22005

6. **Peter Baker** - Best Employee Blockchain
   - Hash: `33c393dcc9a8c0210d48798cac743e5741aa1d9d074f554ca4fdbfc85454756a`
   - Student ID: httt22006

7. **Willie Smith** - CraftMyPDF Education
   - Hash: `f1383e98fe7a20c51cdd8e42ecf5667c9d29510fb84de75e3e4ab696861ded3a`
   - Student ID: httt22007

8. **Nguyễn Hữu Hoàn Thiện** - Vstep Certificate
   - Hash: `146687b95c77271ad1e4922a3999bf857ba69b87a5ca5c37eb723dbda0350c04`
   - Student ID: httt22008


## 🔧 Database Setup

### Chạy seed data:
```bash
# Chạy Prisma seed để tạo dữ liệu mẫu
npx prisma db seed
```

### Cấu hình cần thiết:
- Database: PostgreSQL (qua Prisma)
- Blockchain: Ethereum/Polygon (tùy cấu hình)
- IPFS: Pinata hoặc IPFS node local

## 📝 Lưu ý
- Tất cả chức năng hoạt động với API thật
- Sử dụng development mode mặc định
- Cần cấu hình database và blockchain
- Dữ liệu được seed sẵn 8 chứng chỉ mẫu

## 🎨 Thiết kế Chứng chỉ
- Hiển thị chứng chỉ với thiết kế đẹp mắt, chuẩn chứng chỉ quốc tế
- Format PDF A4 landscape
- Các trường thông tin tự động điền từ database
- QR Code tích hợp để xác minh trên blockchain
- Footer có link xác minh và hash để tra cứu

## 🛠️ Libraries sử dụng
- `qrcode.react`: Tạo mã QR code
- `jspdf` & `html2canvas`: PDF export (nếu cần)