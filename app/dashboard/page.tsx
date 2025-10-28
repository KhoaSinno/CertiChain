'use client';

import { Layout } from '@/src/components/Layout';
import { HolderDashboard } from '@/src/components/dashboard/HolderDashboard';
import { IssuerDashboard } from '@/src/components/dashboard/IssuerDashboard';
import { VerifierDashboard } from '@/src/components/dashboard/VerifierDashboard';
import { useRole } from '@/src/hooks/useRole';

export default function DashboardPage() {
  const { roleContext, isLoading } = useRole();

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Đang tải dashboard...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const renderDashboard = () => {
    if (!roleContext) return null;

    switch (roleContext.role) {
      case 'issuer':
        return <IssuerDashboard />;
      case 'holder':
        return <HolderDashboard />;
      case 'verifier':
        return <VerifierDashboard />;
      default:
        return <IssuerDashboard />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {renderDashboard()}
      </div>
    </Layout>
  );
}