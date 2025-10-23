import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { GraduationCap, Shield } from 'lucide-react';
import Link from 'next/link';

export function CTA() {
  return (
    <section className="py-20 px-6 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 text-center">
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
              Xác minh chứng chỉ
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-primary-foreground/10 border-primary-foreground/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">1000+</div>
              <div className="text-sm opacity-90">Chứng chỉ đã phát hành</div>
            </CardContent>
          </Card>
          
          <Card className="bg-primary-foreground/10 border-primary-foreground/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-sm opacity-90">Trường học tham gia</div>
            </CardContent>
          </Card>
          
          <Card className="bg-primary-foreground/10 border-primary-foreground/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">99.9%</div>
              <div className="text-sm opacity-90">Độ chính xác xác thực</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
