'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useCertificates } from '@/src/hooks/useCertificates';
import { api } from '@/src/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Clock, FileText, Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { CertificateListSection } from './CertificateListSection';

export function IssuerDashboard() {
  const { certificates, allCertificates, pagination, isLoading, error, setPage, limit, setLimit } = useCertificates(1, 10);
  const queryClient = useQueryClient();
  const [registeringIds, setRegisteringIds] = useState<Set<string>>(new Set());

  // Statistics
  const totalCertificates = pagination?.total || allCertificates.length;
  const verifiedCount = allCertificates.filter(c => c.status === 'verified').length;
  const pendingCount = allCertificates.filter(c => c.status === 'pending').length;
  const verificationRate = verifiedCount + pendingCount > 0 
    ? Math.round((verifiedCount / (verifiedCount + pendingCount)) * 100) 
    : 0;

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
      <CertificateListSection
        certificates={certificates}
        pagination={pagination}
        isLoading={isLoading}
        error={error}
        onPageChange={setPage}
        limit={limit}
        setLimit={setLimit}
        onRegisterOnChain={handleRegisterOnChain}
        registeringIds={registeringIds}
        title="Danh sách chứng chỉ"
        description="Danh sách các chứng chỉ đã tạo và trạng thái của chúng"
        emptyMessage="Không có chứng chỉ nào"
      />
    </div>
  );
}
