import { create } from 'zustand';

interface UIState {
  walletConnected: boolean;
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
  verificationResult: any;
  userRole: 'issuer' | 'holder' | 'verifier' | null;
  
  setWalletConnected: (connected: boolean) => void;
  setUploadStatus: (status: 'idle' | 'uploading' | 'success' | 'error') => void;
  setVerificationResult: (result: any) => void;
  setUserRole: (role: 'issuer' | 'holder' | 'verifier' | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  walletConnected: false,
  uploadStatus: 'idle',
  verificationResult: null,
  userRole: null,
  
  setWalletConnected: (connected) => set({ walletConnected: connected }),
  setUploadStatus: (status) => set({ uploadStatus: status }),
  setVerificationResult: (result) => set({ verificationResult: result }),
  setUserRole: (role) => set({ userRole: role }),
}));
