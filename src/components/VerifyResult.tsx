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

        <CardContent className="space-y-3">
          {/* Course Name - Prominent */}
          <div className="relative overflow-hidden rounded-lg p-4 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-2 border-primary/30">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/20 to-primary/20 rounded-full blur-2xl -z-10" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-primary" />
                </div>
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Khóa học
                </h4>
              </div>
              <p className="text-lg font-bold text-foreground leading-tight mb-3">{certificate.courseName}</p>
              
              {/* Student & Date Badges */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-primary/20">
                <Badge className="gap-1.5 bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-primary dark:text-primary-foreground border border-primary/30 py-1.5 px-3 backdrop-blur-sm">
                  <User className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">
                    {certificate.student?.studentName || certificate.studentName || "N/A"}
                    {(certificate.student?.studentId || certificate.studentId) && (
                      <span className="opacity-75"> | {certificate.student?.studentId || certificate.studentId}</span>
                    )}
                  </span>
                </Badge>
                <Badge className="gap-1.5 bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-primary dark:text-primary-foreground border border-primary/30 py-1.5 px-3 backdrop-blur-sm">
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">
                    {formatDate(certificate.issuedAt)}
                  </span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Transaction Hash Badge */}
          {(certificate.transactionHash || certificate.blockchainTx) && (
            <div className="bg-green-600 rounded-lg p-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Transaction Hash
                </h4>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(certificate.transactionHash || certificate.blockchainTx || '')}
                    className="h-6 w-6 p-0 hover:bg-white/20 text-white"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Badge 
                    className="bg-white/20 hover:bg-white/30 text-white border-0 py-1 px-2 cursor-pointer transition-colors gap-1"
                    onClick={() =>
                      window.open(
                        `https://sepolia.etherscan.io/tx/${
                          certificate.transactionHash || certificate.blockchainTx
                        }`,
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="h-3 w-3" />
                    Etherscan
                  </Badge>
                </div>
              </div>
              <code className="text-xs text-white/90 break-all block font-mono">
                {certificate.transactionHash || certificate.blockchainTx}
              </code>
            </div>
          )}

          {/* NFT Mint Transaction Hash Badge */}
          {certificate.mintTx && (
            <div className="bg-purple-600 rounded-lg p-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5" />
                  NFT Mint Transaction
                </h4>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(certificate.mintTx || '')}
                    className="h-6 w-6 p-0 hover:bg-white/20 text-white"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Badge 
                    className="bg-white/20 hover:bg-white/30 text-white border-0 py-1 px-2 cursor-pointer transition-colors gap-1"
                    onClick={() =>
                      window.open(
                        `https://testnet.routescan.io/tx/${certificate.mintTx}`,
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="h-3 w-3" />
                    Routescan
                  </Badge>
                </div>
              </div>
              <code className="text-xs text-white/90 break-all block font-mono">
                {certificate.mintTx}
              </code>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footnote */}
      <div className="mt-4 text-center">
        <p className="text-[10px] text-muted-foreground">
          Kết quả xác minh được lấy từ blockchain Ethereum Sepolia
        </p>
      </div>
    </div>
  );
}
