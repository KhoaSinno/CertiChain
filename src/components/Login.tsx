'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Lock, Shield, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Static page - no actual login functionality
    setError('Trang tĩnh - Chức năng đăng nhập sẽ được tích hợp sau');
  };

  return (
    <section className="relative overflow-hidden px-6 bg-background flex items-center justify-center min-h-[calc(100vh-16rem)] py-20">
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

      <div className="container mx-auto px-6 w-full max-w-md relative z-10">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-vietnamese">
            Đăng nhập
          </h1>
          <p className="text-muted-foreground text-vietnamese">
            Hệ thống xác thực chứng chỉ dựa trên blockchain
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-background/60 backdrop-blur-md border-border/50 shadow-lg-primary">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Chào mừng trở lại</CardTitle>
            <CardDescription className="text-center">
              Nhập thông tin tài khoản để tiếp tục
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Tên đăng nhập
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập của bạn"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Mật khẩu
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu của bạn"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold glass-primary text-white hover:opacity-95 shadow-primary hover:shadow-lg-primary transition-all border-0"
                size="lg"
              >
                Đăng nhập
              </Button>
            </form>

            {/* Additional Links */}
            <div className="mt-6 space-y-3">
              <div className="text-center">
                <Link 
                  href="#" 
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Hoặc
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Xác minh chứng chỉ không cần đăng nhập
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link 
            href="/" 
            className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors"
          >
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </section>
  );
}

