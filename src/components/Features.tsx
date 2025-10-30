import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { CheckCircle, Database, Globe, Lock, Shield, Zap } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Shield,
      title: 'Chống giả mạo',
      description: 'Chứng chỉ được xác thực công khai bằng hash và CID, không thể sửa đổi hay xoá bỏ.',
      badge: 'Bảo mật'
    },
    {
      icon: Zap,
      title: 'Xác minh tức thì (guest)',
      description: 'Nhà tuyển dụng truy cập /verify hoặc quét QR, hệ thống tự kiểm tra on-chain — không cần đăng nhập.',
      badge: 'Hiệu quả'
    },
    {
      icon: Globe,
      title: 'Minh bạch & phi tập trung',
      description: 'Không phụ thuộc vào cơ sở dữ liệu riêng của trường — bất kỳ ai cũng có thể xác thực trên blockchain.',
      badge: 'Minh bạch'
    },
    {
      icon: Database,
      title: 'Dễ tích hợp',
      description: 'Có thể nhúng link xác thực vào LMS, CV điện tử, hoặc ứng dụng HR.',
      badge: 'Linh hoạt'
    },
    {
      icon: Lock,
      title: 'Chi phí thấp',
      description: 'Nhà trường chỉ tốn phí on-chain 1 lần duy nhất khi phát hành.',
      badge: 'Tiết kiệm'
    },
    {
      icon: CheckCircle,
      title: 'Kiểm chứng công khai',
      description: 'Toàn bộ quy trình vận hành dựa trên Blockchain và IPFS, đảm bảo tính bất biến.',
      badge: 'Đáng tin cậy'
    }
  ];

  return (
    <section className="py-20 px-6 bg-muted/30 relative overflow-hidden">
      {/* Background Pattern - Diagonal stripes */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-60 [background:linear-gradient(45deg,theme(colors.primary/8)_25%,transparent_25%,transparent_75%,theme(colors.primary/8)_75%),linear-gradient(-45deg,theme(colors.primary/8)_25%,transparent_25%,transparent_75%,theme(colors.primary/8)_75%)] [background-size:20px_20px]" />
        
        {/* Larger geometric shapes */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-primary/15 rounded-full blur-sm animate-pulse" />
        <div className="absolute top-40 right-20 w-20 h-20 bg-blue-400/25 rounded-lg rotate-45 blur-sm animate-pulse [animation-delay:1s]" />
        <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-purple-400/20 rounded-full blur-sm animate-pulse [animation-delay:2s]" />
        <div className="absolute bottom-20 right-1/3 w-18 h-18 bg-fuchsia-400/25 rounded-lg rotate-12 blur-sm animate-pulse [animation-delay:0.5s]" />
        
        {/* Additional pattern overlay */}
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_25%_25%,theme(colors.blue-400/10)_2px,transparent_2px)] [background-size:40px_40px]" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-blue-400/8" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tại sao chọn CertiChain?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Giải pháp toàn diện cho việc quản lý và xác thực chứng chỉ trong thời đại số
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="h-full bg-background/60 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="opacity-80">{feature.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base opacity-90">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
