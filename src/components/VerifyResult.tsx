import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { formatDate } from '@/src/lib/utils';
import { VerifyResult as VerifyResultType } from '@/src/types/certificate';
import { Calendar, CheckCircle, Copy, ExternalLink, Eye, Shield, User, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface VerifyResultProps {
  data: VerifyResultType;
  hash: string;
  className?: string;
}

export function VerifyResult({ data, hash, className = "" }: VerifyResultProps) {
  const isVerified = data.verified;
  const certificate = data.certificate;
  const router = useRouter();

  const handleViewCertificate = () => {
    if (certificate) {
      router.push(`/certificates/view/${certificate.id}`);
    }
  };

  // Only show verification status card for invalid certificates
  if (!isVerified || !certificate) {
    return (
      <div className={`w-full flex flex-col items-center justify-center gap-3 p-6 ${className}`}>
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
          <XCircle className="h-8 w-8 text-white" />
        </div>
        <p className="text-xl font-bold text-red-600 dark:text-red-400">
          Chứng chỉ không hợp lệ
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Certificate Details with integrated verification status */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Thông tin chứng chỉ</CardTitle>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Verification Status Badge */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-green-700 dark:text-green-400">Hợp lệ</p>
                  <Badge variant="default" className="bg-green-600 text-white text-xs h-4 px-1.5">Verified</Badge>
                </div>
              </div>
              
              {/* View Certificate Button */}
              <Button
                onClick={handleViewCertificate}
                size="sm"
                className="gap-1.5"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Xem chứng chỉ</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Student Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="text-xs text-muted-foreground">Sinh viên:</span>
                <p className="text-sm font-medium">{certificate.studentName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="text-xs text-muted-foreground">Ngày cấp:</span>
                <p className="text-sm font-medium">{formatDate(certificate.issuedAt)}</p>
              </div>
            </div>
          </div>

          {/* Course Info */}
          <div className="bg-muted/50 rounded-lg p-3">
            <h4 className="text-xs font-medium text-muted-foreground mb-1">Khóa học</h4>
            <p className="text-sm font-medium">{certificate.courseName}</p>
          </div>

          {/* Hash Info */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-xs font-medium text-muted-foreground">File Hash</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(hash)}
                className="h-7 px-2 text-xs gap-1"
              >
                <Copy className="h-3 w-3" />
                Copy
              </Button>
            </div>
            <code className="text-xs text-muted-foreground break-all block">
              {hash}
            </code>
          </div>

          {/* Blockchain Status - Solid background */}
          {certificate.transactionHash && (
            <div className="bg-green-600 rounded-lg p-3 shadow-md">
              <div className="flex items-start gap-2.5 mb-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-white flex flex-wrap items-center gap-2">
                    Đã ghi lên blockchain
                    <Badge variant="secondary" className="bg-white text-green-600 text-[10px] px-1.5">Base Sepolia</Badge>
                  </h4>
                  <p className="text-xs text-green-50 mt-0.5">
                    Giao dịch được xác nhận và lưu trữ vĩnh viễn
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-md p-2">
                <p className="text-[10px] text-muted-foreground mb-0.5">Transaction Hash:</p>
                <code className="text-[10px] font-mono text-green-700 break-all block">
                  {certificate.transactionHash}
                </code>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Secondary Actions */}
      {(certificate.ipfsHash || certificate.transactionHash) && (
        <div className={`grid gap-2 ${certificate.ipfsHash && certificate.transactionHash ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {certificate.ipfsHash && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://ipfs.io/ipfs/${certificate.ipfsHash}`, '_blank')}
              className="transition-transform hover:scale-105 active:scale-95"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Xem file gốc
            </Button>
          )}
          
          {certificate.transactionHash && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://sepolia.basescan.org/tx/${certificate.transactionHash}`, '_blank')}
              className="transition-transform hover:scale-105 active:scale-95"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              BaseScan
            </Button>
          )}
        </div>
      )}

      {/* Verification Info */}
      <div className="mt-4 text-center">
        <p className="text-[10px] text-muted-foreground">
          Kết quả xác minh được lấy từ blockchain Base Sepolia
        </p>
      </div>
    </div>
  );
}
