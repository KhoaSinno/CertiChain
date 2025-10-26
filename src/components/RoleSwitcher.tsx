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
import {
    Building2,
    ChevronDown,
    Shield,
    User
} from 'lucide-react';

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
  verifier: {
    label: 'Nhà tuyển dụng',
    icon: Shield,
    description: 'Xác minh chứng chỉ',
    color: 'bg-purple-100 text-purple-800',
  },
};

export function RoleSwitcher() {
  const { roleContext, switchRole } = useRole();

  if (!roleContext) return null;

  const currentRole = ROLE_CONFIG[roleContext.role];
  const Icon = currentRole.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{currentRole.label}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 dropdown-glass">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">Chuyển đổi vai trò</p>
          <p className="text-xs text-muted-foreground">
            Chọn vai trò để xem giao diện phù hợp
          </p>
        </div>
        <DropdownMenuSeparator />
        
        {Object.entries(ROLE_CONFIG).map(([role, config]) => {
          const RoleIcon = config.icon;
          const isActive = role === roleContext.role;
          
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => switchRole(role as UserRole)}
              className="flex items-center gap-3 p-3"
            >
              <div className={`p-2 rounded-md ${config.color}`}>
                <RoleIcon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{config.label}</p>
                  {isActive && (
                    <Badge variant="secondary" className="text-xs">
                      Hiện tại
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {config.description}
                </p>
              </div>
            </DropdownMenuItem>
          );
        })}
        
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <p className="text-xs text-muted-foreground">
            💡 Tip: Chuyển đổi role để trải nghiệm các tính năng khác nhau
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
