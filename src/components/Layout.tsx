'use client';

import { Footer } from './Footer';
import { SimpleHeader } from './SimpleHeader';

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
      <SimpleHeader />
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
