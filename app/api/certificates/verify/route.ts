import { NextResponse } from "next/server";
import { CertificateRepository } from "@/core/repositories/certificate.repository";

const certificateRepo = new CertificateRepository();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hash = searchParams.get("hash");

    if (!hash) {
      return NextResponse.json(
        { error: "Hash parameter is required" },
        { status: 400 }
      );
    }

    // Find certificate by hash
    const certificate = await certificateRepo.findByHash(hash);

    if (!certificate) {
      return NextResponse.json({
        verified: false,
        message: "Certificate not found",
        hash: hash,
      });
    }

    // Return verification result
    return NextResponse.json({
      verified: true,
      certificate: {
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        issuedAt: certificate.issuedAt,
        status: certificate.status,
        issuerAddress: certificate.issuerAddress,
        ipfsCid: certificate.ipfsCid,
        blockchainTx: certificate.blockchainTx,
      },
      hash: hash,
    });
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
