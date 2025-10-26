'use client';

import { cn } from '@/src/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Trang chủ', href: '/', description: 'Giới thiệu hệ thống' },
    { name: 'Dashboard', href: '/dashboard', description: 'Quản lý chứng chỉ' },
    { name: 'Tạo chứng chỉ', href: '/certificates/create', description: 'Tạo chứng chỉ mới' },
    { name: 'Xác minh', href: '/verify', description: 'Xác minh chứng chỉ' },
  ];

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
