'use client';

import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/src/components/ui/dropdown-menu';
import { useAuth } from '@/src/hooks/useAuth';
import { Building2, Cog, LogIn, LogOut, User } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const ROLE_CONFIG = {
  issuer: {
    label: 'Nhà trường',
    icon: Building2,
    color: 'bg-blue-100 text-blue-800',
  },
  holder: {
    label: 'Sinh viên',
    icon: User,
    color: 'bg-green-100 text-green-800',
  },
};

export function UserMenu() {
  const { roleContext, session, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  // Show login button if not authenticated, but NOT on login page
  if (!isAuthenticated && !isLoading && !isLoginPage) {
    return (
      <Button asChild variant="ghost" size="sm">
        <Link href="/login">
          <LogIn className="h-4 w-4 mr-2" />
          Đăng nhập
        </Link>
      </Button>
    );
  }

  // Don't show anything on login page if not authenticated
  if (!isAuthenticated && !isLoading && isLoginPage) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
    );
  }

  // Show menu if authenticated
  if (!roleContext || !session) return null;

  const currentRole = ROLE_CONFIG[roleContext.role];
  const CurrentIcon = currentRole.icon;
  const UserBadge = currentRole.label;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 gap-2 px-3"
        >
          <CurrentIcon className="h-5 w-5" />
          <span className="hidden md:inline font-semibold">
            {session.user.username}
          </span>
          <Badge variant="secondary" className="ml-1 hidden md:inline-flex">
            {UserBadge}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-64" avoidCollisions={true}>
        {/* Account section */}
        <div className="px-3 py-2">
          <p className="text-sm font-semibold text-gradient-primary">Tài khoản</p>
          <p className="text-xs text-muted-foreground truncate">{session.user.username}</p>
        </div>
        <DropdownMenuSeparator />
        
        {/* Role info */}
        <div className="px-3 py-2">
          <p className="text-sm font-semibold text-gradient-primary">Vai trò hiện tại</p>
          <div className="flex items-center gap-2 mt-1">
            <CurrentIcon className="h-4 w-4" />
            <span className="text-sm">{currentRole.label}</span>
            <Badge variant="secondary" className="text-xs ml-auto">
              Đang hoạt động
            </Badge>
          </div>
        </div>
        <DropdownMenuSeparator />
        
        {/* Actions */}
        <DropdownMenuItem className="flex items-center gap-2 p-2.5 font-semibold text-foreground">
          <Cog className="h-4 w-4" />
          Cài đặt
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleLogout}
          className="flex items-center gap-2 p-2.5 font-semibold text-red-600 focus:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

