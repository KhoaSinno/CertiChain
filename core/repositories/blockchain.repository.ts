// CALL SMART CONTRACT FUNCTION
import {
  Abi,
  Address,
  createPublicClient,
  createWalletClient,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import CertiChainAbi from "@/lib/abi/CertiChain.json";

type VerifyCertificateInput = {
  fileHash: string;
};

type VerifyCertificateOutput = {
  issuerAddress: Address;
  issuedAt: Date;
  studentIdHash: string;
  isValid: boolean;
};

// 2. Lấy các biến môi trường
const RPC_URL = process.env.BASE_RPC;
const ADMIN_PRIVATE_KEY = process.env.PRIVATE_KEY as Address | undefined; // viem cần kiểu `0x...`
const CONTRACT_ADDRESS = CertiChainAbi.contractAddress as Address | undefined;
const ABI = CertiChainAbi.abi as Abi;

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
    // ipfsHash: string,
    studentIdHash: string
  ) {
    try {
      console.log("Đang gọi Smart Contract (viem): registerCertificate()...");
      const { request } = await publicClient.simulateContract({
        account: adminAccount,
        address: CONTRACT_ADDRESS as Address,
        abi: ABI,
        functionName: "registerCertificate",
        args: [fileHash, studentIdHash],
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

  async verifyOnChain(fileHash: string): Promise<VerifyCertificateOutput> {
    try {
      const certVerified = (await publicClient.readContract({
        address: CONTRACT_ADDRESS as Address,
        abi: ABI,
        functionName: "verifyCertificate",
        args: [fileHash],
      })) as [boolean, Address, bigint, string, boolean];

      return {
        issuerAddress: certVerified[1],
        issuedAt: new Date(Number(certVerified[2]) * 1000),
        studentIdHash: certVerified[3],
        isValid: certVerified[4],
      };
    } catch (error) {
      console.log("Verify error with server: ", error);
      throw new Error("Blockchain verification failed");
    }
  }
}
