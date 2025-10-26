'use client';

import { ROLE_PERMISSIONS, RoleContext, UserRole } from '@/src/types/role';
import { useEffect, useState } from 'react';

// Mock function - trong thực tế sẽ lấy từ authentication context
const getCurrentUserRole = (): UserRole => {
  // Tạm thời return 'issuer' - trong thực tế sẽ lấy từ auth context
  const savedRole = localStorage.getItem('userRole') as UserRole;
  return savedRole || 'issuer';
};

const getCurrentUserInfo = () => {
  // Mock user info - trong thực tế sẽ lấy từ auth context
  return {
    name: 'Trường Đại học ABC',
    organization: 'Đại học ABC',
    walletAddress: '0x1234...5678',
  };
};

export function useRole() {
  const [roleContext, setRoleContext] = useState<RoleContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = getCurrentUserRole();
    const userInfo = getCurrentUserInfo();
    const permissions = ROLE_PERMISSIONS[role];

    setRoleContext({
      role,
      permissions,
      userInfo,
    });
    setIsLoading(false);
  }, []);

  // Listen for storage changes to sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userRole' && e.newValue) {
        const newRole = e.newValue as UserRole;
        const userInfo = getCurrentUserInfo();
        const permissions = ROLE_PERMISSIONS[newRole];

        setRoleContext({
          role: newRole,
          permissions,
          userInfo,
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const switchRole = (newRole: UserRole) => {
    localStorage.setItem('userRole', newRole);
    const userInfo = getCurrentUserInfo();
    const permissions = ROLE_PERMISSIONS[newRole];

    setRoleContext({
      role: newRole,
      permissions,
      userInfo,
    });

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('roleChanged', { detail: newRole }));
  };

  return {
    roleContext,
    isLoading,
    switchRole,
  };
}
