'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { TRANSITION } from '@/lib/animations';

const sidebarLinkVariants = cva(
  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'hover:bg-accent',
        active: 'bg-accent text-primary',
      },
      size: {
        sm: 'px-2 py-2 text-xs',
        md: 'px-3 py-2.5 text-sm',
        lg: 'px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface SidebarLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    VariantProps<typeof sidebarLinkVariants> {
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  isCollapsed?: boolean;
  external?: boolean;
}

const SidebarLink = forwardRef<HTMLAnchorElement, SidebarLinkProps>(
  (
    {
      className,
      variant,
      size,
      href,
      icon,
      isActive,
      isCollapsed = false,
      external = false,
      children,
      ...props
    },
    ref
  ) => {
    const linkClasses = cn(
      sidebarLinkVariants({
        variant: isActive ? 'active' : variant,
        size,
      }),
      TRANSITION.base,
      'justify-start',
      className
    );

    const iconClasses = 'shrink-0';

    const textClasses = cn(
      'whitespace-nowrap',
      TRANSITION.sidebarContent,
      isCollapsed ? 'opacity-0 max-w-0 overflow-hidden' : 'opacity-100 max-w-48'
    );

    const externalProps = external
      ? { target: '_blank' as const, rel: 'noopener noreferrer' }
      : {};

    // 外部リンクの場合は<a>、内部リンクは<Link>
    if (external) {
      return (
        <a href={href} className={linkClasses} ref={ref} {...externalProps} {...props}>
          {icon && <span className={iconClasses}>{icon}</span>}
          <span className={textClasses}>{children}</span>
        </a>
      );
    }

    return (
      <Link href={href} className={linkClasses} ref={ref} {...props}>
        {icon && <span className={iconClasses}>{icon}</span>}
        <span className={textClasses}>{children}</span>
      </Link>
    );
  }
);
SidebarLink.displayName = 'SidebarLink';

export { SidebarLink, sidebarLinkVariants };
