'use client';

import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Pagination } from '@/src/components/ui/pagination';
import { useCertificates } from '@/src/hooks/useCertificates';
import { api } from '@/src/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Clock, FileText, Loader2, Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function IssuerDashboard() {
  const { certificates, allCertificates, pagination, isLoading, error, setPage } = useCertificates(1, 10);
  const queryClient = useQueryClient();
  const [registeringIds, setRegisteringIds] = useState<Set<string>>(new Set());

  const totalCertificates = allCertificates.length;
  const verifiedCount = allCertificates.filter(c => c.status === 'verified').length;
  const pendingCount = allCertificates.filter(c => c.status === 'pending').length;
  const verificationRate = totalCertificates > 0 ? Math.round((verifiedCount / totalCertificates) * 100) : 0;

  const handleRegisterOnChain = async (certificateId: string) => {
    try {
      setRegisteringIds(prev => new Set(prev).add(certificateId));
      
      const response = await api.certificates.register(certificateId);
      
      // Refresh certificates list
      await queryClient.invalidateQueries({ queryKey: ['certificates'] });
      
      alert(`✅ Đăng ký thành công!\n\nTransaction Hash: ${response.txHash}`);
    } catch (error) {
      let errorMessage = 'Không thể đăng ký chứng chỉ lên blockchain.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      alert(`❌ ${errorMessage}`);
    } finally {
      setRegisteringIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(certificateId);
        return newSet;
      });
    }
  };

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
          <CardTitle>Danh sách chứng chỉ</CardTitle>
          <CardDescription>
            Danh sách các chứng chỉ đã tạo và trạng thái của chúng
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-sm text-muted-foreground">Đang tải danh sách chứng chỉ...</div>
          )}
          {error && (
            <div className="text-sm text-red-600">Không thể tải chứng chỉ. Vui lòng thử lại.</div>
          )}
          {!isLoading && !error && (
            <>
              <div className="space-y-4">
                {certificates.map((certificate) => (
                  <div key={certificate.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{certificate.studentName}</h3>
                      <p className="text-sm text-muted-foreground">{certificate.courseName}</p>
                      {certificate.studentId && (
                        <p className="text-xs text-muted-foreground">Mã SV: {certificate.studentId}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={certificate.status === 'verified' ? 'default' : 'secondary'}>
                        {certificate.status === 'verified' ? 'Đã xác thực' : 'Chờ xác thực'}
                      </Badge>
                      {certificate.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRegisterOnChain(certificate.id)}
                          disabled={registeringIds.has(certificate.id)}
                        >
                          {registeringIds.has(certificate.id) ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Đang đăng ký...
                            </>
                          ) : (
                            'Đăng ký on-chain'
                          )}
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
                {certificates.length === 0 && (
                  <div className="text-sm text-muted-foreground">Chưa có chứng chỉ nào.</div>
                )}
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
    </div>
  );
}
