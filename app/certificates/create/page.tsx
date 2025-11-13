'use client';

import { CertificateForm } from '@/src/components/CertificateForm';
import { Layout } from '@/src/components/Layout';
import { useCreateCertificate } from '@/src/hooks/useCertificates';
import { CreateCertificateRequest } from '@/src/types/certificate';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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

      await createMutation.mutateAsync(data);
      
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
      <section className="relative overflow-hidden px-6 py-6 md:py-8 min-h-[calc(100vh-4rem)] flex items-center">
        {/* Background decorative shapes - matching Landing/Hero design */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {/* Soft radial gradient overlay */}
          <div className="absolute inset-0 opacity-70 [background:radial-gradient(60%_60%_at_50%_30%,theme(colors.primary/10),transparent_70%)]" />
          
          {/* Top-left blurred circle */}
          <div className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-gradient-to-br from-primary/20 via-blue-400/15 to-purple-400/10 blur-3xl" />
          
          {/* Bottom-right blurred circle */}
          <div className="absolute -bottom-24 -right-24 w-[36rem] h-[36rem] rounded-full bg-gradient-to-tr from-purple-500/20 via-fuchsia-400/15 to-primary/10 blur-3xl" />
          
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(0,0,0,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.5)_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>

        <div className="container mx-auto px-6 max-w-5xl relative z-10 w-full">
          {/* Page Header */}
          <div className="text-center mb-6 md:mb-8 animate-fade-in-up">
            <h1 className="flex flex-wrap text-3xl md:text-4xl font-bold mb-2 text-vietnamese items-center justify-center">
              Tạo <span className="flex flex-wrap text-gradient-primary px-2">chứng chỉ</span> mới
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Tải lên chứng chỉ - Tự động lưu trữ trên IPFS và đăng ký lên Base Sepolia blockchain
            </p>
          </div>

          {/* Certificate Form */}
          <div className="animate-fade-in">
            <CertificateForm
              onSubmit={handleSubmit}
              isLoading={createMutation.isPending}
              progress={progress}
            />
          </div>

          {/* Error Display */}
          {createMutation.error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg shadow-lg-primary animate-fade-in">
              <h3 className="text-red-800 dark:text-red-400 font-semibold text-base mb-1">
                Lỗi tạo chứng chỉ
              </h3>
              <p className="text-red-600 dark:text-red-300 text-xs md:text-sm">
                {createMutation.error.message || 'Có lỗi xảy ra khi tạo chứng chỉ. Vui lòng thử lại.'}
              </p>
            </div>
          )}

          {/* Success Message */}
          {createMutation.isSuccess && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg shadow-lg-primary animate-fade-in">
              <h3 className="text-green-800 dark:text-green-400 font-semibold text-base mb-1">
                Tạo chứng chỉ thành công!
              </h3>
              <p className="text-green-600 dark:text-green-300 text-xs md:text-sm">
                Chứng chỉ đã được tạo và sẽ được chuyển hướng đến dashboard...
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
