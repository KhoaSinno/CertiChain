import { BlockchainService } from "@/core/repositories/blockchain.repository";
import { CertificateRepository } from "@/core/repositories/certificate.repository";
import { NextResponse } from "next/server";

const certificateRepo = new CertificateRepository();
const blockchainService = new BlockchainService();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hash = searchParams.get("hash"); // can be file hash or transaction hash
    const type = searchParams.get("type") || "auto"; // "file", "tx", or "auto"

    if (!hash) {
      return NextResponse.json(
        { error: "Hash parameter is required" },
        { status: 400 }
      );
    }

    let fileHash: string;
    let certificate;
    let certOnChain;

    // Determine hash type and get file hash
    if (type === "tx" || (type === "auto" && hash.startsWith("0x") && hash.length === 66)) {
      // Transaction hash (0x + 64 hex chars)
      console.log("Verifying by transaction hash:", hash);
      
      try {
        // Get certificate info from transaction
        console.log("[VERIFY] Fetching transaction data...");
        const txData = await blockchainService.getCertificateFromTxHash(hash);
        fileHash = txData.fileHash;
        
        console.log("[VERIFY] Transaction data:", {
          fileHash,
          issuerAddress: txData.issuerAddress,
          issuedAt: txData.issuedAt,
        });
        
        // Normalize fileHash (remove 0x if present)
        const normalizedFileHash = fileHash.startsWith('0x') ? fileHash.slice(2) : fileHash;
        console.log("[VERIFY] Normalized file hash:", normalizedFileHash);
        
        // Find certificate in database by file hash
        certificate = await certificateRepo.findByHash(normalizedFileHash);
        console.log("[VERIFY] Certificate from DB:", certificate ? `Found ID: ${certificate.id}` : 'Not found');
        
        if (!certificate) {
          return NextResponse.json({
            verified: false,
            message: "Certificate registered on blockchain but not found in database",
            transactionHash: hash,
            fileHash: normalizedFileHash,
            onChainData: {
              issuerAddress: txData.issuerAddress,
              issuedAt: txData.issuedAt,
              studentIdHash: txData.studentIdHash,
            }
          });
        }

        // Verify on blockchain using file hash
        certOnChain = await blockchainService.verifyOnChain(normalizedFileHash);
        
      } catch (error) {
        console.error("[VERIFY] Error processing transaction hash:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({
          verified: false,
          message: `Invalid transaction hash or transaction not found: ${errorMessage}`,
          transactionHash: hash,
          error: errorMessage,
        });
      }
    } else {
      // File hash (without 0x prefix or with it but 64 chars)
      console.log("Verifying by file hash:", hash);
      fileHash = hash;
      
      // Find certificate by hash
      certificate = await certificateRepo.findByHash(fileHash);

      // Validate certificate data layer 1: DATABASE
      if (!certificate) {
        return NextResponse.json({
          verified: false,
          message: "Certificate not found in database",
          hash: fileHash,
        });
      }

      // Find certificate on blockchain
      certOnChain = await blockchainService.verifyOnChain(fileHash);
    }

    // Validate certificate data layer 2: ONCHAIN
    if (
      !certOnChain.isValid ||
      certOnChain.studentIdHash !== certificate.studentIdHash ||
      certOnChain.issuerAddress.toLowerCase() !==
        certificate.issuerAddress.toLowerCase()
    ) {
      return NextResponse.json({
        verified: false,
        message: "Certificate data mismatch between database and blockchain!",
        hash: fileHash,
        databaseData: {
          studentIdHash: certificate.studentIdHash,
          issuerAddress: certificate.issuerAddress,
        },
        blockchainData: {
          studentIdHash: certOnChain.studentIdHash,
          issuerAddress: certOnChain.issuerAddress,
        }
      });
    }

    // Return verification result
    return NextResponse.json({
      verified: certOnChain.isValid,
      certificate: {
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        issuedAt: certOnChain.issuedAt, // onChain data
        status: certificate.status,
        issuerAddress: certOnChain.issuerAddress, // onChain data
        ipfsCid: certificate.ipfsCid,
        blockchainTx: certificate.blockchainTx,
      },
      fileHash: fileHash,
      transactionHash: certificate.blockchainTx,
    });
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
