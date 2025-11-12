//====================
// npx tsx server/addIssuer.ts
//npx tsx server/addIssuer.ts authorize 0x742d35Cc6634C0532925a3b844Bc9e7595f0beb0
// npx tsx server/addIssuer.ts revoke 0x742d35Cc6634C0532925a3b844Bc9e7595f0beb0
// npx tsx server/addIssuer.ts check 0x742d35Cc6634C0532925a3b844Bc9e7595f0beb0
//====================

import "dotenv/config";
import { createPublicClient, createWalletClient, getAddress, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

const RPC = process.env.SEPOLIA_RPC_URL;
let PK = process.env.PRIVATE_KEY;
const CONTRACT = "0x9C114C532f34f2eEa48fF9Ed2Bea5111f22F1099";

if (!RPC) throw new Error("Missing SEPOLIA_RPC_URL in .env");
if (!PK) throw new Error("Missing PRIVATE_KEY in .env");
if (!CONTRACT) throw new Error("Missing CONTRACT_ADDRESS in .env");

// Đảm bảo private key có prefix 0x
if (!PK.startsWith("0x")) {
  PK = `0x${PK}`;
}

// ABI cho CertiChain contract (chỉ cần functions liên quan đến issuer)
const ABI = [
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

async function authorizeIssuer(issuerAddress: string) {
  console.log("=== Authorize Issuer ===");
  console.log("Contract Owner (your wallet):", account.address);
  
  // Chuẩn hóa địa chỉ issuer
  const normalizedAddress = getAddress(issuerAddress);
  console.log("Issuer address to authorize:", normalizedAddress);

  // 1. Kiểm tra bạn có phải owner không
  console.log("\n[1] Kiểm tra quyền owner...");
  const owner = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "contractOwner",
  });
  console.log("Contract owner:", owner);
  
  if (owner.toLowerCase() !== account.address.toLowerCase()) {
    throw new Error("❌ Bạn không phải contract owner! Chỉ owner mới có thể thêm issuer.");
  }
  console.log("✅ Bạn là owner, có thể thêm issuer");

  // 2. Kiểm tra issuer đã được authorize chưa
  console.log("\n[2] Kiểm tra trạng thái hiện tại của issuer...");
  const isCurrentlyAuthorized = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "isAuthorizedIssuer",
    args: [normalizedAddress],
  });
  
  if (isCurrentlyAuthorized) {
    console.log("⚠️  Issuer này đã được authorize rồi!");
    return;
  }
  console.log("Issuer chưa được authorize, đang thêm...");

  // 3. Authorize issuer
  console.log("\n[3] Gửi transaction authorize issuer...");
  const txHash = await walletClient.writeContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "authorizeIssuer",
    args: [normalizedAddress],
  });
  console.log("Tx hash:", txHash);

  // 4. Chờ transaction được mine
  console.log("\n[4] Chờ transaction được mine...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  console.log("Block number:", receipt.blockNumber);
  console.log("Status:", receipt.status === "success" ? "✅ Success" : "❌ Failed");
  console.log("Gas used:", receipt.gasUsed.toString());

  // 5. Parse event
  if (receipt.logs && receipt.logs.length > 0) {
    console.log("\n[5] Event logs:");
    receipt.logs.forEach((log, idx) => {
      console.log(`Log ${idx}:`, {
        address: log.address,
        topics: log.topics,
      });
    });
  }

  // 6. Verify lại
  console.log("\n[6] Verify issuer đã được authorize...");
  const isNowAuthorized = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "isAuthorizedIssuer",
    args: [normalizedAddress],
  });
  console.log("Is now authorized?", isNowAuthorized ? "✅ Yes" : "❌ No");

  console.log("\n=== Hoàn tất ===");
  console.log(`Issuer ${normalizedAddress} đã được thêm vào hệ thống!`);
}

async function revokeIssuer(issuerAddress: string) {
  console.log("=== Revoke Issuer ===");
  console.log("Contract Owner (your wallet):", account.address);
  
  const normalizedAddress = getAddress(issuerAddress);
  console.log("Issuer address to revoke:", normalizedAddress);

  // 1. Kiểm tra owner
  console.log("\n[1] Kiểm tra quyền owner...");
  const owner = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "contractOwner",
  });
  
  if (owner.toLowerCase() !== account.address.toLowerCase()) {
    throw new Error("❌ Bạn không phải contract owner!");
  }
  console.log("✅ Bạn là owner");

  // 2. Kiểm tra issuer có authorized không
  console.log("\n[2] Kiểm tra trạng thái issuer...");
  const isAuthorized = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "isAuthorizedIssuer",
    args: [normalizedAddress],
  });
  
  if (!isAuthorized) {
    console.log("⚠️  Issuer này chưa được authorize!");
    return;
  }

  // 3. Revoke issuer
  console.log("\n[3] Gửi transaction revoke issuer...");
  const txHash = await walletClient.writeContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "revokeIssuer",
    args: [normalizedAddress],
  });
  console.log("Tx hash:", txHash);

  // 4. Chờ transaction
  console.log("\n[4] Chờ transaction được mine...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  console.log("Status:", receipt.status === "success" ? "✅ Success" : "❌ Failed");

  // 5. Verify
  console.log("\n[5] Verify issuer đã bị revoke...");
  const isStillAuthorized = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "isAuthorizedIssuer",
    args: [normalizedAddress],
  });
  console.log("Is still authorized?", isStillAuthorized ? "⚠️  Yes" : "✅ No (revoked)");

  console.log("\n=== Hoàn tất ===");
}

async function checkIssuer(issuerAddress: string) {
  const normalizedAddress = getAddress(issuerAddress);
  console.log("=== Check Issuer Status ===");
  console.log("Issuer address:", normalizedAddress);

  const isAuthorized = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "isAuthorizedIssuer",
    args: [normalizedAddress],
  });

  console.log("\nStatus:", isAuthorized ? "✅ Authorized" : "❌ Not authorized");
}

// Main CLI
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const address = args[1];

  if (!command) {
    console.log(`
Usage:
  npx tsx server/addIssuer.ts authorize <address>  - Thêm issuer mới
  npx tsx server/addIssuer.ts revoke <address>     - Thu hồi quyền issuer
  npx tsx server/addIssuer.ts check <address>      - Kiểm tra trạng thái issuer

Examples:
  npx tsx server/addIssuer.ts authorize 0x742d35Cc6634C0532925a3b844Bc9e7595f0beb0
  npx tsx server/addIssuer.ts check 0x742d35Cc6634C0532925a3b844Bc9e7595f0beb0
    `);
    process.exit(0);
  }

  if (!address && command !== "help") {
    console.error("❌ Thiếu địa chỉ issuer!");
    process.exit(1);
  }

  switch (command) {
    case "authorize":
    case "add":
      await authorizeIssuer(address);
      break;
    case "revoke":
    case "remove":
      await revokeIssuer(address);
      break;
    case "check":
    case "status":
      await checkIssuer(address);
      break;
    default:
      console.error("❌ Command không hợp lệ:", command);
      process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
