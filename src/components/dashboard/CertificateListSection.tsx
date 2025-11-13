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
  title = 'Danh sách chứng chỉ',
  description = 'Danh sách các chứng chỉ',
  emptyMessage = 'Không có chứng chỉ nào',
}: CertificateListSectionProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'processing'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'status'>('date-desc');

  // Client-side filtering based on status and time
  let filteredCertificates = certificates.filter(cert => {
    // Status filter
    const matchesStatus = statusFilter === 'all' 
      ? true 
      : statusFilter === 'verified' 
        ? cert.status === 'verified' 
        : cert.status === 'pending';

    // Time filter
    const now = new Date();
    const certDate = new Date(cert.issuedAt);
    let matchesTime = true;

    if (timeFilter !== 'all') {
      const diffMs = now.getTime() - certDate.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      switch (timeFilter) {
        case 'today':
          matchesTime = diffDays < 1;
          break;
        case 'week':
          matchesTime = diffDays <= 7;
          break;
        case 'month':
          matchesTime = diffDays <= 30;
          break;
        case 'year':
          matchesTime = diffDays <= 365;
          break;
      }
    }

    return matchesStatus && matchesTime;
  });

  // Sorting
  filteredCertificates = [...filteredCertificates].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime();
      case 'date-asc':
        return new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime();
      case 'name-asc':
        return a.courseName.localeCompare(b.courseName);
      case 'name-desc':
        return b.courseName.localeCompare(a.courseName);
      case 'status':
        // Verified first, then processing
        if (a.status === b.status) return 0;
        return a.status === 'verified' ? -1 : 1;
      default:
        return 0;
    }
  });

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
                      {(statusFilter !== 'all' || timeFilter !== 'all') && (
                        <Badge className="ml-1.5 bg-primary/90 text-white text-xs px-1.5 py-0 h-4">
                          {(statusFilter !== 'all' ? 1 : 0) + (timeFilter !== 'all' ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
                    <DropdownMenuLabel>Trạng thái</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'all' | 'verified' | 'processing')}>
                      <DropdownMenuRadioItem value="all">Tất cả</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="verified">Đã xác thực</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="processing">Đang xử lý</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuLabel>Thời gian phát hành</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={timeFilter} onValueChange={(v) => setTimeFilter(v as 'all' | 'today' | 'week' | 'month' | 'year')}>
                      <DropdownMenuRadioItem value="all">Tất cả</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="today">Hôm nay</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="week">7 ngày qua</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="month">30 ngày qua</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="year">1 năm qua</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuLabel>Sắp xếp theo</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={sortBy} onValueChange={(v) => setSortBy(v as 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'status')}>
                      <DropdownMenuRadioItem value="date-desc">Mới nhất</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="date-asc">Cũ nhất</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="name-asc">Tên A-Z</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="name-desc">Tên Z-A</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="status">Trạng thái</DropdownMenuRadioItem>
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
            {(statusFilter !== 'all' || timeFilter !== 'all') && (
              <p className="text-sm mt-1">Thử thay đổi bộ lọc</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCertificates.map((certificate) => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                onView={() => router.push(`/certificates/${certificate.id}`)}
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
