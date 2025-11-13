// CALL SMART CONTRACT FUNCTION
import CertiChainAbi from "@/lib/abi/CertiChain.json";
import { normalizeHashToBytes32 } from "@/utils/SHA256_to_bytes32";
import {
  Abi,
  Address,
  createPublicClient,
  createWalletClient,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

type VerifyCertificateOutput = {
  issuerAddress: Address;
  issuedAt: Date;
  isValid: boolean;
  tokenId: bigint;
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
  // -- REGISTER CERTIFICATE ONCHAIN --
  async registerOnChain(fileHash: string) {
    try {
      const { request } = await publicClient.simulateContract({
        account: adminAccount,
        address: CONTRACT_ADDRESS as Address,
        abi: ABI,
        functionName: "registerCertificate",
        args: [normalizeHashToBytes32(fileHash)], // Normalize hashes to bytes32 format
      });
      const txHash = await walletClient.writeContract(request);

      console.log("Giao dịch đã được gửi, đang chờ xác nhận...");
      console.log("Transaction Hash:", txHash);

      // (Optional: wait transation to verify success)
      const txObj = await publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations: 1,
      });

      if (txObj.status !== "success") {
        throw new Error("Transaction failed on-chain");
      }

      console.log("Transaction success:", txObj);
      return txHash;
    } catch (error) {
      console.log("Error somethings when call contract with VIEM", error);
      throw new Error("Blockchain registration failed");
    }
  }

  // -- VERIFY ONCHAIN CERTIFICATE --
  async verifyOnChain(fileHash: string): Promise<VerifyCertificateOutput> {
    try {
      // Normalize hash before verification
      const normalizedFileHash = normalizeHashToBytes32(fileHash);

      const certVerified = (await publicClient.readContract({
        address: CONTRACT_ADDRESS as Address,
        abi: ABI,
        functionName: "verifyCertificate",
        args: [normalizedFileHash],
      })) as [Address, bigint, boolean, bigint];

      return {
        issuerAddress: certVerified[0],
        issuedAt: new Date(Number(certVerified[1]) * 1000),
        isValid: certVerified[2],
        tokenId: certVerified[3],
      };
    } catch (error) {
      console.log("Verify error with server: ", error);
      throw new Error("Blockchain verification failed");
    }
  }

  // -- MINT NFT CERTIFICATE --
  async mintCertificate(fileHash: string, metadataIpfs: string) {
    try {
      const { request } = await publicClient.simulateContract({
        account: adminAccount,
        address: CONTRACT_ADDRESS as Address,
        abi: ABI,
        functionName: "mintCertificateNFT",
        args: [normalizeHashToBytes32(fileHash), metadataIpfs],
      });

      const txHash = await walletClient.writeContract(request);
      console.log("Mint NFT transaction sent, transaction hash:", txHash);

      const txObj = await publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations: 1,
      });

      if (txObj.status !== "success") {
        throw new Error("Transaction failed on-chain");
      }

      // Call early verifyOnChain to get tokenId
      const { tokenId } = await this.verifyOnChain(fileHash);
      if (!tokenId) {
        throw new Error("Token ID not found after minting");
      }

      return { txHash, tokenId };
    } catch (error) {
      console.log("Mint NFT error with server: ", error);
      throw new Error("Mint NFT failed");
    }
  }
}
