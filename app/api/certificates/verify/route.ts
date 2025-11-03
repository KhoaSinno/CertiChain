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

    // Try to find certificate by fileHash first, then by blockchainTx
    let certificate = await certificateRepo.findByHash(hash);

    if (!certificate) {
      // If not found by fileHash, try blockchainTx
      certificate = await certificateRepo.findByTxHash(hash);
    }

    // Validate certificate data layer 1: DATABASE
    if (!certificate) {
      return NextResponse.json({
        verified: false,
        message: "Certificate not found",
        hash: hash,
      });
    }

    // ✅ Certificate already includes student from findByHash
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

    // Validate certificate data layer 2: ONCHAIN
    if (
      !certOnChain.isValid ||
      certOnChain.issuerAddress.toLowerCase() !==
        certificate.issuerAddress.toLowerCase()
    ) {
      return NextResponse.json({
        verified: false,
        message: "Certificate is not valid on blockchain!",
        hash: hash,
      });
    }

    // Return verification result
    return NextResponse.json({
      verified: certOnChain.isValid,
      certificate: {
        studentName: certificate.student.studentName,
        courseName: certificate.courseName,
        issuedAt: certOnChain.issuedAt, // onChain data
        status: certificate.status,
        issuerAddress: certOnChain.issuerAddress, // onChain data
        ipfsCid: certificate.ipfsCid,
        blockchainTx: certificate.blockchainTx,
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
