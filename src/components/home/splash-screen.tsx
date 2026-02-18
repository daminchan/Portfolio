'use client';

import { useState, useCallback } from 'react';

import { LABELS } from '@/lib/constants';
import { SPLASH_ANIMATION } from '@/lib/animations';

import { GlitchImage } from './glitch-image';
import { GlitchText } from './glitch-text';
import { NoiseOverlay } from './noise-overlay';
import { ScanlineOverlay } from './scanline-overlay';

type SplashScreenProps = {
  onEnter: () => void;
};

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClick = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);

    setTimeout(() => {
      onEnter();
    }, SPLASH_ANIMATION.TIMING.EXIT_DELAY);
  }, [isExiting, onEnter]);

  return (
    <div
      onClick={handleClick}
      className={`fixed inset-0 z-50 flex cursor-pointer select-none flex-col items-center justify-center overflow-hidden bg-[#020617] ${SPLASH_ANIMATION.TRANSITION.SCREEN} ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* 背景エフェクト */}
      {/* <NoiseOverlay opacity={0.04} /> */}
      <ScanlineOverlay opacity={0.06} speed="8s" />

      {/* メインコンテンツ */}
      <div className="relative z-20 flex flex-col items-center gap-6">
        {/* <GlitchText
          text={LABELS.SPLASH.TITLE}
          delay={SPLASH_ANIMATION.DELAY.WELCOME}
          className="font-sans text-7xl font-bold tracking-tight text-white md:text-9xl"
        /> */}
        <GlitchImage
          src="/GLITCH-IMG.png"
          alt="Glitch effect test"
          delay={SPLASH_ANIMATION.DELAY.WELCOME}
        />
      </div>

      {/* CTA */}
      <p
        className="absolute bottom-24 z-20 animate-fade-pulse text-[10px] font-medium uppercase tracking-[0.8em] text-white/30"
        style={{
          opacity: 0,
          animation: `fade-in 0.8s ease-out ${SPLASH_ANIMATION.DELAY.CTA}ms forwards, fade-pulse 3s ease-in-out ${SPLASH_ANIMATION.DELAY.CTA + 800}ms infinite`,
        }}
      >
        {LABELS.SPLASH.CTA}
      </p>
    </div>
  );
}
