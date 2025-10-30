import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent } from '@/src/components/ui/card';
import { GraduationCap, Shield, Users } from 'lucide-react';

export function Process() {
  const steps = [
    {
      step: 1,
      title: 'Nhà trường phát hành',
      description: 'Upload file chứng chỉ, hệ thống tự động tạo hash và upload lên IPFS',
      icon: GraduationCap,
      details: [
        'Nhập thông tin sinh viên và khóa học',
        'Upload file PDF chứng chỉ',
        'Hệ thống sinh SHA-256 hash',
        'Upload lên IPFS → nhận CID',
        'Ghi lên blockchain Base Sepolia'
      ]
    },
    {
      step: 2,
      title: 'Sinh viên nhận chứng chỉ',
      description: 'Nhận link hoặc QR code để chia sẻ trong hồ sơ cá nhân',
      icon: Users,
      details: [
        'Nhận link công khai từ trường',
        'Copy link hoặc QR code',
        'Chèn vào CV, portfolio',
        'Không cần tài khoản hay ví',
        'Chia sẻ dễ dàng'
      ]
    },
    {
      step: 3,
      title: 'Nhà tuyển dụng xác minh',
      description: 'Quét QR hoặc truy cập link để xác minh tính hợp lệ',
      icon: Shield,
      details: [
        'Truy cập link hoặc quét QR',
        'Hệ thống kiểm tra on-chain',
        'Xác minh issuer và thông tin',
        'Hiển thị kết quả xác thực',
        'Xem file gốc trên IPFS'
      ]
    }
  ];

  return (
    <section className="py-20 px-6 relative overflow-hidden">
    {/* Background Pattern - Dense dots (no hexagon) */}
      <div className="absolute inset-0 -z-10">
      {/* Dense dot grid (two layers offset to increase density) */}
      <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle,theme(colors.primary/18)_1.5px,transparent_1.5px),radial-gradient(circle,theme(colors.primary/22)_1px,transparent_1px)] [background-size:24px_24px,24px_24px] [background-position:0_0,12px_12px]" />
        
        {/* Subtle wave gradients */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/6 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-24 bg-gradient-to-t from-blue-400/6 to-transparent" />
        
      {/* Floating elements */}
      <div className="absolute top-1/3 left-1/4 w-6 h-6 bg-primary/30 rounded-full animate-pulse [animation-delay:0s]" />
      <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-blue-400/40 rounded-full animate-pulse [animation-delay:2s]" />
      <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-purple-400/40 rounded-full animate-pulse [animation-delay:1s]" />
      <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-fuchsia-400/40 rounded-full animate-pulse [animation-delay:2.5s]" />
        
        {/* Light overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/3 to-blue-400/3" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Quy trình hoạt động
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Quy trình đơn giản, minh bạch và hiệu quả cho tất cả các bên liên quan
          </p>
        </div>

        <div className="relative">
          {/* Connection lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0">
            <div className="absolute top-1/2 left-1/3 w-0 h-0 border-l-4 border-l-border border-t-4 border-t-transparent border-b-4 border-b-transparent -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-2/3 w-0 h-0 border-l-4 border-l-border border-t-4 border-t-transparent border-b-4 border-b-transparent -translate-y-1/2"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="h-full bg-background/60 backdrop-blur-sm border-border/50">
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <Badge variant="outline" className="mb-2 opacity-80">
                          Bước {step.step}
                        </Badge>
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground opacity-90">{step.description}</p>
                      </div>
                      
                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="opacity-90">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
