'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

type GlitchImageProps = {
  src: string;
  alt: string;
  delay: number;
  className?: string;
};

// 1f = 1/60s ≈ 0.0167s
const F = 1 / 60;

type Slice = {
  top: number;
  height: number;
  animName: string | null;
  animDuration: number;
  animDelay: number;
};

const SLICES: Slice[] = [
  // === Pass 1: ズーム中 ===
  // 上部（静止）
  { top: 40, height: 2, animName: null,            animDuration: 0,      animDelay: 0 },
  // 上グリッチ → 左10%（4fで発動、4f保持、6fで戻る = 10f）
  { top: 42, height: 2, animName: 'glitch-top',    animDuration: 10 * F, animDelay: 4 * F },
  // 静止
  { top: 44, height: 3, animName: null,            animDuration: 0,      animDelay: 0 },
  // 真ん中上 → 左15%（8fで発動、6fで戻る）
  { top: 47, height: 2, animName: 'glitch-mid-l',  animDuration: 6 * F,  animDelay: 8 * F },
  // 真ん中下 → 右15%（8fで発動、6fで戻る）
  { top: 49, height: 2, animName: 'glitch-mid-r',  animDuration: 6 * F,  animDelay: 8 * F },
  // 下部（静止）
  { top: 51, height: 4, animName: null,            animDuration: 0,      animDelay: 0 },

  // === Pass 2: 着地の瞬間（33fで発動） ===
  { top: 41, height: 3, animName: 'glitch-land-l', animDuration: 6 * F,  animDelay: 33 * F },
  { top: 48, height: 3, animName: 'glitch-land-r', animDuration: 6 * F,  animDelay: 33 * F },

  // === Pass 3: 着地後（42fで発動） ===
  { top: 43, height: 2, animName: 'glitch-post-r', animDuration: 5 * F,  animDelay: 42 * F },
  { top: 50, height: 2, animName: 'glitch-post-l', animDuration: 5 * F,  animDelay: 42 * F },
];

export function GlitchImage({
  src,
  alt,
  delay,
  className,
}: GlitchImageProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!isVisible) return null;

  return (
    <div
      className={cn('relative', className)}
      style={{
        animation: `glitch-zoom ${50 * F}s cubic-bezier(0.16, 1, 0.3, 1) both`,
      }}
      aria-label={alt}
    >
      {/* レイアウト確保用 */}
      <img src={src} alt={alt} className="invisible w-full max-w-[1260px]" />

      {SLICES.map((slice, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full select-none"
          style={{
            clipPath: `inset(${slice.top}% 0 ${100 - slice.top - slice.height}% 0)`,
            ...(slice.animName
              ? {
                  animation: `${slice.animName} ${slice.animDuration}s ease-out ${slice.animDelay}s both`,
                }
              : {}),
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
