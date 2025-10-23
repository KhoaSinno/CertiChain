import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, FileText, Lock, Shield, Users, Zap } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Shield,
      title: 'Bảo mật Blockchain',
      description: 'Sử dụng Base Sepolia testnet để đảm bảo tính bất biến và minh bạch của chứng chỉ.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: FileText,
      title: 'Lưu trữ IPFS',
      description: 'Chứng chỉ được lưu trữ trên IPFS với hash bất biến, đảm bảo tính toàn vẹn dữ liệu.',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: CheckCircle,
      title: 'Xác thực tức thì',
      description: 'Xác minh chứng chỉ ngay lập tức thông qua blockchain, không cần liên hệ trường học.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: Users,
      title: 'Đa vai trò',
      description: 'Hỗ trợ 3 vai trò: Nhà trường (Issuer), Sinh viên (Holder), Nhà tuyển dụng (Verifier).',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      icon: Lock,
      title: 'Chống giả mạo',
      description: 'Mỗi chứng chỉ có hash duy nhất, không thể giả mạo hoặc chỉnh sửa.',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      icon: Zap,
      title: 'Tốc độ cao',
      description: 'Xử lý và xác minh chứng chỉ với tốc độ nhanh chóng, tiết kiệm thời gian.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 w-full">
      <div className="container w-full">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Tính năng nổi bật
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            CertiChain cung cấp giải pháp toàn diện cho việc quản lý và xác thực chứng chỉ 
            dựa trên công nghệ blockchain tiên tiến.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-blue-600">100%</div>
            <div className="text-gray-600">Bảo mật</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-green-600">&lt; 3s</div>
            <div className="text-gray-600">Xác minh nhanh</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-purple-600">24/7</div>
            <div className="text-gray-600">Hoạt động</div>
          </div>
        </div>
      </div>
    </section>
  );
}
