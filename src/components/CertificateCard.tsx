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
  const isVerified = certificate.status === 'verified';
  const isPending = certificate.status === 'pending';
  
  // Check transaction hash (support both transactionHash and blockchainTx field names)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txHash = certificate.transactionHash || (certificate as any).blockchainTx;
  const hasTransaction = !!txHash;

  return (
    <Card className="w-full h-full flex flex-col bg-white/70 dark:bg-white/10 backdrop-blur-xl border-2 border-white/60 dark:border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.5)] transition-all duration-300 hover:scale-[1.02] hover:border-white/80 dark:hover:border-white/40">
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

      <CardContent className="flex-1 space-y-4">
        {/* Student Info */}
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="gap-2 bg-blue-500/90 hover:bg-blue-600/90 text-white border-0 py-2 px-3">
              <User className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold leading-tight">{certificate.studentName}</span>
                <span className="text-xs opacity-90 leading-tight">{certificate.studentId}</span>
              </div>
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5 bg-slate-600/90 text-white border-0">
              <Calendar className="h-3 w-3" />
              {formatDate(certificate.issuedAt)}
            </Badge>
          </div>
        </div>

        {/* Hash Info */}
        <div className="flex flex-wrap gap-2">
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
            // Pending: Hiển thị "Chưa có" màu xám nhạt
            <Badge variant="secondary" className="gap-1.5 font-mono text-xs bg-slate-400/60 text-white border-0">
              <span className="opacity-80">Hash:</span>
              Chưa có
            </Badge>
          )}

          {/* Transaction Badge - On-chain status */}
          {hasTransaction ? (
            <Badge className="gap-1.5 bg-green-600/90 hover:bg-green-700/90 text-white border-0">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              On-chain
            </Badge>
          ) : (
            <Badge className="gap-1.5 bg-orange-500/90 text-white border-0">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              Chờ xác thực
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onView}
            className="flex-1 bg-indigo-600/90 hover:bg-indigo-700/90 text-white border-0 shadow-md"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Chi tiết
          </Button>
          
          {isPending && onRegister && (
            <Button
              size="sm"
              onClick={onRegister}
              disabled={isRegistering}
              className="flex-1 bg-purple-600/90 hover:bg-purple-700/90 text-white border-0 shadow-md disabled:opacity-50"
            >
              {isRegistering ? 'Đang đăng ký...' : 'Đăng ký on-chain'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
