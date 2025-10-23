import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";


export const metadata: Metadata = {
  title: "CertiChain - Hệ thống xác thực chứng chỉ dựa trên blockchain",
  description: "CertiChain là hệ thống xác thực chứng chỉ dựa trên blockchain, kết hợp IPFS để lưu trữ và Base Sepolia để xác minh. Dự án gồm dashboard quản trị cho nhà trường, giao diện người dùng cho sinh viên, và trang xác minh công khai cho nhà tuyển dụng.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
