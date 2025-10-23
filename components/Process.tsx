import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle, FileText, Shield, Upload } from 'lucide-react';

export function Process() {
  const steps = [
    {
      step: '01',
      title: 'Tải lên chứng chỉ',
      description: 'Nhà trường tải lên file chứng chỉ PDF và nhập thông tin sinh viên.',
      icon: Upload,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      step: '02',
      title: 'Tạo hash & lưu IPFS',
      description: 'Hệ thống tự động tạo hash cho file và lưu trữ trên IPFS.',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      step: '03',
      title: 'Ghi lên Blockchain',
      description: 'Hash của chứng chỉ được ghi lên Base Sepolia blockchain.',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      step: '04',
      title: 'Xác minh & Sử dụng',
      description: 'Sinh viên và nhà tuyển dụng có thể xác minh chứng chỉ bất kỳ lúc nào.',
      icon: CheckCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <section className="py-20 bg-white w-full">
      <div className="container w-full">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Quy trình hoạt động
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Từ việc tạo chứng chỉ đến xác minh, tất cả được thực hiện một cách 
            minh bạch và bảo mật trên blockchain.
          </p>
        </div>

        <div className="relative">
          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;
              
              return (
                <div key={index} className="relative">
                  <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white h-full">
                    <CardContent className="p-6 text-center space-y-4">
                      {/* Step Number */}
                      <div className="relative">
                        <div className={`w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`h-8 w-8 ${step.color}`} />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {step.step}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Arrow */}
                  {!isLast && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Info */}
          <div className="mt-16 text-center">
            <Card className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Bảo mật tuyệt đối</h3>
                    <p className="text-sm text-gray-600">
                      Mỗi chứng chỉ được bảo vệ bởi mật mã học và blockchain
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
