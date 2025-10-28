'use client';

import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { mockCertificates } from '@/src/mockData/certificates';
import { CheckCircle, Clock, FileText, Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function IssuerDashboard() {
  const totalCertificates = mockCertificates.length;
  const verifiedCount = mockCertificates.filter(c => c.status === 'verified').length;
  const pendingCount = mockCertificates.filter(c => c.status === 'pending').length;
  const verificationRate = Math.round((verifiedCount / totalCertificates) * 100);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Nhà trường</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi tất cả chứng chỉ đã phát hành
          </p>
        </div>
        <Link href="/certificates/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tạo chứng chỉ mới
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng chứng chỉ</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCertificates}</div>
            <p className="text-xs text-muted-foreground">
              Đã phát hành
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xác thực</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{verifiedCount}</div>
            <p className="text-xs text-muted-foreground">
              Trên blockchain
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ xác thực</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Cần đăng ký on-chain
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ xác thực</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{verificationRate}%</div>
            <p className="text-xs text-muted-foreground">
              Hiệu quả xác thực
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Certificates */}
      <Card>
        <CardHeader>
          <CardTitle>Chứng chỉ gần đây</CardTitle>
          <CardDescription>
            Danh sách các chứng chỉ đã tạo và trạng thái của chúng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCertificates.slice(0, 5).map((certificate) => (
              <div key={certificate.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-semibold">{certificate.studentName}</h3>
                  <p className="text-sm text-muted-foreground">{certificate.courseName}</p>
                  <p className="text-xs text-muted-foreground">Mã SV: {certificate.studentId}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={certificate.status === 'verified' ? 'default' : 'secondary'}>
                    {certificate.status === 'verified' ? 'Đã xác thực' : 'Chờ xác thực'}
                  </Badge>
                  {certificate.status === 'pending' && (
                    <Button size="sm" variant="outline">
                      Đăng ký on-chain
                    </Button>
                  )}
                  <Link href={`/certificates/${certificate.id}`}>
                    <Button size="sm" variant="ghost">
                      Xem chi tiết
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
