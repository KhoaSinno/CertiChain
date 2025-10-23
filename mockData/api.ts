import { Certificate, CreateCertificateRequest, VerifyResult } from '@/types/certificate';
import { mockCertificates, mockCertificateDetail } from './certificates';
import { getMockVerifyResult } from './verifyResults';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Certificates API
  certificates: {
    getAll: async (): Promise<Certificate[]> => {
      await delay(500);
      return mockCertificates;
    },
    
    getById: async (id: string): Promise<Certificate> => {
      await delay(300);
      const certificate = mockCertificates.find(c => c.id === id);
      if (!certificate) {
        throw new Error('Certificate not found');
      }
      return certificate;
    },
    
    create: async (data: CreateCertificateRequest): Promise<Certificate> => {
      await delay(1000);
      const newCertificate: Certificate = {
        id: (mockCertificates.length + 1).toString(),
        studentName: data.studentName,
        studentId: data.studentId,
        courseName: data.courseName,
        fileHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        ipfsHash: `Qm${Math.random().toString(16).substr(2, 64)}`,
        issuer: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        issuedAt: new Date(),
        status: 'pending'
      };
      mockCertificates.push(newCertificate);
      return newCertificate;
    },
    
    register: async (certificateId: string): Promise<{ transactionHash: string }> => {
      await delay(2000);
      const certificate = mockCertificates.find(c => c.id === certificateId);
      if (certificate) {
        certificate.status = 'verified';
        certificate.transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      }
      return {
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
      };
    }
  },
  
  // Verify API
  verify: {
    verify: async (hash: string): Promise<VerifyResult> => {
      await delay(800);
      return getMockVerifyResult(hash);
    }
  },
  
  // Upload API
  upload: {
    uploadFile: async (file: File): Promise<{ hash: string; ipfsHash: string }> => {
      await delay(1500);
      return {
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        ipfsHash: `Qm${Math.random().toString(16).substr(2, 64)}`
      };
    }
  }
};
