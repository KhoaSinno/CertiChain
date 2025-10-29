'use client';

import { useRole } from '@/src/hooks/useRole';
import { cn } from '@/src/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();
  const { roleContext } = useRole();

  const allNavigation = [
    { name: 'Trang chủ', href: '/', description: 'Giới thiệu hệ thống', roles: ['issuer', 'holder'] },
    { name: 'Dashboard', href: '/dashboard', description: 'Quản lý chứng chỉ', roles: ['issuer', 'holder'] },
    { name: 'Tạo chứng chỉ', href: '/certificates/create', description: 'Tạo chứng chỉ mới', roles: ['issuer'] },
    { name: 'Xác minh', href: '/verify', description: 'Xác minh chứng chỉ', roles: ['issuer', 'holder'] },
  ];

  // Filter navigation based on current role
  const navigation = roleContext 
    ? allNavigation.filter(item => item.roles.includes(roleContext.role))
    : allNavigation;

  return (
    <nav className={cn('flex space-x-8', className)}>
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`navbar-link ${isActive ? 'active' : ''}`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
