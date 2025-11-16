'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Certificate } from '@/src/types/certificate';
import { CheckCircle, Clock, GraduationCap, TrendingUp, ArrowUpRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface StatisticsCardsProps {
  certificates: Certificate[];
  className?: string;
}

export function StatisticsCards({ certificates, className = "" }: StatisticsCardsProps) {
  const totalCertificates = certificates.length;
  const verifiedCertificates = certificates.filter(c => c.status === 'verified').length;
  const pendingCertificates = certificates.filter(c => c.status === 'pending').length;
  const verificationRate = totalCertificates > 0 ? (verifiedCertificates / totalCertificates * 100).toFixed(1) : '0';
  const verificationRateNum = parseFloat(verificationRate);

  const stats = [
    {
      title: 'Tổng chứng chỉ',
      value: totalCertificates,
      icon: GraduationCap,
      description: 'Đã phát hành',
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      iconBg: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800',
      shadowColor: 'shadow-blue-500/10',
      progressColor: 'bg-blue-500',
      progressBg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Đã xác thực',
      value: verifiedCertificates,
      icon: CheckCircle,
      description: 'Trên blockchain',
      gradient: 'from-emerald-500 via-green-500 to-teal-600',
      iconBg: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      shadowColor: 'shadow-emerald-500/10',
      progressColor: 'bg-emerald-500',
      progressBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      progress: totalCertificates > 0 ? (verifiedCertificates / totalCertificates) * 100 : 0,
    },
    {
      title: 'Đang xử lý',
      value: pendingCertificates,
      icon: Clock,
      description: 'Đang tải lên',
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      iconBg: 'bg-gradient-to-br from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      borderColor: 'border-amber-200 dark:border-amber-800',
      shadowColor: 'shadow-amber-500/10',
      progressColor: 'bg-amber-500',
      progressBg: 'bg-amber-100 dark:bg-amber-900/30',
      progress: totalCertificates > 0 ? (pendingCertificates / totalCertificates) * 100 : 0,
    },
    {
      title: 'Tỷ lệ xác thực',
      value: `${verificationRate}%`,
      icon: TrendingUp,
      description: 'Thành công',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      iconBg: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-200 dark:border-purple-800',
      shadowColor: 'shadow-purple-500/10',
      progressColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
      progressBg: 'bg-purple-100 dark:bg-purple-900/30',
      progress: verificationRateNum,
      showProgress: true,
    }
  ];

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            className={cn(
              "group relative overflow-hidden transition-all duration-300",
              "hover:shadow-xl hover:-translate-y-1",
              "border-2",
              stat.borderColor,
              stat.shadowColor,
              "bg-gradient-to-br from-white to-gray-50/50",
              "dark:from-gray-900 dark:to-gray-800/50",
              "backdrop-blur-sm"
            )}
          >
            {/* Gradient overlay on hover */}
            <div 
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300",
                stat.gradient
              )}
            />
            
            {/* Decorative corner accent */}
            <div 
              className={cn(
                "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 blur-2xl",
                stat.gradient
              )}
            />

            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3 relative z-10">
              <div className="space-y-1">
                <CardTitle className="text-sm font-semibold text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </div>
              <div className={cn(
                "relative w-12 h-12 rounded-xl flex items-center justify-center",
                "transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                stat.iconBg,
                "border border-white/20 dark:border-white/10",
                "shadow-lg"
              )}>
                <Icon className={cn("h-5 w-5", stat.iconColor)} />
              </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-3">
              <div className="flex items-baseline gap-2">
                <div className={cn(
                  "text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                  stat.gradient
                )}>
                  {stat.value}
                </div>
                {stat.showProgress && (
                  <ArrowUpRight className={cn("h-4 w-4", stat.iconColor)} />
                )}
              </div>
              
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  {stat.description}
                </p>
                
                {/* Progress bar for percentage-based stats */}
                {stat.progress !== undefined && (
                  <div className="space-y-1">
                    <div className={cn(
                      "h-2 rounded-full overflow-hidden",
                      stat.progressBg
                    )}>
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500 ease-out",
                          stat.progressColor,
                          "shadow-sm"
                        )}
                        style={{ width: `${Math.min(stat.progress, 100)}%` }}
                      />
                    </div>
                    {stat.showProgress && (
                      <p className="text-xs text-muted-foreground">
                        {verificationRateNum >= 80 ? 'Xuất sắc' : 
                         verificationRateNum >= 60 ? 'Tốt' : 
                         verificationRateNum >= 40 ? 'Khá' : 'Cần cải thiện'}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>

            {/* Shine effect on hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none">
              <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
