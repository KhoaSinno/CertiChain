'use client';

import { Layout } from '@/src/components/Layout';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { VerifyResult } from '@/src/components/VerifyResult';
import { useVerifyCertificate } from '@/src/hooks/useVerify';
import { Hash, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function VerifyPage() {
  const [hash, setHash] = useState('');
  const [searchHash, setSearchHash] = useState('');
  const [hashType, setHashType] = useState<'auto' | 'file' | 'tx'>('auto');
  const resultRef = useRef<HTMLDivElement | null>(null);
  
  const { data: verifyResult, isLoading, error } = useVerifyCertificate(searchHash);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = hash.trim();
    if (trimmed) {
      // Detect hash type automatically
      // Transaction hash: 0x + 64 hex chars (66 total)
      // File hash: 64 hex chars (with or without 0x)
      if (trimmed.startsWith('0x') && trimmed.length === 66) {
        setHashType('tx');
        setSearchHash(trimmed); // Keep 0x for tx hash
      } else if (trimmed.length === 64) {
        setHashType('file');
        setSearchHash(trimmed);
      } else if (trimmed.startsWith('0x') && trimmed.length === 66) {
        // Could be file hash with 0x prefix
        setHashType('file');
        setSearchHash(trimmed.slice(2));
      } else {
        alert('Invalid hash format. Please enter a valid file hash (64 chars) or transaction hash (0x + 64 chars)');
        return;
      }
    }
  };


  // Smooth scroll to result section whenever a new search is triggered
  useEffect(() => {
    if (searchHash && resultRef.current) {
      const el = resultRef.current;
      const headerOffset = 64; // approx h-16 sticky header
      const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [searchHash]);

  return (
    <Layout>
      <section className="relative overflow-hidden px-6 bg-background min-h-screen flex items-start md:items-center py-16">
        {/* Decorative background shapes (same style direction as Hero) */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 opacity-70 [background:radial-gradient(60%_60%_at_50%_30%,theme(colors.primary/10),transparent_70%)]" />
          <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-primary/20 via-blue-400/15 to-purple-400/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-purple-500/20 via-fuchsia-400/15 to-primary/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(0,0,0,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.5)_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>

        <div className="container mx-auto px-6 w-full">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-gradient-primary">
              Xác minh chứng chỉ
            </h1>
            {/* Verified circular badge */}
            <span className="inline-flex items-center justify-center self-center translate-y-[2px]">
              <svg width="46" height="46" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="">
                <defs>
                  <linearGradient id="badgeBlue" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="var(--primary)"/>
                    <stop offset="100%" stop-color="oklch(0.48 0.19 258)"/>
                  </linearGradient>
                </defs>
                <circle cx="22" cy="22" r="20" fill="url(#badgeBlue)" />
                <path d="M15.5 22.5l4.5 4.5L28.5 18.5" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
          <div className="mx-auto mt-3 h-1 w-28 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500" />
          <p className="mt-4 text-base md:text-lg">
            Nhập transaction hash hoặc file hash để xác minh chứng chỉ
          </p>
        </div>

        {/* Verification Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleVerify} className="space-y-4 bg-background/50 supports-[backdrop-filter]:bg-background/30 backdrop-blur-md border border-border/40 rounded-2xl p-6 shadow-lg">
            {/* Search bar */}
            <div className="relative">
              <div className="flex items-center gap-2 rounded-full border border-border/50 bg-background/60 supports-[backdrop-filter]:bg-background/40 backdrop-blur-md shadow-sm px-3 py-1">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Nhập transaction hash (0x...) hoặc file hash"
                  value={hash}
                  onChange={(e) => setHash(e.target.value)}
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus:outline-none h-12 px-2"
                  required
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-10 rounded-full px-4 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Search className="h-4 w-4 mr-2" />
                  {isLoading ? 'Đang xác minh...' : 'Tìm' }
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground text-center">
                💡 Transaction hash: 0x... (66 ký tự) | File hash: 64 ký tự hex
              </p>
              {hashType !== 'auto' && (
                <p className="mt-1 text-xs text-blue-600 text-center">
                  🔍 Đang tìm kiếm theo: {hashType === 'tx' ? 'Transaction Hash' : 'File Hash'}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Verification Result Section (full viewport height) */}
        {searchHash && (
          <section ref={resultRef} id="verify-result" className="w-full min-h-screen flex items-start md:items-center scroll-mt-20 py-12">
            <div className="w-full">
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Đang xác minh chứng chỉ...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12 max-w-2xl mx-auto">
                <div className="text-red-600 mb-4">
                  <p className="text-lg font-semibold">Lỗi xác minh</p>
                  <p className="text-sm">Không thể xác minh chứng chỉ. Vui lòng kiểm tra lại hash.</p>
                </div>
                <Button onClick={() => setSearchHash('')} variant="outline" className="transition-transform hover:scale-105 active:scale-95">
                  Thử lại
                </Button>
              </div>
            )}

            {verifyResult && !isLoading && !error && (
              <div className="max-w-6xl mx-auto">
                <VerifyResult data={verifyResult} hash={searchHash} />
              </div>
            )}
            </div>
          </section>
        )}

        {/* Instructions */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <h3 className="text-lg font-semibold mb-4">Hướng dẫn sử dụng</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. <strong>Transaction Hash</strong>: Dùng mã giao dịch (0x...) sau khi đăng ký on-chain</p>
            <p>2. <strong>File Hash</strong>: Dùng mã hash của file PDF chứng chỉ</p>
            <p>3. Dán hash vào ô tìm kiếm và nhấn Tìm</p>
            <p>4. Kết quả sẽ hiển thị thông tin chi tiết và trạng thái xác thực</p>
          </div>
        </div>
        </div>
      </section>
    </Layout>
  );
}
