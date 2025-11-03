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
        { 
          error: "Certificate ID is required",
          step: "validation"
        },
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
        { 
          error: "Certificate not found",
          step: "database_lookup",
          certificateId
        },
        { status: 404 }
      );
    }

    // Register on blockchain
    const blockchainTx = await blockchainService.registerOnChain(
      certificate.fileHash,
      certificate.studentIdHash
    );

    // Update the status to verified
    await certificateRepo.updateStatus(certificateId.toString(), "verified", blockchainTx);

    return NextResponse.json({
      status: "success",
      message: "Certificate registered on blockchain",
      txHash: blockchainTx,
      certificateId: certificateId,
      certificate: {
        id: certificate.id,
        fileHash: certificate.fileHash,
        studentIdHash: certificate.studentIdHash,
      }
    });
  } catch (error) {
    // Return detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        errorName,
        errorType: typeof error,
        step: "blockchain_registration",
        details: error instanceof Error ? {
          message: error.message,
          name: error.name,
          stack: error.stack?.split('\n').slice(0, 5).join('\n'), // First 5 lines of stack
        } : String(error),
      },
      { status: 500 }
    );
  }
}
