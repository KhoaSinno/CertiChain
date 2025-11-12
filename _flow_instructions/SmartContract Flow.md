# **⚙️ Smart Contract Development & Testing Flow (Remix \+ Base Sepolia)**

### **Dự án: *Blockchain-Backed Certificate Verification System (Hybrid Edition)***

---

## **🧩 1\. Mục tiêu**

Smart contract chịu trách nhiệm:

* Lưu trữ thông tin **chứng chỉ giáo dục đã phát hành**: file hash, CID IPFS, issuer, thời gian, và mã sinh viên mã hóa.

* Cho phép **xác minh công khai** (verify) bất kỳ chứng chỉ nào dựa vào hash.

* Đảm bảo **bất biến, minh bạch, chống giả mạo** — không thể chỉnh sửa hoặc xóa.

---

## **🧭 2\. Môi trường và công cụ sử dụng**

| Thành phần | Công nghệ |
| ----- | ----- |
| IDE | [Remix IDE](https://remix.ethereum.org/) |
| Compiler | Solidity ^0.8.20 |
| Network | **Base Sepolia Testnet** |
| Wallet | MetaMask (đã cấu hình mạng Base Sepolia) |
| Test faucet | [https://faucet.triangleplatform.com/base/sepolia](https://faucet.triangleplatform.com/base/sepolia) |
| Explorer | [https://sepolia.basescan.org/](https://sepolia.basescan.org/) |

---

## **🧱 3\. Cấu trúc smart contract**

### **📄 File: `CertificateRegistry.sol`**

// SPDX-License-Identifier: MIT  
pragma solidity ^0.8.20;

/// @title Certificate Registry for Educational Institutions  
/// @notice Lưu thông tin chứng chỉ giáo dục (hash \+ CID IPFS) lên Blockchain  
/// @dev Triển khai trên mạng Base Sepolia

contract CertificateRegistry {

    // Cấu trúc dữ liệu chứng chỉ  
    struct Certificate {  
        string ipfsFile;        // CID IPFS nơi lưu file PDF  
        bytes32 fileHash;      // Hash SHA-256 của file chứng chỉ  
        bytes32 studentIdHash; // Mã sinh viên đã hash  
        address issuer;        // Địa chỉ ví của nhà trường  
        uint256 issuedAt;      // Dấu thời gian phát hành  
    }

    // Mapping lưu chứng chỉ theo hash  
    mapping(bytes32 \=\> Certificate) public certificates;

    // Sự kiện phát hành chứng chỉ  
    event CertificateIssued(  
        bytes32 indexed fileHash,  
        string ipfsFile,  
        bytes32 indexed studentIdHash,  
        address indexed issuer,  
        uint256 issuedAt  
    );

    /// @notice Đăng ký chứng chỉ mới  
    /// @param \_hash Hash của file chứng chỉ  
    /// @param \_ipfsCid CID IPFS chứa chứng chỉ  
    /// @param \_studentIdHash Mã sinh viên đã hash (ẩn danh)  
    function registerCertificate(  
        bytes32 \_hash,  
        string memory \_ipfsCid,  
        bytes32 \_studentIdHash  
    ) external {  
        require(certificates\[\_hash\].issuedAt \== 0, "Certificate already exists");

        certificates\[\_hash\] \= Certificate({  
            ipfsFile: \_ipfsCid,  
            fileHash: \_hash,  
            studentIdHash: \_studentIdHash,  
            issuer: msg.sender,  
            issuedAt: block.timestamp  
        });

        emit CertificateIssued(\_hash, \_ipfsCid, \_studentIdHash, msg.sender, block.timestamp);  
    }

    /// @notice Kiểm tra chứng chỉ có tồn tại hay không  
    /// @param \_hash Hash của file chứng chỉ  
    /// @return Certificate struct (ipfsFile, issuer, issuedAt)  
    function verifyCertificate(bytes32 \_hash) external view returns (Certificate memory) {  
        require(certificates\[\_hash\].issuedAt \!= 0, "Certificate not found");  
        return certificates\[\_hash\];  
    }

    /// @notice Lấy địa chỉ người phát hành của chứng chỉ  
    function getIssuer(bytes32 \_hash) external view returns (address) {  
        return certificates\[\_hash\].issuer;  
    }

    /// @notice Kiểm tra nhanh chứng chỉ có tồn tại không (boolean)  
    function isRegistered(bytes32 \_hash) external view returns (bool) {  
        return certificates\[\_hash\].issuedAt \!= 0;  
    }  
}

---

## **🧩 4\. Quy trình thực hiện trên Remix**

### **🔧 Bước 1: Chuẩn bị môi trường**

1. Truy cập: [https://remix.ethereum.org](https://remix.ethereum.org/)

2. Tạo file `CertificateRegistry.sol` trong workspace.

3. Tự code \=\> code xịn hơn ở trên.

4. **Solidity Compile, deploy, test trên UI remix**

---

## **🔍 5\. Test chức năng trực tiếp trên Remix**

### **🧪 Test 1: Đăng ký chứng chỉ (registerCertificate)**

1. Mở phần “Deployed Contracts” → `registerCertificate`

Nhập:

 \_hash: 0x8a7f3c... (hash SHA-256 của file)  
\_ipfsCid: QmABC123xyz...  
\_studentIdHash: 0x3bd6f9...

2.
3. Nhấn **transact** → ký giao dịch MetaMask

4. Xem kết quả:

   * Sự kiện `CertificateIssued` hiển thị trong Logs

   * `TxHash` có thể kiểm tra tại BaseScan

   * Gas tiêu tốn \~ 0.0003 ETH (≈ vài xu)

---

### **🧪 Test 2: Kiểm tra chứng chỉ (verifyCertificate)**

1. Copy lại `_hash` từ bước trước.

2. Nhập vào hàm `verifyCertificate(bytes32)`

3. Bấm **call**

Kết quả trả về:

 ipfsFile: QmABC123xyz...  
fileHash: 0x8a7f3c...  
studentIdHash: 0x3bd6f9...  
issuer: 0xYourUniversityWallet  
issuedAt: 1729592585

4.

✅ → Nếu ra đúng dữ liệu, chứng chỉ đã được ghi thành công.

---

### **🧪 Test 3: Kiểm tra nhanh (isRegistered)**

1. Dán cùng hash vào `isRegistered(bytes32)`

2. Nếu trả `true` → chứng chỉ tồn tại.

---

### **🧪 Test 4: Lấy issuer (getIssuer)**

Nhập hash → trả về địa chỉ ví của trường.

---

## **🧱 6\. Tích hợp FE/BE sau khi test thành công**

| Thành phần | Mục tiêu | Thông tin cần cung cấp |
| ----- | ----- | ----- |
| **Backend** | Gọi hàm `registerCertificate()` khi trường bấm “Đăng ký on-chain” | `CONTRACT_ADDRESS`, `ABI`, `PRIVATE_KEY` |
| **Frontend** | Dùng wagmi để gọi hàm `verifyCertificate()` và hiển thị kết quả | `CONTRACT_ADDRESS`, `ABI` |

💡 Gợi ý: Export ABI từ Remix → paste vào file `src/lib/abi/CertificateRegistry.json`.

---

## **📘 7\. File ABI cần chia sẻ cho team**

Sau khi compile trên Remix, mở tab “Compilation Details” → copy JSON ABI, ví dụ:

\[  
  {  
    "inputs": \[  
      { "internalType": "bytes32", "name": "\_hash", "type": "bytes32" },  
      { "internalType": "string", "name": "\_ipfsCid", "type": "string" },  
      { "internalType": "bytes32", "name": "\_studentIdHash", "type": "bytes32" }  
    \],  
    "name": "registerCertificate",  
    "outputs": \[\],  
    "stateMutability": "nonpayable",  
    "type": "function"  
  },  
  {  
    "inputs": \[{ "internalType": "bytes32", "name": "\_hash", "type": "bytes32" }\],  
    "name": "verifyCertificate",  
    "outputs": \[  
      {  
        "components": \[  
          { "internalType": "string", "name": "ipfsFile", "type": "string" },  
          { "internalType": "bytes32", "name": "fileHash", "type": "bytes32" },  
          { "internalType": "bytes32", "name": "studentIdHash", "type": "bytes32" },  
          { "internalType": "address", "name": "issuer", "type": "address" },  
          { "internalType": "uint256", "name": "issuedAt", "type": "uint256" }  
        \],  
        "internalType": "struct CertificateRegistry.Certificate",  
        "name": "",  
        "type": "tuple"  
      }  
    \],  
    "stateMutability": "view",  
    "type": "function"  
  }  
\]

---

## **🧠 8\. Best Practices cho dev smart contract**

| Mục tiêu | Cách thực hiện |
| ----- | ----- |
| Tránh duplicate hash | `require(certificates[_hash].issuedAt == 0)` |
| Giảm phí gas | Dùng string thay vì bytes32 cho CID |
| Bảo mật | Chỉ cần public (ai cũng verify được), không cần owner-only |
| Log event để BE sync | `emit CertificateIssued` |
| Giữ backward compatibility | Không đổi mapping key, dùng version contract |

---

## **🧪 9\. Test case checklist**

| Test case | Input | Kết quả mong đợi |
| ----- | ----- | ----- |
| 1️⃣ Đăng ký chứng chỉ mới | Hash mới | `CertificateIssued` event emit |
| 2️⃣ Đăng ký trùng hash | Hash đã tồn tại | Revert `Certificate already exists` |
| 3️⃣ Verify chứng chỉ tồn tại | Hash đúng | Trả thông tin chính xác |
| 4️⃣ Verify chứng chỉ sai | Hash không tồn tại | Revert `Certificate not found` |
| 5️⃣ Kiểm tra issuer | Hash đúng | Trả địa chỉ đúng của trường |
| 6️⃣ Kiểm tra isRegistered | Hash đúng | True |
| 7️⃣ Kiểm tra gas cost | Hash mới | \< 100k gas |

---

## **🚀 10\. Kết quả cuối sau khi deploy**

* **Contract Address:** `0xABC...123`

* **Network:** Base Sepolia

* **Explorer:** [https://sepolia.basescan.org/address/0xABC...123](https://sepolia.basescan.org/address/0xABC...123)

* **Owner (issuer):** ví của trường

* **Event log:** `CertificateIssued` hiển thị tại tab Logs.

---

## **✅ Tóm tắt cho dev SC**

| Giai đoạn | Hành động | Mục tiêu |
| ----- | ----- | ----- |
| 1️⃣ Code contract | Viết, compile trong Remix | Chuẩn cấu trúc |
| 2️⃣ Deploy | Dùng MetaMask – Base Sepolia | Có contract address |
| 3️⃣ Test | Dùng hàm register / verify / isRegistered | Xác minh logic |
| 4️⃣ Export ABI | Dán cho BE & FE team | Đồng bộ API |
| 5️⃣ Ghi lại contract info | `.env` hoặc `README.md` | Team BE dùng deploy info |
