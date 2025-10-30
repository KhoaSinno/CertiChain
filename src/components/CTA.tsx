import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { GraduationCap, Shield } from 'lucide-react';
import Link from 'next/link';

export function CTA() {
  return (
    <section className="py-20 px-6 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern - Concentric circles */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,theme(colors.primary-foreground/10)_1px,transparent_1px),radial-gradient(circle_at_80%_80%,theme(colors.primary-foreground/10)_1px,transparent_1px)] [background-size:40px_40px,60px_60px]" />
        
        {/* Animated rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-primary-foreground/10 rounded-full animate-ping [animation-duration:3s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-primary-foreground/15 rounded-full animate-ping [animation-duration:4s] [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-primary-foreground/20 rounded-full animate-ping [animation-duration:5s] [animation-delay:2s]" />
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-24 h-24 bg-primary-foreground/5 rounded-full blur-xl animate-pulse [animation-delay:0s]" />
        <div className="absolute top-32 right-32 w-32 h-32 bg-primary-foreground/8 rounded-full blur-2xl animate-pulse [animation-delay:1.5s]" />
        <div className="absolute bottom-24 left-1/3 w-20 h-20 bg-primary-foreground/6 rounded-full blur-lg animate-pulse [animation-delay:3s]" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-foreground/5 via-transparent to-primary-foreground/10" />
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Sẵn sàng bắt đầu?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Tham gia hàng ngàn trường học và doanh nghiệp đã tin tưởng CertiChain 
          để quản lý chứng chỉ một cách minh bạch và hiệu quả.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button asChild size="lg" variant="secondary">
            <Link href="/dashboard">
              <GraduationCap className="mr-2 h-5 w-5" />
              Dành cho nhà trường
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            <Link href="/verify">
              <Shield className="mr-2 h-5 w-5" />
              Xác minh như khách (không cần tài khoản)
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-primary-foreground/5 border-primary-foreground/10 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">1000+</div>
              <div className="text-sm opacity-80">Chứng chỉ đã phát hành</div>
            </CardContent>
          </Card>
          
          <Card className="bg-primary-foreground/5 border-primary-foreground/10 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-sm opacity-80">Trường học tham gia</div>
            </CardContent>
          </Card>
          
          <Card className="bg-primary-foreground/5 border-primary-foreground/10 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">99.9%</div>
              <div className="text-sm opacity-80">Độ chính xác xác thực</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
