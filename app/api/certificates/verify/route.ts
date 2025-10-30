import { NextResponse } from "next/server";
import { CertificateRepository } from "@/core/repositories/certificate.repository";
import { BlockchainService } from "@/core/repositories/blockchain.repository";

const certificateRepo = new CertificateRepository();
const blockchainService = new BlockchainService();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hash = searchParams.get("hash"); // file hash

    if (!hash) {
      return NextResponse.json(
        { error: "Hash parameter is required" },
        { status: 400 }
      );
    }

    // Find certificate by hash
    const certificate = await certificateRepo.findByHash(hash);

    // Validate certificate data layer 1: DATABASE
    if (!certificate) {
      return NextResponse.json({
        verified: false,
        message: "Certificate not found",
        hash: hash,
      });
    }

    const certOnChain = await blockchainService.verifyOnChain(hash);

    // Validate certificate data layer 2: ONCHAIN
    if (
      !certOnChain.isValid ||
      certOnChain.studentIdHash !== certificate.studentIdHash ||
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
        studentName: certificate.studentName,
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
