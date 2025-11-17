**Next.js 15 (App Router) \+ Tailwind \+ wagmi \+ Prisma \+ Sepolia \+ IPFS**.

---

# **🎨 Frontend Technical Flow – Blockchain Certificate Verification System (MVP 2025\)**

---

## **🧭 1\. Mục tiêu**

Frontend (Next.js) chịu trách nhiệm:

* Cung cấp giao diện cho **Nhà trường** (issuer) để upload, tạo, đăng ký chứng chỉ on-chain.

* Cung cấp giao diện công khai cho **Sinh viên** (holder) để xem & chia sẻ chứng chỉ.

* Cung cấp trang xác minh cho **Nhà tuyển dụng** (verifier) để quét QR / xác thực chứng chỉ.

👉 Mục tiêu là “frontend thông minh nhưng nhẹ” — kết nối trực tiếp cả **API backend** và **smart contract** thông qua **wagmi \+ ethers.js**.

---

## **⚙️ 2\. Tech Stack (FE)**

| Thành phần | Công nghệ |
| ----- | ----- |
| Framework | Next.js 15 (App Router) |
| UI | Tailwind CSS \+ shadcn/ui \+ QRCode.react |
| State | React Query (hoặc Zustand / useData store) |
| Wallet | wagmi \+ MetaMask \+ Sepolia |
| API | Axios (hoặc native fetch) |
| Blockchain | ethers.js (wagmi hooks) |
| Storage | web3.storage (thông qua backend) |
| Routing | App Router (`/app/*`) |
| Deploy | Vercel |

---

## **🧩 3\. Cấu trúc thư mục đề xuất**

src/  
├── app/  
│   ├── page.tsx                     \# Trang landing  
│   ├── dashboard/page.tsx           \# Trang quản lý chứng chỉ (Nhà trường)  
│   ├── certificates/create/page.tsx \# Form tạo chứng chỉ  
│   ├── certificates/\[id\]/page.tsx   \# Trang chi tiết chứng chỉ  
│   ├── verify/\[hash\]/page.tsx       \# Trang xác thực công khai  
│   └── layout.tsx                   \# Layout chính  
│  
├── components/  
│   ├── CertificateForm.tsx  
│   ├── CertificateCard.tsx  
│   ├── CertificateList.tsx  
│   ├── VerifyResult.tsx  
│   └── QRDisplay.tsx  
│  
├── hooks/  
│   ├── useCertificates.ts  
│   ├── useUpload.ts  
│   ├── useVerify.ts  
│   └── useBlockchain.ts  
│  
├── lib/  
│   ├── api.ts             \# axios instance  
│   ├── wagmiConfig.ts     \# cấu hình chain Base \+ connectors  
│   └── utils.ts  
│  
├── state/  
│   ├── ui.ts              \# modal, toast  
│   └── data.ts            \# react-query / zustand store  
│  
├── types/  
│   └── certificate.ts  
│  
└── public/  
    └── logo.png

---

## **🧭 4\. Các Actor và UI tương ứng**

| Actor | UI chính | Mô tả |
| ----- | ----- | ----- |
| 🏫 **Nhà trường** | `/dashboard` – quản lý danh sách chứng chỉ`/certificates/create` – form tạo mới | Tạo chứng chỉ, upload, ghi on-chain |
| 👩‍🎓 **Sinh viên** | `/certificates/[id]` – xem chi tiết, copy link, QR | Chia sẻ link hoặc QR |
| 🏢 **Nhà tuyển dụng** | `/verify/[hash]` – xác minh chứng chỉ | Quét QR / verify hash trực tiếp |

---

## **🔁 5\. Frontend Flow chi tiết (Step-by-Step)**

---

### **🧱 A. Trang “Create Certificate” – Upload & Lưu Off-chain**

**Đường dẫn:** `/certificates/create`

**Mục tiêu:** Nhà trường tạo chứng chỉ cho sinh viên.

#### **🧩 Quy trình:**

1. **Form nhập thông tin:**

   * Tên sinh viên

   * Mã sinh viên

   * Tên khóa học

   * Upload file PDF (Drag & Drop)

2. Khi nhấn “Tạo chứng chỉ”:

   * Gọi API `POST /api/certificates` (Backend xử lý hash \+ IPFS)

   * Hiển thị trạng thái “Đang upload…”

   * Sau khi API trả về → hiển thị preview \+ nút “Ghi lên blockchain”.

#### **🧠 Hooks/Logic:**

const { mutate: createCert } \= useMutation((data) \=\> api.post("/api/certificates", data));

#### **🧩 Kết quả:**

Hiển thị thông báo:

✅ Certificate created (pending on-chain)  
File Hash: 0x123abc...

---

### **🧱 B. Trang “Dashboard” – Danh sách chứng chỉ**

**Đường dẫn:** `/dashboard`

**Mục tiêu:** Hiển thị toàn bộ chứng chỉ của nhà trường, lọc theo trạng thái.

#### **🧩 Quy trình:**

1. FE gọi API `GET /api/certificates`.

2. Hiển thị danh sách bằng `CertificateList.tsx`:

   * Họ tên

   * Tên khóa học

   * Ngày cấp

   * Trạng thái: `pending` / `verified`

   * Nút “Đăng ký on-chain” (nếu pending).

#### **🧠 Hooks:**

const { data: certificates } \= useQuery(\["certificates"\], () \=\> api.get("/api/certificates"));

#### **🧩 Khi bấm “Đăng ký on-chain”:**

* FE gọi `POST /api/certificates/register` với `certificateId`.

* BE gọi smart contract → cập nhật trạng thái → FE refetch list.

---

### **🧱 C. Nhà trường ghi dữ liệu lên Blockchain**

**Kích hoạt từ UI Dashboard hoặc trang chi tiết.**

#### **🧩 Quy trình:**

1. User kết nối MetaMask (wagmi hook).

 const { connect, isConnected, address } \= useAccount();

2. FE hiển thị ví nhà trường đang dùng.

3. Khi nhấn “Register on-chain”:

   * Gọi API `/api/certificates/register` → trả `txHash`.

Hiển thị toast:

 🟢 Registered on Blockchain\!  
Tx: 0xabc123... (View on BaseScan)

4. 

---

### **🧱 D. Trang “Certificate Detail” – Sinh viên tra cứu chứng chỉ**

**Đường dẫn:** `/certificates/[id]`

#### **🧩 Quy trình:**

1. Gọi API `GET /api/certificates/[id]`.

2. Hiển thị:

   * Thông tin sinh viên, khóa học, hash.

   * Nút “Sao chép link / mã QR”.

3. Sinh viên bấm “Copy link” → copy đường dẫn `https://verify.edu.vn/verify/<hash>`.

4. Hoặc “Tải QR Code” → lưu ảnh QR từ component `QRCode.react`.

#### **🧠 Component:**

\<QRCode value={\`https://verify.edu.vn/verify/${fileHash}\`} size={180} /\>

---

### **🧱 E. Trang “Verify Certificate” – Nhà tuyển dụng xác minh**

**Đường dẫn:** `/verify/[hash]`

#### **🧩 Quy trình:**

1. Khi mở trang → FE gọi:

 *const { data } \= useQuery(\["verify", hash\], () \=\> api.get(\`/api/certificates/verify?hash=${hash}\`));*

2. Hiển thị:

   * Hash: `0xabc123...`

   * Trạng thái: ✅ Verified / ❌ Not Found

   * Issuer: `0x123...abc`

   * Ngày cấp: `22/10/2025`

   * Nút “Xem chứng chỉ trên IPFS” → `https://ipfs.io/ipfs/Qm123...`

   * Nút “Xem giao dịch trên BaseScan” → `https://basescan.org/tx/0xabc...`

#### **🧩 Component:**

{data.verified ? (  
  \<VerifiedBadge /\>  
) : (  
  \<UnverifiedAlert /\>  
)}

---

## **🧠 6\. React Query data flow**

| Hook | Chức năng | API |
| ----- | ----- | ----- |
| `useCertificates()` | Lấy danh sách chứng chỉ | GET /api/certificates |
| `useCreateCertificate()` | Tạo chứng chỉ mới | POST /api/certificates |
| `useRegisterCertificate()` | Ghi lên blockchain | POST /api/certificates/register |
| `useVerify(hash)` | Xác minh chứng chỉ | GET /api/certificates/verify?hash=... |

---

## **🧱 7\. UI State flow tổng quát**

\[Upload\] → “Đang xử lý hash & IPFS” → “Đã tạo (pending)”  
   ↓  
\[Register\] → “Đang gửi giao dịch” → “Đã verified ✅”  
   ↓  
\[Share link/QR\] → “Copied ✅”  
   ↓  
\[Verifier\] → “Verified ✅ / Invalid ❌”

---

## **🧩 8\. Thành phần UI chính**

| Component | Mô tả | Props |
| ----- | ----- | ----- |
| `CertificateForm` | Form upload, nhập thông tin chứng chỉ | onSubmit |
| `CertificateList` | Danh sách chứng chỉ (table hoặc grid) | certificates\[\] |
| `CertificateCard` | Thẻ hiển thị chứng chỉ riêng | certificate |
| `QRDisplay` | Tạo mã QR cho link verify | value |
| `VerifyResult` | Hiển thị kết quả xác thực on-chain | data |

---

## **🔗 9\. Tích hợp Blockchain (wagmi)**

**File:** `src/lib/wagmiConfig.ts`

import { createConfig, http } from "wagmi";  
import { baseSepolia } from "wagmi/chains";  
import { metaMask } from "wagmi/connectors";

export const config \= createConfig({  
  chains: \[baseSepolia\],  
  connectors: \[metaMask()\],  
  transports: {  
    \[baseSepolia.id\]: http("https://base-sepolia.g.alchemy.com/v2/yourKey")  
  }  
});

**Dùng trong component:**

const { connect, address } \= useAccount();  
const { writeContract } \= useWriteContract({  
  address: CONTRACT\_ADDRESS,  
  abi: CERT\_ABI,  
  functionName: "registerCertificate"  
});

---

## **📊 10\. Frontend Routing Flow Summary**

| Route | Vai trò | Mô tả |
| ----- | ----- | ----- |
| `/` | Landing page | Giới thiệu hệ thống |
| `/dashboard` | Nhà trường | Danh sách chứng chỉ |
| `/certificates/create` | Nhà trường | Tạo chứng chỉ, upload |
| `/certificates/[id]` | Sinh viên | Xem và copy link |
| `/verify/[hash]` | Nhà tuyển dụng | Xác minh chứng chỉ |

---

## **🧠 11\. Flow toàn cảnh Frontend (UI Logic)**

\[Upload chứng chỉ\]  
   ↓  
Call API → hash \+ IPFS → DB (pending)  
   ↓  
Hiển thị UI (status: pending)  
   ↓  
Nhấn “Đăng ký on-chain” → MetaMask popup  
   ↓  
Call API → ghi blockchain → status \= verified  
   ↓  
Sinh viên lấy link/QR chia sẻ  
   ↓  
Nhà tuyển dụng click verify → UI gọi /verify  
   ↓  
✅ Hiển thị “Valid Certificate – Issued by University”

---

## **✅ 12\. Tóm tắt nhiệm vụ cho FE dev**

| Hạng mục | Người phụ trách | Công việc |
| ----- | ----- | ----- |
| **UI/UX** | FE Lead | Tạo layout, modal, table |
| **API Integration** | FE \+ BE | Connect API `/certificates` và `/verify` |
| **Blockchain Hook** | FE | Thêm wagmi để call contract |
| **QR & Verify page** | FE | Hiển thị kết quả xác thực |
| **Testing \+ Toast UX** | FE | Thông báo trạng thái hành động |

