'use client';

import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useCertificates } from '@/src/hooks/useCertificates';
import { FileText, Share2 } from 'lucide-react';
import { CertificateListSection } from './CertificateListSection';

export function HolderDashboard() {
  const { certificates, pagination, isLoading, error, setPage, limit, setLimit } = useCertificates(1, 10);
  
  // Filter certificates for current user (in real app, this would be based on user context)
  const myCertificates = certificates || [];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Chứng chỉ của tôi</h1>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Chứng chỉ của tôi</h1>
          <p className="text-destructive">Lỗi khi tải dữ liệu: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Chứng chỉ của tôi</h1>
        <p className="text-muted-foreground">
          Xem và quản lý các chứng chỉ đã được cấp
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng chứng chỉ</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myCertificates.length}</div>
            <p className="text-xs text-muted-foreground">
              Đã được cấp
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xác thực</CardTitle>
            <Badge variant="default" className="w-fit">Verified</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {myCertificates.filter(c => c.status === 'verified').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Trên blockchain
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Có thể chia sẻ</CardTitle>
            <Share2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{myCertificates.length}</div>
            <p className="text-xs text-muted-foreground">
              Link & QR Code
            </p>
          </CardContent>
        </Card>
      </div>

      {/* My Certificates */}
      <CertificateListSection
        certificates={myCertificates}
        pagination={pagination}
        isLoading={isLoading}
        error={error}
        onPageChange={setPage}
        limit={limit}
        setLimit={setLimit}
        title="Danh sách chứng chỉ"
        description="Các chứng chỉ đã được cấp cho bạn"
        emptyMessage="Liên hệ nhà trường để được cấp chứng chỉ"
      />

      {/* Verification Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn xác minh</CardTitle>
          <CardDescription>
            Cách nhà tuyển dụng có thể xác minh chứng chỉ của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p>• Chia sẻ link xác minh hoặc QR code với nhà tuyển dụng</p>
            <p>• Nhà tuyển dụng sẽ truy cập link để xác minh tính hợp lệ</p>
            <p>• Kết quả xác minh sẽ hiển thị thông tin chi tiết và trạng thái</p>
            <p>• Tất cả dữ liệu được lưu trữ an toàn trên blockchain</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
