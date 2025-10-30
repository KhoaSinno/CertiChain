// CALL SMART CONTRACT FUNCTION
import { Address, createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
// import CertiChainAbi from "@/lib/abi/CertiChain.json";

// 2. Lấy các biến môi trường
const RPC_URL = process.env.BASE_RPC;
const ADMIN_PRIVATE_KEY = process.env.PRIVATE_KEY as Address | undefined; // viem cần kiểu `0x...`
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS as Address | undefined;

// Check empty env vars
if (!RPC_URL || !ADMIN_PRIVATE_KEY || !CONTRACT_ADDRESS) {
  throw new Error("Missing required environment variables for blockchain");
}

// create admin account from private key
const adminAccount = privateKeyToAccount(ADMIN_PRIVATE_KEY);

// create public and wallet clients
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(RPC_URL),
});

// create wallet client to sign transactions
const walletClient = createWalletClient({
  account: adminAccount,
  chain: sepolia,
  transport: http(RPC_URL),
});

export class BlockchainService {
  /**
   * Call the smart contract to register a certificate on the blockchain
   */

  async registerOnChain(
    fileHash: string,
    ipfsHash: string,
    studentIdHash: string
  ) {
    try {
      console.log("Đang gọi Smart Contract (viem): registerCertificate()...");
      const { request } = await publicClient.simulateContract({
        account: adminAccount,
        address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
        abi: CertiChainAbi,
        functionName: "mint",
        args: [fileHash, ipfsHash, studentIdHash],
      });
      const txHash = await walletClient.writeContract(request);

      console.log("Giao dịch đã được gửi, đang chờ xác nhận...");
      console.log("Transaction Hash:", txHash);

      // (Optional: wait transation to verify success)
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      console.log("Transaction success:", transaction);
      
      return txHash;
    } catch (error) {
      console.log("Error somethings when call contract with VIEM", error);
      throw new Error("Blockchain registration failed");
    }
  }
}
