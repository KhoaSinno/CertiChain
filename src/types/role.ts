export type UserRole = 'issuer' | 'holder';

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
