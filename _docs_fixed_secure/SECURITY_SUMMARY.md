# 🚨 TÓM TẮT LỖ HỔNG BẢO MẬT - Certificate Verification

## 🎯 Kết Luận Chính

Logic xác minh hiện tại của bạn có **LỖ HỔNG NGHIÊM TRỌNG** cho phép attacker giả mạo certificate.

---

## 🔴 3 VẤN ĐỀ CRITICAL

### 1. KHÔNG VERIFY FILE INTEGRITY ⚠️⚠️⚠️

**Vấn đề:** Frontend chỉ gửi hash, KHÔNG gửi file gốc

**Kịch bản tấn công:**

```
1. Attacker lấy cert hợp lệ: certificate_real.pdf (hash: 0xabc123)
2. Sửa nội dung PDF: đổi tên, đổi điểm
3. File mới: certificate_fake.pdf (hash mới: 0xdef456)
4. Gửi request với hash CŨ: ?hash=0xabc123
5. Server check → ✅ VERIFIED (SAI!)
6. Attacker có cert giả được "xác thực"
```

**Fix:** Upload FILE thay vì hash

```typescript
// ❌ CŨ: GET /api/verify?hash=abc123
// ✅ MỚI: POST /api/verify + FormData(file)

const formData = new FormData();
formData.append("file", certificateFile);
fetch("/api/certificates/verify", { method: "POST", body: formData });
```

### 2. STUDENT ID HASH PREDICTABLE

**Vấn đề:**

```typescript
// ❌ Công thức public, có thể brute force
hash(studentId + studentName + courseName)
```

**Fix:** Thêm server-side pepper

```typescript
// ✅ Attacker không thể tính được
hash(studentId + name + course + PEPPER + timestamp)
```

### 3. KHÔNG VALIDATE TIMESTAMP

**Vấn đề:** Không check expiry, không check future date

**Fix:**

```typescript
// ✅ Check logic
if (issuedDate > now) return "Invalid: future date";
if (now > expiryDate) return "Expired";
```

---

## 🟡 6 VẤN ĐỀ KHÁC

4. **Không verify IPFS file** → File trên IPFS có thể khác với hash
5. **Address case sensitivity** → Có thể mismatch
6. **Không có revocation** → Không thể thu hồi cert
7. **Error handling generic** → Khó debug
8. **Không có caching** → Chậm, tốn gas
9. **Không có rate limiting** → Có thể bị spam/DDoS

---

## 📊 PRIORITY

| Priority | Issue | Severity | Effort | Status |
|----------|-------|----------|--------|--------|
| 🔴 P0 | File Integrity | CRITICAL | 4-6h | ⚠️ FIX NOW |
| 🔴 P1 | Student Hash | HIGH | 2-3h | ⚠️ FIX NOW |
| 🟡 P2 | Timestamp | MEDIUM | 1-2h | 📝 Recommended |
| 🟡 P3 | Error Handling | MEDIUM | 1-2h | 📝 Recommended |
| 🟡 P4 | Rate Limiting | MEDIUM | 2-3h | 📝 Recommended |
| 🟢 P5 | Address Case | LOW | 30m | 🔧 Quick Win |
| 🟢 P6 | IPFS Verify | LOW | 3-4h | 💡 Optional |
| 🟢 P7 | Revocation | MEDIUM | 8-12h | 💡 Feature |
| 🟢 P8 | Caching | LOW | 4-6h | 💡 Optimization |

---

## ⚡ QUICK START - Fix P0 trong 30 phút

### Bước 1: Update Backend (15 phút)

**File:** `app/api/certificates/verify/route.ts`

```typescript
import { certSha256 } from "@/core/services/certificate.service";

export async function POST(request: Request) {
  // 1. Nhận file (không phải hash)
  const formData = await request.formData();
  const file = formData.get("file") as File;
  
  if (!file) {
    return NextResponse.json({ verified: false, error: "File required" }, { status: 400 });
  }

  // 2. Hash file đã upload
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const uploadedFileHash = certSha256(fileBuffer);

  // 3. Tìm trong DB
  const certificate = await certificateRepo.findByHash(uploadedFileHash);
  if (!certificate) {
    return NextResponse.json({ verified: false, message: "Not found" });
  }

  // 4. Verify blockchain
  const certOnChain = await blockchainService.verifyOnChain(uploadedFileHash);

  // 5. Validate
  if (!certOnChain.isValid || 
      certOnChain.studentIdHash !== certificate.studentIdHash) {
    return NextResponse.json({ verified: false, message: "Invalid" });
  }

  // ✅ Success
  return NextResponse.json({ 
    verified: true,
    certificate: { ...certificate }
  });
}
```

### Bước 2: Update Frontend (15 phút)

**File:** `src/hooks/useVerify.ts` hoặc component

```typescript
// ❌ CŨ
const verify = async (hash: string) => {
  return fetch(`/api/certificates/verify?hash=${hash}`).then(r => r.json());
};

// ✅ MỚI
const verify = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  return fetch("/api/certificates/verify", {
    method: "POST",
    body: formData
  }).then(r => r.json());
};

// Component
<input type="file" onChange={e => {
  const file = e.target.files[0];
  verify(file).then(result => {
    if (result.verified) alert("✅ Valid!");
    else alert("❌ Invalid!");
  });
}} />
```

### Bước 3: Test

```bash
# 1. Start server
npm run dev

# 2. Upload certificate hợp lệ → ✅ Verified
# 3. Sửa file PDF, upload lại → ❌ Not found (hash khác)
# 4. Upload file cũ với hash cũ → ✅ Verified (correct!)
```

---

## 📖 Chi Tiết Đầy Đủ

Xem file: [`SECURITY_VERIFICATION_ISSUES.md`](./SECURITY_VERIFICATION_ISSUES.md)

Bao gồm:

- ✅ Kịch bản tấn công chi tiết
- ✅ Code examples đầy đủ
- ✅ Migration guide
- ✅ Testing checklist
- ✅ FAQ

---

## 🤔 CÂU HỎI THƯỜNG GẶP

**Q: Tại sao không dùng GET với hash?**  
A: Attacker có thể lấy hash của cert hợp lệ, sửa file, gửi hash cũ → System báo "verified" cho file giả.

**Q: Upload file có chậm không?**  
A: Có, nhưng **cần thiết** để đảm bảo tính toàn vẹn. Có thể tối ưu bằng caching.

**Q: QR code vẫn dùng được không?**  
A: Có, QR code chứa `ipfsCid` → Download file từ IPFS → Upload file để verify.

**Q: Data cũ có migrate được không?**  
A: Không thể migrate studentIdHash (đã lưu trên blockchain). Chỉ áp dụng cho cert mới.

---

## ⚠️ WARNING

**KHÔNG ĐƯỢC:**

- ❌ Chỉ verify hash mà không verify file
- ❌ Trust client-side data (hash, metadata)
- ❌ Bỏ qua timestamp validation
- ❌ Hardcode secrets trong code

**PHẢI:**

- ✅ Upload và hash file trên server
- ✅ Validate tất cả input
- ✅ Check timestamp logic
- ✅ Dùng environment variables cho secrets
- ✅ Log tất cả verification attempts

---

**Tài liệu đầy đủ:** [SECURITY_VERIFICATION_ISSUES.md](./SECURITY_VERIFICATION_ISSUES.md)  
**Last updated:** November 1, 2025  
**Status:** 🔴 CRITICAL - FIX IMMEDIATELY
