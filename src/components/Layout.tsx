'use client';

import { Footer } from './Footer';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      width: '100%',
      margin: 0,
      padding: 0
    }}>
      <Header />
      <main style={{ 
        flex: 1, 
        width: '100%',
        margin: 0,
        padding: 0
      }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
