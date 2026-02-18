'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

type GlitchTextProps = {
  text: string;
  delay: number;
  className?: string;
};

/**
 * 5本の水平スライス定義
 *
 * distance: ズレ幅（正=右、負=左）
 * peak:     最大ズレに達するタイミング（0〜100）
 *           小さい=速くズレる、大きい=ゆっくりズレる
 *           残り(100-peak)が戻りの時間
 */
// グリッチ: 出現4f後に開始、10f持続
const GLITCH_DELAY = 0.07;    // 4f @ 60fps
const GLITCH_DURATION = 0.17; // 10f @ 60fps
const GLITCH_EASING = 'cubic-bezier(0.05, 0, 0.1, 0)';

const SLICES = [
  { top: '0%',  height: '20%', distance: '50%',  peak: 30, delayOffset: GLITCH_DELAY },               // ① 上（最初）
  { top: '80%', height: '20%', distance: '35%',  peak: 35, delayOffset: GLITCH_DELAY + 0.03 },        // ② 下
  { top: '20%', height: '20%', distance: '-40%', peak: 35, delayOffset: GLITCH_DELAY + 0.06 },        // ③ 上寄り
  { top: '60%', height: '20%', distance: '-50%', peak: 30, delayOffset: GLITCH_DELAY + 0.09 },        // ④ 下寄り
  { top: '40%', height: '20%', distance: '30%',  peak: 25, delayOffset: GLITCH_DELAY + 0.12 },        // ⑤ 真ん中（最後）
];

function generateKeyframes(): string {
  return SLICES.map((slice, i) =>
    `@keyframes glitch-s${i}{0%{transform:translateX(0)}${slice.peak}%{transform:translateX(${slice.distance})}100%{transform:translateX(0)}}`
  ).join('');
}

const KEYFRAMES_CSS = generateKeyframes();

export function GlitchText({ text, delay, className }: GlitchTextProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!isVisible) return null;

  return (
    <div
      className="relative"
      style={{
        animation: 'glitch-reveal 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
      }}
      aria-label={text}
    >
      {/* 動的 keyframes 注入 */}
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES_CSS }} />

      {/* 5スライス グリッチワイプ（各スライス内に赤・シアン・白をネスト） */}
      {SLICES.map((slice, i) => (
        <span
          key={i}
          className="pointer-events-none absolute inset-0 select-none"
          style={{
            clipPath: `inset(${slice.top} 0 ${100 - parseFloat(slice.top) - parseFloat(slice.height)}% 0)`,
            animation: `glitch-s${i} ${GLITCH_DURATION}s ${GLITCH_EASING} ${slice.delayOffset}s both`,
          }}
          aria-hidden="true"
        >
          {/* 赤 */}
          <span
            className={cn('absolute inset-0', className, 'text-red-600')}
            style={{ transform: 'translate(-2px, 1px)' }}
          >
            {text}
          </span>
          {/* シアン */}
          <span
            className={cn('absolute inset-0', className, 'text-cyan-400')}
            style={{ transform: 'translate(2px, -1px)' }}
          >
            {text}
          </span>
          {/* 白 */}
          <span className={cn('relative', className)}>{text}</span>
        </span>
      ))}

      {/* レイアウト確保用（不可視） */}
      <span className={cn('invisible relative', className)}>{text}</span>
    </div>
  );
}
