import { NextResponse } from "next/server";
import { CertificateRepository } from "@/core/repositories/certificate.repository";
import { BlockchainService } from "@/core/repositories/blockchain.repository";

const certificateRepo = new CertificateRepository();
const blockchainService = new BlockchainService();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hash = searchParams.get("hash"); // can be fileHash or blockchainTx

    if (!hash) {
      return NextResponse.json(
        { error: "Hash parameter is required" },
        { status: 400 }
      );
    }

    // 2 OPT: By file hash and by blockchain/ transaction hash
    let certificate = await certificateRepo.findByHash(hash);
    if (!certificate) {
      certificate = await certificateRepo.findByTxHash(hash);
    }

    // Validate certificate data layer 1: DATABASE - OFFchain
    if (!certificate) {
      return NextResponse.json({
        verified: false,
        message: "Certificate not found",
        hash: hash,
      });
    }

    //  Standard check form data response
    if (!certificate.student) {
      return NextResponse.json({
        verified: false,
        message: "Student information not found",
        hash: hash,
      });
    }

    // Find certificate on blockchain using fileHash
    const certOnChain = await blockchainService.verifyOnChain(
      certificate.fileHash
    );

    // ----- Validate certificate data layer 2: ONCHAIN -----
    if (!certOnChain.isValid) {
      return NextResponse.json({
        verified: false,
        message: "Certificate is invalid on blockchain!",
        hash: hash,
      });
    }

    // Return verification result
    return NextResponse.json({
      verified: certOnChain.isValid,
      certificate: {
        id: certificate.id, // Add certificate ID for navigation
        studentName: certificate.student.studentName,
        studentId: certificate.student.studentId,
        courseName: certificate.courseName,
        issuedAt: certOnChain.issuedAt, // onChain data
        status: certificate.status,
        issuerAddress: certOnChain.issuerAddress, // onChain data
        ipfsFile: certificate.ipfsFile,
        blockchainTx: certificate.blockchainTx,
        tokenId: certOnChain.tokenId.toString(), // NFT token ID
      },
      hash: hash, // file hash
    });
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
