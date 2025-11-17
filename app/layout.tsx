import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ErrorBoundary } from "./ErrorBoundary";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "CertiChain - Hệ thống xác thực chứng chỉ dựa trên blockchain",
  description:
    "CertiChain là hệ thống xác thực chứng chỉ dựa trên blockchain, kết hợp IPFS để lưu trữ và Sepolia để xác minh. Dự án gồm dashboard quản trị cho nhà trường, giao diện người dùng cho sinh viên, và trang xác minh công khai cho nhà tuyển dụng.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth(); // Lấy session ở Server

  return (
    <html lang="vi">
      <body className={`antialiased`}>
        <ErrorBoundary>
          <Providers session={session}>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
