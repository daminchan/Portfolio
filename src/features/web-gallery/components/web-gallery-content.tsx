'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { HyperText } from '@/components/ui/hyper-text';
import { useTransition } from '@/components/transition/transition-context';

import { GALLERY_ITEMS } from '../constants';

import type { GalleryItem } from '../constants';

export function WebGalleryContent() {
  const { isTransitionComplete } = useTransition();
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());

  // トランジション完了後にアニメーション開始
  useEffect(() => {
    if (isTransitionComplete) {
      setIsLoaded(true);
    }
  }, [isTransitionComplete]);

  // 順番にアイテムを表示
  useEffect(() => {
    if (!isLoaded) return;

    const items = ['title', ...GALLERY_ITEMS.map((item) => item.id), 'back'];
    items.forEach((item, index) => {
      setTimeout(() => {
        setVisibleItems((prev) => new Set([...prev, item]));
      }, index * 150);
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
      <div className="relative z-10 max-w-6xl mx-auto p-10">
        <h1
          className="text-6xl font-normal tracking-[0.2em] text-card-foreground mb-16"
          style={{
            textShadow: '3px 3px 0px rgba(180, 180, 180, 0.4)',
          }}
        >
          {visibleItems.has('title') && <HyperText>Web Gallery</HyperText>}
        </h1>

        {/* カードグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GALLERY_ITEMS.map((item, index) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={index}
              isVisible={visibleItems.has(item.id)}
            />
          ))}
        </div>

        {/* 戻るリンク */}
        <Link
          href="/works"
          className="inline-block mt-10 px-4 py-2 text-base text-muted-foreground tracking-wider transition-all hover:bg-muted hover:text-foreground hover:font-medium"
          style={{
            opacity: visibleItems.has('back') ? 1 : 0,
            transition: 'opacity 0.5s ease-out 0.3s, background-color 0.2s, color 0.2s',
          }}
        >
          ← Works に戻る
        </Link>
      </div>
    </div>
  );
}

// --- プレースホルダーグラデーション ---

const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)',
  'linear-gradient(135deg, #373b44 0%, #4286f4 100%)',
  'linear-gradient(135deg, #434343 0%, #000000 100%)',
] as const;

// --- サブコンポーネント ---

type GalleryCardProps = {
  item: GalleryItem;
  index: number;
  isVisible: boolean;
};

function GalleryCard({ item, index, isVisible }: GalleryCardProps) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-[16/10] overflow-hidden rounded-lg border border-border"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
      }}
    >
      {/* 背景画像 or プレースホルダー */}
      {item.image ? (
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          style={{
            background: PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length],
          }}
        />
      )}

      {/* 常時表示のグラデーションオーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* テキストコンテンツ */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="text-xl font-medium tracking-widest text-white mb-1">
          {item.title}
        </h3>
        <p className="text-sm text-white/70 mb-3 line-clamp-2">
          {item.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs tracking-wider text-white/90 bg-white/15 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ホバーオーバーレイ */}
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
    </a>
  );
}
