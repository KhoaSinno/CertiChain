import { Layout } from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="container py-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">CertiChain</h1>
          <p className="text-xl text-muted-foreground">
            Hệ thống xác thực chứng chỉ dựa trên blockchain
          </p>
        </div>
      </div>
    </Layout>
  );
}
