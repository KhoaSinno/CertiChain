import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, Shield, Users } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto px-6 text-center">
        <Badge variant="secondary" className="mb-4">
          🚀 Blockchain + IPFS 2025
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Hệ thống xác thực chứng chỉ
          <span className="text-primary block">dựa trên blockchain</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          CertiChain kết hợp IPFS để lưu trữ và Base Sepolia để xác minh, 
          đảm bảo tính minh bạch, bất biến và không thể giả mạo.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button asChild size="lg">
            <Link href="/dashboard">
              <GraduationCap className="mr-2 h-5 w-5" />
              Bắt đầu ngay
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/verify">
              <Shield className="mr-2 h-5 w-5" />
              Xác minh chứng chỉ
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">🏫 Nhà trường</h3>
            <p className="text-muted-foreground">
              Tạo và phát hành chứng chỉ kỹ thuật số minh bạch
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">👩‍🎓 Sinh viên</h3>
            <p className="text-muted-foreground">
              Chia sẻ chứng chỉ dễ dàng với link hoặc QR code
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">🏢 Nhà tuyển dụng</h3>
            <p className="text-muted-foreground">
              Xác minh chứng chỉ độc lập, không cần liên hệ trường
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
