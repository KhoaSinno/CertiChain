import { User } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: '1',
    address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    role: 'issuer',
    name: 'Trường Đại học Công nghệ',
    email: 'admin@university.edu.vn'
  },
  {
    id: '2',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    role: 'holder',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@student.edu.vn'
  },
  {
    id: '3',
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    role: 'verifier',
    name: 'Công ty ABC',
    email: 'hr@abc.com'
  }
];

export const mockCurrentUser: User = {
  id: '1',
  address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  role: 'issuer',
  name: 'Trường Đại học Công nghệ',
  email: 'admin@university.edu.vn'
};
