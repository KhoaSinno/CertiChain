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
import { useRole } from '@/src/hooks/useRole';
import { UserRole } from '@/src/types/role';
import { Building2, Cog, LogIn, LogOut, User } from 'lucide-react';

const ROLE_CONFIG = {
  issuer: {
    label: 'Nhà trường',
    icon: Building2,
    description: 'Tạo và quản lý chứng chỉ',
    color: 'bg-blue-100 text-blue-800',
  },
  holder: {
    label: 'Sinh viên',
    icon: User,
    description: 'Xem và chia sẻ chứng chỉ',
    color: 'bg-green-100 text-green-800',
  },
};

export function RoleSwitcher() {
  const { roleContext, switchRole } = useRole();

  if (!roleContext) return null;

  const currentRole = ROLE_CONFIG[roleContext.role];
  const CurrentIcon = currentRole.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-0 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
        >
          <CurrentIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {/* Account section */}
        <div className="px-3 py-2">
          <p className="text-sm font-semibold text-gradient-primary">Tài khoản</p>
        </div>
        <DropdownMenuItem className="flex items-center gap-2 p-2.5 font-semibold text-foreground">
          <LogIn className="h-4 w-4" />
          Đăng nhập
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 p-2.5 font-semibold text-foreground">
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 p-2.5 font-semibold text-foreground">
          <Cog className="h-4 w-4" />
          Cài đặt
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Role section */}
        <div className="px-3 py-2">
          <p className="text-sm font-semibold text-gradient-primary">Chuyển vai trò</p>
        </div>
        {Object.entries(ROLE_CONFIG).map(([role, config]) => {
          const RoleIcon = config.icon;
          const isActive = role === roleContext.role;
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => switchRole(role as UserRole)}
              className="flex items-center gap-2 p-2.5 font-semibold text-foreground"
            >
              <RoleIcon className="h-4 w-4" />
              <span className="flex-1">{config.label}</span>
              {isActive && (
                <Badge variant="secondary" className="text-xs">Hiện tại</Badge>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
