'use client';

import { useEffect, useRef, useState } from 'react';

import { INTRO_TITLE, INTRO_TITLE_BLOCKS } from '@/lib/animations';
import { LABELS } from '@/lib/constants';

import { NoiseOverlay } from './noise-overlay';
import { ScanlineOverlay } from './scanline-overlay';

type Phase = 'entering' | 'visible';

type IntroTitleProps = {
  onComplete: () => void;
};

export function IntroTitle({ onComplete }: IntroTitleProps) {
  const [phase, setPhase] = useState<Phase>('entering');
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setPhase('visible');
    });

    const completeTimer = setTimeout(() => {
      onCompleteRef.current();
    }, INTRO_TITLE.FADE_IN_DURATION + INTRO_TITLE.DISPLAY_DURATION);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(completeTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <ScanlineOverlay opacity={10} speed="6s" />
      <NoiseOverlay opacity={0.1} />
      {/* ビネット: CRT周辺暗化 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.80) 100%)',
        }}
      />

      {/* 画面レベル幾何学ブロック — viewport端から出現 */}
      {phase !== 'entering' &&
        INTRO_TITLE_BLOCKS.VIEWPORT.map((block, i) => (
          <div
            key={i}
            className={`absolute ${block.side === 'left' ? 'left-0' : 'right-0'} bg-stone-900`}
            style={{
              top: block.top,
              width: block.width,
              height: block.height,
              animation: block.animation,
              ...('transformOrigin' in block ? { transformOrigin: block.transformOrigin } : {}),
            }}
          />
        ))}

      <div className="relative px-14 py-4 md:px-20 md:py-6">
        {/* 座布団: 左から右へ展開 */}
        <div
          className="absolute inset-0 origin-left bg-stone-900"
          style={{
            transform: phase === 'entering' ? 'scaleX(0)' : 'scaleX(1)',
            transition: `transform ${INTRO_TITLE.FADE_IN_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          }}
        />
        {/* テキスト: 座布団展開後にフェードイン */}
        <span
          className="relative text-7xl font-bold tracking-widest text-white md:text-9xl"
          style={{
            clipPath: phase === 'entering' ? 'inset(0 67% 0 0)' : 'inset(0 0% 0 0)',
            transition: phase !== 'entering'
              ? 'clip-path 400ms cubic-bezier(0.16, 1, 0.3, 1) 100ms'
              : 'none',
          }}
        >
          {LABELS.SPLASH.SUBTITLE}
        </span>

        {/* 幾何学装飾: ■ × 3 */}
        {phase !== 'entering' &&
          INTRO_TITLE_BLOCKS.DECORATIVE.map((block, i) => (
            <div
              key={i}
              className={`absolute ${block.className} bg-stone-900`}
              style={{
                width: block.width,
                height: block.height,
                transformOrigin: block.transformOrigin,
                animation: block.animation,
              }}
            />
          ))}
      </div>
    </div>
  );
}
