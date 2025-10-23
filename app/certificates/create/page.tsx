'use client';

import { Layout } from '@/components/Layout';
import { CertificateForm } from '@/components/CertificateForm';
import { useCreateCertificate } from '@/hooks/useCertificates';
import { CreateCertificateRequest } from '@/types/certificate';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCertificatePage() {
  const router = useRouter();
  const createMutation = useCreateCertificate();
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (data: CreateCertificateRequest) => {
    try {
      setProgress(0);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await createMutation.mutateAsync(data);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Redirect to dashboard after success
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      
    } catch (error) {
      console.error('Failed to create certificate:', error);
      setProgress(0);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tạo chứng chỉ mới</h1>
          <p className="text-muted-foreground">
            Tạo và đăng ký chứng chỉ mới trên blockchain
          </p>
        </div>

        {/* Certificate Form */}
        <CertificateForm
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
          progress={progress}
        />

        {/* Error Display */}
        {createMutation.error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-red-800 font-medium">Lỗi tạo chứng chỉ</h3>
            <p className="text-red-600 text-sm mt-1">
              {createMutation.error.message || 'Có lỗi xảy ra khi tạo chứng chỉ. Vui lòng thử lại.'}
            </p>
          </div>
        )}

        {/* Success Message */}
        {createMutation.isSuccess && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-green-800 font-medium">Tạo chứng chỉ thành công!</h3>
            <p className="text-green-600 text-sm mt-1">
              Chứng chỉ đã được tạo và sẽ được chuyển hướng đến dashboard...
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
