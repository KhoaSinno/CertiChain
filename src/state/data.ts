import { Certificate } from '@/types/certificate';
import { create } from 'zustand';

interface DataState {
  certificates: Certificate[];
  selectedCertificate: Certificate | null;
  
  setCertificates: (certificates: Certificate[]) => void;
  addCertificate: (certificate: Certificate) => void;
  updateCertificate: (id: string, updates: Partial<Certificate>) => void;
  setSelectedCertificate: (certificate: Certificate | null) => void;
}

export const useDataStore = create<DataState>((set) => ({
  certificates: [],
  selectedCertificate: null,
  
  setCertificates: (certificates) => set({ certificates }),
  addCertificate: (certificate) => set((state) => ({
    certificates: [...state.certificates, certificate]
  })),
  updateCertificate: (id, updates) => set((state) => ({
    certificates: state.certificates.map(cert => 
      cert.id === id ? { ...cert, ...updates } : cert
    )
  })),
  setSelectedCertificate: (certificate) => set({ selectedCertificate: certificate }),
}));
