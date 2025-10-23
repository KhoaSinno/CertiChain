import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { VerifyResult } from '@/types/certificate';

export function useVerify(hash: string) {
  return useQuery<VerifyResult>({
    queryKey: ['verify', hash],
    queryFn: () => api.certificates.verify(hash),
    enabled: !!hash,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
