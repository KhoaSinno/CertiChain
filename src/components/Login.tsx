'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { ArrowLeft, Lock, Mail, Shield, User } from 'lucide-react';
import { useState } from 'react';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Static page - no actual login functionality
    setError(isForgotPassword 
      ? 'Trang tĩnh - Chức năng đặt lại mật khẩu sẽ được tích hợp sau' 
      : 'Trang tĩnh - Chức năng đăng nhập sẽ được tích hợp sau');
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsForgotPassword(true);
    setError('');
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setEmail('');
    setError('');
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
        <div className="text-center mb-8 transition-all duration-500">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 text-vietnamese transition-all duration-500 ${
            isForgotPassword ? 'transform scale-95 opacity-90' : ''
          }`}>
            {isForgotPassword ? 'Đặt lại mật khẩu' : 'Đăng nhập'}
          </h1>
          <p className="text-muted-foreground text-vietnamese transition-all duration-500">
            {isForgotPassword 
              ? 'Nhập email của bạn để nhận link đặt lại mật khẩu' 
              : 'Hệ thống xác thực chứng chỉ dựa trên blockchain'}
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-background/60 backdrop-blur-md border-border/50 shadow-lg-primary transition-all duration-500">
          <CardHeader className="transition-all duration-500">
            <CardTitle className="text-2xl text-center transition-all duration-500">
              {isForgotPassword ? 'Đặt lại mật khẩu' : 'Chào mừng trở lại'}
            </CardTitle>
            <CardDescription className="text-center transition-all duration-500">
              {isForgotPassword 
                ? 'Chúng tôi sẽ gửi link đặt lại mật khẩu qua email của bạn' 
                : 'Nhập thông tin tài khoản để tiếp tục'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isForgotPassword ? (
              // Login Form
              <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                {/* Username Field */}
                <div className="space-y-2 transition-all duration-500">
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
                <div className="space-y-2 transition-all duration-500">
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
                  <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20 animate-fade-in">
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
            ) : (
              // Forgot Password Form
              <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                {/* Email Field */}
                <div className="space-y-2 transition-all duration-500">
                  <label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20 animate-fade-in">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold glass-primary text-white hover:opacity-95 shadow-primary hover:shadow-lg-primary transition-all border-0"
                  size="lg"
                >
                  Gửi link đặt lại mật khẩu
                </Button>
              </form>
            )}

            {/* Additional Links */}
            <div className="mt-6 space-y-3 transition-all duration-500">
              {!isForgotPassword && (
                <div className="text-center">
                  <button
                    onClick={handleForgotPassword}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              )}
              
              {!isForgotPassword && (
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
              )}

              {!isForgotPassword && (
                <div className="flex items-center justify-center gap-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Xác minh chứng chỉ không cần đăng nhập
                  </span>
                </div>
              )}

              {isForgotPassword && (
                <div className="text-center">
                  <button
                    onClick={handleBackToLogin}
                    className="text-sm text-primary hover:underline font-medium flex items-center gap-2 mx-auto transition-all duration-200 hover:gap-3"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại đăng nhập
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

