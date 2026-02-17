/**
 * WorksContent - 制作物ページのメインコンテンツ
 *
 * Stream Deck風カードでカテゴリを表示。
 * 左メニューでカテゴリ切り替え、右にカード表示。
 */
'use client';

import { useState, useEffect, useTransition as useReactTransition } from 'react';

import { useRouter } from 'next/navigation';

import { HyperText } from '@/components/ui/hyper-text';
import { useTransition } from '@/components/transition/transition-context';
import { WorksCard } from '@/components/works';

import { CATEGORIES, CATEGORY_DETAILS } from '../constants';
import { WorksCategoryNav } from './works-category-nav';
import { WorksDetails } from './works-details';

export function WorksContent() {
  const { isTransitionComplete } = useTransition();
  const router = useRouter();
  const [, startReactTransition] = useReactTransition();
  const [selectedId, setSelectedId] = useState(CATEGORIES[0].id);
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());

  const currentItem = CATEGORIES.find((c) => c.id === selectedId)!;
  const currentDetails = CATEGORY_DETAILS[selectedId];

  // トランジション完了後にアニメーション開始
  useEffect(() => {
    if (isTransitionComplete) {
      setIsLoaded(true);
    }
  }, [isTransitionComplete]);

  // 順番にアイテムを表示
  useEffect(() => {
    if (!isLoaded) return;

    const items = ['title', ...CATEGORIES.map((c) => c.id), 'details', 'card'];
    items.forEach((item, index) => {
      setTimeout(() => {
        setVisibleItems((prev) => new Set([...prev, item]));
      }, index * 150);
    });
  }, [isLoaded]);

  const handleCategoryChange = (id: string) => {
    if (id === selectedId) return;
    setSelectedId(id);
  };

  const handleCardClick = () => {
    if (!currentItem.href) return;

    // 内部リンク（/で始まる）は内部遷移
    if (currentItem.href.startsWith('/')) {
      startReactTransition(() => {
        router.push(currentItem.href);
      });
    } else {
      window.open(currentItem.href, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* グリッド背景 */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* メインコンテンツ */}
      <div className="relative z-10 flex min-h-screen max-w-6xl mx-auto">
        {/* 左サイドバー */}
        <div className="w-[55%] flex-shrink-0 p-10">
          <h1
            className="text-6xl font-normal tracking-[0.2em] text-card-foreground mb-16"
            style={{
              textShadow: '3px 3px 0px rgba(180, 180, 180, 0.4)',
            }}
          >
            {visibleItems.has('title') && <HyperText>Works</HyperText>}
          </h1>

          <WorksCategoryNav
            categories={CATEGORIES}
            selectedId={selectedId}
            visibleItems={visibleItems}
            onCategoryChange={handleCategoryChange}
          />

          <WorksDetails
            currentItem={currentItem}
            currentDetails={currentDetails}
            selectedId={selectedId}
            visibleItems={visibleItems}
          />
        </div>

        {/* 右コンテンツエリア - カード表示 */}
        <div className="w-[45%] flex items-center justify-center">
          <div
            style={{
              opacity: visibleItems.has('card') ? 1 : 0,
              transform: visibleItems.has('card')
                ? 'translateY(0) scale(1)'
                : 'translateY(20px) scale(0.95)',
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
            }}
          >
            <WorksCard
              key={selectedId}
              item={currentItem}
              onClick={handleCardClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
