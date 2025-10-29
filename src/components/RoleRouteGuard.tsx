'use client';

import { useRole } from '@/src/hooks/useRole';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ROLE_DEFAULT_ROUTE: Record<string, string> = {
  issuer: '/dashboard',
  holder: '/dashboard',
};

function isAllowed(pathname: string, role: string) {
  const rules: Array<{ pattern: RegExp; roles: string[] }> = [
    { pattern: /^\/?$/, roles: ['issuer', 'holder'] },
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

export function RoleRouteGuard() {
  const { roleContext, isLoading } = useRole();
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


