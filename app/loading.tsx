"use client";

import { Footer } from '@/src/components/Footer';
import { Header } from '@/src/components/Header';
import { useEffect, useState } from 'react';

export default function Loading() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!show) {
    return (
      <div className="h-screen w-full flex flex-col">
        <Header />
        <main className="flex-1 w-full relative overflow-hidden flex items-center justify-center">
          {/* Background - mimic Hero decorative shapes */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 opacity-70 [background:radial-gradient(60%_60%_at_50%_30%,theme(colors.primary/10),transparent_70%)]" />
            <div className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-gradient-to-br from-primary/20 via-blue-400/15 to-purple-400/10 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-[36rem] h-[36rem] rounded-full bg-gradient-to-tr from-purple-500/20 via-fuchsia-400/15 to-primary/10 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(0,0,0,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.5)_1px,transparent_1px)] [background-size:40px_40px]" />
          </div>

          {/* Foreground content - perfectly centered */}
          <div className="text-center px-6 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gradient-primary mb-6">CertiChain</h2>
            <p className="text-lg md:text-xl text-muted-foreground">Đang tải nội dung, vui lòng đợi trong giây lát...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return null;
}


