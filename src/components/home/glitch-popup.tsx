/**
 * GlitchPopup - ゲームデータ風ポップアップ + グリッチエフェクト
 *
 * Phase 1: scale(0) → scale(1) のポップアップ出現
 * Phase 2: translateX ジッター + 水平グリッチスライスオーバーレイ
 * Phase 3: 静止（通常表示）
 */
'use client';

import { GALLERY_POPUP } from '@/lib/animations';
import { cn } from '@/lib/utils';

type GlitchPopupProps = {
  children: React.ReactNode;
  /** ポップアップ開始までの遅延（ms） */
  delay?: number;
  /** false の場合アニメーションを抑制し、静止表示する */
  active?: boolean;
  className?: string;
};

const GLITCH_SLICES = [
  { top: '12%', height: '3%', offset: 8 },
  { top: '33%', height: '2%', offset: -7 },
  { top: '55%', height: '4%', offset: 10 },
  { top: '72%', height: '2%', offset: -9 },
  { top: '88%', height: '3%', offset: 6 },
] as const;

const SLICE_STAGGER = 25;

export function GlitchPopup({
  children,
  delay = 0,
  active = true,
  className,
}: GlitchPopupProps) {
  const glitchStart = delay + GALLERY_POPUP.GLITCH_OFFSET;

  // active=false: アニメーションなしで静止表示
  if (!active) {
    return (
      <div className={cn('glitch-popup relative', className)}>
        <div className="h-full">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn('glitch-popup relative', className)}
      style={{
        animation: `data-popup ${GALLERY_POPUP.POPUP_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both`,
      }}
    >
      {/* ジッター層: ポップアップ後に水平揺れ */}
      <div
        className="h-full"
        style={{
          animation: `glitch-jitter ${GALLERY_POPUP.GLITCH_JITTER_DURATION}ms ease-out ${glitchStart}ms both`,
        }}
      >
        {children}
      </div>

      {/* グリッチフラッシュ: 白いオーバーレイが一瞬光る */}
      <div
        className="pointer-events-none absolute inset-0 bg-white/30"
        style={{
          animation: `glitch-flash 150ms ease-out ${glitchStart}ms both`,
        }}
      />

      {/* グリッチスライス: 水平バーが左右にずれてフラッシュ */}
      {GLITCH_SLICES.map((slice, i) => (
        <div
          key={i}
          className="pointer-events-none absolute inset-x-0 bg-neutral-500/30"
          style={{
            top: slice.top,
            height: slice.height,
            animation: `glitch-slice ${GALLERY_POPUP.GLITCH_SLICE_DURATION}ms ease-out ${glitchStart + i * SLICE_STAGGER}ms both`,
            '--slice-offset': `${slice.offset}px`,
          } as React.CSSProperties}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
