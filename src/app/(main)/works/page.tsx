/**
 * Works - 制作物ページ
 *
 * Stream Deck風カードでカテゴリを表示。
 * 左メニューでカテゴリ切り替え、右にカード表示。
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HyperText } from '@/components/ui/hyper-text';
import { useTransition } from '@/components/transition/transition-context';
import { WorksCard, type WorkItem } from '@/components/works';

// カテゴリデータ
const CATEGORIES: WorkItem[] = [
  {
    id: 'youtube',
    icon: 'youtube',
    label: 'YouTube',
    href: 'https://youtube.com/',
  },
  {
    id: 'app',
    icon: 'github',
    label: 'ついっぷ',
    href: 'https://app.twitchclip.jp/',
  },
  {
    id: 'app2',
    icon: 'code',
    label: '勉強アプリ',
    href: '#',
  },
];

// カテゴリ詳細
const CATEGORY_DETAILS: Record<string, string[]> = {
  youtube: [
    '切り抜きチャンネルを運営：登録者数3600人',
    '約二か月で登録者数1000人突破',
    '技術スタック：Premiere Pro / Photoshop',
  ],
  app: [
    'Twitchの好きな配信者のクリップを自動で取得して表示するアプリ',
    '技術スタック：Next.js / TypeScript / Tailwind CSS / shadcn/ui / prisma / supabase / vercel',
    '使用したAPI：Twitch API',
    'Claude Codeを使用してAIバイブコーディング',
  ],
  app2: [
    '現在制作中 & 技術練習中',
    '技術スタック：Turborepo / pnpm / Next.js / React Aria Components / Tailwind v4 / Hono / Turso / Drizzle',
    'Hono OpenAPIでAPIドキュメント自動生成に挑戦中',
    'Claude Codeを使用してAIバイブコーディング',
  ],
};

export default function WorksPage() {
  const { isTransitionComplete } = useTransition();
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

  // カテゴリ切り替え
  const handleCategoryChange = (id: string) => {
    if (id === selectedId) return;
    setSelectedId(id);
  };

  // カードクリック時
  const handleCardClick = () => {
    if (currentItem.href && currentItem.href !== '#') {
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
          {/* タイトル */}
          <h1
            className="text-6xl font-normal tracking-[0.2em] text-gray-700 mb-16"
            style={{
              textShadow: '3px 3px 0px rgba(180, 180, 180, 0.4)',
            }}
          >
            {visibleItems.has('title') && <HyperText>Works</HyperText>}
          </h1>

          {/* メニュー項目 */}
          <nav className="space-y-4">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`flex items-center w-full text-left transition-all duration-300 ${
                  selectedId === category.id
                    ? 'text-gray-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                style={{
                  opacity: visibleItems.has(category.id) ? 1 : 0,
                  transform: visibleItems.has(category.id)
                    ? 'translateX(0)'
                    : 'translateX(-20px)',
                  transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
                }}
              >
                {/* 四角ビュレット */}
                <span
                  className={`w-4 h-4 mr-4 flex-shrink-0 transition-colors ${
                    selectedId === category.id ? 'bg-gray-700' : 'bg-gray-400'
                  }`}
                />
                {/* テキスト + グレーバー */}
                <span className="relative py-3 px-4 flex-grow">
                  <span
                    className={`absolute inset-0 transition-all ${
                      selectedId === category.id
                        ? 'bg-gray-300/60'
                        : 'bg-gray-200/40'
                    }`}
                  />
                  <span className="relative text-xl tracking-widest">
                    {visibleItems.has(category.id) && (
                      <HyperText>{category.label}</HyperText>
                    )}
                  </span>
                </span>
              </button>
            ))}
          </nav>

          {/* 詳細エリア */}
          <div
            className="border-t border-gray-300 pt-8 mt-10"
            style={{
              opacity: visibleItems.has('details') ? 1 : 0,
              transform: visibleItems.has('details')
                ? 'translateY(0)'
                : 'translateY(10px)',
              transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
            }}
          >
            <p className="text-lg text-gray-600 mb-4 tracking-wider">
              {visibleItems.has('details') && (
                <HyperText key={selectedId}>{currentItem.label}</HyperText>
              )}
            </p>
            <div className="space-y-2">
              {currentDetails.map((line, index) => (
                <p
                  key={`${selectedId}-${index}`}
                  className="text-base text-gray-500"
                  style={{
                    opacity: visibleItems.has('details') ? 1 : 0,
                    transition: `opacity 0.3s ease-out ${index * 0.1}s`,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* 戻るリンク */}
          <Link
            href="/"
            className="inline-block mt-10 px-4 py-2 text-base text-gray-500 tracking-wider transition-all hover:bg-gray-200 hover:text-gray-900 hover:font-medium"
            style={{
              opacity: visibleItems.has('details') ? 1 : 0,
              transition: 'opacity 0.5s ease-out 0.3s, background-color 0.2s, color 0.2s',
            }}
          >
            ← TOP に戻る
          </Link>
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
