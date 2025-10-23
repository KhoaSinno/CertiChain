'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useBlockchain } from '@/hooks/useBlockchain';
import { ArrowRight, CheckCircle, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export function CTA() {
  const { isConnected } = useBlockchain();

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 w-full">
      <div className="container w-full">
        <div className="text-center space-y-8">
          {/* Main CTA */}
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-5xl font-bold text-white">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Tham gia vào hệ sinh thái chứng chỉ blockchain an toàn và minh bạch. 
              Kết nối ví của bạn để trải nghiệm ngay hôm nay.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isConnected ? (
              <>
                <Link href="/dashboard">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                    Vào Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/certificates/create">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                    Tạo chứng chỉ mới
                  </Button>
                </Link>
              </>
            ) : (
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Kết nối ví MetaMask
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Bảo mật cao</h3>
                <p className="text-blue-100 text-sm">
                  Sử dụng công nghệ blockchain tiên tiến để bảo vệ chứng chỉ
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Nhanh chóng</h3>
                <p className="text-blue-100 text-sm">
                  Xác minh chứng chỉ trong vài giây với tốc độ blockchain
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Minh bạch</h3>
                <p className="text-blue-100 text-sm">
                  Mọi giao dịch đều được ghi lại trên blockchain công khai
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Links */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/verify">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                Xác minh chứng chỉ
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                Tìm hiểu thêm
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
