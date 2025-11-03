// CALL SMART CONTRACT FUNCTION
import CertiChainAbi from "@/lib/abi/CertiChain.json";
import {
  Abi,
  Address,
  createPublicClient,
  createWalletClient,
  Hex,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

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

/**
 * Convert SHA-256 hash string to bytes32 format (0x + 64 hex chars)
 */
function normalizeHashToBytes32(hash: string): Hex {
  // Remove any existing 0x prefix
  const cleanHash = hash.replace(/^0x/, "");

  // Ensure it's exactly 64 hex characters
  if (cleanHash.length !== 64) {
    throw new Error(
      `Invalid hash length: expected 64 chars, got ${cleanHash.length}`
    );
  }

  // Validate hex format
  if (!/^[0-9a-fA-F]{64}$/.test(cleanHash)) {
    throw new Error("Hash contains invalid hex characters");
  }

  return `0x${cleanHash}` as Hex;
}

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

      // Normalize hashes to bytes32 format
      const normalizedFileHash = normalizeHashToBytes32(fileHash);
      const normalizedStudentIdHash = normalizeHashToBytes32(studentIdHash);

      const { request } = await publicClient.simulateContract({
        account: adminAccount,
        address: CONTRACT_ADDRESS as Address,
        abi: ABI,
        functionName: "registerCertificate",
        args: [normalizedFileHash, normalizedStudentIdHash],
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
      // Normalize hash before verification
      const normalizedFileHash = normalizeHashToBytes32(fileHash);

      const certVerified = (await publicClient.readContract({
        address: CONTRACT_ADDRESS as Address,
        abi: ABI,
        functionName: "verifyCertificate",
        args: [normalizedFileHash],
      })) as [Address, bigint, string, boolean];

      return {
        issuerAddress: certVerified[0],
        issuedAt: new Date(Number(certVerified[1]) * 1000),
        studentIdHash: certVerified[2],
        isValid: certVerified[3],
      };
    } catch (error) {
      console.log("Verify error with server: ", error);
      throw new Error("Blockchain verification failed");
    }
  }

  /**
   * Get certificate info from transaction hash
   * This reads the transaction receipt and extracts CertificateRegistered event data
   */
  async getCertificateFromTxHash(txHash: string): Promise<{
    fileHash: string;
    studentIdHash: string;
    issuerAddress: Address;
    issuedAt: Date;
  }> {
    try {
      // Get transaction receipt
      const receipt = await publicClient.getTransactionReceipt({
        hash: txHash as Hex,
      });

      if (!receipt || receipt.status !== 'success') {
        throw new Error('Transaction not found or failed');
      }

      // Find CertificateRegistered event in logs
      const certificateEvent = receipt.logs.find((log) => {
        // Check if log is from our contract
        if (log.address.toLowerCase() !== CONTRACT_ADDRESS?.toLowerCase()) {
          return false;
        }

        // CertificateRegistered event signature
        // event CertificateRegistered(bytes32 indexed fileHash, address indexed issuer, bytes32 studentidHash, uint256 issuedAt)
        const eventSignature = '0xfb62d7d96831a0779f5c8ccf8a667f70cda9dabbef7e461f674c05fbe93423d9';
        return log.topics[0] === eventSignature;
      });

      if (!certificateEvent || !certificateEvent.topics) {
        throw new Error('CertificateRegistered event not found in transaction');
      }

      // Parse event data
      // topics[0] = event signature
      // topics[1] = fileHash (indexed)
      // topics[2] = issuer (indexed)
      // data = studentIdHash + issuedAt (non-indexed)
      const fileHash = certificateEvent.topics[1];
      const issuerTopic = certificateEvent.topics[2];
      
      console.log("[BLOCKCHAIN] Event topics:", {
        fileHash,
        issuerTopic,
        data: certificateEvent.data,
      });
      
      if (!fileHash || !issuerTopic) {
        throw new Error('Invalid event data: missing topics');
      }
      
      const issuerAddress = `0x${issuerTopic.slice(26)}` as Address; // address (last 20 bytes)

      // Decode data field (studentIdHash + issuedAt)
      const data = certificateEvent.data;
      const studentIdHash = data.slice(0, 66); // First 32 bytes (0x + 64 chars)
      const issuedAtHex = `0x${data.slice(66)}` as Hex; // Remaining bytes
      const issuedAt = new Date(Number(BigInt(issuedAtHex)) * 1000);

      console.log("[BLOCKCHAIN] Parsed data:", {
        fileHash,
        studentIdHash,
        issuerAddress,
        issuedAt,
      });

      return {
        fileHash,
        studentIdHash,
        issuerAddress,
        issuedAt,
      };
    } catch (error) {
      console.log("Error getting certificate from tx hash:", error);
      throw new Error("Failed to get certificate from transaction hash");
    }
  }
}
