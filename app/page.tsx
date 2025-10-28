import { CTA } from '@/src/components/CTA';
import { Features } from '@/src/components/Features';
import { Hero } from '@/src/components/Hero';
import { Layout } from '@/src/components/Layout';
import { Process } from '@/src/components/Process';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Features />
      <Process />
      <CTA />
    </Layout>
  );
}
