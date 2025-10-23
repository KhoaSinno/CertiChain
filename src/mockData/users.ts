import { User } from '../types/user';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Trường Đại học Công nghệ',
    email: 'admin@university.edu.vn',
    role: 'issuer',
    walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    organization: 'Trường Đại học Công nghệ',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@email.com',
    role: 'holder',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: 'Công ty ABC',
    email: 'hr@abc.com',
    role: 'verifier',
    walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    organization: 'Công ty ABC',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
];
