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
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              {certificate.courseName}
            </CardTitle>
          </div>
          <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="absolute h-6 w-6 text-primary group-hover:opacity-0 transition-all duration-300" />
            <ExternalLink className="absolute h-5 w-5 text-indigo-600 opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 relative z-0">
        {/* Hash Info & Date - Cùng hàng */}
        <div className="flex flex-wrap gap-2">
          {/* Date Badge */}
          <Badge
            variant="secondary"
            className="gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 shadow-sm"
          >
            <Calendar className="h-3 w-3" />
            {formatDate(certificate.issuedAt)}
          </Badge>

          {/* Hash Badge - Thay đổi theo trạng thái */}
          {hasTransaction ? (
            // On-chain: Hiển thị transaction hash màu xanh
            <Badge
              variant="secondary"
              className="gap-1.5 font-mono text-xs bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-sm"
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

        {/* Student Info */}
        <div className="flex items-center gap-2.5 pt-1">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
            <User className="h-4.5 w-4.5 text-white" />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <span className="font-semibold text-foreground leading-tight text-sm truncate">
              {certificate.student.studentName || ""}
            </span>
            <span className="text-xs text-muted-foreground leading-tight font-mono">
              {certificate.student.studentId || ""}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
