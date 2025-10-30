# **🎓 CertiChain – Hệ thống Xác thực Chứng chỉ Giáo dục trên Blockchain**

**Blockchain + IPFS 2025**

---

## 📚 Quick Links

- 📖 [**Complete Auth Guide**](./docs/FE_AUTH_GUIDE.md) - Comprehensive documentation
- 🧪 [**Testing Guide**](./TEST_AUTH.md) - How to test authentication

---

## **🧭 1\. Mục tiêu nghiệp vụ**

Hệ thống được xây dựng nhằm **tự động hóa và phi tập trung hóa quy trình xác thực chứng chỉ giáo dục**, giúp:

- Nhà trường có thể phát hành chứng chỉ kỹ thuật số **minh bạch, không thể giả mạo**.

- Sinh viên có thể **chứng minh năng lực học tập** của mình chỉ bằng một đường link hoặc mã QR.

- Nhà tuyển dụng có thể **xác thực độc lập** chứng chỉ đó mà **không cần liên hệ trực tiếp với trường**.

Toàn bộ quy trình vận hành dựa trên **Blockchain (Base chain)** và **IPFS (phi tập trung)**, đảm bảo tính **bất biến, minh bạch, và kiểm chứng công khai**.

---

## **👥 2\. Các vai trò trong hệ thống**

| Vai trò | Mô tả | Quyền hạn / Trách nhiệm |
| ----- | ----- | ----- |
| 🏫 **Nhà trường (Issuer)** | Cơ quan phát hành chứng chỉ, chịu trách nhiệm xác thực thông tin sinh viên và cấp chứng chỉ lên blockchain. | \- Xác minh danh tính sinh viên.- Tạo, ký và upload chứng chỉ lên hệ thống.- Chịu chi phí giao dịch (gas fee) để ghi dữ liệu lên blockchain.- Cung cấp đường link hoặc mã QR cho sinh viên. |
| 👩‍🎓 **Sinh viên (Guest/Holder)** | Người sở hữu chứng chỉ kỹ thuật số. Không cần tài khoản hay ví, chỉ sử dụng link hoặc QR để chia sẻ chứng chỉ trong hồ sơ cá nhân. | \- Nhận link hoặc mã QR từ nhà trường.- Dán link đó vào CV, portfolio, hoặc profile cá nhân.- Không thể chỉnh sửa hay giả mạo chứng chỉ đã phát hành. |
| 🏢 **Nhà tuyển dụng (Verifier)** | Bên thứ ba có nhu cầu xác thực chứng chỉ của ứng viên. Không cần tài khoản, chỉ cần truy cập link để kiểm tra tính hợp lệ. | \- Scan QR hoặc truy cập link chứng chỉ.- Hệ thống tự động xác minh on-chain: kiểm tra **issuer hợp lệ** và **thông tin sinh viên**.- Nhận kết quả xác thực “Valid / Invalid”. |

---

## **⚙️ 3\. Quy trình nghiệp vụ tổng quát**

### **Bước 1\. Nhà trường phát hành chứng chỉ**

1. Nhà trường đăng nhập hệ thống (Next.js admin portal).

2. Nhập thông tin sinh viên và khóa học (tên, mã sinh viên, ngành học, ngày cấp...).

3. Upload file chứng chỉ (PDF hoặc ảnh).

4. Hệ thống:

   - Sinh `SHA-256 hash` từ file PDF.

   - Upload file lên **IPFS** → nhận **CID (Content Identifier)**.

   - Gọi smart contract `registerCertificate(hash, CID, studentIdHash)` trên **mạng Base Sepolia**.

5. Smart contract lưu trữ:

   - Hash chứng chỉ (fileHash).

   - CID (vị trí lưu trữ phi tập trung).

   - Địa chỉ ví của nhà trường (issuer).

   - Dấu thời gian phát hành (`block.timestamp`).

💰 **Nhà trường chịu chi phí giao dịch (gas fee)** cho mỗi chứng chỉ được phát hành.

---

### **Bước 2\. Sinh viên nhận chứng chỉ số**

1. Sau khi chứng chỉ được ghi lên blockchain, hệ thống tạo:

Link công khai:

 <https://verify.edu.vn/certificates/\><certificate\_id\>

-
  - Hoặc mã QR tương ứng.

2. Sinh viên (guest account) nhận link/QR từ trường (qua email, LMS, hoặc dashboard).

3. Sinh viên chèn link hoặc QR đó vào hồ sơ cá nhân, portfolio, hoặc CV.

👉 Không cần tài khoản, không cần ví — chỉ cần copy link.

---

### **Bước 3\. Nhà tuyển dụng xác thực chứng chỉ**

1. Nhà tuyển dụng truy cập link hoặc quét QR code trên CV của ứng viên.

2. Hệ thống frontend gọi API `/api/verify?hash=<fileHash>`.

3. API truy vấn smart contract:

   - Kiểm tra xem hash có tồn tại trên blockchain hay không.

   - Lấy thông tin: `issuer`, `ipfsCID`, `issuedAt`, `studentIdHash`.

API trả về kết quả xác thực:

 {  
  "verified": true,  
  "issuer": "0x123...abc",  
  "student": "hashed\_student\_id",  
  "ipfs\_cid": "QmXyz...",  
  "issued\_at": "2025-10-22"  
}

4.
5. Frontend hiển thị:

   - ✅ “Certificate Verified — Issued by University of ABC”

   - Xem file chứng chỉ gốc tại: `https://ipfs.io/ipfs/QmXyz...`

   - Xem giao dịch on-chain trên BaseScan.

---

## **🧱 4\. Luồng nghiệp vụ (Business Sequence)**

sequenceDiagram  
    participant Issuer as Nhà Trường  
    participant IPFS as IPFS Network  
    participant Blockchain as Base Blockchain  
    participant Student as Sinh Viên  
    participant Employer as Nhà Tuyển Dụng

    Issuer-\>\>IPFS: Upload chứng chỉ (PDF) → nhận CID  
    Issuer-\>\>Blockchain: registerCertificate(hash, CID, studentIdHash)  
    Blockchain--\>\>Issuer: Trả về txHash \+ timestamp  
    Issuer--\>\>Student: Cung cấp link / QR code chứng chỉ  
    Student-\>\>Employer: Dán link chứng chỉ vào CV  
    Employer-\>\>Blockchain: verifyCertificate(hash)  
    Blockchain--\>\>Employer: Trả về issuer \+ CID \+ issuedAt  
    Employer-\>\>IPFS: Mở file chứng chỉ theo CID  
    Employer--\>\>Employer: So sánh thông tin → ✅ "Verified"

---

## **📊 5\. Giá trị nghiệp vụ**

| Lợi ích | Mô tả |
| ----- | ----- |
| 🔒 **Chống giả mạo** | Chứng chỉ được xác thực công khai bằng hash và CID, không thể sửa đổi hay xoá bỏ. |
| ⚙️ **Tự động hóa xác thực** | Nhà tuyển dụng chỉ cần quét mã, hệ thống tự kiểm tra on-chain, không cần xác nhận thủ công. |
| 🌐 **Minh bạch & phi tập trung** | Không phụ thuộc vào cơ sở dữ liệu riêng của trường — bất kỳ ai cũng có thể xác thực trên blockchain. |
| 📎 **Dễ tích hợp với hệ thống hiện có** | Có thể nhúng link xác thực vào LMS, CV điện tử, hoặc ứng dụng HR. |
| 💰 **Chi phí thấp, duy trì lâu dài** | Nhà trường chỉ tốn phí on-chain 1 lần duy nhất khi phát hành. |

---

## **🧩 6\. Tổng kết logic nghiệp vụ**

| Thành phần | Vai trò | Hành động | Kết quả |
| ----- | ----- | ----- | ----- |
| **Nhà trường** | Issuer | Upload & ghi chứng chỉ lên blockchain | Giao dịch bất biến (proof-of-issue) |
| **Sinh viên** | Holder | Nhận link chứng chỉ | Có thể chia sẻ dễ dàng |
| **Nhà tuyển dụng** | Verifier | Quét QR hoặc truy cập link | Xác minh tính hợp lệ và xuất xứ |

---

## **⚙️ 7\. Điểm nổi bật trong phiên bản này**

- **Không cần sinh viên có ví hoặc đăng ký blockchain.**

- **Nhà trường đóng vai trò duy nhất phát hành on-chain** → tránh giả mạo.

- **Nhà tuyển dụng có thể xác minh độc lập** mà không cần tin vào server của trường.

- **Sử dụng IPFS \+ Base Chain** → dữ liệu phân tán, bất biến, rẻ và minh bạch.

---

## **🧠 Tóm tắt nói ngắn gọn (cho phần giới thiệu báo cáo):**

“Hệ thống của chúng tôi cho phép các cơ sở đào tạo phát hành chứng chỉ kỹ thuật số lưu trữ trên IPFS, đồng thời ghi lại dấu vết xác thực trên blockchain Base. Sinh viên có thể sử dụng đường link hoặc mã QR của chứng chỉ này để đính kèm vào hồ sơ cá nhân. Nhà tuyển dụng chỉ cần quét QR hoặc truy cập link là có thể xác minh ngay lập tức tính hợp lệ và nguồn gốc của chứng chỉ mà không cần liên hệ với nhà trường. Toàn bộ quá trình xác thực được đảm bảo minh bạch, phi tập trung và không thể bị chỉnh sửa.”
