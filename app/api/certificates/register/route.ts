import { NextResponse } from "next/server";
import { CertificateRepository } from "@/core/repositories/certificate.repository";
import { BlockchainService } from "@/core/repositories/blockchain.repository";

const certificateRepo = new CertificateRepository();
const blockchainService = new BlockchainService();

export async function POST(request: Request) {
  try {
    const { certificateId } = await request.json();

    if (!certificateId) {
      return NextResponse.json(
        { error: "Certificate ID is required" },
        { status: 400 }
      );
    }

    // Find the certificate
    const certificate = await certificateRepo.findById(
      certificateId.toString()
    );
    // Validate
    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    // TODO: Implement blockchain registration here
    const blockchainTx = await blockchainService.registerOnChain(
      certificate.fileHash,
      certificate.ipfsCid,
      certificate.studentIdHash
    );

    // For now, just update the status to verified
    await certificateRepo.updateStatus(certificateId.toString(), "verified", blockchainTx);

    return NextResponse.json({
      status: "success",
      message: "Certificate registered on blockchain",
      txHash: blockchainTx,
      certificateId: certificateId,
    });
  } catch (error) {
    console.error("Error registering certificate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
