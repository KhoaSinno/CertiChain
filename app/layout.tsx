import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
