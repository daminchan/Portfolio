'use client';

import { useEffect, useRef } from 'react';

import { INTRO_WELCOME } from '@/lib/animations';

import { GlitchImage } from './glitch-image';
import { NoiseOverlay } from './noise-overlay';
import { ScanlineOverlay } from './scanline-overlay';

type IntroWelcomeProps = {
  onComplete: () => void;
};

export function IntroWelcome({ onComplete }: IntroWelcomeProps) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const { DELAY, TIMING } = INTRO_WELCOME;
    const autoExitDelay = DELAY.WELCOME + TIMING.GLITCH_IMAGE_DURATION + TIMING.POST_WELCOME_HOLD;

    const completeTimer = setTimeout(() => {
      onCompleteRef.current();
    }, autoExitDelay);

    return () => {
      clearTimeout(completeTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex select-none flex-col items-center justify-center overflow-hidden bg-[#020617]">
      <ScanlineOverlay opacity={10} speed="6s" />
      <NoiseOverlay opacity={0.1} />
      {/* ビネット: CRT周辺暗化 */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-20 flex w-full flex-col items-center gap-6 px-8">
        <GlitchImage
          src="/GLITCH-IMG.png"
          alt="Glitch effect test"
          delay={INTRO_WELCOME.DELAY.WELCOME}
          className="w-full max-w-[1260px]"
        />
      </div>
    </div>
  );
}
