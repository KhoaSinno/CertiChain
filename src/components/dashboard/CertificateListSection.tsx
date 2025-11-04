'use client';

import { CertificateCard } from '@/src/components/CertificateCard';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { Pagination } from '@/src/components/ui/pagination';
import { Certificate } from '@/src/types/certificate';
import { FileText, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CertificateListSectionProps {
  certificates: Certificate[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading?: boolean;
  error?: Error | null;
  onPageChange: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  onRegisterOnChain?: (certificateId: string) => void;
  registeringIds?: Set<string>;
  title?: string;
  description?: string;
  emptyMessage?: string;
}

export function CertificateListSection({
  certificates,
  pagination,
  isLoading,
  error,
  onPageChange,
  limit,
  setLimit,
  onRegisterOnChain,
  registeringIds = new Set(),
  title = 'Danh sách chứng chỉ',
  description = 'Danh sách các chứng chỉ',
  emptyMessage = 'Không có chứng chỉ nào',
}: CertificateListSectionProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all');

  // Client-side filtering based on status
  const filteredCertificates = statusFilter === 'all'
    ? certificates
    : certificates.filter(cert =>
        statusFilter === 'verified' ? cert.status === 'verified' : cert.status === 'pending'
      );

  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
      {/* Background effects - Nhẹ nhàng */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(60%_60%_at_50%_30%,theme(colors.primary/10),transparent_70%)]" />
        <div className="absolute -top-12 -left-12 w-96 h-96 rounded-full bg-gradient-to-br from-primary/15 via-blue-400/10 to-purple-400/8 blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-purple-500/15 via-fuchsia-400/10 to-primary/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-cyan-400/8 to-blue-500/8 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(0,0,0,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.5)_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <CardHeader className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>

          {/* Filter & Pagination Controls */}
          {pagination && (
            <div className="bg-white/60 dark:bg-white/10 backdrop-blur-md border-2 border-white/60 dark:border-white/30 shadow-lg rounded-lg px-3 py-2">
              <div className="flex items-center gap-3">
                {/* Filter Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 hover:bg-white/50 dark:hover:bg-white/10"
                    >
                      <Filter className="h-4 w-4 mr-1.5" />
                      Lọc
                      {statusFilter !== 'all' && (
                        <Badge className="ml-1.5 bg-primary/90 text-white text-xs px-1.5 py-0 h-4">1</Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
                    <DropdownMenuLabel>Trạng thái</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'all' | 'verified' | 'pending')}>
                      <DropdownMenuRadioItem value="all">Tất cả</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="verified">Đã xác thực</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="pending">Chờ xác thực</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuLabel>Số lượng/trang</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={String(limit)} onValueChange={(v) => { setLimit(Number(v)); onPageChange(1); }}>
                      <DropdownMenuRadioItem value="5">5 mục</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="10">10 mục</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="20">20 mục</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="50">50 mục</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Divider */}
                <div className="h-6 w-px bg-white/40 dark:bg-white/20" />

                {/* Pagination */}
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={onPageChange}
                  className="m-0"
                />
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative">
        {isLoading && (
          <div className="text-sm text-muted-foreground">Đang tải danh sách chứng chỉ...</div>
        )}
        {error && (
          <div className="text-sm text-red-600">Không thể tải chứng chỉ. Vui lòng thử lại.</div>
        )}
        {!isLoading && !error && filteredCertificates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{emptyMessage}</p>
            {statusFilter !== 'all' && <p className="text-sm mt-1">Thử thay đổi bộ lọc</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCertificates.map((certificate) => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                onView={() => router.push(`/certificates/${certificate.id}`)}
                onRegister={onRegisterOnChain && certificate.status === 'pending' ? () => onRegisterOnChain(certificate.id.toString()) : undefined}
                isRegistering={registeringIds.has(certificate.id.toString())}
                onCopy={() => {
                  navigator.clipboard.writeText(certificate.fileHash);
                  alert('Đã copy hash!');
                }}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
