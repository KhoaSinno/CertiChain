import { VerifyResult } from '@/types/certificate';

export const mockVerifyResults: Record<string, VerifyResult> = {
  '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef': {
    verified: true,
    certificate: {
      id: '1',
      studentName: 'Nguyễn Văn An',
      studentId: 'SV001',
      courseName: 'Khóa học Blockchain Development',
      fileHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      ipfsHash: 'QmXyz1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      issuer: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      issuedAt: new Date('2024-01-15'),
      status: 'verified',
      transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
    },
    issuer: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    issuedAt: new Date('2024-01-15'),
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  },
  '0x2345678901bcdef1234567890abcdef1234567890abcdef1234567890abcdef1': {
    verified: true,
    certificate: {
      id: '2',
      studentName: 'Trần Thị Bình',
      studentId: 'SV002',
      courseName: 'Khóa học Web3 Development',
      fileHash: '0x2345678901bcdef1234567890abcdef1234567890abcdef1234567890abcdef1',
      ipfsHash: 'QmAbc2345678901bcdef1234567890abcdef1234567890abcdef1234567890',
      issuer: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      issuedAt: new Date('2024-01-20'),
      status: 'verified',
      transactionHash: '0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
    },
    issuer: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    issuedAt: new Date('2024-01-20'),
    transactionHash: '0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  },
  '0xinvalidhash1234567890abcdef1234567890abcdef1234567890abcdef1234567890': {
    verified: false
  }
};

export const getMockVerifyResult = (hash: string): VerifyResult => {
  return mockVerifyResults[hash] || { verified: false };
};
