export interface User {
  id: string;
  name: string;
  email: string;
  role: 'issuer' | 'holder';
  walletAddress?: string;
  organization?: string;
  createdAt: Date;
  updatedAt: Date;
}