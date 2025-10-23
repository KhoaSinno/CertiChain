import { Certificate } from '@/types/certificate';

export const mockCertificates: Certificate[] = [
  {
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
  {
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
  {
    id: '3',
    studentName: 'Lê Văn Cường',
    studentId: 'SV003',
    courseName: 'Khóa học Smart Contract Development',
    fileHash: '0x3456789012cdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    ipfsHash: 'QmDef3456789012cdef1234567890abcdef1234567890abcdef1234567890',
    issuer: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    issuedAt: new Date('2024-01-25'),
    status: 'pending'
  },
  {
    id: '4',
    studentName: 'Phạm Thị Dung',
    studentId: 'SV004',
    courseName: 'Khóa học DeFi Development',
    fileHash: '0x4567890123def1234567890abcdef1234567890abcdef1234567890abcdef123',
    ipfsHash: 'QmEfg4567890123def1234567890abcdef1234567890abcdef1234567890',
    issuer: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    issuedAt: new Date('2024-02-01'),
    status: 'pending'
  },
  {
    id: '5',
    studentName: 'Hoàng Văn Em',
    studentId: 'SV005',
    courseName: 'Khóa học NFT Development',
    fileHash: '0x5678901234ef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    ipfsHash: 'QmFgh5678901234ef1234567890abcdef1234567890abcdef1234567890',
    issuer: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    issuedAt: new Date('2024-02-05'),
    status: 'verified',
    transactionHash: '0xcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  }
];

export const mockCertificateDetail: Certificate = {
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
};
