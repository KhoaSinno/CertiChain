'use client';

import { useAuth } from '@/src/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ROLE_DEFAULT_ROUTE: Record<string, string> = {
  issuer: '/dashboard',
  holder: '/dashboard',
};

function isAllowed(pathname: string, role: string) {
  const rules: Array<{ pattern: RegExp; roles: string[] }> = [
    { pattern: /^\/?$/, roles: ['issuer', 'holder'] },
    { pattern: /^\/login(\/.*)?$/, roles: ['issuer', 'holder'] }, // Login page is public
    { pattern: /^\/dashboard(\/.*)?$/, roles: ['issuer', 'holder'] },
    { pattern: /^\/certificates\/create(\/.*)?$/, roles: ['issuer'] },
    // Verify is public for all roles/guests, so always allowed
    { pattern: /^\/verify(\/.*)?$/, roles: ['issuer', 'holder'] },
    { pattern: /^\/certificates(\/.*)?$/, roles: ['issuer', 'holder'] },
  ];

  for (const rule of rules) {
    if (rule.pattern.test(pathname)) {
      return rule.roles.includes(role);
    }
  }
  return true;
}

/**
 * Role Route Guard - Navigates users based on their role
 * Note: This is a CLIENT-SIDE guard for UX. Real protection is in middleware.ts
 */
export function RoleRouteGuard() {
  const { roleContext, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !roleContext || !pathname) return;
    if (!isAllowed(pathname, roleContext.role)) {
      const redirectTo = ROLE_DEFAULT_ROUTE[roleContext.role] || '/';
      router.replace(redirectTo);
    }
  }, [isLoading, roleContext, pathname, router]);

  return null;
}


