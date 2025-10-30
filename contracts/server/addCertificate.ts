//====================
// npx tsx server/addCertificate.ts
// Đăng ký tất cả mock certificates lên blockchain
//====================

import "dotenv/config";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

const RPC = process.env.SEPOLIA_RPC_URL;
let PK = process.env.PRIVATE_KEY;
const CONTRACT = "0xF82d44De7D594f8d47c38a2c7208Fac85554C0d8";

if (!RPC) throw new Error("Missing SEPOLIA_RPC_URL in .env");
if (!PK) throw new Error("Missing PRIVATE_KEY in .env");
if (!CONTRACT) throw new Error("Missing CONTRACT_ADDRESS in .env");

// Đảm bảo private key có prefix 0x
if (!PK.startsWith("0x")) {
  PK = `0x${PK}`;
}

// ABI for CertiChain contract
const ABI = [
  {
    inputs: [
      { internalType: "bytes32", name: "_fileHash", type: "bytes32" },
      { internalType: "bytes32", name: "_studentIdHash", type: "bytes32" },
    ],
    name: "registerCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "certificates",
    outputs: [
      { internalType: "bytes32", name: "studentIdHash", type: "bytes32" },
      { internalType: "address", name: "issuer", type: "address" },
      { internalType: "uint256", name: "issuedAt", type: "uint256" },
      { internalType: "bool", name: "isValid", type: "bool" },
    ],
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
      { indexed: false, internalType: "bytes32", name: "studentidHash", type: "bytes32" },
      { indexed: false, internalType: "uint256", name: "issuedAt", type: "uint256" },
    ],
    name: "CertificateRegistered",
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

// Mock data từ seed.ts - Chỉ cần 2 trường: fileHash và studentIdHash
const MOCK_CERTIFICATES = [
  {
    fileHash: "2efb9c8e48e3ae48c92778cf08fcea01ba8091cfdbacd2609d97747db3b34001",
    studentIdHash: "2ab654b93d08a274e519d869fd164c93f0f8138599b197d25017fc4b5958db59",
  },
  {
    fileHash: "24d3300b4cb276e7110527d6d5e7f3856c5b2f049c9ccc5a9d3080d9b610b11b",
    studentIdHash: "eb6afd674b0616f0f157e35e6bb1803851fc1f35fd9cd09a75b48354d20fc006",
  },
  {
    fileHash: "cbddcf032651fc6983fb61ccbceb226e1e436dd41f697e9692f17377eb8d6e78",
    studentIdHash: "f78435b92de21febe98363e42450e3c48160ab9f3a7146e6ca1c48e231cd2176",
  },
  {
    fileHash: "fc085bee6fa69a7fd8a93b25c75162acf7ebc9c5c0ee563d822d4a1683cc7f8b",
    studentIdHash: "e7eafed3add7ae685ae04713ff89c478154376f4a5bcdc41de76bff21c3bd330",
  },
  {
    fileHash: "d48d31973a2676fff595a3a4ab2c6a8735589b83d9b2c0619f16e7663e4d4321",
    studentIdHash: "8f8e0df7774fb61d4262e042a32a40ec2654dd39eb78eb9ef49cf6b27ed14882",
  },
  {
    fileHash: "33c393dcc9a8c0210d48798cac743e5741aa1d9d074f554ca4fdbfc85454756a",
    studentIdHash: "4ae408c677ee1cca73e698acb95e77cb59aa2cdef732a74d63dc2350a7b4c817",
  },
  {
    fileHash: "f1383e98fe7a20c51cdd8e42ecf5667c9d29510fb84de75e3e4ab696861ded3a",
    studentIdHash: "43d42268c0a21fef6b08ae2f1f3752245fec0ae6588856c2a99dade001786605",
  },
  {
    fileHash: "146687b95c77271ad1e4922a3999bf857ba69b87a5ca5c37eb723dbda0350c04",
    studentIdHash: "2a797aae79685d9f7fe5229ef4e43765ee8d7485bd7d06297904c7042ab84ec7",
  },
];

async function registerCertificate(
  fileHash: string,
  studentIdHash: string,
  index: number
) {
  // Thêm 0x prefix nếu chưa có
  const formattedFileHash = fileHash.startsWith("0x") ? fileHash : `0x${fileHash}`;
  const formattedStudentIdHash = studentIdHash.startsWith("0x")
    ? studentIdHash
    : `0x${studentIdHash}`;

  console.log(`\n📜 Certificate #${index + 1}`);
  console.log(`   File hash: ${formattedFileHash.slice(0, 10)}...`);
  console.log(`   Student ID hash: ${formattedStudentIdHash.slice(0, 10)}...`);

  // Kiểm tra đã tồn tại chưa
  try {
    const existing = await publicClient.readContract({
      address: CONTRACT as `0x${string}`,
      abi: ABI,
      functionName: "certificates",
      args: [formattedFileHash as `0x${string}`],
    });

    if (Number(existing[2]) !== 0) {
      console.log(`   ⚠️  Đã tồn tại (issued at ${new Date(Number(existing[2]) * 1000).toLocaleString()})`);
      return { success: false, reason: "already_exists", txHash: null };
    }
  } catch {
    // Certificate chưa tồn tại, tiếp tục
  }

  // Đăng ký lên blockchain
  try {
    const txHash = await walletClient.writeContract({
      address: CONTRACT as `0x${string}`,
      abi: ABI,
      functionName: "registerCertificate",
      args: [formattedFileHash as `0x${string}`, formattedStudentIdHash as `0x${string}`],
    });

    console.log(`   ⏳ Tx hash: ${txHash}`);

    // Chờ confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    if (receipt.status === "success") {
      console.log(`   ✅ Success (block ${receipt.blockNumber}, gas: ${receipt.gasUsed})`);
      return { success: true, txHash, blockNumber: receipt.blockNumber };
    } else {
      console.log(`   ❌ Failed`);
      return { success: false, reason: "tx_failed", txHash };
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error instanceof Error ? error.message.split('\n')[0] : String(error)}`);
    return { success: false, reason: "error", txHash: null };
  }
}

async function main() {
  console.log("=== Register Mock Certificates to Blockchain ===");
  console.log(`Issuer: ${account.address}`);
  console.log(`Contract: ${CONTRACT}`);
  console.log(`Total certificates: ${MOCK_CERTIFICATES.length}`);

  // Kiểm tra issuer có authorized không
  console.log("\n[1] Kiểm tra quyền issuer...");
  const isAuthorized = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "isAuthorizedIssuer",
    args: [account.address],
  });

  if (!isAuthorized) {
    throw new Error(
      "❌ Account này chưa được authorize làm issuer! Chạy: npx tsx server/addIssuer.ts authorize <address>"
    );
  }
  console.log("✅ Account là issuer hợp lệ");

  // Đăng ký từng certificate
  console.log("\n[2] Bắt đầu đăng ký certificates...");
  const results = {
    success: 0,
    skipped: 0,
    failed: 0,
    txHashes: [] as string[],
  };

  for (let i = 0; i < MOCK_CERTIFICATES.length; i++) {
    const cert = MOCK_CERTIFICATES[i];
    console.log(`\n--- Certificate ${i + 1}/${MOCK_CERTIFICATES.length} ---`);

    const result = await registerCertificate(
      cert.fileHash,
      cert.studentIdHash,
      i
    );

    if (result.success) {
      results.success++;
      if (result.txHash) results.txHashes.push(result.txHash);
    } else if (result.reason === "already_exists") {
      results.skipped++;
    } else {
      results.failed++;
    }

    // Delay để tránh rate limit
    if (i < MOCK_CERTIFICATES.length - 1) {
      console.log("   ⏸️  Đợi 2 giây...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // Tổng kết
  console.log("\n=== Tổng kết ===");
  console.log(`✅ Thành công: ${results.success}`);
  console.log(`⚠️  Đã tồn tại (bỏ qua): ${results.skipped}`);
  console.log(`❌ Thất bại: ${results.failed}`);
  console.log(`📝 Tổng cộng: ${MOCK_CERTIFICATES.length}`);

  if (results.txHashes.length > 0) {
    console.log("\n📋 Transaction hashes:");
    results.txHashes.forEach((hash, idx) => {
      console.log(`   ${idx + 1}. ${hash}`);
      console.log(`      https://sepolia.etherscan.io/tx/${hash}`);
    });
  }

  console.log("\n✨ Hoàn tất!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
