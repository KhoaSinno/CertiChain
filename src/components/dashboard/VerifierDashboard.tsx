'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { AlertCircle, CheckCircle, FileText, Search, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function VerifierDashboard() {
  const [searchHash, setSearchHash] = useState('');

  const handleVerify = () => {
    if (searchHash.trim()) {
      // Navigate to verify page with hash
      window.location.href = `/verify?hash=${searchHash.trim()}`;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Xác minh chứng chỉ</h1>
        <p className="text-muted-foreground">
          Công cụ xác minh tính hợp lệ của chứng chỉ blockchain
        </p>
      </div>

      {/* Quick Verify */}
      <Card>
        <CardHeader>
          <CardTitle>Xác minh nhanh</CardTitle>
          <CardDescription>
            Nhập hash hoặc quét QR code để xác minh chứng chỉ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nhập hash chứng chỉ (0x...)"
              value={searchHash}
              onChange={(e) => setSearchHash(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleVerify} disabled={!searchHash.trim()}>
              <Search className="h-4 w-4 mr-2" />
              Xác minh
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Hoặc sử dụng camera để quét QR code từ chứng chỉ
          </p>
        </CardContent>
      </Card>

      {/* Verification Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Xác minh bằng Hash
            </CardTitle>
            <CardDescription>
              Nhập hash chứng chỉ để kiểm tra tính hợp lệ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm">Cách sử dụng:</p>
              <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                <li>Lấy hash từ chứng chỉ (thường bắt đầu bằng 0x...)</li>
                <li>Nhập hash vào ô tìm kiếm phía trên</li>
                <li>Nhấn "Xác minh" để kiểm tra</li>
                <li>Xem kết quả chi tiết về chứng chỉ</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Xác minh bằng QR Code
            </CardTitle>
            <CardDescription>
              Quét mã QR từ chứng chỉ để xác minh
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm">Cách sử dụng:</p>
              <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                <li>Mở camera trên thiết bị</li>
                <li>Quét mã QR trên chứng chỉ</li>
                <li>Hệ thống sẽ tự động xác minh</li>
                <li>Xem kết quả xác minh chi tiết</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Results Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Kết quả xác minh</CardTitle>
          <CardDescription>
            Hiểu ý nghĩa của các kết quả xác minh
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-600">Chứng chỉ hợp lệ</h4>
                <p className="text-sm text-muted-foreground">
                  Chứng chỉ đã được xác thực trên blockchain và có thể tin tưởng
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-600">Chứng chỉ không hợp lệ</h4>
                <p className="text-sm text-muted-foreground">
                  Chứng chỉ không tồn tại trên blockchain hoặc đã bị thu hồi
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-600">Chứng chỉ chờ xác thực</h4>
                <p className="text-sm text-muted-foreground">
                  Chứng chỉ đã được tạo nhưng chưa được đăng ký trên blockchain
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Liên kết nhanh</CardTitle>
          <CardDescription>
            Các công cụ hữu ích cho việc xác minh
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Link href="/verify">
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Trang xác minh
              </Button>
            </Link>
            <Button variant="outline" disabled>
              <FileText className="h-4 w-4 mr-2" />
              Lịch sử xác minh
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
