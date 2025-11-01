import { CertificateService } from "@/core/services/certificate.service";
import { CertificateRepository } from "@/core/repositories/certificate.repository";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const certificateService = new CertificateService();
const certificateRepo = new CertificateRepository();

export async function POST(request: Request) {
  try {
    // Xác thực người dùng với NextAuth
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Vui lòng đăng nhập." },
        { status: 401 }
      );
    }

    // Kiểm tra role - CHỈ ADMIN mới được tạo certificate
    const currentUser = await prisma.user.findFirst({
      where: { id: parseInt(session.user.id) },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "User không tồn tại." },
        { status: 404 }
      );
    }

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Chỉ Admin mới có thể tạo certificate." },
        { status: 403 }
      );
    }

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

    // Tìm user theo studentId (username)
    const student = await prisma.user.findFirst({
      where: { username: studentId },
    });

    if (!student) {
      return NextResponse.json(
        { error: `Không tìm thấy sinh viên với username: ${studentId}` },
        { status: 404 }
      );
    }

    // Call service to create certificate
    const result = await certificateService.createCertificate({
      file,
      studentName,
      studentId,
      courseName,
      userId: student.id, // Sử dụng userId của sinh viên được tạo certificate
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
    // Xác thực người dùng
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Vui lòng đăng nhập." },
        { status: 401 }
      );
    }

    const currentUser = await prisma.user.findFirst({
      where: { id: parseInt(session.user.id) },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "User không tồn tại." },
        { status: 404 }
      );
    }

    let certificates;

    // ADMIN: Xem tất cả certificates
    if (currentUser.role === "ADMIN") {
      certificates = await certificateRepo.findAll();
    }
    // STUDENT: Chỉ xem certificates của chính mình
    else {
      certificates = await prisma.certificate.findMany({
        where: { userId: currentUser.id },
        orderBy: { issuedAt: "desc" },
      });
    }

    return NextResponse.json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
