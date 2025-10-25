import { api } from '@/src/lib/api';
import { mockVerifyResults } from '@/src/mockData/verifyResults';
import { VerifyResult } from '@/src/types/certificate';
import { useQuery } from '@tanstack/react-query';

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
        
        // Return mock verification result from mockVerifyResults
        return mockVerifyResults[hash] || { verified: false, error: 'Certificate not found' };
      }
      
      return api.certificates.verify(hash);
    },
    enabled: !!hash && hash.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
