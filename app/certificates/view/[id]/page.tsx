'use client';

import { CertificateDisplay } from '@/src/components/CertificateDisplay';
import { Layout } from '@/src/components/Layout';
import { Button } from '@/src/components/ui/button';
import { useCertificate } from '@/src/hooks/useCertificates';
import { ArrowLeft } from 'lucide-react';
import { notFound, useParams, useRouter } from 'next/navigation';

export default function CertificateViewPage() {
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

  // Use transaction hash if available, otherwise fallback to file hash
  const verificationHash = certificate.transactionHash || certificate.fileHash;
  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/verify?hash=${verificationHash}` 
    : '';

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

        {/* Certificate Display */}
        <div className="mb-8">
          <CertificateDisplay 
            certificate={certificate}
            verificationUrl={verificationUrl}
          />
        </div>
      </div>
    </Layout>
  );
}
