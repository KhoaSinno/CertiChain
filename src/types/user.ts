export interface User {
  id: string;
  name: string;
  email: string;
  role: 'issuer' | 'holder' | 'verifier';
  walletAddress?: string;
  organization?: string;
  createdAt: Date;
  updatedAt: Date;
}