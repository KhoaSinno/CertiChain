import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { formatDate, truncateAddress } from "@/src/lib/utils";
import { Certificate } from "@/src/types/certificate";
import {
  Calendar,
  Copy,
  ExternalLink,
  GraduationCap,
  User,
} from "lucide-react";

interface CertificateCardProps {
  certificate: Certificate;
  onView?: () => void;
  onCopy?: () => void;
}

export function CertificateCard({
  certificate,
  onView,
  onCopy,
}: CertificateCardProps) {
  const isProcessing = certificate.status === "pending";

  // Check transaction hash (support both transactionHash and blockchainTx field names)
  const txHash = certificate.transactionHash || certificate.blockchainTx;
  const hasTransaction = !!txHash;

  // ✅ Safety check: Return early if student data is missing
  if (!certificate.student) {
    return (
      <Card className="w-full h-full flex flex-col items-center justify-center p-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
        <p className="text-red-600 dark:text-red-400 font-medium">
          ⚠️ Thiếu thông tin sinh viên
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Certificate ID: {certificate.id}
        </p>
      </Card>
    );
  }

  return (
    <Card 
      className="group relative w-full h-full flex flex-col bg-white/70 dark:bg-white/10 backdrop-blur-xl border-2 border-white/60 dark:border-white/30 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 dark:hover:border-primary/40 cursor-pointer overflow-hidden hover:glass-primary"
      onClick={onView}
    >
      {/* Status Indicator Ribbon */}
      <div className="absolute top-0 right-0 z-10">
        {hasTransaction ? (
          <div className="bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-bl-lg shadow-md flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Đã xác thực
          </div>
        ) : isProcessing ? (
          <div className="bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-bl-lg shadow-md flex items-center gap-1">
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
            Đang xử lý
          </div>
        ) : null}
      </div>

      <CardHeader className="pb-4 relative z-0">
        <div className="flex items-center gap-3 min-h-[3.5rem]">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300">
            <GraduationCap className="h-6 w-6 text-primary group-hover:text-indigo-600 transition-colors duration-300" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              {certificate.courseName}
            </CardTitle>
          </div>
          <ExternalLink className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-indigo-600 transition-all duration-300 flex-shrink-0" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 relative z-0">
        {/* Hash Info & Date - Cùng hàng */}
        <div className="flex flex-wrap gap-2">
          {/* Date Badge */}
          <Badge
            variant="secondary"
            className="gap-1.5 bg-indigo-600/90 text-white border-0"
          >
            <Calendar className="h-3 w-3" />
            {formatDate(certificate.issuedAt)}
          </Badge>

          {/* Hash Badge - Thay đổi theo trạng thái */}
          {hasTransaction ? (
            // On-chain: Hiển thị transaction hash màu xanh
            <Badge
              variant="secondary"
              className="gap-1.5 font-mono text-xs bg-green-600/90 hover:bg-green-700/90 text-white border-0"
            >
              <span className="opacity-90">Hash:</span>
              {truncateAddress(txHash)}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(txHash);
                  if (onCopy) onCopy();
                }}
                className="h-4 w-4 p-0 hover:bg-white/20"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </Badge>
          ) : null}
        </div>

        {/* Student Info Card */}
        <div className="glass-effect rounded-lg p-3 group-hover:bg-white/80 dark:group-hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-primary flex-shrink-0" />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-semibold text-foreground leading-tight">
                {certificate.student.studentName || ""}
              </span>
              <span className="text-xs text-muted-foreground leading-tight">
                {certificate.student.studentId || ""}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
