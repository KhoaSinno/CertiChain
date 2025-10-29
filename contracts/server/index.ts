//====================
// npx tsx index.ts
//====================

import "dotenv/config";
import { createPublicClient, createWalletClient, getAddress, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

const RPC = process.env.SEPOLIA_RPC_URL;
const PK = process.env.PRIVATE_KEY;
const CONTRACT = process.env.CONTRACT_ADDRESS;

if (!RPC) throw new Error("Missing SEPOLIA_RPC_URL in .env");
if (!PK) throw new Error("Missing PRIVATE_KEY in .env");
if (!CONTRACT) throw new Error("Missing CONTRACT_ADDRESS in .env");

// ABI for CertiChainSC
const ABI = [
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "student", "type": "address" },
      { "internalType": "string", "name": "fullName", "type": "string" },
      { "internalType": "string", "name": "course", "type": "string" }
    ],
    "name": "issueCertificate",
    "outputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "getCertificate",
    "outputs": [
      { "internalType": "uint256", "name": "cid", "type": "uint256" },
      { "internalType": "address", "name": "student", "type": "address" },
      { "internalType": "string", "name": "fullName", "type": "string" },
      { "internalType": "string", "name": "course", "type": "string" },
      { "internalType": "uint256", "name": "issuedAt", "type": "uint256" },
      { "internalType": "bool", "name": "revoked", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "student", "type": "address" }],
    "name": "getCertificatesByStudent",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "student", "type": "address" }
    ],
    "name": "CertificateIssued",
    "type": "event"
  }
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

async function main() {
  console.log("=== CertiChain Demo ===");
  console.log("Địa chỉ ví:", account.address);
  
  // Đọc owner của contract
  console.log("\n1. Đọc owner của contract...");
  const owner = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "owner",
  });
  console.log("Owner:", owner);

  // Địa chỉ student mẫu - sử dụng account.address hoặc địa chỉ hợp lệ khác
  // Để demo, ta dùng chính địa chỉ ví làm student
  const studentAddress = getAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f0beb0");
  
  console.log("\n2. Issue certificate cho student...");
  console.log("Student address:", studentAddress);
  
  const txHash = await walletClient.writeContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "issueCertificate",
    args: [
      studentAddress as `0x${string}`,
      "Nguyen Van A",
      "Blockchain Fundamentals"
    ],
  });
  console.log("Tx hash:", txHash);

  // Chờ transaction được mined
  console.log("\n3. Chờ transaction mined...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  console.log("Block number:", receipt.blockNumber);
  console.log("Status:", receipt.status);
  console.log("Gas used:", receipt.gasUsed.toString());

  // Lấy certificate ID từ logs/events
  let certId: bigint | null = null;
  if (receipt.logs && receipt.logs.length > 0) {
    // Event CertificateIssued có indexed id ở topic[1]
    const log = receipt.logs[0];
    if (log.topics && log.topics.length > 1 && log.topics[1]) {
      certId = BigInt(log.topics[1]);
      console.log("Certificate ID từ event:", certId.toString());
    }
  }

  // Đọc lại certificate vừa tạo
  if (certId !== null) {
    console.log("\n4. Đọc thông tin certificate vừa tạo...");
    const cert = await publicClient.readContract({
      address: CONTRACT as `0x${string}`,
      abi: ABI,
      functionName: "getCertificate",
      args: [certId],
    });
    
    console.log("\n=== Certificate Info ===");
    console.log("ID:", cert[0].toString());
    console.log("Student:", cert[1]);
    console.log("Full Name:", cert[2]);
    console.log("Course:", cert[3]);
    console.log("Issued At:", new Date(Number(cert[4]) * 1000).toLocaleString());
    console.log("Revoked:", cert[5]);
  }

  // Đọc tất cả certificates của student
  console.log("\n5. Đọc tất cả certificates của student...");
  const certIds = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "getCertificatesByStudent",
    args: [studentAddress as `0x${string}`],
  });
  console.log("Certificate IDs của student:", certIds.map(id => id.toString()));
}

main().catch((e) => { console.error(e); process.exit(1); });

