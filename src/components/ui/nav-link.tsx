'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const navLinkVariants = cva(
  'flex items-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      variant: {
        default: 'hover:bg-accent',
        active: 'bg-accent text-primary',
      },
      size: {
        sm: 'gap-3 rounded-md px-2 py-1.5 text-xs',
        md: 'gap-4 rounded-lg px-3 py-2 text-sm',
        lg: 'gap-4 rounded-lg px-4 py-3 text-base',
      },
      layout: {
        horizontal: 'flex-row',
        vertical: 'flex-col gap-1 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      layout: 'horizontal',
    },
  }
);

interface NavLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    VariantProps<typeof navLinkVariants> {
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, variant, size, layout, href, icon, isActive, children, ...props }, ref) => {
    return (
      <Link
        href={href}
        className={cn(
          navLinkVariants({
            variant: isActive ? 'active' : variant,
            size,
            layout,
            className,
          })
        )}
        ref={ref}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </Link>
    );
  }
);
NavLink.displayName = 'NavLink';

export { NavLink, navLinkVariants };
