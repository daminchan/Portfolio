/**
 * MainContent - メインコンテンツ
 *
 * スプラッシュ画面通過後に表示されるナビゲーション画面。
 * 3D配置されたカードから遷移先を選択する。
 */
'use client';

import { useState, useCallback } from 'react';
import { NavCard } from './nav-card';
import { useTransition } from '@/components/transition';
import type { NavItem, CardPosition } from '@/types';

// ナビゲーション先データ
const NAV_ITEMS: NavItem[] = [
  {
    id: 'works',
    title: 'Works',
    description: '制作物',
    href: '/works',
    characterImage: '/characters/character1.png',
    cardBackground: '/cards/card.jpg',
  },
  {
    id: 'about',
    title: 'About',
    description: '自己紹介',
    href: '/about',
    characterImage: '/characters/placeholder.png',
    cardBackground: '/cards/card3.jpg',
  },
  {
    id: 'contact',
    title: 'Contact',
    description: 'お問い合わせ',
    href: '/contact',
    characterImage: '/characters/placeholder.png',
    cardBackground: '/cards/card2.jpg',
  },
];

export function MainContent() {
  const [frontIndex, setFrontIndex] = useState(0);
  const { startTransition } = useTransition();

  // カードの位置を計算
  const getPosition = useCallback(
    (index: number): CardPosition => {
      const totalCards = NAV_ITEMS.length;
      const relativeIndex = (index - frontIndex + totalCards) % totalCards;

      if (relativeIndex === 0) return 'front';
      if (relativeIndex === 1) return 'backRight';
      return 'backLeft';
    },
    [frontIndex]
  );

  // カード選択時の処理
  const handleSelect = useCallback((index: number) => {
    setFrontIndex(index);
  }, []);

  // ページ遷移トリガー
  const handleNavigate = useCallback(
    (href: string) => {
      // Contact, Aboutページへの遷移はピクセルトランジションを使用
      const pixelPages = ['/contact', '/about'];
      const transitionType = pixelPages.includes(href) ? 'pixel' : 'default';
      startTransition(href, transitionType);
    },
    [startTransition]
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* グリッド背景 */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* カードコンテナ */}
      <div className="relative h-[500px] w-full max-w-4xl">
        {NAV_ITEMS.map((item, index) => {
          const position = getPosition(index);
          return (
            <NavCard
              key={item.id}
              item={item}
              position={position}
              index={index}
              onSelect={() => handleSelect(index)}
              onNavigate={handleNavigate}
              isFront={position === 'front'}
            />
          );
        })}
      </div>

      {/* ナビゲーションヒント */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          クリックしてカードを選択
        </p>
      </div>
    </div>
  );
}
