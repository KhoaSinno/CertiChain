import { api } from '@/lib/api';
import { Certificate, CreateCertificateRequest } from '@/types/certificate';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockCertificates } from '../../mockData/certificates';

// Query keys
export const certificateKeys = {
  all: ['certificates'] as const,
  lists: () => [...certificateKeys.all, 'list'] as const,
  list: (filters: string) => [...certificateKeys.lists(), { filters }] as const,
  details: () => [...certificateKeys.all, 'detail'] as const,
  detail: (id: string) => [...certificateKeys.details(), id] as const,
};

// Get all certificates
export function useCertificates() {
  return useQuery({
    queryKey: certificateKeys.lists(),
    queryFn: async (): Promise<Certificate[]> => {
      // Use mock data in development
      if (process.env.NODE_ENV === 'development') {
        return mockCertificates;
      }
      return api.certificates.getAll();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get certificate by ID
export function useCertificate(id: string) {
  return useQuery({
    queryKey: certificateKeys.detail(id),
    queryFn: async (): Promise<Certificate> => {
      // Use mock data in development
      if (process.env.NODE_ENV === 'development') {
        const certificate = mockCertificates.find(c => c.id === id);
        if (!certificate) {
          throw new Error('Certificate not found');
        }
        return certificate;
      }
      return api.certificates.getById(id);
    },
    enabled: !!id,
  });
}

// Create certificate
export function useCreateCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCertificateRequest): Promise<Certificate> => {
      // Convert to FormData for API
      const formData = new FormData();
      formData.append('studentName', data.studentName);
      formData.append('studentId', data.studentId);
      formData.append('courseName', data.courseName);
      formData.append('file', data.file);

      return api.certificates.create(formData);
    },
    onSuccess: (newCertificate) => {
      // Invalidate and refetch certificates list
      queryClient.invalidateQueries({ queryKey: certificateKeys.lists() });
      
      // Add to cache
      queryClient.setQueryData(certificateKeys.detail(newCertificate.id), newCertificate);
    },
  });
}

// Register certificate on blockchain
export function useRegisterCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (certificateId: string): Promise<{ transactionHash: string }> => {
      return api.certificates.register(certificateId);
    },
    onSuccess: (data, certificateId) => {
      // Update certificate in cache
      queryClient.setQueryData(
        certificateKeys.detail(certificateId),
        (old: Certificate | undefined) => {
          if (old) {
            return {
              ...old,
              status: 'verified' as const,
              transactionHash: data.transactionHash,
            };
          }
          return old;
        }
      );

      // Invalidate certificates list to refetch
      queryClient.invalidateQueries({ queryKey: certificateKeys.lists() });
    },
  });
}

// Verify certificate
export function useVerifyCertificate() {
  return useMutation({
    mutationFn: async (hash: string) => {
      return api.certificates.verify(hash);
    },
  });
}