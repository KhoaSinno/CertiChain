'use client';

import { Layout } from '@/src/components/Layout';
import { QRDisplay } from '@/src/components/QRDisplay';
import { Button } from '@/src/components/ui/button';
import { useCertificate } from '@/src/hooks/useCertificates';
import { ArrowLeft, ExternalLink, FileText, Share2 } from 'lucide-react';
import { notFound, useParams, useRouter } from 'next/navigation';

export default function CertificateDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: certificate, isLoading, error } = useCertificate(id);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Đang tải thông tin chứng chỉ...</p>
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

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 transition-transform hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Certificate Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{certificate.courseName}</h1>
              <p className="text-xl text-muted-foreground">{certificate.student?.studentName || 'N/A'}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Mã sinh viên</h3>
                <p className="text-lg">{certificate.student?.studentId || 'N/A'}</p>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Ngày xác thực</h3>
                <p className="text-lg">{certificate.issuedAt.toLocaleDateString('vi-VN')}</p>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Trạng thái</h3>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  certificate.status === 'verified'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {certificate.status === 'verified' ? 'Đã xác thực' : 'Chờ xác thực'}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">File Hash</h3>
                <p className="text-sm font-mono bg-muted p-2 rounded break-all">
                  {certificate.fileHash}
                </p>
              </div>

              {certificate.transactionHash && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Transaction Hash</h3>
                  <p className="text-sm font-mono bg-muted p-2 rounded break-all">
                    {certificate.transactionHash}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
                             <Button
                 variant="default"
                 onClick={() => router.push(`/certificates/view/${id}`)}
                 className="gap-2 transition-transform hover:scale-105 active:scale-95"
               >
                 <FileText className="h-4 w-4" />
                 Xem chứng chỉ
               </Button>

              {certificate.ipfsCid && (
                <Button
                  variant="outline"
                  onClick={() => window.open(`https://ipfs.io/ipfs/${certificate.ipfsCid}`, '_blank')}
                  className="transition-transform hover:scale-105 active:scale-95"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Xem file gốc
                </Button>
              )}

              {certificate.transactionHash && (
                <Button
                  variant="outline"
                  onClick={() => window.open(`https://sepolia.etherscan.io/tx/${certificate.transactionHash}`, '_blank')}
                  className="transition-transform hover:scale-105 active:scale-95"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Xem trên Etherscan
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => navigator.share({ 
                  title: 'Chứng chỉ CertiChain',
                  text: `Chứng chỉ ${certificate.courseName} của ${certificate.student?.studentName || 'N/A'}`,
                  url: verificationUrl 
                })}
                className="transition-transform hover:scale-105 active:scale-95"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Chia sẻ
              </Button>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <QRDisplay
              value={verificationUrl}
              title="Mã QR xác minh"
              description={certificate.transactionHash 
                ? "Quét mã QR để xác minh chứng chỉ trên blockchain" 
                : "Quét mã QR để xác minh chứng chỉ (chưa đăng ký on-chain)"
              }
              size={250}
            />
          </div>
        </div>

        {/* Verification Link */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Link xác minh</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Chia sẻ link này để nhà tuyển dụng có thể xác minh chứng chỉ:
          </p>
          <p className="text-sm font-mono bg-background p-2 rounded break-all">
            {verificationUrl}
          </p>
        </div>
      </div>
    </Layout>
  );
}
