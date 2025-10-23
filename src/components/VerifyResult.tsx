import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VerifyResult as VerifyResultType } from '@/types/certificate';
import { CheckCircle, XCircle, ExternalLink, Calendar, User, Shield } from 'lucide-react';
import { formatDate, truncateAddress } from '@/lib/utils';

interface VerifyResultProps {
  data: VerifyResultType;
  hash: string;
  className?: string;
}

export function VerifyResult({ data, hash, className = "" }: VerifyResultProps) {
  const isVerified = data.verified;
  const certificate = data.certificate;

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      {/* Verification Status */}
      <Card className="mb-6">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {isVerified ? (
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>
          
          <CardTitle className={`text-2xl font-bold ${isVerified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isVerified ? 'Chứng chỉ hợp lệ' : 'Chứng chỉ không hợp lệ'}
          </CardTitle>
          
          <Badge variant={isVerified ? "default" : "destructive"} className="text-sm">
            {isVerified ? 'Verified' : 'Invalid'}
          </Badge>
        </CardHeader>
      </Card>

      {/* Certificate Details */}
      {isVerified && certificate && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Thông tin chứng chỉ
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Student Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Sinh viên:</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  {certificate.studentName}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Ngày cấp:</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  {formatDate(certificate.issuedAt)}
                </p>
              </div>
            </div>

            {/* Course Info */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Khóa học</h4>
              <p className="text-sm text-muted-foreground">{certificate.courseName}</p>
            </div>

            {/* Hash Info */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">File Hash</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(hash)}
                  className="h-6 px-2 text-xs"
                >
                  Copy
                </Button>
              </div>
              <code className="text-xs text-muted-foreground break-all block">
                {hash}
              </code>
            </div>

            {/* Transaction Info */}
            {certificate.transactionHash && (
              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h4 className="font-medium text-sm text-green-700 dark:text-green-400">
                    Đã ghi lên blockchain
                  </h4>
                </div>
                <code className="text-xs text-green-600 dark:text-green-400 break-all block">
                  {truncateAddress(certificate.transactionHash)}
                </code>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {isVerified && certificate?.ipfsHash && (
          <Button
            variant="outline"
            onClick={() => window.open(`https://ipfs.io/ipfs/${certificate.ipfsHash}`, '_blank')}
            className="flex-1"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Xem file gốc trên IPFS
          </Button>
        )}
        
        {isVerified && certificate?.transactionHash && (
          <Button
            variant="outline"
            onClick={() => window.open(`https://sepolia.basescan.org/tx/${certificate.transactionHash}`, '_blank')}
            className="flex-1"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Xem giao dịch trên BaseScan
          </Button>
        )}
        
        <Button
          variant="outline"
          onClick={() => window.location.href = '/'}
          className="flex-1"
        >
          Xác minh chứng chỉ khác
        </Button>
      </div>

      {/* Verification Info */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          Kết quả xác minh được lấy từ blockchain Base Sepolia
        </p>
      </div>
    </div>
  );
}
