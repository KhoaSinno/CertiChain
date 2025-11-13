"use client";

import { Layout } from "@/src/components/Layout";
import { QRDisplay } from "@/src/components/QRDisplay";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { useCertificate } from "@/src/hooks/useCertificates";
import { formatDate } from "@/src/lib/utils";
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Copy,
    ExternalLink,
    FileText,
    GraduationCap,
    Hash,
    Share2,
    User,
} from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function CertificateDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: certificate, isLoading, error } = useCertificate(id);

  // ✅ All hooks must be called before any conditional returns
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                Đang tải thông tin chứng chỉ...
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !certificate) {
    notFound();
  }

  // Use transaction hash if available, fallback to file hash
  const verificationHash = certificate.transactionHash || certificate.fileHash;
  const verificationUrl = `${window.location.origin}/verify?hash=${verificationHash}`;
  const txHash = certificate.transactionHash || certificate.blockchainTx;
  const hasTransaction = !!txHash;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Header with Back Button and Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="transition-transform hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="ghost"
              onClick={() => router.push(`/certificates/view/${id}`)}
              className="gap-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white"
            >
              <FileText className="h-4 w-4" />
              Xem chứng chỉ
            </Button>

            {certificate.ipfsFile && (
              <Button
                variant="ghost"
                onClick={() => window.open(`${certificate.ipfsFile}`, "_blank")}
                className="gap-2 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
                File gốc
              </Button>
            )}

            {txHash && (
              <Button
                variant="ghost"
                onClick={() =>
                  window.open(
                    `https://sepolia.etherscan.io/tx/${txHash}`,
                    "_blank"
                  )
                }
                className="gap-2 text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white dark:hover:bg-green-600 dark:hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
                Etherscan
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={() =>
                navigator.share({
                  title: "Chứng chỉ CertiChain",
                  text: `Chứng chỉ ${certificate.courseName} của ${
                    certificate.student?.studentName || "N/A"
                  }`,
                  url: verificationUrl,
                })
              }
              className="gap-2 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white"
            >
              <Share2 className="h-4 w-4" />
              Chia sẻ
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Card */}
            <Card className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-2 border-white/60 dark:border-white/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl">
                      {certificate.courseName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Certificate Details
                    </p>
                  </div>
                  {hasTransaction && (
                    <Badge className="bg-green-600 text-white border-0 gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      On-chain
                    </Badge>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Student & Date Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Student Card */}
              <Card className="glass-effect border-2 border-white/60 dark:border-white/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Thông tin sinh viên
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-foreground mb-1">
                    {certificate.student?.studentName || "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    MSSV: {certificate.student?.studentId || "N/A"}
                  </p>
                </CardContent>
              </Card>

              {/* Date Card */}
              <Card className="glass-effect border-2 border-white/60 dark:border-white/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Ngày xác thực
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-foreground">
                    {formatDate(certificate.issuedAt)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {certificate.status === "verified"
                      ? "Đã xác thực"
                      : "Đang xử lý"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Hash Information */}
            <Card className="glass-effect border-2 border-white/60 dark:border-white/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Mã băm chứng chỉ</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Hash */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    File Hash
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs font-mono bg-background/60 p-3 rounded-lg break-all">
                      {certificate.fileHash}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleCopy(certificate.fileHash, "fileHash")
                      }
                      className="flex-shrink-0"
                    >
                      {copiedField === "fileHash" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Transaction Hash */}
                {txHash && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Transaction Hash
                    </label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs font-mono bg-green-600/10 text-green-700 dark:text-green-400 p-3 rounded-lg break-all">
                        {txHash}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(txHash, "txHash")}
                        className="flex-shrink-0"
                      >
                        {copiedField === "txHash" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - QR Code */}
          <div className="space-y-6">
            {hasTransaction ? (
              /* QR Code - On-chain */
              <QRDisplay
                value={verificationUrl}
                title="Mã QR xác minh"
                description="Quét để xác minh on-chain"
                size={220}
              />
            ) : (
              /* Alternative UI - Processing */
              <Card className="glass-effect border-2 border-orange-500/30 bg-orange-500/5">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-3 bg-orange-500/10 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-600 border-t-transparent" />
                  </div>
                  <CardTitle className="text-lg font-semibold">
                    Đang xử lý
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Chứng chỉ đang được tải lên IPFS và đăng ký lên blockchain
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
                    <p className="text-xs text-muted-foreground mb-2">
                      File Hash
                    </p>
                    <code className="text-xs font-mono break-all block text-orange-700 dark:text-orange-400">
                      {certificate.fileHash}
                    </code>
                  </div>
                  <div className="text-center pt-2">
                    <p className="text-xs text-muted-foreground">
                      Mã QR sẽ khả dụng sau khi hoàn tất xử lý
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
