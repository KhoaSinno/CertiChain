import { useState } from 'react';
import { useUIStore } from '@/state/ui';

export function useUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { setUploadStatus } = useUIStore();

  const uploadFile = async (file: File): Promise<string> => {
    try {
      setUploadStatus('uploading');
      setUploadError(null);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Upload to backend API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setUploadStatus('success');
      return result.hash;

    } catch (error) {
      setUploadStatus('error');
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      throw error;
    }
  };

  const resetUpload = () => {
    setUploadProgress(0);
    setUploadError(null);
    setUploadStatus('idle');
  };

  return {
    uploadFile,
    uploadProgress,
    uploadError,
    resetUpload,
  };
}
