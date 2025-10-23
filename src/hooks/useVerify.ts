import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { VerifyResult } from '../types/certificate';

// Query keys
export const verifyKeys = {
  all: ['verify'] as const,
  verify: (hash: string) => [...verifyKeys.all, 'verify', hash] as const,
};

export function useVerifyCertificate(hash: string) {
  return useQuery({
    queryKey: verifyKeys.verify(hash),
    queryFn: async (): Promise<VerifyResult> => {
      // Use mock data in development
      if (process.env.NODE_ENV === 'development') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Return mock verification result
        const mockResults = {
          '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef': {
            verified: true,
            certificate: {
              id: '1',
              studentName: 'Nguyễn Văn An',
              studentId: 'SV001',
              courseName: 'Khóa học Blockchain Development',
              fileHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
              ipfsHash: 'QmXyz1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
              issuer: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
              issuedAt: new Date('2024-01-15'),
              status: 'verified' as const,
              transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
            },
            issuer: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
            issuedAt: new Date('2024-01-15'),
            transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
          }
        };

        return mockResults[hash as keyof typeof mockResults] || { verified: false };
      }
      
      return api.certificates.verify(hash);
    },
    enabled: !!hash && hash.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
