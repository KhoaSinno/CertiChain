import { api } from '@/src/lib/api';
import { useDataStore } from '@/src/state/data';
import { Certificate, CreateCertificateRequest } from '@/src/types/certificate';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRegisterCertificate as useBlockchainRegisterCertificate } from './useBlockchain'; // Alias to avoid conflict

export function useCertificates() {
  const { certificates, setCertificates, searchTerm, filterStatus } = useDataStore();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<Certificate[]>({
    queryKey: ['certificates'],
    queryFn: api.certificates.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Update Zustand store when data changes
  if (data && certificates.length === 0) {
    setCertificates(data);
  }

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch = cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cert.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' ||
                          (filterStatus === 'verified' && cert.isVerified) ||
                          (filterStatus === 'pending' && !cert.isVerified);
    return matchesSearch && matchesStatus;
  });

  return {
    certificates: filteredCertificates,
    allCertificates: certificates, // Return all for statistics
    isLoading,
    error,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['certificates'] }),
  };
}

export function useCertificate(id: string) {
  return useQuery({
    queryKey: ['certificates', id],
    queryFn: () => api.certificates.getById(id),
    enabled: !!id,
  });
}

export function useCreateCertificate() {
  const queryClient = useQueryClient();
  const { /* addCertificate */ } = useDataStore();

  return useMutation({
    mutationFn: (data: CreateCertificateRequest) => {
      // Convert CreateCertificateRequest to FormData
      const formData = new FormData();
      formData.append('studentName', data.studentName);
      formData.append('studentId', data.studentId);
      formData.append('courseName', data.courseName);
      formData.append('file', data.file);
      return api.certificates.create(formData);
    },
    onSuccess: () => {
      // Refresh certificates list; creation response is not a full Certificate entity
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
}

export function useRegisterCertificate() {
  const queryClient = useQueryClient();
  const { updateCertificate } = useDataStore();
  const { registerCertificate: blockchainRegister } = useBlockchainRegisterCertificate();

  return useMutation({
    mutationFn: async ({ certificateId, fileHash, ipfsHash, studentIdHash }: {
      certificateId: string;
      fileHash: `0x${string}`;
      ipfsHash: string;
      studentIdHash: `0x${string}`;
    }) => {
      // First, register on blockchain
      await blockchainRegister(fileHash, ipfsHash, studentIdHash);
      // Then, update backend/mock API
      return api.certificates.register(certificateId);
    },
    onSuccess: (updatedCert) => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      updateCertificate(updatedCert);
    },
  });
}
