'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { HomeContainer } from '@/components/home';

interface MainLayoutClientProps {
  children: React.ReactNode;
}

// フルスクリーン表示するページ
const FULLSCREEN_PAGES = ['/about', '/works', '/works/web', '/contact'];

export function MainLayoutClient({ children }: MainLayoutClientProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isFullscreen = FULLSCREEN_PAGES.includes(pathname);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ホームコンテンツ（常に存在） */}
      <div
        className="pt-14"
        style={{
          // ホーム以外では下層に配置
          position: isHome ? 'relative' : 'fixed',
          inset: isHome ? undefined : 0,
          zIndex: isHome ? undefined : 1,
          paddingTop: isHome ? undefined : '3.5rem',
        }}
      >
        <div className="p-4 lg:p-6">
          <HomeContainer />
        </div>
      </div>

      {/* 遷移先コンテンツ（オーバーレイ） */}
      {!isHome && (
        <main
          className="page-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10,
            overflow: 'auto',
          }}
        >
          <div className={`pt-14 ${isFullscreen ? '' : 'p-4 lg:p-6'}`}>
            {children}
          </div>
        </main>
      )}
    </div>
  );
}
