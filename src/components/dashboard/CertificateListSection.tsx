'use client';

import { CertificateCard } from '@/src/components/CertificateCard';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { Pagination } from '@/src/components/ui/pagination';
import { Certificate } from '@/src/types/certificate';
import { 
  FileText, 
  Filter, 
  CheckCircle2, 
  Calendar, 
  ArrowUpDown, 
  List
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';

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

  // Client-side filtering and sorting - memoized to avoid unnecessary recalculations
  const filteredCertificates = useMemo(() => {
    const filtered = certificates.filter(cert => {
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
    return [...filtered].sort((a, b) => {
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
  }, [certificates, statusFilter, timeFilter, sortBy]);

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
                        <Badge className="ml-1.5 bg-blue-600 text-white text-xs px-1.5 py-0 h-4 rounded-full min-w-[1rem] flex items-center justify-center border-0 shadow-sm">
                          {(statusFilter !== 'all' ? 1 : 0) + (timeFilter !== 'all' ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[480px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4">
                    {/* Status Filter */}
                    <div className="space-y-2 mb-4">
                      <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-0 flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        Trạng thái
                      </DropdownMenuLabel>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setStatusFilter('all')}
                          className={`flex-1 h-8 text-xs transition-all ${
                            statusFilter === 'all'
                              ? 'bg-gradient-primary text-white hover:bg-gradient-primary border-primary shadow-primary'
                              : 'bg-white text-black hover:border-primary hover:text-primary'
                          }`}
                        >
                          Tất cả
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setStatusFilter('verified')}
                          className={`flex-1 h-8 text-xs transition-all ${
                            statusFilter === 'verified'
                              ? 'bg-green-600 text-white hover:bg-green-700 border-green-600 shadow-lg shadow-green-600/30'
                              : 'bg-white text-black hover:border-green-500 hover:text-green-600'
                          }`}
                        >
                          Đã xác thực
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setStatusFilter('processing')}
                          className={`flex-1 h-8 text-xs transition-all ${
                            statusFilter === 'processing'
                              ? 'bg-orange-500 text-white hover:bg-orange-600 border-orange-500 shadow-lg shadow-orange-500/30'
                              : 'bg-white text-black hover:border-orange-500 hover:text-orange-600'
                          }`}
                        >
                          Đang xử lý
                        </Button>
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    {/* Time Filter */}
                    <div className="space-y-2 my-4">
                      <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-0 flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        Thời gian phát hành
                      </DropdownMenuLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'all', label: 'Tất cả', span: false },
                          { value: 'today', label: 'Hôm nay', span: false },
                          { value: 'week', label: '7 ngày', span: false },
                          { value: 'month', label: '30 ngày', span: false },
                          { value: 'year', label: '1 năm', span: true },
                        ].map((filter) => (
                          <Button
                            key={filter.value}
                            variant="outline"
                            size="sm"
                            onClick={() => setTimeFilter(filter.value as typeof timeFilter)}
                            className={`h-8 text-xs transition-all ${filter.span ? 'col-span-2' : ''} ${
                              timeFilter === filter.value
                                ? 'bg-gradient-primary text-white hover:bg-gradient-primary border-primary shadow-primary'
                                : 'bg-white text-black hover:border-primary hover:text-primary'
                            }`}
                          >
                            {filter.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    {/* Sort Options */}
                    <div className="space-y-2 my-4">
                      <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-0 flex items-center gap-2">
                        <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
                        Sắp xếp theo
                      </DropdownMenuLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'date-desc', label: 'Mới nhất', span: false },
                          { value: 'date-asc', label: 'Cũ nhất', span: false },
                          { value: 'status', label: 'Trạng thái', span: false },
                          { value: 'name-asc', label: 'A-Z', span: false },
                          { value: 'name-desc', label: 'Z-A', span: true },
                        ].map((sort) => (
                          <Button
                            key={sort.value}
                            variant="outline"
                            size="sm"
                            onClick={() => setSortBy(sort.value as typeof sortBy)}
                            className={`h-8 text-xs transition-all ${sort.span ? 'col-span-2' : ''} ${
                              sortBy === sort.value
                                ? 'bg-gradient-primary text-white hover:bg-gradient-primary border-primary shadow-primary'
                                : 'bg-white text-black hover:border-primary hover:text-primary'
                            }`}
                          >
                            {sort.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    {/* Items Per Page */}
                    <div className="space-y-2 mt-4">
                      <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-0 flex items-center gap-2">
                        <List className="h-3.5 w-3.5 text-primary" />
                        Số lượng mỗi trang
                      </DropdownMenuLabel>
                      <div className="grid grid-cols-4 gap-2">
                        {[5, 10, 20, 50].map((num) => (
                          <Button
                            key={num}
                            variant="outline"
                            size="sm"
                            onClick={() => { setLimit(num); onPageChange(1); }}
                            className={`h-8 text-xs font-semibold transition-all ${
                              limit === num
                                ? 'bg-gradient-primary text-white hover:bg-gradient-primary border-primary shadow-primary'
                                : 'bg-white text-black hover:border-primary hover:text-primary'
                            }`}
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                    </div>
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
