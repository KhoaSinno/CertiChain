import { Github, GraduationCap, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">CertiChain</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Hệ thống xác thực chứng chỉ dựa trên blockchain, 
              kết hợp IPFS để lưu trữ và Base Sepolia để xác minh.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/certificates/create" className="text-muted-foreground hover:text-primary">
                  Tạo chứng chỉ
                </Link>
              </li>
              <li>
                <Link href="/verify" className="text-muted-foreground hover:text-primary">
                  Xác minh
                </Link>
              </li>
            </ul>
          </div>

          {/* Actors */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Đối tượng sử dụng</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>🏫 Nhà trường (Issuer)</li>
              <li>👩‍🎓 Sinh viên (Holder)</li>
              <li>🏢 Nhà tuyển dụng (Verifier)</li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Kết nối</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2025 CertiChain. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="hover:text-primary">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
