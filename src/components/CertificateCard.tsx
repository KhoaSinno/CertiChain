import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { formatDate, truncateAddress } from '@/src/lib/utils';
import { Certificate } from '@/src/types/certificate';
import { BookOpen, Calendar, Copy, ExternalLink, GraduationCap, User } from 'lucide-react';

interface CertificateCardProps {
  certificate: Certificate;
  onView?: () => void;
  onRegister?: () => void;
  onCopy?: () => void;
}

export function CertificateCard({ 
  certificate, 
  onView, 
  onRegister, 
  onCopy 
}: CertificateCardProps) {
  const isVerified = certificate.status === 'verified';
  const isPending = certificate.status === 'pending';

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold line-clamp-1">
                {certificate.courseName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {certificate.studentName}
              </p>
            </div>
          </div>
          <Badge variant={isVerified ? "default" : "secondary"}>
            {isVerified ? "Đã xác thực" : "Chờ xác thực"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Student Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Mã sinh viên:</span>
            <span className="text-muted-foreground">{certificate.studentId}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Khóa học:</span>
            <span className="text-muted-foreground">{certificate.courseName}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Ngày cấp:</span>
            <span className="text-muted-foreground">{formatDate(certificate.issuedAt)}</span>
          </div>
        </div>

        {/* Hash Info */}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">File Hash</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCopy}
              className="h-6 px-2 text-xs"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>
          <code className="text-xs text-muted-foreground break-all">
            {truncateAddress(certificate.fileHash)}
          </code>
        </div>

        {/* Transaction Info */}
        {certificate.transactionHash && (
          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-green-700 dark:text-green-400">
                Đã ghi lên blockchain
              </span>
            </div>
            <code className="text-xs text-green-600 dark:text-green-400 break-all">
              {truncateAddress(certificate.transactionHash)}
            </code>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onView}
            className="flex-1"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Xem chi tiết
          </Button>
          
          {isPending && onRegister && (
            <Button
              size="sm"
              onClick={onRegister}
              className="flex-1"
            >
              Đăng ký on-chain
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
