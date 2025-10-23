import { create } from 'zustand';
import { Certificate } from '@/types/certificate';

interface DataState {
  certificates: Certificate[];
  selectedCertificate: Certificate | null;
  searchTerm: string;
  filterStatus: 'all' | 'verified' | 'pending';
  setCertificates: (certs: Certificate[]) => void;
  addCertificate: (cert: Certificate) => void;
  updateCertificate: (cert: Certificate) => void;
  removeCertificate: (id: string) => void;
  setSelectedCertificate: (cert: Certificate | null) => void;
  setSearchTerm: (term: string) => void;
  setFilterStatus: (status: 'all' | 'verified' | 'pending') => void;
  clearData: () => void;
}

export const useDataStore = create<DataState>((set) => ({
  certificates: [],
  selectedCertificate: null,
  searchTerm: '',
  filterStatus: 'all',
  setCertificates: (certs) => set({ certificates: certs }),
  addCertificate: (cert) => set((state) => ({ certificates: [...state.certificates, cert] })),
  updateCertificate: (updatedCert) =>
    set((state) => ({
      certificates: state.certificates.map((cert) =>
        cert.id === updatedCert.id ? updatedCert : cert
      ),
      selectedCertificate:
        state.selectedCertificate?.id === updatedCert.id ? updatedCert : state.selectedCertificate,
    })),
  removeCertificate: (id) =>
    set((state) => ({
      certificates: state.certificates.filter((cert) => cert.id !== id),
      selectedCertificate: state.selectedCertificate?.id === id ? null : state.selectedCertificate,
    })),
  setSelectedCertificate: (cert) => set({ selectedCertificate: cert }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  clearData: () => set({ certificates: [], selectedCertificate: null, searchTerm: '', filterStatus: 'all' }),
}));