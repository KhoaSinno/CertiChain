import { Certificate } from '../types/certificate';

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
    isVerified: true,
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  },
  {
    id: '2',
    studentName: 'Trần Thị Bình',
    studentId: 'SV002',
    courseName: 'Khóa học Web Development',
    fileHash: '0x2345678901bcdef2345678901bcdef2345678901bcdef2345678901bcdef234567',
    ipfsHash: 'QmAbc2345678901bcdef2345678901bcdef2345678901bcdef2345678901bcdef',
    issuer: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    issuedAt: new Date('2024-01-20'),
    status: 'verified',
    isVerified: true,
    transactionHash: '0xbcdef2345678901bcdef2345678901bcdef2345678901bcdef2345678901bcdef'
  },
  {
    id: '3',
    studentName: 'Lê Văn Cường',
    studentId: 'SV003',
    courseName: 'Khóa học Data Science',
    fileHash: '0x3456789012cdef3456789012cdef3456789012cdef3456789012cdef34567890',
    ipfsHash: 'QmDef3456789012cdef3456789012cdef3456789012cdef3456789012cdef3456',
    issuer: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    issuedAt: new Date('2024-01-25'),
    status: 'pending',
    isVerified: false
  },
  {
    id: '4',
    studentName: 'Phạm Thị Dung',
    studentId: 'SV004',
    courseName: 'Khóa học AI & Machine Learning',
    fileHash: '0x4567890123def4567890123def4567890123def4567890123def456789012345',
    ipfsHash: 'QmEfg4567890123def4567890123def4567890123def4567890123def456789012',
    issuer: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    issuedAt: new Date('2024-02-01'),
    status: 'verified',
    isVerified: true,
    transactionHash: '0xcdef4567890123def4567890123def4567890123def4567890123def456789012'
  },
  {
    id: '5',
    studentName: 'Hoàng Văn Em',
    studentId: 'SV005',
    courseName: 'Khóa học Cybersecurity',
    fileHash: '0x5678901234ef5678901234ef5678901234ef5678901234ef5678901234ef567890',
    ipfsHash: 'QmFgh5678901234ef5678901234ef5678901234ef5678901234ef5678901234ef',
    issuer: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    issuedAt: new Date('2024-02-05'),
    status: 'pending',
    isVerified: false
  }
];
