import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Certificate } from '@/types/certificate';

export function useCertificates() {
  return useQuery({
    queryKey: ['certificates'],
    queryFn: api.certificates.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateCertificate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: FormData) => api.certificates.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
}

export function useRegisterCertificate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (certificateId: string) => api.certificates.register(certificateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
}

export function useCertificateDetail(id: string) {
  return useQuery({
    queryKey: ['certificate', id],
    queryFn: () => api.certificates.getById(id),
    enabled: !!id,
  });
}
