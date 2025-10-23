import { CTA } from '@/components/CTA';
import { Features } from '@/components/Features';
import { Hero } from '@/components/Hero';
import { Layout } from '@/components/Layout';
import { Process } from '@/components/Process';

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
