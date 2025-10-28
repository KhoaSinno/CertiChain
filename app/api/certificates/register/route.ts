import { NextResponse } from "next/server";
import { CertificateRepository } from "@/core/repositories/certificate.repository";

const certificateRepo = new CertificateRepository();

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

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    // TODO: Implement blockchain registration here
    // For now, just update the status to verified
    await certificateRepo.updateStatus(certificateId.toString(), "verified");

    return NextResponse.json({
      status: "success",
      message: "Certificate registered on blockchain",
      txHash: "0x" + Math.random().toString(16).substr(2, 64), // Placeholder
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
