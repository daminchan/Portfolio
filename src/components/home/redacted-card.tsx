'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

import { GALLERY_GLITCH } from '@/lib/animations';

type RedactedCardProps = {
  width: number;
  height: number;
  style: React.CSSProperties;
};

export function RedactedCard({ width, height, style }: RedactedCardProps) {
  const [isErrored, setIsErrored] = useState(false);
  const glitchRef = useRef<HTMLDivElement>(null);
  const errorTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (errorTimer.current) clearTimeout(errorTimer.current);
    };
  }, []);

  const handleClick = useCallback(() => {
    if (isErrored) return;

    glitchRef.current?.animate(GALLERY_GLITCH.CARD_KEYFRAMES as Keyframe[], {
      duration: GALLERY_GLITCH.CARD_DURATION,
      easing: 'ease-out',
    });

    setIsErrored(true);
    errorTimer.current = setTimeout(() => setIsErrored(false), GALLERY_GLITCH.ERROR_DISPLAY_DURATION);
  }, [isErrored]);

  return (
    <div
      className="absolute cursor-pointer select-none opacity-40"
      style={{ width, height, ...style }}
      aria-hidden="true"
      onClick={handleClick}
    >
      {/* グリッチ対象の内側ラッパー（rotateを保持したまま中身だけ揺らす） */}
      <div
        ref={glitchRef}
        className="h-full w-full border border-neutral-500/15 border-l-4 border-l-neutral-500/10 bg-stone-300/20"
      >
        <div className="flex h-full flex-col p-4 text-neutral-500/30">
          {/* REF タグ */}
          <div className="absolute right-4 top-0 border-x border-b border-neutral-500/10 bg-neutral-500/5 px-2 py-0.5 font-mono text-[7px]">
            ■■■: ■■■
          </div>
          {/* ヘッダー */}
          <div className="mb-4">
            <p className="font-mono text-[7px] uppercase tracking-widest">■■■■■■.■■■■■■■</p>
            <p className="text-[11px] font-bold uppercase">■■■■■■</p>
          </div>
          {/* コンテンツ領域 */}
          <div
            className={`relative grow border border-neutral-500/10 transition-colors duration-300 ${
              isErrored ? 'bg-red-500/10' : 'bg-neutral-500/[0.03]'
            }`}
          >
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-neutral-500/20" />
            {/* ERROR オーバーレイ */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                isErrored ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="font-mono text-lg font-bold tracking-widest text-red-500/80">
                ERROR
              </span>
            </div>
          </div>
          {/* フッター */}
          <div className="mt-auto flex justify-between pt-1 font-mono text-[7px]">
            <span>■■■</span>
            <span>▶</span>
          </div>
        </div>
      </div>
    </div>
  );
}
