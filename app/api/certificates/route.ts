import { CertificateService } from "@/core/services/certificate.service";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const certificateService = new CertificateService();

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

    // Tìm user theo studentId
    const student = await prisma.user.findFirst({
      where: { studentId: studentId },
    });

    if (!student) {
      return NextResponse.json(
        { error: `Không tìm thấy sinh viên với student ID: ${studentId}` },
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
        ipfsFile: result.ipfsFile,
        certificateId: result.id,
        ipfsUrl: result.fileURL, // Thêm URL này cho FE dùng luôn
        metadataUrl: result.metadataURL,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(console.error("Lỗi tại POST /api/certificates:", error));

    return NextResponse.json({ error: "Lỗi máy chủ nội bộ." }, { status: 500 });
  }
}

export async function GET(request: Request) {
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

    // Get pagination params from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    let certificates;
    let total;

    // ADMIN: Xem tất cả certificates
    if (currentUser.role === "ADMIN") {
      [certificates, total] = await Promise.all([
        prisma.certificate.findMany({
          skip,
          take: limit,
          orderBy: { issuedAt: "desc" },
          include: { student: true },
        }),
        prisma.certificate.count(),
      ]);
    }
    // STUDENT: Chỉ xem certificates của chính mình
    else {
      [certificates, total] = await Promise.all([
        prisma.certificate.findMany({
          where: { userId: currentUser.id },
          skip,
          take: limit,
          orderBy: { issuedAt: "desc" },
          include: { student: true },
        }),
        prisma.certificate.count({
          where: { userId: currentUser.id },
        }),
      ]);
    }

    // Map certificates to ensure consistent format
    const mappedCertificates = certificates.map((cert) => ({
      ...cert,
      tokenId: cert.tokenId?.toString() || null,
      mintTx: cert.mintTx || null,
      transactionHash: cert.blockchainTx, // Add alias for compatibility
    }));

    return NextResponse.json({
      data: mappedCertificates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
