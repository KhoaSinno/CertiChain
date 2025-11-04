import { UserService } from "@/core/services/user.service";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

const userService = new UserService();
export async function GET() {
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
    return NextResponse.json({ error: "User không tồn tại." }, { status: 404 });
  }

  if (currentUser.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden - Chỉ Admin mới có thể GET Student list." },
      { status: 403 }
    );
  }

  const users = await userService.getAllStudents();
  return NextResponse.json(users);
}
