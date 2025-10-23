const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = {
  // Certificate endpoints
  certificates: {
    create: async (data: FormData) => {
      const response = await fetch(`${API_BASE_URL}/certificates`, {
        method: 'POST',
        body: data,
      });
      return response.json();
    },
    
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/certificates`);
      return response.json();
    },
    
    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/certificates/${id}`);
      return response.json();
    },
    
    register: async (certificateId: string) => {
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
      const response = await fetch(`${API_BASE_URL}/certificates/verify?hash=${hash}`);
      return response.json();
    },
  },
};
