'use client';

import { useEffect, useState } from 'react';

export function GlobalLogoutOverlay() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const handleLogoutStart = () => {
      setIsRedirecting(true);
    };

    // Listen for custom logout event
    window.addEventListener('logout:start', handleLogoutStart);

    return () => {
      window.removeEventListener('logout:start', handleLogoutStart);
    };
  }, []);

  if (!isRedirecting) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center">
      {/* Background decorative shapes - matching Hero design */}
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
      {/* Loading content */}
      <div className="text-center px-6 max-w-md relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-gradient-primary mb-4">CertiChain</h2>
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <p className="text-lg text-muted-foreground">Đang đăng xuất...</p>
      </div>
    </div>
  );
}

