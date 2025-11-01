'use client';

import { Footer } from './Footer';
import { GlobalLogoutOverlay } from './GlobalLogoutOverlay';
import { Header } from './Header';
import { RoleRouteGuard } from './RoleRouteGuard';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <GlobalLogoutOverlay />
      <div className="min-h-screen flex flex-col w-full m-0 p-0">
        <Header />
        <RoleRouteGuard />
        <main className="flex-1 w-full m-0 p-0">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
