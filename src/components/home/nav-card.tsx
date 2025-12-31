/**
 * NavCard - ナビゲーションカード
 *
 * 3D配置されたカードコンポーネント。
 * - 手前のカード: ホバーで拡大 + マウス追従回転（横方向）
 * - 奥のカード: クリックで手前に移動
 */
'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import type { NavItem, CardPosition, CardPositionStyle } from '@/types';

// カード位置のスタイル定義
const POSITIONS: Record<CardPosition, CardPositionStyle> = {
  front: {
    zIndex: 30,
    scale: 1,
    translateY: '0',
    translateX: '0',
    opacity: 1,
    blur: 0,
  },
  backLeft: {
    zIndex: 20,
    scale: 0.8,
    translateY: '-100px',
    translateX: '-200px',
    opacity: 0.6,
    blur: 1,
  },
  backRight: {
    zIndex: 20,
    scale: 0.8,
    translateY: '-100px',
    translateX: '200px',
    opacity: 0.6,
    blur: 1,
  },
};

// フロートアニメーションクラス
const FLOAT_ANIMATIONS = [
  'animate-float',
  'animate-float-delayed',
  'animate-float-delayed-2',
];

interface NavCardProps {
  item: NavItem;
  position: CardPosition;
  index: number;
  onSelect: () => void;
  onNavigate: (href: string) => void;
  isFront: boolean;
}

export function NavCard({ item, position, index, onSelect, onNavigate, isFront }: NavCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDisappearing, setIsDisappearing] = useState(false);

  const pos = POSITIONS[position];
  const floatClass = FLOAT_ANIMATIONS[index % FLOAT_ANIMATIONS.length];

  // マウス追従回転（frontのみ・横方向のみ）
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isFront || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;

      setRotateY(((e.clientX - centerX) / (rect.width / 2)) * 20);
    },
    [isFront]
  );

  const handleMouseLeave = useCallback(() => {
    setRotateY(0);
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleClick = useCallback(() => {
    if (!isFront) {
      onSelect();
    } else {
      // カード消えるアニメーション + トランジション同時発火
      setIsDisappearing(true);
      onNavigate(item.href);
    }
  }, [isFront, onSelect, onNavigate, item.href]);

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        zIndex: pos.zIndex,
        transform: `
          translate(-50%, -50%)
          translateX(${pos.translateX})
          translateY(${pos.translateY})
        `,
        opacity: pos.opacity,
        filter: pos.blur > 0 ? `blur(${pos.blur}px)` : 'none',
        transition: 'transform 0.5s ease-out, opacity 0.5s ease-out, filter 0.5s ease-out',
      }}
    >
      {/* 浮遊アニメーション用ラッパー */}
      <div className={floatClass}>
        {/* tilt・スケール用ラッパー */}
        <div
          ref={cardRef}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="cursor-pointer"
          style={{
            transform: `
              scale(${isDisappearing ? 0.9 : isHovered && isFront ? pos.scale * 1.05 : pos.scale})
              perspective(1000px)
              rotateY(${isFront ? rotateY : 0}deg)
            `,
            opacity: isDisappearing ? 0 : 1,
            transition: isDisappearing
              ? 'transform 0.25s ease-out, opacity 0.25s ease-out'
              : 'transform 0.3s ease-out',
          }}
        >
          {/* カード本体 */}
          <div className="relative h-[400px] w-[300px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <CardBackground cardBackground={item.cardBackground} />
            <CardVerticalLabel id={item.id} hasBackground={!!item.cardBackground} />
            <CardCharacter item={item} />
            <CardTitle item={item} />
            <CardHoverEffect show={isFront && isHovered} />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- サブコンポーネント ---

function CardBackground({ cardBackground }: { cardBackground: string | null }) {
  if (cardBackground) {
    return (
      <div className="absolute inset-0">
        <Image
          src={cardBackground}
          alt=""
          fill
          priority
          sizes="300px"
          unoptimized
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <>
      {/* ダイヤモンドパターン背景 */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(45deg, #e5e5e5 25%, transparent 25%),
            linear-gradient(-45deg, #e5e5e5 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #e5e5e5 75%),
            linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)
          `,
          backgroundColor: '#f5f5f5',
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px',
        }}
      />
      {/* オーバーレイグラデーション（パターン用） */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/70" />
    </>
  );
}

function CardVerticalLabel({ id, hasBackground }: { id: string; hasBackground: boolean }) {
  return (
    <div className="absolute left-3 top-4 z-10">
      <p
        className={`text-[10px] font-light tracking-widest ${
          hasBackground ? 'text-white/70' : 'text-gray-500'
        }`}
        style={{ writingMode: 'vertical-rl' }}
      >
        {id.toUpperCase()}
      </p>
    </div>
  );
}

function CardCharacter({ item }: { item: NavItem }) {
  const hasCharacter = item.characterImage && !item.characterImage.includes('placeholder');

  return (
    <div className="absolute inset-x-0 -top-8 bottom-12 flex items-end justify-center">
      <div className="relative h-full w-full">
        {hasCharacter ? (
          <Image
            src={item.characterImage}
            alt={item.title}
            fill
            priority
            className="scale-[1.5] object-contain object-bottom"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className={`text-6xl ${item.cardBackground ? 'text-white/30' : 'text-gray-300'}`}>
              ?
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function CardTitle({ item }: { item: NavItem }) {
  const hasBackground = !!item.cardBackground;

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 p-4 ${
        hasBackground ? 'backdrop-blur-sm bg-black/30' : ''
      }`}
    >
      <div className={`border-t pt-3 ${hasBackground ? 'border-white/30' : 'border-gray-300'}`}>
        <h3
          className={`text-xl font-bold tracking-wider ${
            hasBackground ? 'text-white' : 'text-gray-800'
          }`}
        >
          {item.title}
        </h3>
        <p
          className={`text-sm tracking-widest ${
            hasBackground ? 'text-white/80' : 'text-gray-500'
          }`}
        >
          {item.description}
        </p>
      </div>
    </div>
  );
}

function CardHoverEffect({ show }: { show: boolean }) {
  if (!show) return null;
  return <div className="absolute inset-0 bg-black/5 transition-opacity duration-300" />;
}
