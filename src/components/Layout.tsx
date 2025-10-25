'use client';

import { Footer } from './Footer';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full m-0 p-0">
      <Header />
      <main className="flex-1 w-full m-0 p-0">
        {children}
      </main>
      <Footer />
    </div>
  );
}
