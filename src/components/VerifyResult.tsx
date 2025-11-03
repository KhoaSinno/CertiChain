import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { formatDate } from "@/src/lib/utils";
import { VerifyResult as VerifyResultType } from "@/src/types/certificate";
import {
  Calendar,
  CheckCircle,
  Copy,
  ExternalLink,
  Eye,
  GraduationCap,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface VerifyResultProps {
  data: VerifyResultType;
  hash: string;
  className?: string;
}

export function VerifyResult({
  data,
  hash,
  className = "",
}: VerifyResultProps) {
  const isVerified = data.verified;
  const certificate = data.certificate;
  const router = useRouter();

  const handleViewCertificate = () => {
    if (certificate) router.push(`/certificates/view/${certificate.id}`);
  };

  // Invalid state (nicer card)
  if (!isVerified || !certificate) {
    return (
      <div className={`w-full ${className}`}>
        <Card className="border-red-200/50 bg-red-50/60 supports-[backdrop-filter]:bg-red-50/40 backdrop-blur-md">
          <CardContent className="py-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-red-600 shadow-lg flex items-center justify-center">
                <XCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-extrabold text-red-700">
                Chứng chỉ không hợp lệ
              </h3>
              <p className="text-sm text-red-600/80">
                Không tìm thấy thông tin tương ứng với mã đã nhập. Vui lòng kiểm
                tra lại transaction hash.
              </p>
              <div className="mt-3 text-xs text-muted-foreground">
                Đã kiểm tra hash:
                <code className="ml-2 px-2 py-1 bg-white/70 rounded font-mono">
                  {hash}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Valid state (banner + glass details)
  return (
    <div className={`w-full ${className}`}>
      {/* Status banner */}
      <div className="mb-4 rounded-2xl p-4 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs opacity-90">Trạng thái xác minh</p>
              <h4 className="text-lg font-bold leading-tight">
                Chứng chỉ hợp lệ
              </h4>
            </div>
          </div>
          <Badge className="bg-white text-blue-600">Verified</Badge>
        </div>
      </div>

      {/* Details card */}
      <Card className="bg-background/60 supports-[backdrop-filter]:bg-background/40 backdrop-blur-md border border-border/40 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Thông tin chứng chỉ</CardTitle>
            </div>

            <div className="flex items-center gap-2">
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

        <CardContent className="space-y-4">
          {/* Primary info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="text-xs text-muted-foreground">Sinh viên</span>
                <p className="text-sm font-medium">
                  {certificate.student?.studentName || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="text-xs text-muted-foreground">
                  Ngày xác thực
                </span>
                <p className="text-sm font-medium">
                  {formatDate(certificate.issuedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Course */}
          <div className="bg-muted/50 rounded-lg p-3">
            <h4 className="text-xs font-medium text-muted-foreground mb-1">
              Khóa học
            </h4>
            <p className="text-sm font-medium">{certificate.courseName}</p>
          </div>

          {/* Hash (copiable) */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-xs font-medium text-muted-foreground">
                File Hash
              </h4>
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

          {/* On-chain transaction banner */}
          {certificate.transactionHash && (
            <div className="rounded-lg p-3 bg-green-600 text-white shadow-md">
              <div className="flex items-start gap-2.5 mb-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm flex flex-wrap items-center gap-2">
                    Đã ghi lên blockchain
                    <Badge
                      variant="secondary"
                      className="bg-white text-green-600 text-[10px] px-1.5"
                    >
                      Base Sepolia
                    </Badge>
                  </h4>
                  <p className="text-xs text-green-50 mt-0.5">
                    Giao dịch được xác nhận và lưu trữ vĩnh viễn
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-md p-2">
                <p className="text-[10px] text-muted-foreground mb-0.5">
                  Transaction Hash:
                </p>
                <code className="text-[10px] font-mono text-green-700 break-all block">
                  {certificate.transactionHash}
                </code>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Secondary actions */}
      {(certificate.ipfsCid ||
        certificate.transactionHash ||
        certificate.blockchainTx) && (
        <div
          className={`grid gap-2 ${
            certificate.ipfsCid &&
            (certificate.transactionHash || certificate.blockchainTx)
              ? "grid-cols-2"
              : "grid-cols-1"
          }`}
        >
          {certificate.ipfsCid && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open(
                  `https://ipfs.io/ipfs/${certificate.ipfsCid}`,
                  "_blank"
                )
              }
              className="transition-transform hover:scale-105 active:scale-95"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Xem file gốc
            </Button>
          )}
          {(certificate.transactionHash || certificate.blockchainTx) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open(
                  `https://sepolia.basescan.org/tx/${
                    certificate.transactionHash || certificate.blockchainTx
                  }`,
                  "_blank"
                )
              }
              className="transition-transform hover:scale-105 active:scale-95"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              BaseScan
            </Button>
          )}
        </div>
      )}

      {/* Footnote */}
      <div className="mt-4 text-center">
        <p className="text-[10px] text-muted-foreground">
          Kết quả xác minh được lấy từ blockchain Base Sepolia
        </p>
      </div>
    </div>
  );
}
