'use client';

import { usePathname } from 'next/navigation';
import { Home, User, Github, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TRANSITION, LAYOUT } from '@/lib/animations';
import { SidebarLink } from '@/components/ui';
import { SIDEBAR_NAV } from '@/lib/constants';

const iconMap = {
  Home,
  User,
  Github,
  Mail,
} as const;

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] overflow-hidden bg-background',
        TRANSITION.sidebar,
        isOpen ? LAYOUT.sidebar.open : LAYOUT.sidebar.closed
      )}
    >
      <nav className="flex flex-col gap-1 p-2">
        {SIDEBAR_NAV.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = pathname === item.href;
          const isExternal = 'external' in item && item.external;

          return (
            <SidebarLink
              key={item.id}
              href={item.href}
              isActive={isActive}
              isCollapsed={!isOpen}
              external={isExternal}
              icon={<Icon className="h-5 w-5" />}
            >
              {item.label}
            </SidebarLink>
          );
        })}
      </nav>
    </aside>
  );
}
