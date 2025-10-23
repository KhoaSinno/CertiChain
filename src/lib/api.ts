import { mockApi } from '../mockData/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const USE_MOCK_DATA = process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_API_URL;

export const api = {
  // Certificate endpoints
  certificates: {
    create: async (data: FormData) => {
      if (USE_MOCK_DATA) {
        // Convert FormData to CreateCertificateRequest
        const studentName = data.get('studentName') as string;
        const studentId = data.get('studentId') as string;
        const courseName = data.get('courseName') as string;
        const file = data.get('file') as File;
        
        return mockApi.certificates.create({
          studentName,
          studentId,
          courseName,
          file
        });
      }
      
      const response = await fetch(`${API_BASE_URL}/certificates`, {
        method: 'POST',
        body: data,
      });
      return response.json();
    },
    
    getAll: async () => {
      if (USE_MOCK_DATA) {
        return mockApi.certificates.getAll();
      }
      
      const response = await fetch(`${API_BASE_URL}/certificates`);
      return response.json();
    },
    
    getById: async (id: string) => {
      if (USE_MOCK_DATA) {
        return mockApi.certificates.getById(id);
      }
      
      const response = await fetch(`${API_BASE_URL}/certificates/${id}`);
      return response.json();
    },
    
    register: async (certificateId: string) => {
      if (USE_MOCK_DATA) {
        return mockApi.certificates.register(certificateId);
      }
      
      const response = await fetch(`${API_BASE_URL}/certificates/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ certificateId }),
      });
      return response.json();
    },
    
    verify: async (hash: string) => {
      if (USE_MOCK_DATA) {
        return mockApi.verify.verify(hash);
      }
      
      const response = await fetch(`${API_BASE_URL}/certificates/verify?hash=${hash}`);
      return response.json();
    },
  },
};
