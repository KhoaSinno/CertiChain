'use client';

import { Layout } from '@/components/Layout';
import { mockCertificates } from '@/mockData/certificates';

export default function DashboardPage() {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi tất cả chứng chỉ đã phát hành
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Tổng chứng chỉ</h3>
            <p className="text-3xl font-bold text-blue-600">{mockCertificates.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Đã xác thực</h3>
            <p className="text-3xl font-bold text-green-600">
              {mockCertificates.filter(c => c.status === 'verified').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Chờ xác thực</h3>
            <p className="text-3xl font-bold text-orange-600">
              {mockCertificates.filter(c => c.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Tỷ lệ xác thực</h3>
            <p className="text-3xl font-bold text-purple-600">
              {Math.round((mockCertificates.filter(c => c.status === 'verified').length / mockCertificates.length) * 100)}%
            </p>
          </div>
        </div>

        {/* Certificate List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Danh sách chứng chỉ</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockCertificates.map((certificate) => (
                <div key={certificate.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{certificate.studentName}</h3>
                  <p className="text-sm text-gray-600">{certificate.courseName}</p>
                  <p className="text-sm text-gray-500">Mã SV: {certificate.studentId}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      certificate.status === 'verified' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {certificate.status === 'verified' ? 'Đã xác thực' : 'Chờ xác thực'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}