'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardTitle } from '@/src/components/ui/card';
import { useCertificates } from '@/src/hooks/useCertificates';
import { CheckCircle, Clock, FileText, Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { CertificateListSection } from './CertificateListSection';

export function IssuerDashboard() {
  const { certificates, allCertificates, pagination, isLoading, error, setPage, limit, setLimit } = useCertificates(1, 10);

  // Statistics
  const totalCertificates = pagination?.total || allCertificates.length;
  const verifiedCount = allCertificates.filter(c => c.status === 'verified').length;
  const processingCount = allCertificates.filter(c => c.status === 'pending').length;
  const verificationRate = verifiedCount + processingCount > 0 
    ? Math.round((verifiedCount / (verifiedCount + processingCount)) * 100) 
    : 0;

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
          <Button 
            size="lg"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            Tạo chứng chỉ mới
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Certificates */}
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-blue-200 shadow-sm bg-white">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 blur-xl" />
          
          <CardContent className="relative z-10 px-4 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="text-2xl font-bold text-blue-600">{totalCertificates}</div>
              <div>
                <CardTitle className="text-xs font-medium text-muted-foreground">Tổng chứng chỉ</CardTitle>
                <p className="text-xs text-muted-foreground">Đã phát hành</p>
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
                <div className="text-2xl font-bold text-emerald-600">{verifiedCount}</div>
                <div>
                  <CardTitle className="text-xs font-medium text-muted-foreground">Đã xác thực</CardTitle>
                  <p className="text-xs text-muted-foreground">Trên blockchain</p>
                </div>
              </div>
              <div className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 bg-emerald-50 border border-emerald-100">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
            {totalCertificates > 0 && (
              <div className="h-1.5 rounded-full overflow-hidden bg-emerald-100">
                <div 
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
                  style={{ width: `${Math.min((verifiedCount / totalCertificates) * 100, 100)}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Processing Certificates */}
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-amber-200 shadow-sm bg-white">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 blur-xl" />
          
          <CardContent className="relative z-10 px-4 py-4">
            <div className="flex items-center justify-between mb-2 gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="text-2xl font-bold text-amber-600">{processingCount}</div>
                <div>
                  <CardTitle className="text-xs font-medium text-muted-foreground">Đang xử lý</CardTitle>
                  <p className="text-xs text-muted-foreground">Đang tải lên blockchain</p>
                </div>
              </div>
              <div className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 bg-amber-50 border border-amber-100">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
            </div>
            {totalCertificates > 0 && (
              <div className="h-1.5 rounded-full overflow-hidden bg-amber-100">
                <div 
                  className="h-full rounded-full bg-amber-500 transition-all duration-500 ease-out"
                  style={{ width: `${Math.min((processingCount / totalCertificates) * 100, 100)}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification Rate */}
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-purple-200 shadow-sm bg-white">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-xl" />
          
          <CardContent className="relative z-10 px-4 py-4">
            <div className="flex items-center justify-between mb-2 gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-baseline gap-1.5">
                  <div className="text-2xl font-bold text-purple-600">{verificationRate}%</div>
                  <TrendingUp className="h-3 w-3 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-xs font-medium text-muted-foreground">Tỷ lệ xác thực</CardTitle>
                  <p className="text-xs text-muted-foreground">Hiệu quả xác thực</p>
                </div>
              </div>
              <div className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 bg-purple-50 border border-purple-100">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 rounded-full overflow-hidden bg-purple-100">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(verificationRate, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Certificates */}
      <CertificateListSection
        certificates={certificates}
        pagination={pagination}
        isLoading={isLoading}
        error={error}
        onPageChange={setPage}
        limit={limit}
        setLimit={setLimit}
        title="Danh sách chứng chỉ"
        description="Tất cả chứng chỉ được tải lên và tự động đăng ký trên blockchain"
        emptyMessage="Không có chứng chỉ nào"
      />
    </div>
  );
}
