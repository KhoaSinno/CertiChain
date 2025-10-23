import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Certificate } from '@/types/certificate';
import { CheckCircle, Clock, GraduationCap, TrendingUp } from 'lucide-react';

interface StatisticsCardsProps {
  certificates: Certificate[];
  className?: string;
}

export function StatisticsCards({ certificates, className = "" }: StatisticsCardsProps) {
  const totalCertificates = certificates.length;
  const verifiedCertificates = certificates.filter(c => c.status === 'verified').length;
  const pendingCertificates = certificates.filter(c => c.status === 'pending').length;
  const verificationRate = totalCertificates > 0 ? (verifiedCertificates / totalCertificates * 100).toFixed(1) : '0';

  const stats = [
    {
      title: 'Tổng chứng chỉ',
      value: totalCertificates,
      icon: GraduationCap,
      description: 'Đã phát hành',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20'
    },
    {
      title: 'Đã xác thực',
      value: verifiedCertificates,
      icon: CheckCircle,
      description: 'Trên blockchain',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20'
    },
    {
      title: 'Chờ xác thực',
      value: pendingCertificates,
      icon: Clock,
      description: 'Cần đăng ký',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20'
    },
    {
      title: 'Tỷ lệ xác thực',
      value: `${verificationRate}%`,
      icon: TrendingUp,
      description: 'Thành công',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20'
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
