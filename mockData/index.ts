// Export all mock data
export * from './certificates';
export * from './verifyResults';
export * from './users';
export * from './api';
export * from './statistics';

// Mock data configuration
export const MOCK_CONFIG = {
  API_DELAY: {
    FAST: 300,
    NORMAL: 800,
    SLOW: 1500
  },
  SUCCESS_RATE: 0.95, // 95% success rate
  ERROR_MESSAGES: {
    NOT_FOUND: 'Không tìm thấy dữ liệu',
    NETWORK_ERROR: 'Lỗi kết nối mạng',
    VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
    UNAUTHORIZED: 'Không có quyền truy cập'
  }
};

// Utility functions for mock data
export const mockUtils = {
  // Generate random hash
  generateHash: (): string => {
    return `0x${Math.random().toString(16).substr(2, 64)}`;
  },
  
  // Generate random IPFS hash
  generateIPFSHash: (): string => {
    return `Qm${Math.random().toString(16).substr(2, 64)}`;
  },
  
  // Generate random transaction hash
  generateTransactionHash: (): string => {
    return `0x${Math.random().toString(16).substr(2, 64)}`;
  },
  
  // Simulate API error
  shouldThrowError: (): boolean => {
    return Math.random() > MOCK_CONFIG.SUCCESS_RATE;
  },
  
  // Get random error message
  getRandomError: (): string => {
    const errors = Object.values(MOCK_CONFIG.ERROR_MESSAGES);
    return errors[Math.floor(Math.random() * errors.length)];
  }
};
