# **🧱 Backend Technical Flow – Blockchain Certificate Verification System (MVP 2025\)**

---

## **🧩 1\. Mục tiêu**

Xây dựng backend phục vụ cho 3 nhiệm vụ chính:

1. **Tạo và quản lý chứng chỉ off-chain**  
    → Lưu thông tin sinh viên, hash, IPFS CID vào Postgres (qua Prisma).

2. **Ghi chứng chỉ lên blockchain (on-chain proof)**  
    → Gọi smart contract `registerCertificate()` trên mạng Base Sepolia.

3. **Xác thực chứng chỉ công khai**  
    → Cung cấp API verify hash → so khớp dữ liệu blockchain.

---

## **⚙️ 2\. Công nghệ và môi trường**

| Thành phần | Công nghệ |
| ----- | ----- |
| Framework | Next.js 15 (App Router) – dùng chung cho FE & BE |
| ORM & DB | Prisma \+ PostgreSQL |
| Storage | IPFS (qua `web3.storage` SDK hoặc Pinata) |
| Blockchain | Base Sepolia \+ `ethers.js` (qua wagmi hoặc viem) |
| Hashing | Node.js `crypto` (SHA-256) |
| Auth (optional) | JWT hoặc Simple admin key |
| Deployment | Docker Compose \+ Vercel / Railway |

---

## **🧭 3\. Kiến trúc tổng thể Backend**

src/  
├── api/  
│   ├── certificates/  
│   │   ├── route.ts (POST, GET)  
│   │   ├── \[id\]/route.ts (GET)  
│   │   ├── register/route.ts (POST)  
│   │   └── verify/route.ts (GET)  
│   └── upload/route.ts  
│  
├── lib/  
│   ├── db.ts               → Prisma client  
│   ├── hash.ts             → SHA-256 function  
│   ├── ipfs.ts             → IPFS upload client  
│   ├── blockchain.ts       → Gọi contract registerCertificate  
│   └── utils.ts  
│  
├── prisma/  
│   └── schema.prisma  
│  
└── .env (DB\_URL, WEB3\_TOKEN, CONTRACT\_ADDRESS, PRIVATE\_KEY)

---

## **🧩 4\. Data Model (Prisma Schema)**

model Certificate {  
  id             Int      @id @default(autoincrement())  
  studentName    String  
  studentIdHash  String  
  courseName     String  
  fileHash       String   @unique  
  ipfsCid        String  
  issuerAddress  String  
  blockchainTx   String?  
  status         String   @default("pending") // pending | verified | failed  
  issuedAt       DateTime @default(now())  
}

---

## 

## **🔁 5\. Business Flow chi tiết (step-by-step)**

### **🧱 A. Upload & Register Certificate (Admin Flow)**

**API:** `POST /api/certificates`

**Luồng xử lý:**

1. **FE gửi form:**

   1. Tên sinh viên, mã sinh viên, tên khóa học

   2. File PDF chứng chỉ

2. **BE xử lý:**   
   1. Hash file bằng SHA-256

       import crypto from "crypto";

const fileBuffer \= await file.arrayBuffer();  
const hash \= crypto.createHash("sha256").update(Buffer.from(fileBuffer)).digest("hex");

2. Upload file lên IPFS (`web3.storage`) → nhận `CID`

    const client \= new Web3Storage({ token: process.env.WEB3\_TOKEN });

const cid \= await client.put(\[file\]);

3. Hash mã sinh viên (ẩn danh hóa

 const studentIdHash \= crypto.createHash("sha256").update(studentId).digest("hex");

4. Lưu vào database (trạng thái `pending`)

await prisma.certificate.create({

  data: { studentName, courseName, fileHash: hash, ipfsCid: cid, studentIdHash, issuerAddress }  
});

5. Trả về JSON:

    {

  "status": "pending",  
  "fileHash": "0xabc123...",  
  "ipfsCid": "QmXYZ...",  
  "certificateId": 1  
}  
---

### **🧱 B. Ghi dữ liệu lên Blockchain (On-chain registration)**

**API:** `POST /api/certificates/register`

**Mục đích:** Trường xác thực chứng chỉ bằng cách ghi hash \+ CID lên blockchain.

**Input:**

{  
  "certificateId": 1  
}

**Luồng xử lý:**

1. Lấy record từ DB → `{ fileHash, ipfsCid, studentIdHash }`

Gọi smart contract (qua `ethers.js`):

 const provider \= new ethers.JsonRpcProvider(process.env.BASE\_RPC);  
const wallet \= new ethers.Wallet(process.env.PRIVATE\_KEY, provider);  
const contract \= new ethers.Contract(process.env.CONTRACT\_ADDRESS, abi, wallet);  
const tx \= await contract.registerCertificate(fileHash, ipfsCid, studentIdHash);  
const receipt \= await tx.wait();

2. Cập nhật DB:

    await prisma.certificate.update({

  where: { id: certificateId },  
  data: { blockchainTx: tx.hash, status: "verified" }  
});

3. Trả về JSON:

    {

  "status": "verified",  
  "txHash": "0xabc123...",  
  "explorer": "https://basescan.org/tx/0xabc123..."  
}

---

### **🧱 C. Lấy danh sách chứng chỉ (Dashboard)**

**API:** `GET /api/certificates`

**Mục đích:** Cho nhà trường hiển thị danh sách chứng chỉ đã phát hành.

**Output mẫu:**

\[  
  {  
    "id": 1,  
    "studentName": "Nguyen Van A",  
    "courseName": "Blockchain Fundamentals",  
    "fileHash": "0xabc123",  
    "status": "verified",  
    "issuedAt": "2025-10-22T09:00:00Z"  
  }  
\]

---

### **🧱 D. Xác thực chứng chỉ công khai (Verify Flow)**

**API:** `GET /api/certificates/verify?hash=<fileHash>`

**Luồng xử lý:**

1. Lấy dữ liệu off-chain trong DB (nếu có).

Gọi smart contract để kiểm tra:

 const cert \= await contract.verifyCertificate(fileHash);

2.   
3. So sánh:

   * Hash có tồn tại không?

   * Issuer có khớp với DB (địa chỉ trường) không?

Trả về kết quả:

 {  
  "verified": true,  
  "issuer": "0x123...",  
  "ipfsCid": "QmXyz...",  
  "txHash": "0xabc...",  
  "issuedAt": 1729555555,  
  "viewOnChain": "https://basescan.org/tx/0xabc..."  
}

4.   
5. Nếu không tồn tại → trả `verified: false`.

---

### **🧱 E. Upload lại file (optional)**

**API:** `POST /api/upload`  
 – Chỉ dùng cho các trường hợp cần re-upload chứng chỉ hoặc cập nhật IPFS.

---

## **🧩 6\. Tóm tắt API Table**

| API | Method | Vai trò | Mô tả |
| ----- | ----- | ----- | ----- |
| `/api/certificates` | `POST` | Nhà trường | Tạo chứng chỉ, hash \+ upload IPFS |
| `/api/certificates` | `GET` | Nhà trường | Lấy danh sách chứng chỉ |
| `/api/certificates/register` | `POST` | Nhà trường | Ghi chứng chỉ lên blockchain |
| `/api/certificates/[id]` | `GET` | FE | Lấy thông tin chứng chỉ cụ thể |
| `/api/certificates/verify` | `GET` | Công khai | Xác minh hash trên blockchain |
| `/api/upload` | `POST` | Nội bộ | Upload file và trả CID (nếu tách riêng IPFS service) |

---

## **🧠 7\. Xử lý bất đồng bộ / Job runner (optional)**

Nếu muốn tối ưu, bạn có thể dùng **background job** để:

* Tự động update status `pending → verified` khi có `txHash`.

* Dùng WebSocket / event listener theo dõi event `CertificateIssued` trong contract.

Ví dụ event watcher:

contract.on("CertificateIssued", async (hash, ipfsCid, issuer, timestamp) \=\> {  
  await prisma.certificate.updateMany({  
    where: { fileHash: hash },  
    data: { status: "verified" }  
  });  
});

---

## **🧰 8\. Biến môi trường cần thiết (.env)**

DATABASE\_URL=postgresql://user:password@host:port/db  
WEB3\_TOKEN=YOUR\_WEB3\_STORAGE\_TOKEN  
BASE\_RPC=https://base-sepolia.g.alchemy.com/v2/yourKey  
CONTRACT\_ADDRESS=0xYourContractAddress  
PRIVATE\_KEY=0xYourPrivateKey  
ISSUER\_WALLET=0xUniversityWallet

---

## **🚀 9\. Tóm tắt pipeline dữ liệu**

PDF → Hash (SHA256) → Upload IPFS (CID)  
   ↓  
Lưu DB (pending)  
   ↓  
Gọi contract registerCertificate(hash, CID, studentId)  
   ↓  
Base Sepolia ghi proof  
   ↓  
DB update status \= verified  
   ↓  
FE hiển thị QR \+ link verify

---

## **✅ 10\. Kết luận – Dev backend cần nắm rõ**

| Thành phần | Trách nhiệm |
| ----- | ----- |
| **API layer** | Tiếp nhận request, validate, trả JSON |
| **IPFS module** | Upload / lấy file |
| **Blockchain module** | Gọi contract, verify hash |
| **DB module (Prisma)** | Lưu và đồng bộ trạng thái |
| **Auth middleware (optional)** | Giới hạn ai có thể tạo chứng chỉ |

