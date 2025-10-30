import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/auth";

/**
 * Get server-side session in Server Components or API Routes
 * Usage: const session = await auth();
 */
export async function auth() {
  return await getServerSession(authOptions);
}
