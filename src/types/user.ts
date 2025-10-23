export interface User {
  id: string;
  address: string;
  role: 'issuer' | 'holder' | 'verifier';
  name?: string;
  email?: string;
}

export type UserRole = 'issuer' | 'holder' | 'verifier';
