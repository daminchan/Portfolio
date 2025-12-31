/**
 * SplashScreen - サイト訪問時の導入画面
 *
 * クリックで波紋エフェクトが広がり、フェードアウトしてメインコンテンツへ遷移する。
 * 幻想的な霧の背景とアニメーションで没入感を演出。
 */
'use client';

import { useState, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { RippleEffect, type Ripple } from './ripple-effect';
import { LABELS } from '@/lib/constants';
import { SPLASH_ANIMATION } from '@/lib/animations';

interface SplashScreenProps {
  onEnter: () => void;
}

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isImpact, setIsImpact] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isExiting) return;

      const x = e.clientX;
      const y = e.clientY;
      const id = Date.now();

      setRipples((prev) => [...prev, { id, x, y }]);
      setIsImpact(true);
      setIsExiting(true);

      setTimeout(() => setIsImpact(false), SPLASH_ANIMATION.TIMING.IMPACT_DURATION);

      setTimeout(() => {
        onEnter();
      }, SPLASH_ANIMATION.TIMING.EXIT_DELAY);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, SPLASH_ANIMATION.TIMING.RIPPLE_CLEANUP);
    },
    [isExiting, onEnter]
  );

  return (
    <div
      onClick={handleClick}
      className={`fixed inset-0 z-50 flex cursor-pointer select-none flex-col items-center justify-center overflow-hidden ${SPLASH_ANIMATION.TRANSITION.SCREEN} ${
        isImpact ? 'bg-slate-900' : 'bg-[#020617]'
      } ${isExiting ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* 背景の霧と環境光 */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e40af_0%,_transparent_70%)] ${SPLASH_ANIMATION.TRANSITION.SCREEN} ${
            isImpact ? 'opacity-30' : 'opacity-10'
          }`}
        />
        <div
          className={`${SPLASH_ANIMATION.CLASS.MIST} absolute inset-0 opacity-10`}
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 20%, #60a5fa 0%, transparent 40%), radial-gradient(circle at 70% 80%, #3b82f6 0%, transparent 40%)',
          }}
        />
      </div>

      {/* 波紋エフェクト */}
      <RippleEffect ripples={ripples} />

      {/* メインテキスト */}
      <div
        className={`relative z-20 flex flex-col items-center ${SPLASH_ANIMATION.TRANSITION.CONTENT} ${
          isImpact ? 'scale-110 blur-[0.5px]' : 'scale-100 blur-0'
        }`}
      >
        <div className="relative">
          <div className={`${SPLASH_ANIMATION.CLASS.BOUNCE} absolute -top-12 left-1/2 -translate-x-1/2 opacity-40`}>
            <Sparkles className="h-6 w-6 text-blue-400" />
          </div>

          <h1 className="text-4xl font-extralight tracking-[0.6em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] md:text-6xl">
            {LABELS.SPLASH.TITLE}
          </h1>
          <h2 className="ml-2 mt-4 text-lg font-thin uppercase tracking-[1.2em] text-blue-200/60 md:text-xl">
            {LABELS.SPLASH.SUBTITLE}
          </h2>
        </div>

        <div className="mt-20 flex flex-col items-center gap-6">
          <div
            className={`h-12 w-px bg-gradient-to-b from-blue-500/0 via-blue-400 to-blue-500/0 ${SPLASH_ANIMATION.TRANSITION.INDICATOR} ${
              isImpact ? 'scale-y-0 opacity-0' : 'scale-y-100 opacity-40'
            }`}
          />
          <p
            className={`${SPLASH_ANIMATION.CLASS.FADE_PULSE} text-[10px] font-medium uppercase tracking-[0.8em] text-white/20 ${SPLASH_ANIMATION.TRANSITION.OPACITY} ${
              isImpact ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {LABELS.SPLASH.CTA}
          </p>
        </div>
      </div>

      {/* 下部の装飾 */}
      <div className="absolute bottom-10 z-20 text-[8px] uppercase tracking-[0.6em] text-white/10">
        {LABELS.SPLASH.FOOTER}
      </div>
    </div>
  );
}
