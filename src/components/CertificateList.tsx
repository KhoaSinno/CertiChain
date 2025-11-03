'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Pagination } from '@/src/components/ui/pagination';
import { Certificate } from '@/src/types/certificate';
import { GraduationCap, Search } from 'lucide-react';
import { useState } from 'react';
import { CertificateCard } from './CertificateCard';

interface CertificateListProps {
  certificates: Certificate[];
  onView?: (certificate: Certificate) => void;
  onRegister?: (certificate: Certificate) => void;
  onCopy?: (hash: string) => void;
  className?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
}

export function CertificateList({ 
  certificates, 
  onView, 
  onRegister, 
  onCopy,
  className = "",
  pagination,
  onPageChange,
}: CertificateListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending'>('all');

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || cert.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const verifiedCount = certificates.filter(c => c.status === 'verified').length;
  const pendingCount = certificates.filter(c => c.status === 'pending').length;

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Danh sách chứng chỉ</h2>
            <p className="text-sm text-muted-foreground">
              {certificates.length} chứng chỉ • {verifiedCount} đã xác thực • {pendingCount} chờ xác thực
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên sinh viên, khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            Tất cả ({certificates.length})
          </Button>
          <Button
            variant={filterStatus === 'verified' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('verified')}
          >
            Đã xác thực ({verifiedCount})
          </Button>
          <Button
            variant={filterStatus === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('pending')}
          >
            Chờ xác thực ({pendingCount})
          </Button>
        </div>
      </div>

      {/* Certificate Grid */}
      {filteredCertificates.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((certificate) => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                onView={() => onView?.(certificate)}
                onRegister={() => onRegister?.(certificate)}
                onCopy={() => onCopy?.(certificate.fileHash)}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && onPageChange && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
              className="mt-6"
            />
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || filterStatus !== 'all' ? 'Không tìm thấy chứng chỉ' : 'Chưa có chứng chỉ nào'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                : 'Bắt đầu tạo chứng chỉ đầu tiên của bạn'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Button>
                Tạo chứng chỉ đầu tiên
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}