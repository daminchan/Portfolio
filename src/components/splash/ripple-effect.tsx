/**
 * RippleEffect - 波紋エフェクト
 *
 * クリック位置から水面のような波紋が広がるアニメーションを描画。
 * SplashScreenで使用される視覚効果コンポーネント。
 */
'use client';

import { SPLASH_ANIMATION } from '@/lib/animations';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface RippleEffectProps {
  ripples: Ripple[];
}

export function RippleEffect({ ripples }: RippleEffectProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className={`${SPLASH_ANIMATION.CLASS.RIPPLE} absolute rounded-full border border-blue-200/30 blur-[12px]`}
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}

export type { Ripple };
