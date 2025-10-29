//====================
// npx tsx index.ts
//====================

import crypto from "crypto";
import "dotenv/config";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

const RPC = process.env.SEPOLIA_RPC_URL;
const PK = process.env.PRIVATE_KEY;
const CONTRACT = "0xfA26AB254e35004e9Af3B4C86153049bcD4432dA";

if (!RPC) throw new Error("Missing SEPOLIA_RPC_URL in .env");
if (!PK) throw new Error("Missing PRIVATE_KEY in .env");
if (!CONTRACT) throw new Error("Missing CONTRACT_ADDRESS in .env");

// ABI for CertiChain contract
const ABI = [
  {
    inputs: [
      { internalType: "bytes32", name: "_fileHash", type: "bytes32" },
      { internalType: "string", name: "_ipfsCID", type: "string" },
      { internalType: "bytes32", name: "_studentIdHash", type: "bytes32" },
    ],
    name: "registerCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "_fileHash", type: "bytes32" }],
    name: "verifyCertificate",
    outputs: [
      { internalType: "string", name: "_ipfsCID", type: "string" },
      { internalType: "address", name: "_issuer", type: "address" },
      { internalType: "uint256", name: "_isssedAt", type: "uint256" },
      { internalType: "bytes32", name: "_studentIdHash", type: "bytes32" },
      { internalType: "bool", name: "_isValid", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_issuerAddress", type: "address" }],
    name: "authorizeIssuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_issuerAddress", type: "address" }],
    name: "revokeIssuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "contractOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "isAuthorizedIssuer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "fileHash", type: "bytes32" },
      { indexed: true, internalType: "address", name: "issuer", type: "address" },
      { indexed: false, internalType: "string", name: "ipfsCID", type: "string" },
      { indexed: false, internalType: "bytes32", name: "studentidHash", type: "bytes32" },
      { indexed: false, internalType: "uint256", name: "issuedAt", type: "uint256" },
    ],
    name: "CertificateRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "issuerAddress", type: "address" },
    ],
    name: "IssuerAuthorized",
    type: "event",
  },
] as const;

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(RPC),
});

const account = privateKeyToAccount(PK as `0x${string}`);
const walletClient = createWalletClient({
  chain: sepolia,
  transport: http(RPC),
  account,
});

// Helper: tạo bytes32 hash từ string
function sha256ToBytes32(input: string): `0x${string}` {
  const hash = crypto.createHash("sha256").update(input).digest("hex");
  return `0x${hash}` as `0x${string}`;
}

// Mock data
const MOCK_FILE_CONTENT = "Chung chi tot nghiep - Nguyen Van A - Blockchain Fundamentals - 2025";
const MOCK_STUDENT_ID = "SV123456";
const MOCK_IPFS_CID = "QmXyz123MockCIDForDemoPurpose";

async function main() {
  console.log("=== CertiChain Demo - Test ABI ===");
  console.log("Địa chỉ ví issuer:", account.address);
  
  // 1. Đọc owner của contract
  console.log("\n[1] Đọc contractOwner...");
  const owner = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "contractOwner",
  });
  console.log("Owner:", owner);

  // 2. Kiểm tra account hiện tại có phải authorized issuer không
  console.log("\n[2] Kiểm tra isAuthorizedIssuer...");
  const isAuthorized = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "isAuthorizedIssuer",
    args: [account.address],
  });
  console.log("Account này là issuer hợp lệ?", isAuthorized);

  // 3. Tạo mock hash từ mock data
  console.log("\n[3] Tạo mock hash...");
  const fileHash = sha256ToBytes32(MOCK_FILE_CONTENT);
  const studentIdHash = sha256ToBytes32(MOCK_STUDENT_ID);
  console.log("File hash (mock):", fileHash);
  console.log("Student ID hash (mock):", studentIdHash);
  console.log("IPFS CID (mock):", MOCK_IPFS_CID);

  // 4. Đăng ký chứng chỉ (registerCertificate)
  console.log("\n[4] Đăng ký chứng chỉ lên blockchain...");
  const txHash = await walletClient.writeContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "registerCertificate",
    args: [fileHash, MOCK_IPFS_CID, studentIdHash],
  });
  console.log("Tx hash:", txHash);

  // 5. Chờ transaction được mine
  console.log("\n[5] Chờ transaction được mine...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  console.log("Block number:", receipt.blockNumber);
  console.log("Status:", receipt.status);
  console.log("Gas used:", receipt.gasUsed.toString());

  // 6. Parse event CertificateRegistered từ logs
  console.log("\n[6] Parse event từ transaction logs...");
  if (receipt.logs && receipt.logs.length > 0) {
    console.log("Số lượng logs:", receipt.logs.length);
    receipt.logs.forEach((log, idx) => {
      console.log(`Log ${idx}:`, {
        address: log.address,
        topics: log.topics,
      });
    });
  }

  // 7. Xác minh chứng chỉ (verifyCertificate)
  console.log("\n[7] Xác minh chứng chỉ vừa đăng ký...");
  try {
    const cert = await publicClient.readContract({
      address: CONTRACT as `0x${string}`,
      abi: ABI,
      functionName: "verifyCertificate",
      args: [fileHash],
    });
    
    console.log("\n=== Thông tin chứng chỉ ===");
    console.log("IPFS CID:", cert[0]);
    console.log("Issuer:", cert[1]);
    console.log("Issued At:", new Date(Number(cert[2]) * 1000).toLocaleString());
    console.log("Student ID Hash:", cert[3]);
    console.log("Is Valid", cert[4]);
    console.log("\n✅ Chứng chỉ hợp lệ!");
    console.log(`Link IPFS gateway: https://ipfs.io/ipfs/${cert[0]}`);
  } catch (e) {
    console.error("❌ Lỗi khi xác minh:", e instanceof Error ? e.message : String(e));
  }

  // 8. Mock verify với hash không tồn tại
  console.log("\n[8] Test verify với hash không tồn tại...");
  const fakeHash = sha256ToBytes32("fake_certificate_content");
  try {
    await publicClient.readContract({
      address: CONTRACT as `0x${string}`,
      abi: ABI,
      functionName: "verifyCertificate",
      args: [fakeHash],
    });
    console.log("Không nên đến đây!");
  } catch (e) {
    console.log("✅ Đúng rồi - contract revert với hash không tồn tại");
    const msg = e instanceof Error ? e.message : String(e);
    console.log("Error message:", msg.split('\n')[0]);
  }

  console.log("\n=== Demo hoàn tất ===");
}

main().catch((e) => { console.error(e); process.exit(1); });

