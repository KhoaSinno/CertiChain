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
      title: 'Tự động hóa xác thực',
      description: 'Nhà tuyển dụng chỉ cần quét mã, hệ thống tự kiểm tra on-chain, không cần xác nhận thủ công.',
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
    <section className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto px-6">
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
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary">{feature.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
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
