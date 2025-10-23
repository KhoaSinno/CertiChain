import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { GraduationCap, Shield, Users } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="container mx-auto px-6 text-center">
        <Badge variant="secondary" className="mb-4 bg-primary text-primary-foreground shadow-primary">
          🚀 Blockchain + IPFS 2025
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-vietnamese leading-tight">
          Hệ thống xác thực chứng chỉ
          <br />
          <span className="text-gradient-primary font-bold">dựa trên blockchain</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          CertiChain kết hợp IPFS để lưu trữ và Base Sepolia để xác minh, 
          đảm bảo tính minh bạch, bất biến và không thể giả mạo.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button asChild size="lg" className="!bg-primary !text-primary-foreground !hover:bg-primary/90 shadow-primary font-semibold">
            <Link href="/dashboard">
              <GraduationCap className="mr-2 h-5 w-5" />
              Bắt đầu ngay
            </Link>
          </Button>
          <Button asChild size="lg" className="!border-2 !border-primary !bg-background !text-primary !hover:bg-primary/10 font-semibold">
            <Link href="/verify">
              <Shield className="mr-2 h-5 w-5" />
              Xác minh chứng chỉ
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-xl bg-card shadow-card hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-primary">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-vietnamese">🏫 Nhà trường</h3>
            <p className="text-muted-foreground text-vietnamese">
              Tạo và phát hành chứng chỉ kỹ thuật số minh bạch
            </p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-card shadow-card hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-primary">
              <Users className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-vietnamese">👩‍🎓 Sinh viên</h3>
            <p className="text-muted-foreground text-vietnamese">
              Chia sẻ chứng chỉ dễ dàng với link hoặc QR code
            </p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-card shadow-card hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-primary">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-vietnamese">🏢 Nhà tuyển dụng</h3>
            <p className="text-muted-foreground text-vietnamese">
              Xác minh chứng chỉ độc lập, không cần liên hệ trường
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
