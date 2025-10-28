import { CertificateService } from "@/core/services/certificate.service";
import { CertificateRepository } from "@/core/repositories/certificate.repository";
import { NextResponse } from "next/server";

const certificateService = new CertificateService();
const certificateRepo = new CertificateRepository();

export async function POST(request: Request) {
  try {
    // Get form data from request
    const data = await request.formData();
    // Extract data from form data
    const file = data.get("file") as File | null;
    const studentName = data.get("studentName") as string | null;
    const studentId = data.get("studentId") as string | null;
    const courseName = data.get("courseName") as string | null;
    // Validate inputs
    if (!file || !studentName || !studentId || !courseName) {
      return NextResponse.json(
        { error: "Thiếu dữ liệu bắt buộc." },
        { status: 400 }
      );
    }
    // Call service to create certificate
    const result = await certificateService.createCertificate({
      file,
      studentName,
      studentId,
      courseName,
    });
    // return response
    return NextResponse.json(
      {
        status: result.status,
        fileHash: result.fileHash,
        ipfsCid: result.ipfsCid,
        certificateId: result.id,
        ipfsUrl: result.url, // Thêm URL này cho FE dùng luôn
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(console.error("Lỗi tại POST /api/certificates:", error));

    return NextResponse.json({ error: "Lỗi máy chủ nội bộ." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const certificates = await certificateRepo.findAll();
    return NextResponse.json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
