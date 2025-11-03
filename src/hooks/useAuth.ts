'use client';

import { ROLE_PERMISSIONS, RoleContext, UserRole } from '@/src/types/role';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

/**
 * Custom hook that wraps NextAuth useSession and provides role context
 * Replaces the old useRole hook that used localStorage
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  // Map NextAuth role to UserRole
  const userRole = useMemo(() => {
    if (!session?.user?.role) return null;
    
    // Map ADMIN -> issuer, STUDENT -> holder
    const roleMap: Record<string, UserRole> = {
      ADMIN: 'issuer',
      STUDENT: 'holder',
    };
    
    return roleMap[session.user.role] || null;
  }, [session?.user?.role]);

  // Build role context
  const roleContext = useMemo<RoleContext | null>(() => {
    if (!isAuthenticated || !session?.user || !userRole) {
      return null;
    }

    return {
      role: userRole,
      permissions: ROLE_PERMISSIONS[userRole],
      userInfo: {
        name: session.user.studentId || '',
        organization: session.user.studentId || '',
        walletAddress: undefined, // Add wallet if needed later
      },
    };
  }, [isAuthenticated, session, userRole]);

  return {
    session,
    roleContext,
    isLoading,
    isAuthenticated,
    user: session?.user,
  };
}

