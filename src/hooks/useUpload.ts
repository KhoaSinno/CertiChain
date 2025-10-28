import { useState } from 'react';

interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function useUpload() {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle'
  });

  const uploadFile = async (file: File): Promise<{ hash: string; ipfsHash: string }> => {
    setUploadProgress({ progress: 0, status: 'uploading' });

    try {
      // Simulate file upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev.progress >= 90) {
            clearInterval(progressInterval);
            return { ...prev, progress: 90 };
          }
          return { ...prev, progress: prev.progress + 10 };
        });
      }, 200);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      
      // Generate mock hash and IPFS hash
      const hash = `0x${Math.random().toString(16).substr(2, 64)}`;
      const ipfsHash = `Qm${Math.random().toString(16).substr(2, 64)}`;

      setUploadProgress({ progress: 100, status: 'success' });

      return { hash, ipfsHash };
    } catch (error) {
      setUploadProgress({ 
        progress: 0, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Upload failed' 
      });
      throw error;
    }
  };

  const resetUpload = () => {
    setUploadProgress({ progress: 0, status: 'idle' });
  };

  return {
    uploadProgress,
    uploadFile,
    resetUpload
  };
}
