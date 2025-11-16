'use client';

import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useCertificates } from '@/src/hooks/useCertificates';
import { CheckCircle, FileText, Share2 } from 'lucide-react';
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Certificates */}
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-blue-200 shadow-sm bg-white">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 blur-xl" />
          
          <CardContent className="relative z-10 px-4 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="text-2xl font-bold text-blue-600">{myCertificates.length}</div>
              <div>
                <CardTitle className="text-xs font-medium text-muted-foreground">Tổng chứng chỉ</CardTitle>
                <p className="text-xs text-muted-foreground">Đã được cấp</p>
              </div>
            </div>
            <div className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 bg-blue-50 border border-blue-100">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {/* Verified Certificates */}
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-emerald-200 shadow-sm bg-white">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 blur-xl" />
          
          <CardContent className="relative z-10 px-4 py-4">
            <div className="flex items-center justify-between mb-2 gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="text-2xl font-bold text-emerald-600">
                  {myCertificates.filter(c => c.status === 'verified').length}
                </div>
                <div>
                  <CardTitle className="text-xs font-medium text-muted-foreground">Đã xác thực</CardTitle>
                  <p className="text-xs text-muted-foreground">Trên blockchain</p>
                </div>
              </div>
              <div className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 bg-emerald-50 border border-emerald-100">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <Badge variant="default" className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center bg-emerald-500 text-white text-[9px]">
                  ✓
                </Badge>
              </div>
            </div>
            {myCertificates.length > 0 && (
              <div className="h-1.5 rounded-full overflow-hidden bg-emerald-100">
                <div 
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
                  style={{ width: `${Math.min((myCertificates.filter(c => c.status === 'verified').length / myCertificates.length) * 100, 100)}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shareable Certificates */}
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-cyan-200 shadow-sm bg-white">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-xl" />
          
          <CardContent className="relative z-10 px-4 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="text-2xl font-bold text-cyan-600">{myCertificates.length}</div>
              <div>
                <CardTitle className="text-xs font-medium text-muted-foreground">Có thể chia sẻ</CardTitle>
                <p className="text-xs text-muted-foreground">Link & QR Code</p>
              </div>
            </div>
            <div className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 bg-cyan-50 border border-cyan-100">
              <Share2 className="h-4 w-4 text-cyan-600" />
            </div>
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
