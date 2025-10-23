export const mockStatistics = {
  totalCertificates: 156,
  verifiedCertificates: 142,
  pendingCertificates: 14,
  totalStudents: 89,
  totalCourses: 12,
  thisMonthCertificates: 23,
  lastMonthCertificates: 18,
  verificationRate: 91.0,
  averageProcessingTime: 2.5, // hours
  popularCourses: [
    { name: 'Blockchain Development', count: 45 },
    { name: 'Web3 Development', count: 38 },
    { name: 'Smart Contract Development', count: 32 },
    { name: 'DeFi Development', count: 28 },
    { name: 'NFT Development', count: 13 }
  ],
  monthlyTrend: [
    { month: 'Jan', certificates: 15 },
    { month: 'Feb', certificates: 18 },
    { month: 'Mar', certificates: 22 },
    { month: 'Apr', certificates: 25 },
    { month: 'May', certificates: 28 },
    { month: 'Jun', certificates: 23 }
  ],
  issuerStats: {
    totalIssuers: 5,
    activeIssuers: 4,
    topIssuer: {
      name: 'Trường Đại học Công nghệ',
      certificates: 89
    }
  }
};
