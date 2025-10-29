import { api } from '@/src/lib/api';
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
    queryFn: async (): Promise<VerifyResult> => api.certificates.verify(hash),
    enabled: !!hash && hash.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
