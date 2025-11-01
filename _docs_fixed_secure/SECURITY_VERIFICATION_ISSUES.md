# 🔒 Phân Tích & Hướng Dẫn Fix Lỗ Hổng Bảo Mật - Certificate Verification

**Ngày phân tích:** November 1, 2025  
**Độ nghiêm trọng:** 🔴 CRITICAL  
**Hệ thống:** CertiChain Certificate Verification

---

## 📋 Tóm Tắt

Logic xác minh chứng chỉ hiện tại của bạn có **3 lỗ hổng nghiêm trọng** và **6 vấn đề trung bình/nhỏ** cần được fix để đảm bảo tính toàn vẹn và bảo mật của hệ thống.

**Điểm yếu chính:** Hệ thống chỉ verify **hash** chứ không verify **file gốc**, dẫn đến attacker có thể giả mạo certificate.

---

## 🔴 VẤN ĐỀ 1: KHÔNG VERIFY FILE INTEGRITY (CRITICAL)

### Hiện trạng

**File:** `app/api/certificates/verify/route.ts` (Lines 9-17)

```typescript
// ❌ CODE HIỆN TẠI - CÓ LỖ HỔNG
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hash = searchParams.get("hash"); // ⚠️ Chỉ nhận hash qua URL!
  
  if (!hash) {
    return NextResponse.json({ error: "Hash parameter is required" }, { status: 400 });
  }
  
  const certificate = await certificateRepo.findByHash(hash);
  // ... verify với blockchain
}
```

### Vấn Đề

1. **Frontend chỉ gửi `fileHash` string**, KHÔNG gửi file gốc
2. **Backend không re-hash file** để kiểm tra tính toàn vẹn
3. **Attacker có thể:**
   - Lấy certificate hợp lệ của sinh viên A
   - Sửa nội dung PDF (đổi tên → sinh viên B, đổi điểm số 6.0 → 9.0)
   - Giữ nguyên `fileHash` cũ khi gửi request verify
   - Hệ thống kiểm tra hash trong DB và blockchain → **Match** → ✅ **"VERIFIED"**
   - **Nhưng file đã bị sửa đổi!**

### Kịch Bản Tấn Công Cụ Thể

```
Step 1: Attacker lấy certificate hợp lệ
  - File: certificate_studentA.pdf
  - Hash: 0xabc123...
  - Student: Nguyễn Văn A
  - Grade: 7.0

Step 2: Attacker sửa file
  - Đổi tên: Nguyễn Văn A → Nguyễn Văn B
  - Đổi điểm: 7.0 → 9.5
  - File mới: certificate_fake.pdf
  - Hash mới (thực tế): 0xdef456...

Step 3: Attacker gửi request với hash CŨ
  GET /api/certificates/verify?hash=0xabc123
  
Step 4: Server response
  - Check DB: hash 0xabc123 → Found ✅
  - Check Blockchain: hash 0xabc123 → Valid ✅
  - Response: { verified: true } 😱
  
Step 5: Kết quả
  - File giả mạo được xác nhận là "hợp lệ"
  - Attacker có certificate giả với điểm cao hơn
```

### Giải Pháp

#### Option 1: Upload File để Verify (RECOMMENDED)

Thay đổi từ `GET` với URL params sang `POST` với file upload:

**File:** `app/api/certificates/verify/route.ts`

```typescript
// ✅ CODE MỚI - BẢO MẬT
import { certSha256 } from "@/core/services/certificate.service";

export async function POST(request: Request) {
  try {
    // Step 1: Nhận file từ frontend
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { verified: false, error: "File is required" },
        { status: 400 }
      );
    }

    // Step 2: Hash file đã upload
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const uploadedFileHash = certSha256(fileBuffer);
    
    console.log("🔍 Uploaded file hash:", uploadedFileHash);

    // Step 3: Tìm trong database
    const certificate = await certificateRepo.findByHash(uploadedFileHash);

    if (!certificate) {
      return NextResponse.json({
        verified: false,
        message: "Certificate not found",
        details: { computedHash: uploadedFileHash }
      });
    }

    // Step 4: Verify on blockchain
    const certOnChain = await blockchainService.verifyOnChain(uploadedFileHash);

    // Step 5: So sánh dữ liệu
    if (!certOnChain.isValid ||
        certOnChain.studentIdHash !== certificate.studentIdHash ||
        certOnChain.issuerAddress.toLowerCase() !== certificate.issuerAddress.toLowerCase()
    ) {
      return NextResponse.json({
        verified: false,
        message: "Certificate validation failed",
        details: {
          blockchainValid: certOnChain.isValid,
          studentHashMatch: certOnChain.studentIdHash === certificate.studentIdHash,
          issuerMatch: certOnChain.issuerAddress.toLowerCase() === certificate.issuerAddress.toLowerCase()
        }
      });
    }

    // ✅ Success - Certificate hợp lệ
    return NextResponse.json({
      verified: true,
      certificate: {
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        issuedAt: certOnChain.issuedAt,
        issuerAddress: certOnChain.issuerAddress,
        fileHash: uploadedFileHash, // Hash của file thật sự được upload
      },
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { verified: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

#### Frontend Update

**File:** `src/hooks/useVerify.ts` hoặc component verify

```typescript
// ❌ CŨ - Chỉ gửi hash
const verifyOld = async (hash: string) => {
  const response = await fetch(`/api/certificates/verify?hash=${hash}`);
  return response.json();
};

// ✅ MỚI - Upload file
const verifyNew = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/certificates/verify", {
    method: "POST",
    body: formData,
  });

  return response.json();
};
```

#### Option 2: QR Code với Hash + Download File từ IPFS

Nếu muốn giữ QR code, có thể:

1. QR code chứa `ipfsCid` (không phải hash)
2. Frontend download file từ IPFS
3. Hash file đã download
4. Gửi hash + file lên server để verify

```typescript
// Frontend flow
async function verifyFromQR(ipfsCid: string) {
  // Step 1: Download từ IPFS
  const fileUrl = `https://gateway.pinata.cloud/ipfs/${ipfsCid}`;
  const fileBlob = await fetch(fileUrl).then(r => r.blob());
  const file = new File([fileBlob], "certificate.pdf");
  
  // Step 2: Upload file lên verify endpoint
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch("/api/certificates/verify", {
    method: "POST",
    body: formData,
  });
  
  return response.json();
}
```

### Checklist Fix

- [ ] Thay đổi endpoint từ `GET` sang `POST`
- [ ] Nhận file qua `FormData`
- [ ] Re-hash file trên server
- [ ] So sánh hash đã compute với hash trong DB
- [ ] Update frontend để upload file thay vì gửi hash
- [ ] Validate file size (max 10MB)
- [ ] Validate file type (PDF, PNG, JPEG)

---

## 🔴 VẤN ĐỀ 2: STUDENT ID HASH FORMULA RÒ RỈ (CRITICAL)

### Hiện trạng

**File:** `core/services/certificate.service.ts` (Lines 28-30)

```typescript
// ❌ CODE HIỆN TẠI - PREDICTABLE
const studentIdHash = certSha256(
  Buffer.from(studentId + studentName + courseName)
);
```

### Vấn Đề

1. **Công thức dễ đoán:** `hash(studentId + studentName + courseName)`
2. **Code public trên GitHub** → attacker biết công thức
3. **Nếu attacker biết thông tin:**
   - studentId: `20210001`
   - studentName: `Nguyen Van A`
   - courseName: `Web Development`
   - → Có thể tính được `studentIdHash` chính xác
4. **Rainbow table attack possible**
5. **Brute force với thông tin phổ biến**

### Giải Pháp

#### Option 1: Thêm Server-Side Pepper (RECOMMENDED)

**File:** `core/services/certificate.service.ts`

```typescript
// ✅ CODE MỚI - BẢO MẬT với PEPPER
const STUDENT_HASH_PEPPER = process.env.STUDENT_HASH_PEPPER || "CHANGE_ME_IN_PRODUCTION";

export const createStudentIdHash = (
  studentId: string,
  studentName: string,
  courseName: string,
  timestamp: Date
): string => {
  // Thêm PEPPER (server-side secret) + timestamp
  const combinedData = `${studentId}|${studentName}|${courseName}|${STUDENT_HASH_PEPPER}|${timestamp.getTime()}`;
  return certSha256(Buffer.from(combinedData));
};

// Update trong createCertificate
async createCertificate({ file, studentName, studentId, courseName, userId }: CertificateUploadInput) {
  const fileHash = certSha256(Buffer.from(await file.arrayBuffer()));
  const issuedAt = new Date();
  
  // ✅ Sử dụng hàm mới với pepper và timestamp
  const studentIdHash = createStudentIdHash(studentId, studentName, courseName, issuedAt);

  // ... rest of code
}
```

**File:** `.env`

```env
# Add pepper (random 32+ character string)
STUDENT_HASH_PEPPER=g7k2m9p4w8x1n5q3t6v0z8c4f7j2l5r9u3y6b1e4h8k0n3p7s2v5x9a4d6g1j3m8
```

**Lợi ích:**

- Attacker không thể tính hash ngay cả khi biết studentId, name, course
- Pepper lưu trên server, không public
- Timestamp đảm bảo mỗi certificate có hash unique

#### Option 2: Sử dụng HMAC thay vì SHA-256

```typescript
import crypto from "crypto";

const HMAC_SECRET = process.env.HMAC_SECRET || "CHANGE_ME";

export const createStudentIdHash = (
  studentId: string,
  studentName: string,
  courseName: string
): string => {
  const combinedData = `${studentId}|${studentName}|${courseName}`;
  return crypto
    .createHmac("sha256", HMAC_SECRET)
    .update(combinedData)
    .digest("hex");
};
```

### ⚠️ LƯU Ý QUAN TRỌNG

**Vấn đề với timestamp:** Nếu thêm timestamp vào hash, bạn cần lưu `issuedAt` trong DB để có thể verify lại sau này.

**Database Schema Update:**

```prisma
model Certificate {
  id            Int      @id @default(autoincrement())
  studentName   String
  studentIdHash String
  courseName    String
  fileHash      String   @unique
  ipfsCid       String
  issuerAddress String
  blockchainTx  String?
  status        String   @default("pending")
  issuedAt      DateTime @default(now())
  
  // ✅ Thêm field này nếu dùng timestamp trong hash
  hashCreatedAt DateTime @default(now()) // Timestamp dùng để tạo studentIdHash
  
  userId        Int
  student       User     @relation(fields: [userId], references: [id])
}
```

### Checklist Fix

- [ ] Tạo environment variable `STUDENT_HASH_PEPPER`
- [ ] Tạo hàm `createStudentIdHash()` với pepper
- [ ] Update `createCertificate()` để dùng hàm mới
- [ ] Quyết định có dùng timestamp trong hash không
- [ ] Nếu dùng timestamp: update Prisma schema, thêm field `hashCreatedAt`
- [ ] Generate pepper value ngẫu nhiên (32+ ký tự)
- [ ] Test với data mới
- [ ] ⚠️ **KHÔNG THỂ MIGRATE DATA CŨ** (hash đã lưu trên blockchain)

---

## 🔴 VẤN ĐỀ 3: KHÔNG VALIDATE TIMESTAMP (CRITICAL)

### Hiện trạng

**File:** `app/api/certificates/verify/route.ts` (Lines 56-71)

```typescript
// ❌ CODE HIỆN TẠI - Không validate timestamp
return NextResponse.json({
  verified: certOnChain.isValid,
  certificate: {
    studentName: certificate.studentName,
    courseName: certificate.courseName,
    issuedAt: certOnChain.issuedAt, // ⚠️ Chỉ lấy, không validate
    // ...
  },
});
```

### Vấn Đề

1. **Không check expiry date** - Certificate có thể đã hết hạn
2. **Không validate logic** - issuedAt có thể là future date (vô lý)
3. **Không check business rules** - Ví dụ: certificate phải được issued sau khi course kết thúc

### Giải Pháp

**File:** `app/api/certificates/verify/route.ts`

```typescript
// ✅ CODE MỚI - Validate timestamp
export async function POST(request: Request) {
  // ... existing code ...

  // Get data from blockchain
  const certOnChain = await blockchainService.verifyOnChain(uploadedFileHash);

  // ✅ VALIDATE TIMESTAMP LOGIC
  const now = new Date();
  const issuedDate = new Date(certOnChain.issuedAt);
  
  // 1. Check if issued date is in the future
  if (issuedDate > now) {
    return NextResponse.json({
      verified: false,
      message: "Invalid certificate: issued date is in the future",
      details: {
        issuedAt: issuedDate.toISOString(),
        currentTime: now.toISOString()
      }
    }, { status: 400 });
  }

  // 2. Check if certificate has expired (valid for 10 years)
  const CERT_VALIDITY_YEARS = 10;
  const expiryDate = new Date(issuedDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + CERT_VALIDITY_YEARS);

  if (now > expiryDate) {
    return NextResponse.json({
      verified: false,
      message: `Certificate has expired (valid for ${CERT_VALIDITY_YEARS} years from issuance)`,
      details: {
        issuedAt: issuedDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
        currentTime: now.toISOString(),
        yearsExpired: Math.floor((now.getTime() - expiryDate.getTime()) / (365 * 24 * 60 * 60 * 1000))
      }
    }, { status: 400 });
  }

  // 3. Optional: Check if issued date is too old (before system launch)
  const SYSTEM_LAUNCH_DATE = new Date("2024-01-01");
  if (issuedDate < SYSTEM_LAUNCH_DATE) {
    return NextResponse.json({
      verified: false,
      message: "Invalid certificate: issued before system launch date",
      details: {
        issuedAt: issuedDate.toISOString(),
        systemLaunchDate: SYSTEM_LAUNCH_DATE.toISOString()
      }
    }, { status: 400 });
  }

  // ✅ All validations passed
  return NextResponse.json({
    verified: true,
    certificate: {
      studentName: certificate.studentName,
      courseName: certificate.courseName,
      issuedAt: certOnChain.issuedAt,
      expiryDate: expiryDate.toISOString(), // ✅ Include expiry info
      status: certificate.status,
      issuerAddress: certOnChain.issuerAddress,
      ipfsCid: certificate.ipfsCid,
      blockchainTx: certificate.blockchainTx,
    },
  });
}
```

### Constants Configuration

**File:** `utils/constants.ts` (tạo mới)

```typescript
export const CERTIFICATE_CONFIG = {
  VALIDITY_YEARS: 10,
  SYSTEM_LAUNCH_DATE: new Date("2024-01-01"),
  MAX_FUTURE_TOLERANCE_MINUTES: 5, // Allow 5 minutes tolerance for clock skew
};
```

### Checklist Fix

- [ ] Thêm validation cho issued date (không được là future)
- [ ] Thêm validation cho expiry date (10 năm sau issuance)
- [ ] Thêm validation cho system launch date
- [ ] Tạo constants file cho configuration
- [ ] Return expiry date trong response
- [ ] Update frontend để hiển thị expiry info
- [ ] Test với các edge cases (expired cert, future date, etc.)

---

## 🟡 VẤN ĐỀ 4: KHÔNG VERIFY IPFS FILE (MEDIUM)

### Hiện trạng

Hệ thống lưu `ipfsCid` nhưng không verify file trên IPFS có match với hash không.

### Vấn Đề

1. File trên IPFS có thể bị xóa
2. IPFS gateway có thể trả về file khác (MITM attack)
3. Không đảm bảo file trên IPFS là file gốc

### Giải Pháp (Optional)

**File:** `app/api/certificates/verify/route.ts`

```typescript
import { pinata } from "@/utils/config";

export async function POST(request: Request) {
  // ... existing verification logic ...

  // ✅ OPTIONAL: Verify IPFS file content
  try {
    console.log("🔍 Verifying IPFS file content...");
    
    // Download file from IPFS
    const ipfsFile = await pinata.gateways.get(certificate.ipfsCid);
    const ipfsBuffer = Buffer.from(await ipfsFile.data.arrayBuffer());
    const ipfsFileHash = certSha256(ipfsBuffer);

    // Compare with uploaded file hash
    if (ipfsFileHash !== uploadedFileHash) {
      return NextResponse.json({
        verified: false,
        message: "IPFS file does not match uploaded file",
        details: {
          uploadedFileHash,
          ipfsFileHash,
          ipfsCid: certificate.ipfsCid,
        }
      }, { status: 400 });
    }

    console.log("✅ IPFS file verification passed");
  } catch (ipfsError) {
    console.warn("⚠️ Could not verify IPFS file:", ipfsError);
    // Don't fail verification if IPFS is temporarily down
    // But log the warning for monitoring
  }

  // Continue with rest of verification...
}
```

### ⚠️ Lưu Ý

- IPFS verification tốn thời gian (download file)
- Nếu IPFS gateway down → verification sẽ fail
- Consider làm optional hoặc có fallback

### Checklist Fix

- [ ] Quyết định có cần verify IPFS không
- [ ] Nếu có: implement download + hash comparison
- [ ] Handle IPFS gateway errors gracefully
- [ ] Add timeout cho IPFS requests (max 10s)
- [ ] Log warnings nếu IPFS check fail
- [ ] Monitor IPFS gateway uptime

---

## 🟡 VẤN ĐỀ 5: ADDRESS CASE SENSITIVITY (MEDIUM)

### Hiện trạng

**Backend lowercase addresses:**

```typescript
certOnChain.issuerAddress.toLowerCase() === certificate.issuerAddress.toLowerCase()
```

**Smart contract KHÔNG lowercase:**

```solidity
address issuer; // Stored as-is
```

### Vấn Đề

Ethereum addresses có checksum (mixed case), nhưng so sánh có thể mismatch.

### Giải Pháp

#### Option 1: Lowercase trong Smart Contract (RECOMMENDED)

**File:** `contracts/contracts/CertiChain.sol`

```solidity
// ✅ Thêm helper function
function toLowerCase(address _addr) internal pure returns (address) {
    return address(uint160(_addr));
}

// Update registerCertificate
function registerCertificate(
    bytes32 _fileHash,
    bytes32 _studentIdHash 
) public onlyAuthorizedIssuer {
    require(certificates[_fileHash].issuedAt == 0, "Certificate already registered.");

    certificates[_fileHash] = Certificate(
        _studentIdHash,
        msg.sender, // ✅ Already lowercase
        block.timestamp,
        true
    );

    emit CertificateRegistered(_fileHash, msg.sender, _studentIdHash, block.timestamp);
}
```

**Note:** Ethereum addresses không cần lowercase trong smart contract vì Solidity tự động handle.

#### Option 2: Consistent Lowercase trên Backend

**File:** `core/services/certificate.service.ts`

```typescript
// ✅ Luôn lowercase trước khi lưu DB
const issuerAddress = process.env.ISSUER_WALLET!.toLowerCase();

const cert = await this.certRepo.createWithUserId({
  studentName,
  courseName,
  fileHash,
  ipfsCid: cid,
  studentIdHash,
  issuerAddress, // ✅ Already lowercase
  userId,
});
```

### Checklist Fix

- [ ] Ensure `ISSUER_WALLET` env var được lowercase trước khi lưu DB
- [ ] Update existing records trong DB: `UPDATE certificates SET issuerAddress = LOWER(issuerAddress)`
- [ ] Add validation: addresses phải là valid Ethereum format
- [ ] Test với checksummed addresses

---

## 🟡 VẤN ĐỀ 6: KHÔNG CÓ REVOCATION MECHANISM (MEDIUM)

### Hiện trạng

Smart contract có `isValid` flag nhưng không có function để revoke:

```solidity
struct Certificate {
    bytes32 studentIdHash;
    address issuer;
    uint256 issuedAt;
    bool isValid; // ✅ Có flag
}

// ❌ Không có function revoke
```

### Vấn Đề

1. Nếu phát hiện certificate bị giả mạo → không thể revoke
2. Nếu sinh viên bị đuổi học → không thể thu hồi certificate
3. `isValid` flag không được sử dụng

### Giải Pháp

#### Update Smart Contract

**File:** `contracts/contracts/CertiChain.sol`

```solidity
// ✅ Thêm function revoke
function revokeCertificate(bytes32 _fileHash) public onlyAuthorizedIssuer {
    require(certificates[_fileHash].issuedAt != 0, "Certificate does not exist");
    require(certificates[_fileHash].issuer == msg.sender, "Only the issuer can revoke");
    
    certificates[_fileHash].isValid = false;
    
    emit CertificateRevoked(_fileHash, msg.sender, block.timestamp);
}

// ✅ Thêm event
event CertificateRevoked(
    bytes32 indexed fileHash,
    address indexed issuer,
    uint256 revokedAt
);
```

#### Update Backend Repository

**File:** `core/repositories/blockchain.repository.ts`

```typescript
// ✅ Thêm function revoke
async revokeOnChain(fileHash: string) {
  try {
    console.log("Revoking certificate on blockchain...");
    
    const { request } = await publicClient.simulateContract({
      account: adminAccount,
      address: CONTRACT_ADDRESS as Address,
      abi: ABI,
      functionName: "revokeCertificate",
      args: [fileHash],
    });
    
    const txHash = await walletClient.writeContract(request);
    
    console.log("Revocation transaction sent:", txHash);
    
    const transaction = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });
    
    console.log("Certificate revoked successfully");
    return txHash;
  } catch (error) {
    console.error("Error revoking certificate:", error);
    throw new Error("Blockchain revocation failed");
  }
}
```

#### Update API Endpoint

**File:** `app/api/certificates/revoke/route.ts` (tạo mới)

```typescript
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { BlockchainService } from "@/core/repositories/blockchain.repository";
import { CertificateRepository } from "@/core/repositories/certificate.repository";

const blockchainService = new BlockchainService();
const certRepo = new CertificateRepository();

export async function POST(request: Request) {
  try {
    // Check auth
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get fileHash from request
    const { fileHash, reason } = await request.json();

    if (!fileHash) {
      return NextResponse.json(
        { error: "fileHash is required" },
        { status: 400 }
      );
    }

    // Check if certificate exists
    const cert = await certRepo.findByHash(fileHash);
    if (!cert) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    // Revoke on blockchain
    const txHash = await blockchainService.revokeOnChain(fileHash);

    // Update DB status
    await certRepo.updateStatus(cert.id.toString(), "revoked", txHash);

    return NextResponse.json({
      success: true,
      message: "Certificate revoked successfully",
      txHash,
      reason,
    });

  } catch (error) {
    console.error("Error revoking certificate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Checklist Fix

- [ ] Update smart contract với function `revokeCertificate()`
- [ ] Thêm event `CertificateRevoked`
- [ ] Deploy smart contract mới (hoặc upgrade nếu dùng proxy pattern)
- [ ] Update blockchain repository với `revokeOnChain()`
- [ ] Tạo API endpoint `/api/certificates/revoke`
- [ ] Update Prisma schema: thêm status `revoked`
- [ ] Update frontend: admin dashboard có button "Revoke"
- [ ] Test revocation flow end-to-end

---

## 🟢 VẤN ĐỀ 7: ERROR HANDLING KHÔNG ĐẦY ĐỦ (LOW)

### Hiện trạng

```typescript
// ❌ Error handling generic
catch (error) {
  console.error("Error verifying certificate:", error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
```

### Vấn Đề

Không phân biệt giữa:

- Certificate not found
- Blockchain RPC down
- Database connection error
- Invalid hash format

### Giải Pháp

```typescript
// ✅ Detailed error handling
export async function POST(request: Request) {
  try {
    // ... verification logic ...
  } catch (error) {
    // Log full error for debugging
    console.error("❌ Verification error:", error);

    // Determine error type
    if (error instanceof Error) {
      // Blockchain errors
      if (error.message.includes("Certificate not found or invalid")) {
        return NextResponse.json({
          verified: false,
          error: "Certificate not found on blockchain",
          errorCode: "BLOCKCHAIN_NOT_FOUND",
          details: error.message
        }, { status: 404 });
      }

      // RPC connection errors
      if (error.message.includes("fetch failed") || error.message.includes("ECONNREFUSED")) {
        return NextResponse.json({
          verified: false,
          error: "Blockchain service temporarily unavailable",
          errorCode: "BLOCKCHAIN_UNAVAILABLE",
          details: "Please try again later"
        }, { status: 503 });
      }

      // Database errors
      if (error.message.includes("prisma") || error.message.includes("database")) {
        return NextResponse.json({
          verified: false,
          error: "Database service temporarily unavailable",
          errorCode: "DATABASE_UNAVAILABLE",
          details: "Please try again later"
        }, { status: 503 });
      }
    }

    // Generic error
    return NextResponse.json({
      verified: false,
      error: "Internal server error",
      errorCode: "INTERNAL_ERROR",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
```

### Checklist Fix

- [ ] Add specific error codes cho từng error type
- [ ] Differentiate giữa 404, 400, 503, 500 errors
- [ ] Log errors với context (fileHash, userId, etc.)
- [ ] Return helpful error messages cho frontend
- [ ] Add error monitoring (Sentry, LogRocket, etc.)

---

## 🟢 VẤN ĐỀ 8: KHÔNG CÓ CACHING (PERFORMANCE)

### Hiện trạng

Mỗi lần verify đều call blockchain → tốn thời gian

### Giải Pháp

#### Option 1: Redis Cache

```typescript
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const CACHE_TTL = 3600; // 1 hour

export async function POST(request: Request) {
  // ... get fileHash ...

  // Check cache first
  const cacheKey = `cert_verify:${uploadedFileHash}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log("✅ Cache hit");
    return NextResponse.json(cached);
  }

  // ... do verification ...

  // Cache result
  await redis.set(cacheKey, result, { ex: CACHE_TTL });

  return NextResponse.json(result);
}
```

#### Option 2: In-Memory Cache (Simple)

```typescript
const verificationCache = new Map<string, { result: any; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour in ms

export async function POST(request: Request) {
  // Check cache
  const cached = verificationCache.get(uploadedFileHash);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("✅ Cache hit");
    return NextResponse.json(cached.result);
  }

  // ... do verification ...

  // Cache result
  verificationCache.set(uploadedFileHash, {
    result,
    timestamp: Date.now()
  });

  return NextResponse.json(result);
}
```

### Checklist Fix

- [ ] Quyết định cache strategy (Redis vs In-Memory)
- [ ] Implement caching layer
- [ ] Set appropriate TTL (1 hour recommended)
- [ ] Add cache invalidation khi certificate bị revoke
- [ ] Monitor cache hit rate
- [ ] Test cache behavior

---

## 🟢 VẤN ĐỀ 9: KHÔNG CÓ RATE LIMITING (SECURITY)

### Hiện trạng

Public endpoint `/verify` có thể bị spam/DDoS

### Giải Pháp

#### Option 1: Upstash Rate Limit

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
});

export async function POST(request: Request) {
  // Get IP address
  const ip = request.headers.get("x-forwarded-for") || "anonymous";

  // Check rate limit
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({
      error: "Rate limit exceeded",
      errorCode: "RATE_LIMIT_EXCEEDED",
      details: {
        limit,
        remaining,
        resetAt: new Date(reset).toISOString()
      }
    }, { status: 429 });
  }

  // Continue with verification...
}
```

#### Option 2: Middleware Rate Limit

**File:** `middleware.ts`

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest) {
  // Only rate limit verify endpoint
  if (request.nextUrl.pathname === "/api/certificates/verify") {
    const ip = request.ip || "anonymous";
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 10;

    const record = rateLimitMap.get(ip);

    if (record) {
      if (now > record.resetTime) {
        // Reset window
        rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      } else if (record.count >= maxRequests) {
        // Rate limit exceeded
        return NextResponse.json({
          error: "Too many requests",
          errorCode: "RATE_LIMIT_EXCEEDED"
        }, { status: 429 });
      } else {
        // Increment count
        record.count++;
      }
    } else {
      // First request
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/certificates/verify",
};
```

### Checklist Fix

- [ ] Choose rate limiting solution (Upstash recommended cho production)
- [ ] Set rate limit: 10 requests/minute cho IP
- [ ] Return 429 status với reset time
- [ ] Add rate limit headers: X-RateLimit-Limit, X-RateLimit-Remaining
- [ ] Monitor rate limit hits
- [ ] Consider different limits cho authenticated users

---

## 📊 PRIORITY & ROADMAP

### 🔴 HIGH PRIORITY (Fix ngay)

1. **File Integrity Verification** (Issue #1)
   - Effort: Medium (4-6 hours)
   - Impact: CRITICAL
   - Status: ⚠️ BLOCKING

2. **Student ID Hash Security** (Issue #2)
   - Effort: Low (2-3 hours)
   - Impact: HIGH
   - Status: ⚠️ IMPORTANT
   - Note: Cannot migrate old data

3. **Timestamp Validation** (Issue #3)
   - Effort: Low (1-2 hours)
   - Impact: MEDIUM
   - Status: 📝 RECOMMENDED

### 🟡 MEDIUM PRIORITY (Fix trong sprint này)

4. **Address Case Sensitivity** (Issue #5)
   - Effort: Very Low (30 mins)
   - Impact: LOW
   - Status: 🔧 QUICK WIN

5. **Error Handling** (Issue #7)
   - Effort: Low (1-2 hours)
   - Impact: MEDIUM
   - Status: 📝 RECOMMENDED

### 🟢 LOW PRIORITY (Fix khi có thời gian)

6. **IPFS Verification** (Issue #4)
   - Effort: Medium (3-4 hours)
   - Impact: LOW
   - Status: 💡 OPTIONAL

7. **Revocation Mechanism** (Issue #6)
   - Effort: High (8-12 hours)
   - Impact: MEDIUM
   - Status: 💡 FEATURE REQUEST

8. **Caching** (Issue #8)
   - Effort: Medium (4-6 hours)
   - Impact: MEDIUM (Performance)
   - Status: 💡 OPTIMIZATION

9. **Rate Limiting** (Issue #9)
   - Effort: Low (2-3 hours)
   - Impact: MEDIUM (Security)
   - Status: 📝 RECOMMENDED

---

## 🧪 TESTING CHECKLIST

### Test Cases cần implement

#### File Integrity Tests

- [ ] Upload file hợp lệ → Verify success
- [ ] Upload file sửa đổi với hash cũ → Verify failed
- [ ] Upload file không đúng format → Reject
- [ ] Upload file > 10MB → Reject

#### Student Hash Tests

- [ ] Create cert với pepper → Hash unique
- [ ] Verify không thể reverse hash → Success
- [ ] Test với data cũ (không có pepper) → Document migration path

#### Timestamp Tests

- [ ] Verify cert với issued date trong quá khứ → Success
- [ ] Verify cert với issued date trong tương lai → Failed
- [ ] Verify cert đã expired → Failed
- [ ] Verify cert còn hạn → Success

#### Error Handling Tests

- [ ] Blockchain RPC down → Return 503
- [ ] Certificate not found → Return 404
- [ ] Invalid hash format → Return 400
- [ ] Database connection error → Return 503

#### Rate Limiting Tests

- [ ] 10 requests trong 1 phút → Success
- [ ] 11th request → Return 429
- [ ] Wait 1 minute → Reset counter

---

## 🚀 IMPLEMENTATION GUIDE

### Step 1: Setup Environment

```bash
# Add to .env
STUDENT_HASH_PEPPER=<generate-random-32-char-string>
UPSTASH_REDIS_REST_URL=<your-redis-url>
UPSTASH_REDIS_REST_TOKEN=<your-redis-token>
```

Generate pepper:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Fix Critical Issues

```bash
# 1. Update verify endpoint
# Edit: app/api/certificates/verify/route.ts

# 2. Update certificate service
# Edit: core/services/certificate.service.ts

# 3. Test locally
npm run dev
# Upload test certificate
# Try to verify with modified file → Should fail
```

### Step 3: Update Frontend

```typescript
// Update verification UI to upload file
const handleVerify = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/certificates/verify", {
    method: "POST",
    body: formData,
  });

  const result = await res.json();
  // Display result
};
```

### Step 4: Deploy & Monitor

```bash
# Deploy to production
vercel deploy --prod

# Monitor logs
vercel logs --follow

# Check for errors in verification
```

---

## 📚 REFERENCES

- [SHA-256 Collision Resistance](https://en.wikipedia.org/wiki/SHA-2)
- [HMAC Security](https://en.wikipedia.org/wiki/HMAC)
- [Ethereum Address Checksum](https://eips.ethereum.org/EIPS/eip-55)
- [IPFS Content Addressing](https://docs.ipfs.tech/concepts/content-addressing/)
- [Rate Limiting Best Practices](https://www.nginx.com/blog/rate-limiting-nginx/)

---

## ❓ FAQ

**Q: Có thể migrate data cũ sang formula mới không?**  
A: KHÔNG. Hash đã được lưu trên blockchain, không thể thay đổi. Chỉ áp dụng cho certificate mới.

**Q: Upload file có tốn băng thông không?**  
A: Có, nhưng cần thiết để verify integrity. Có thể optimize bằng client-side hashing + server validation.

**Q: IPFS verification có bắt buộc không?**  
A: Không bắt buộc. Chỉ cần nếu lo ngại IPFS gateway attack.

**Q: Rate limit 10 req/min có quá thấp không?**  
A: Đủ cho use case verify certificate (thường 1-2 requests). Có thể tăng lên 20-30 nếu cần.

**Q: Có thể dùng GET với file hash không?**  
A: KHÔNG an toàn. Phải dùng POST với file upload để verify integrity.

---

**Last updated:** November 1, 2025  
**Maintainer:** CertiChain Security Team  
**Status:** 🔴 CRITICAL ISSUES FOUND - REQUIRES IMMEDIATE ACTION
