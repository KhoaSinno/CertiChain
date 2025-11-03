import { UserService } from "@/core/services/user.service";
import { NextResponse } from "next/server";

const userService = new UserService();
export async function GET() {
  const users = await userService.getAllStudents();
  return NextResponse.json(users);
}
