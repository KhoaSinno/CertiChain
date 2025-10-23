'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useBlockchain } from '@/hooks/useBlockchain';
import { CheckCircle, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  const { isConnected } = useBlockchain();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 w-full">
      <div className="container relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Chứng chỉ
                <span className="text-blue-600 block">Blockchain</span>
                <span className="text-2xl lg:text-3xl text-gray-600 block">
                  An toàn & Minh bạch
                </span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                Hệ thống xác thực chứng chỉ dựa trên blockchain Base Sepolia, 
                kết hợp IPFS để lưu trữ an toàn và bảo mật.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Bảo mật cao</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Nhanh chóng</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium">Xác thực dễ dàng</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {isConnected ? (
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Vào Dashboard
                  </Button>
                </Link>
              ) : (
                <Button size="lg" className="w-full sm:w-auto">
                  Kết nối ví để bắt đầu
                </Button>
              )}
              <Link href="/verify">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Xác minh chứng chỉ
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Nhà trường</h3>
                      <p className="text-sm text-gray-600">Phát hành chứng chỉ</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg mt-8">
                <CardContent className="p-0">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Sinh viên</h3>
                      <p className="text-sm text-gray-600">Nhận chứng chỉ</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Zap className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Nhà tuyển dụng</h3>
                      <p className="text-sm text-gray-600">Xác minh chứng chỉ</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg mt-8">
                <CardContent className="p-0">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Blockchain</h3>
                      <p className="text-sm text-gray-600">Bảo mật tuyệt đối</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
