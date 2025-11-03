import { api } from "@/src/lib/api";
import { useDataStore } from "@/src/state/data";
import { CreateCertificateRequest } from "@/src/types/certificate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useRegisterCertificate as useBlockchainRegisterCertificate } from "./useBlockchain"; // Alias to avoid conflict

export function useCertificates(initialPage = 1, initialLimit = 10) {
  const { searchTerm, filterStatus } = useDataStore();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const { data, isLoading, error } = useQuery({
    queryKey: ["certificates", page, limit],
    queryFn: () => api.certificates.getAll(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Update Zustand store when data changes (only if not using pagination filtering)
  // Since we're using server-side pagination, we rely on data?.data directly
  const currentCertificates = data?.data || [];

  const filteredCertificates = currentCertificates.filter((cert) => {
    const matchesSearch =
      cert.student?.studentName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.student?.studentId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "verified" && cert.status === "verified") ||
      (filterStatus === "pending" && cert.status === "pending");
    return matchesSearch && matchesStatus;
  });

  return {
    certificates: filteredCertificates,
    allCertificates: currentCertificates, // Return all for statistics
    pagination: data?.pagination,
    isLoading,
    error,
    page,
    limit,
    setPage,
    setLimit,
    refetch: () =>
      queryClient.invalidateQueries({ queryKey: ["certificates"] }),
  };
}

export function useCertificate(id: string) {
  return useQuery({
    queryKey: ["certificates", id],
    queryFn: () => api.certificates.getById(id),
    enabled: !!id,
  });
}

export function useCreateCertificate() {
  const queryClient = useQueryClient();
  const {
    /* addCertificate */
  } = useDataStore();

  return useMutation({
    mutationFn: (data: CreateCertificateRequest) => {
      // Convert CreateCertificateRequest to FormData
      const formData = new FormData();
      formData.append("studentName", data.studentName);
      formData.append("studentId", data.studentId);
      formData.append("courseName", data.courseName);
      formData.append("file", data.file);
      return api.certificates.create(formData);
    },
    onSuccess: () => {
      // Refresh certificates list; creation response is not a full Certificate entity
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
    },
  });
}

export function useRegisterCertificate() {
  const queryClient = useQueryClient();
  const { updateCertificate } = useDataStore();
  const { registerCertificate: blockchainRegister } =
    useBlockchainRegisterCertificate();

  return useMutation({
    mutationFn: async ({
      certificateId,
      fileHash,
      ipfsHash,
      studentIdHash,
    }: {
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
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      updateCertificate(updatedCert);
    },
  });
}
