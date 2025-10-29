'use client';

import { Layout } from '@/src/components/Layout';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { VerifyResult } from '@/src/components/VerifyResult';
import { useVerifyCertificate } from '@/src/hooks/useVerify';
import { Hash, Search } from 'lucide-react';
import { useState } from 'react';

export default function VerifyPage() {
  const [hash, setHash] = useState('');
  const [searchHash, setSearchHash] = useState('');
  
  const { data: verifyResult, isLoading, error } = useVerifyCertificate(searchHash);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = hash.trim();
    if (trimmed) {
      // Normalize: strip leading 0x if present to match DB format
      const normalized = trimmed.startsWith('0x') ? trimmed.slice(2) : trimmed;
      setSearchHash(normalized);
    }
  };

  // Remove debug logs in production

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Xác minh chứng chỉ</h1>
          <p className="text-muted-foreground">
            Nhập hash của chứng chỉ để xác minh tính hợp lệ
          </p>
        </div>

        {/* Verification Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Nhập file hash (64 hex, không 0x)"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                className="pl-10"
                required
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Gợi ý: Dán đúng chuỗi 64 ký tự hex. Nếu có tiền tố 0x, hệ thống sẽ tự bỏ.
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Search className="h-4 w-4 mr-2" />
              {isLoading ? 'Đang xác minh...' : 'Xác minh chứng chỉ'}
            </Button>
          </form>
        </div>

        {/* Verification Result */}
        {searchHash && (
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
        )}

        {/* Instructions */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <h3 className="text-lg font-semibold mb-4">Hướng dẫn sử dụng</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. Nhập hash của chứng chỉ vào ô trên</p>
            <p>2. Hash có 64 ký tự hex; nếu có tiền tố 0x sẽ tự bỏ</p>
            <p>3. Nhấn Xác minh chứng chỉ để kiểm tra</p>
            <p>4. Kết quả sẽ hiển thị thông tin chi tiết về chứng chỉ</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
