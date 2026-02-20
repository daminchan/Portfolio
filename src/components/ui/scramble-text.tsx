/**
 * ScrambleText - ブラー切り替えテキスト
 *
 * テキスト変更時にブラーアウト→テキスト差し替え→ブラーインで切り替え。
 * ClipWipeText と同じ API で差し替え可能。
 */
'use client';

import { useState, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

type ScrambleTextProps = {
  children: string;
  className?: string;
  /** アニメーション時間（ms） */
  duration?: number;
  /** アニメーション開始までの遅延（ms） */
  delay?: number;
};

export function ScrambleText({
  children,
  className,
  duration = 400,
  delay = 0,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(children);
  const [isBlurred, setIsBlurred] = useState(false);
  const isFirstRender = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (children === displayText && !isBlurred) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setIsBlurred(true);

      timerRef.current = setTimeout(() => {
        setDisplayText(children);
        setIsBlurred(false);
      }, duration / 2);
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [children, duration, delay, displayText, isBlurred]);

  const half = duration / 2;

  return (
    <span
      className={cn(className)}
      style={{
        filter: isBlurred ? 'blur(4px)' : 'blur(0)',
        opacity: isBlurred ? 0.3 : 1,
        transition: `filter ${half}ms ease, opacity ${half}ms ease`,
      }}
    >
      {displayText}
    </span>
  );
}
