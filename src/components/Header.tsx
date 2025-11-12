'use client';

import { UserMenu } from '@/src/components/UserMenu';
import { Button } from '@/src/components/ui/button';
import { useAuth } from '@/src/hooks/useAuth';
import { GraduationCap, Home, LayoutDashboard, Menu, PlusCircle, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Header() {
  const { roleContext } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const allNavigation = [
    { name: 'Trang chủ', href: '/', roles: ['issuer', 'holder'], icon: Home },
    { name: 'Dashboard', href: '/dashboard', roles: ['issuer', 'holder'], icon: LayoutDashboard },
    { name: 'Tạo chứng chỉ', href: '/certificates/create', roles: ['issuer'], icon: PlusCircle },
    { name: 'Xác minh', href: '/verify', roles: ['issuer', 'holder'], icon: ShieldCheck },
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 md:px-6 flex justify-between h-16 items-center">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">CertiChain</span>
          </Link>
        </div>

        {/* Right: Desktop Navigation + User Menu + Mobile Menu Button */}
        <div className="flex items-center space-x-6">
          {/* Full Navigation for large screens */}
          <nav className="hidden lg:flex items-center space-x-8 flex-nowrap">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`navbar-link whitespace-nowrap flex items-center gap-2 ${isActive ? 'active' : ''}`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Compact Navigation for medium screens (icons only with text on hover) */}
          <nav className="hidden md:flex lg:hidden items-center space-x-2 flex-nowrap">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`navbar-link-compact group relative flex items-center ${isActive ? 'active' : ''}`}
                  title={item.name}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  {/* Text appears on hover as tooltip */}
                  <span className="navbar-text-hover absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-background border rounded-md shadow-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu - always visible on desktop */}
          <div className="hidden md:flex">
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
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
        <div className="md:hidden border-t bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
          <nav className="container px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 flex items-center gap-3 ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-primary/10 hover:text-primary'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
            {/* User Menu in mobile */}
            <div className="border-t pt-3 mt-3">
              <div className="px-3">
                <UserMenu />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
