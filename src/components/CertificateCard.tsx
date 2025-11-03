import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { formatDate, truncateAddress } from '@/src/lib/utils';
import { Certificate } from '@/src/types/certificate';
import { Calendar, Copy, ExternalLink, GraduationCap, User } from 'lucide-react';

interface CertificateCardProps {
  certificate: Certificate;
  onView?: () => void;
  onRegister?: () => void;
  onCopy?: () => void;
  isRegistering?: boolean;
}

export function CertificateCard({ 
  certificate, 
  onView, 
  onRegister, 
  onCopy,
  isRegistering = false
}: CertificateCardProps) {
  const isPending = certificate.status === 'pending';
  
  // Check transaction hash (support both transactionHash and blockchainTx field names)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txHash = certificate.transactionHash || (certificate as any).blockchainTx;
  const hasTransaction = !!txHash;

  return (
    <Card className="w-full h-full flex flex-col bg-white/70 dark:bg-white/10 backdrop-blur-xl border-2 border-white/60 dark:border-white/30 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-white/80 dark:hover:border-white/40">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 min-h-[3.5rem]">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight">
              {certificate.courseName}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {/* Hash Info & Date - Cùng hàng */}
        <div className="flex flex-wrap gap-2">
          {/* Date Badge */}
          <Badge variant="secondary" className="gap-1.5 bg-indigo-600/90 text-white border-0">
            <Calendar className="h-3 w-3" />
            {formatDate(certificate.issuedAt)}
          </Badge>

          {/* Hash Badge - Thay đổi theo trạng thái */}
          {hasTransaction ? (
            // On-chain: Hiển thị transaction hash màu xanh
            <Badge variant="secondary" className="gap-1.5 font-mono text-xs bg-green-600/90 hover:bg-green-700/90 text-white border-0">
              <span className="opacity-90">Hash:</span>
              {truncateAddress(txHash)}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(txHash);
                  if (onCopy) onCopy();
                }}
                className="h-4 w-4 p-0 hover:bg-white/20"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </Badge>
          ) : (
            // Pending: Hiển thị "Chờ xác thực" màu cam
            <Badge variant="secondary" className="gap-1.5 font-mono text-xs bg-orange-500/90 text-white border-0">
              <span className="opacity-90">Hash:</span>
              Chờ xác thực
            </Badge>
          )}
        </div>

        {/* Student Info Card */}
        <div className="glass-effect rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-primary flex-shrink-0" />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-semibold text-foreground leading-tight">{certificate.studentName}</span>
              <span className="text-xs text-muted-foreground leading-tight">{certificate.studentId}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onView}
            className="flex-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Chi tiết
          </Button>
          
          {hasTransaction ? (
            <div className="flex-1 flex items-center justify-center text-green-600 dark:text-green-400 rounded-md px-3 py-2 text-sm font-medium">
              ✓ Đã xác thực
            </div>
          ) : isPending && onRegister ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegister}
              disabled={isRegistering}
              className="flex-1 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-purple-600"
            >
              {isRegistering ? 'Đang đăng ký...' : 'Đăng ký on-chain'}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
