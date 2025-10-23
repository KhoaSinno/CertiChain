import { Certificate } from '@/types/certificate';
import { create } from 'zustand';

interface DataState {
  // Certificate data
  certList: Certificate[];
  selectedCertificate: Certificate | null;
  
  // Actions
  setCertificates: (certificates: Certificate[]) => void;
  addCertificate: (certificate: Certificate) => void;
  updateCertificate: (id: string, updates: Partial<Certificate>) => void;
  setSelectedCertificate: (certificate: Certificate | null) => void;
  
  // Filters and search
  searchTerm: string;
  filterStatus: 'all' | 'verified' | 'pending';
  setSearchTerm: (term: string) => void;
  setFilterStatus: (status: 'all' | 'verified' | 'pending') => void;
  
  // Clear all data
  clearData: () => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  // Initial state
  certList: [],
  selectedCertificate: null,
  searchTerm: '',
  filterStatus: 'all',
  
  // Actions
  setCertificates: (certificates) => {
    set({ certList: certificates });
  },
  
  addCertificate: (certificate) => {
    set((state) => ({
      certList: [...state.certList, certificate]
    }));
  },
  
  updateCertificate: (id, updates) => {
    set((state) => ({
      certList: state.certList.map(cert => 
        cert.id === id ? { ...cert, ...updates } : cert
      ),
      selectedCertificate: state.selectedCertificate?.id === id 
        ? { ...state.selectedCertificate, ...updates }
        : state.selectedCertificate
    }));
  },
  
  setSelectedCertificate: (certificate) => {
    set({ selectedCertificate: certificate });
  },
  
  setSearchTerm: (term) => {
    set({ searchTerm: term });
  },
  
  setFilterStatus: (status) => {
    set({ filterStatus: status });
  },
  
  clearData: () => {
    set({
      certList: [],
      selectedCertificate: null,
      searchTerm: '',
      filterStatus: 'all'
    });
  }
}));