/**
 * Works - 制作物ページ（NieR風UI）
 */
'use client';

import { useState, useEffect, useRef, ViewTransition, startTransition } from 'react';
import Link from 'next/link';
import { HyperText } from '@/components/ui/hyper-text';
import { useTransition } from '@/components/transition/transition-context';
import Image from 'next/image';

// カテゴリデータ
const CATEGORIES = [
  {
    id: 'youtube',
    label: 'YouTube',
    description: [
      '切り抜きチャンネルを運営：登録者数3600人',
      '約二か月で登録者数1000人突破',
      '技術スタック：Premiere Pro / Photoshop ',
    ],
  },
  {
    id: 'app',
    label: 'ついっぷ',
    description: [
      'Twitchの好きな配信者のクリップを自動で取得して表示するアプリ',
      '技術スタック：Next.js / TypeScript / Tailwind CSS / shadcn/ui / prisma / supabase / vercel',
      '使用したAPI：Twitch API',
      'claude.codeでAIバイブコーディング',
      'https://app.twitchclip.jp/',
    ],
  },
  {
    id: 'app2',
    label: '勉強アプリ',
    description: [
      '現在制作中 & 技術練習中',
      '技術スタック：Turborepo / pnpm / Next.js / React Aria Components / Tailwind v4 / Hono / Turso / Drizzle',
      'Hono OpenAPIでAPIドキュメント自動生成に挑戦中',
      'Claude Codeを使用してAIバイブコーディング',
    ],
  },
];

// 仮の制作物データ
const WORKS_DATA = [
  { id: 1, title: '作品1', category: 'youtube', image: '/cards/card.jpg' },
  { id: 2, title: '作品2', category: 'youtube', image: '/cards/test2.jpg' },
  { id: 3, title: 'ついっぷ', category: 'app', image: '/app.png' },
  { id: 4, title: '勉強アプリ', category: 'app2', image: null },
];

export default function WorksPage() {
  const { isTransitionComplete } = useTransition();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);
  const currentCategory = CATEGORIES.find((c) => c.id === selectedCategory);
  const filteredWorks = WORKS_DATA.filter((w) => w.category === selectedCategory);

  // トランジション完了後にアニメーション開始
  useEffect(() => {
    if (isTransitionComplete) {
      setIsLoaded(true);
    }
  }, [isTransitionComplete]);

  // 順番にアイテムを表示
  useEffect(() => {
    if (!isLoaded) return;

    const items = ['title', ...CATEGORIES.map((c) => c.id), 'achievements', 'cards'];
    items.forEach((item, index) => {
      setTimeout(() => {
        setVisibleItems((prev) => new Set([...prev, item]));
      }, index * 200);
    });
  }, [isLoaded]);


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
      <div ref={contentRef} className="relative z-10 flex min-h-screen">
        {/* 左サイドバー - 約35% */}
        <div className="w-[35%] flex-shrink-0 p-10">
          {/* タイトル */}
          <h1
            className="text-6xl font-normal tracking-[0.2em] text-gray-700 mb-16"
            style={{
              textShadow: '3px 3px 0px rgba(180, 180, 180, 0.4)',
            }}
          >
            {visibleItems.has('title') && <HyperText>制作物</HyperText>}
          </h1>

          {/* メニュー項目 */}
          <nav className="space-y-4">
            {CATEGORIES.map((category, index) => (
              <button
                key={category.id}
                onClick={() => startTransition(() => setSelectedCategory(category.id))}
                className={`flex items-center w-full text-left transition-all duration-300 ${
                  selectedCategory === category.id
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
                    selectedCategory === category.id ? 'bg-gray-700' : 'bg-gray-400'
                  }`}
                />
                {/* テキスト + グレーバー */}
                <span className="relative py-3 px-4 flex-grow">
                  <span
                    className={`absolute inset-0 transition-all ${
                      selectedCategory === category.id
                        ? 'bg-gray-300/60'
                        : 'bg-gray-200/40'
                    }`}
                  />
                  <span className="relative text-xl tracking-widest">
                    {visibleItems.has(category.id) && (
                      <HyperText delay={index * 100}>{category.label}</HyperText>
                    )}
                  </span>
                </span>
              </button>
            ))}
          </nav>

          {/* 実績エリア */}
          {currentCategory && (
            <div
              className="border-t border-gray-300 pt-8 mt-10"
              style={{
                opacity: visibleItems.has('achievements') ? 1 : 0,
                transform: visibleItems.has('achievements')
                  ? 'translateY(0)'
                  : 'translateY(10px)',
                transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
              }}
            >
              <p className="text-lg text-gray-600 mb-4 tracking-wider">
                {visibleItems.has('achievements') && (
                  <HyperText key={selectedCategory}>{currentCategory.label}</HyperText>
                )}
              </p>
              <div className="space-y-2">
                {currentCategory.description.map((line, index) => (
                  <p
                    key={index}
                    className="text-base text-gray-500"
                    style={{
                      opacity: visibleItems.has('achievements') ? 1 : 0,
                      transition: `opacity 0.3s ease-out ${index * 0.1}s`,
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* 戻るリンク */}
          <Link
            href="/"
            className="inline-block mt-10 px-4 py-2 text-base text-gray-500 tracking-wider transition-all hover:bg-gray-200 hover:text-gray-900 hover:font-medium"
            style={{
              opacity: visibleItems.has('achievements') ? 1 : 0,
              transition: 'opacity 0.5s ease-out 0.3s, background-color 0.2s, color 0.2s',
            }}
          >
            ← TOP に戻る
          </Link>
        </div>

        {/* 右コンテンツエリア - 約65% */}
        <div className="w-[65%] p-8 flex items-center justify-center">
          {filteredWorks.length > 0 && (
            <ViewTransition>
              <div
                key={selectedCategory}
                className="w-full h-[80%] bg-gray-200 overflow-hidden relative group cursor-pointer shadow-lg"
              >
              {filteredWorks[0].image ? (
                <>
                  {/* 画像 */}
                  <Image
                    src={filteredWorks[0].image}
                    alt={filteredWorks[0].title}
                    fill
                    priority
                    className="object-cover object-left-top"
                  />
                  {/* オーバーレイ */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  {/* タイトル */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                    <p className="text-white text-lg tracking-wider">{filteredWorks[0].title}</p>
                  </div>
                </>
              ) : (
                <>
                  {/* 画像なし - 工事中 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                    <span className="text-8xl text-gray-300 mb-4">?</span>
                    <span className="text-xl text-gray-400 tracking-widest">工事中</span>
                  </div>
                  {/* タイトル */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-300 to-transparent">
                    <p className="text-gray-600 text-lg tracking-wider">{filteredWorks[0].title}</p>
                  </div>
                </>
              )}
              </div>
            </ViewTransition>
          )}

          {/* 作品がない場合 */}
          {filteredWorks.length === 0 && (
            <div className="flex items-center justify-center h-64 text-gray-400 text-lg">
              作品がありません
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
