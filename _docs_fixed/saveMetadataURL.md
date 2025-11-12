# bước **mint NFT** chính là **“khóa niêm phong”** tất cả dữ liệu bạn vừa upload lên IPFS, để đảm bảo sau này *không ai (kể cả bạn)* có thể chỉnh sửa được nữa

Mình giải thích thật kỹ theo đúng luồng của bạn nhé 👇

---

## 🧱 Tổng quan lại luồng bạn đang có (hiện tại)

Hiện giờ bạn đã làm được:

```ts
// 1️⃣ Upload file PDF lên IPFS
const { cid: fileCID } = await pinata.upload.public.file(file);
const fileURL = await pinata.gateways.public.convert(fileCID);

// 2️⃣ Tạo và upload JSON metadata
const { cid: metadataCID } = await pinata.upload.public.json({
  fileHash,
  courseName,
  studentName: "Nguyen Van A - mock",
  studentId: "123456 - mock",
  startDate: new Date(),
  endDate: new Date(),
  fileUrl: fileURL,
  issuer: process.env.ISSUER_WALLET,
});
const metadataURL = await pinata.gateways.public.convert(metadataCID);
console.log("📝 Metadata URL:", metadataURL);
```

Lúc này bạn có:

* fileCID → hash của file PDF thật
* metadataCID → hash của JSON mô tả chứng chỉ

Cả hai đều được lưu trên IPFS (bất biến).
👉 Tuy nhiên, **chưa có nơi nào "xác nhận" rằng metadataCID này thật sự của nhà trường cả.**

---

## 🔒 Vấn đề hiện tại

Nếu hacker vào DB của bạn và đổi `ipfsMetadata` (CID metadata) sang một cái khác,
thì khi bạn fetch từ DB vẫn thấy “có vẻ hợp lệ”, dù nội dung thật bị thay.
(IPFS CID là hash của nội dung, nhưng hacker có thể đổi sang CID khác của *một file giả*.)

---

## 🧩 Bước tiếp theo: **Mint NFT = Ghi niêm phong on-chain**

Khi bạn gọi hàm mint trên smart contract, bạn sẽ ghi **mã định danh thật sự (proof)** lên blockchain:

```solidity
function mintCertificate(address to, string calldata tokenURI, bytes32 fileHash) external onlyOwner {
    // tokenURI = ipfs://metadataCID
    // fileHash = sha256(file.pdf)
}
```

Ví dụ ở backend / frontend:

```ts
const tx = await contract.mintCertificate(
  process.env.ISSUER_WALLET,  // Nhà trường (chủ sở hữu ban đầu)
  `ipfs://${metadataCID}`,     // tokenURI chính là metadata trên IPFS
  fileHash                     // hash của file PDF
);
await tx.wait();
```

Blockchain sẽ lưu lại:

* `tokenId`: mã NFT duy nhất cho chứng chỉ này
* `tokenURI`: `ipfs://bafkreiahv...` (chính là CID metadata gốc)
* `issuer`: ví nhà trường (owner ban đầu)
* `fileHash`: mã hash để xác thực nội dung file

Từ giờ về sau:

* **DB bị sửa** → không sao, vì blockchain vẫn giữ tokenURI thật.
* **Người xác thực** chỉ cần gọi:

  ```js
  const tokenURI = await contract.tokenURI(tokenId)
  ```

  rồi so sánh với `ipfsMetadata` trong DB:

  * Nếu khác nhau → DB bị can thiệp.
  * Nếu giống nhau → hợp lệ.

🎯 Blockchain trở thành “nguồn sự thật tuyệt đối” (source of truth).
Không ai có thể thay đổi được CID hoặc fileHash sau khi mint, vì dữ liệu này đã được ghi vào **block bất biến**.

---

## 📊 Tóm tắt lại cho bạn

| Giai đoạn                | Hành động                                                | Mục tiêu                        |
| ------------------------ | -------------------------------------------------------- | ------------------------------- |
| 1️⃣ Upload file          | Lưu chứng chỉ PDF lên IPFS                               | Bất biến nội dung               |
| 2️⃣ Upload metadata JSON | Lưu mô tả chứng chỉ (CID của file + thông tin sinh viên) | Bất biến metadata               |
| 3️⃣ Mint NFT             | Ghi `fileHash` + `tokenURI (metadataCID)` lên blockchain | Niêm phong bằng chứng vĩnh viễn |

---

## ✅ Sau khi mint, verify sẽ như sau

### 1. Lấy `tokenURI` từ blockchain

```js
const tokenURI = await contract.tokenURI(tokenId)
```

### 2. Fetch metadata JSON từ `tokenURI`

```js
const metadata = await fetch(tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")).then(r => r.json())
```

### 3. So sánh với DB hoặc IPFS bản hiện tại

```js
if (metadata.fileHash === db.fileHash && tokenURI === db.ipfsMetadata) {
  console.log("✅ Certificate valid and untampered");
} else {
  console.log("⚠️ Certificate mismatch — possible tampering");
}
```

---

## 🧠 Nếu tóm lại thật ngắn

| Bước        | Vai trò                                                   | Bất biến ở đâu |
| ----------- | --------------------------------------------------------- | -------------- |
| Upload PDF  | Tạo file chứng chỉ gốc                                    | IPFS           |
| Upload JSON | Gắn metadata cho NFT                                      | IPFS           |
| Mint NFT    | Ghi bằng chứng niêm phong (metadataCID, fileHash, issuer) | Blockchain     |

---

Nếu bạn đồng ý, mình có thể viết luôn cho bạn **đoạn code mintNFT thực tế (ethers.js)**
→ sử dụng `metadataCID` bạn vừa upload,
→ tương thích 100% với pinata flow và Base Sepolia.

Bạn có muốn mình viết luôn phần mint này (gọi hợp đồng + cập nhật DB) không?
