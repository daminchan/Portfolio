'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';

interface MainLayoutClientProps {
  children: React.ReactNode;
}

// フルスクリーン表示するページ
const FULLSCREEN_PAGES = ['/about'];

export function MainLayoutClient({ children }: MainLayoutClientProps) {
  const pathname = usePathname();
  const isFullscreen = FULLSCREEN_PAGES.includes(pathname);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className={isFullscreen ? '' : 'pt-14'}>
        <div className={isFullscreen ? '' : 'p-4 lg:p-6'}>
          {children}
        </div>
      </main>
    </div>
  );
}
