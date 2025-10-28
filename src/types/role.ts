export type UserRole = 'issuer' | 'holder' | 'verifier';

export interface RolePermissions {
  canCreate: boolean;
  canViewAll: boolean;
  canVerify: boolean;
  canRegisterOnChain: boolean;
  canViewOwn: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  issuer: {
    canCreate: true,
    canViewAll: true,
    canVerify: false,
    canRegisterOnChain: true,
    canViewOwn: false,
  },
  holder: {
    canCreate: false,
    canViewAll: false,
    canVerify: false,
    canRegisterOnChain: false,
    canViewOwn: true,
  },
  verifier: {
    canCreate: false,
    canViewAll: false,
    canVerify: true,
    canRegisterOnChain: false,
    canViewOwn: false,
  },
};

export interface RoleContext {
  role: UserRole;
  permissions: RolePermissions;
  userInfo?: {
    name: string;
    organization?: string;
    walletAddress?: string;
  };
}
