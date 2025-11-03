'use client';

import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Pagination } from '@/src/components/ui/pagination';
import { useCertificates } from '@/src/hooks/useCertificates';
import { Download, Eye, FileText, QrCode, Share2 } from 'lucide-react';
import Link from 'next/link';

export function HolderDashboard() {
  const { certificates, pagination, isLoading, error, setPage } = useCertificates(1, 10);
  
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
      <Card>
        <CardHeader>
          <CardTitle>Danh sách chứng chỉ</CardTitle>
          <CardDescription>
            Các chứng chỉ đã được cấp cho bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {myCertificates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Bạn chưa có chứng chỉ nào</p>
              <p className="text-sm">Liên hệ nhà trường để được cấp chứng chỉ</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {myCertificates.map((certificate) => (
                  <div key={certificate.id} className="p-6 border rounded-lg space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{certificate.courseName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Cấp cho: {certificate.studentName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Mã sinh viên: {certificate.studentId || 'N/A'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ngày xác thực: {new Date(certificate.issuedAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <Badge variant={certificate.status === 'verified' ? 'default' : 'secondary'}>
                        {certificate.status === 'verified' ? 'Đã xác thực' : 'Chờ xác thực'}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/certificates/${certificate.id}`}>
                        <Button size="sm" className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Xem chi tiết
                        </Button>
                      </Link>
                      <Link href={`/certificates/view/${certificate.id}`}>
                        <Button size="sm" variant="outline" className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Tải chứng chỉ
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" className="flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        Chia sẻ
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center gap-2">
                        <QrCode className="h-4 w-4" />
                        QR Code
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                  className="mt-6"
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

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
