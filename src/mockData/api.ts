import { Certificate, CreateCertificateRequest, VerifyResult } from '@/src/types/certificate';
import { mockCertificates } from './certificates';
import { mockVerifyResults } from './verifyResults';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate 5% error rate
const shouldFail = () => Math.random() < 0.05;

export const mockApi = {
  certificates: {
    create: async (data: CreateCertificateRequest): Promise<Certificate> => {
      await delay(1000 + Math.random() * 2000); // 1-3 seconds
      
      if (shouldFail()) {
        throw new Error('Failed to create certificate');
      }

      const newCertificate: Certificate = {
        id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        studentName: data.studentName,
        studentId: data.studentId,
        courseName: data.courseName,
        fileHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        ipfsHash: `Qm${Math.random().toString(16).substr(2, 64)}`,
        issuer: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        issuedAt: new Date(),
        status: 'pending',
        isVerified: false,
      };

      return newCertificate;
    },

    getAll: async (): Promise<Certificate[]> => {
      await delay(500 + Math.random() * 1000); // 0.5-1.5 seconds
      
      if (shouldFail()) {
        throw new Error('Failed to fetch certificates');
      }

      return mockCertificates;
    },

    getById: async (id: string): Promise<Certificate> => {
      await delay(300 + Math.random() * 700); // 0.3-1 seconds
      
      if (shouldFail()) {
        throw new Error('Failed to fetch certificate');
      }

      const certificate = mockCertificates.find(cert => cert.id === id);
      if (!certificate) {
        throw new Error('Certificate not found');
      }

      return certificate;
    },

    register: async (certificateId: string): Promise<Certificate> => {
      await delay(2000 + Math.random() * 3000); // 2-5 seconds (blockchain simulation)
      
      if (shouldFail()) {
        throw new Error('Failed to register certificate on blockchain');
      }

      const certificate = mockCertificates.find(cert => cert.id === certificateId);
      if (!certificate) {
        throw new Error('Certificate not found');
      }

      const updatedCertificate: Certificate = {
        ...certificate,
        status: 'verified',
        isVerified: true,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      };

      return updatedCertificate;
    },
  },

  verify: {
    verify: async (hash: string): Promise<VerifyResult> => {
      await delay(800 + Math.random() * 1200); // 0.8-2 seconds
      
      if (shouldFail()) {
        throw new Error('Failed to verify certificate');
      }

      return mockVerifyResults[hash] || { verified: false };
    },
  },
};
