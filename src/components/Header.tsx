'use client';

import { RoleSwitcher } from '@/src/components/RoleSwitcher';
import { Button } from '@/src/components/ui/button';
import { useRole } from '@/src/hooks/useRole';
import { GraduationCap, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Header() {
  const { roleContext } = useRole();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const allNavigation = [
    { name: 'Trang chủ', href: '/', roles: ['issuer', 'holder'] },
    { name: 'Dashboard', href: '/dashboard', roles: ['issuer', 'holder'] },
    { name: 'Tạo chứng chỉ', href: '/certificates/create', roles: ['issuer'] },
    { name: 'Xác minh', href: '/verify', roles: ['issuer', 'holder'] },
  ];

  // Filter navigation based on current role
  const navigation = roleContext 
    ? allNavigation.filter(item => item.roles.includes(roleContext.role))
    : allNavigation;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 grid grid-cols-3 h-16 items-center">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">CertiChain</span>
          </Link>
        </div>

        {/* Center: empty to keep right cluster alignment */}
        <div className="hidden md:block" />

        {/* Right: Desktop Navigation + Role switcher icon + mobile menu button */}
        <div className="flex items-center justify-end space-x-6">
          <nav className="hidden md:flex items-center space-x-8 flex-nowrap">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`navbar-link whitespace-nowrap ${isActive ? 'active' : ''}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <RoleSwitcher />
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <nav className="container py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-primary/10 hover:text-primary'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
