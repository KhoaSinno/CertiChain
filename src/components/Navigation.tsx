'use client';

import { useAuth } from '@/src/hooks/useAuth';
import { cn } from '@/src/lib/utils';
import { Home, LayoutDashboard, PlusCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();
  const { roleContext } = useAuth();

  const allNavigation = [
    { name: 'Trang chủ', href: '/', description: 'Giới thiệu hệ thống', roles: ['issuer', 'holder'], icon: Home },
    { name: 'Dashboard', href: '/dashboard', description: 'Quản lý chứng chỉ', roles: ['issuer', 'holder'], icon: LayoutDashboard },
    { name: 'Tạo chứng chỉ', href: '/certificates/create', description: 'Tạo chứng chỉ mới', roles: ['issuer'], icon: PlusCircle },
    { name: 'Xác minh', href: '/verify', description: 'Xác minh chứng chỉ', roles: ['issuer', 'holder'], icon: ShieldCheck },
  ];

  // Always show Home + Verify links (public), filter rest based on role
  const homeLink = allNavigation[0];
  const verifyLink = allNavigation[3]; // Xác minh - always public
  const protectedNavigation = allNavigation.slice(1, 3); // Dashboard, Tạo chứng chỉ
  
  const filteredProtectedNavigation = roleContext 
    ? protectedNavigation.filter(item => item.roles.includes(roleContext.role))
    : [];
  
  const navigation = roleContext 
    ? [homeLink, ...filteredProtectedNavigation, verifyLink]
    : [homeLink, verifyLink]; // Always show home + verify even when not authenticated

  return (
    <nav className={cn('flex space-x-8', className)}>
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`navbar-link ${isActive ? 'active' : ''} flex items-center gap-2`}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
