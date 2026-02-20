/**
 * ClipWipeText - クリップパス・ワイプ切り替えテキスト
 *
 * テキストが消えずに、新しいテキストが左から右へワイプして上書きする。
 * CSS Grid で新旧テキストを重ね、clip-path transition で切り替え。
 */
'use client';

import { useState, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

type ClipWipeTextProps = {
  children: string;
  className?: string;
  /** ワイプアニメーション時間（ms） */
  duration?: number;
  /** アニメーション開始までの遅延（ms） */
  delay?: number;
};

const WIPE_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';
const SWAP_BUFFER_MS = 50;

export function ClipWipeText({
  children,
  className,
  duration = 500,
  delay = 0,
}: ClipWipeTextProps) {
  const [currentText, setCurrentText] = useState(children);
  const [nextText, setNextText] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (children === currentText) return;

    setNextText(children);
    setRevealed(false);

    let outerRaf: number;
    let innerRaf: number;

    // delay 後に clip-path transition を発火
    const delayTimer = setTimeout(() => {
      outerRaf = requestAnimationFrame(() => {
        innerRaf = requestAnimationFrame(() => {
          setRevealed(true);
        });
      });
    }, delay);

    // transition 完了後にテキストを差し替え
    const swapTimer = setTimeout(() => {
      setCurrentText(children);
      setNextText(null);
      setRevealed(false);
    }, delay + duration + SWAP_BUFFER_MS);

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(swapTimer);
      cancelAnimationFrame(outerRaf);
      cancelAnimationFrame(innerRaf);
    };
  }, [children, currentText, duration, delay]);

  return (
    <span className={cn('inline-grid', className)}>
      <span className="col-start-1 row-start-1">{currentText}</span>
      {nextText !== null && (
        <span
          className="col-start-1 row-start-1"
          style={{
            clipPath: revealed ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
            transition: `clip-path ${duration}ms ${WIPE_EASING}`,
          }}
        >
          {nextText}
        </span>
      )}
    </span>
  );
}
