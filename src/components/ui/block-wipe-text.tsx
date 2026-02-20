/**
 * BlockWipeText - ■ブロックワイプ切り替えテキスト
 *
 * テキスト変更時に■ブロックが左→右にテキストを覆い、
 * テキスト差し替え後に■ブロックが右へ抜けて新テキストを出現させる。
 */
'use client';

import { useState, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

type BlockWipeTextProps = {
  children: string;
  className?: string;
  /** ワイプアニメーション時間（各フェーズ, ms） */
  duration?: number;
};

type Phase = 'idle' | 'covering' | 'covered' | 'revealing';

const WIPE_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';
const PHASE_BUFFER = 20;

export function BlockWipeText({
  children,
  className,
  duration = 250,
}: BlockWipeTextProps) {
  const [displayText, setDisplayText] = useState(children);
  const [phase, setPhase] = useState<Phase>('idle');
  const prevChildrenRef = useRef(children);

  useEffect(() => {
    // children が実際に変わった場合のみアニメーション発火
    // （Strict Mode の二重実行でも誤発火しない）
    if (prevChildrenRef.current === children) {
      prevChildrenRef.current = children;
      return;
    }
    prevChildrenRef.current = children;

    // setTimeout(fn, 0) で idle 状態の paint を確保してから transition 発火
    const t1 = setTimeout(() => setPhase('covering'), 0);
    const t2 = setTimeout(() => {
      setDisplayText(children);
      setPhase('covered');
    }, duration);
    const t3 = setTimeout(() => setPhase('revealing'), duration + PHASE_BUFFER);
    const t4 = setTimeout(() => setPhase('idle'), duration + PHASE_BUFFER + duration);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      setPhase('idle');
    };
  }, [children, duration]);

  return (
    <span className={cn('relative inline-block overflow-hidden', className)}>
      <span>{displayText}</span>
      <span
        className="absolute inset-0 bg-neutral-500"
        style={getBlockStyle(phase, duration)}
      />
    </span>
  );
}

function getBlockStyle(phase: Phase, duration: number): React.CSSProperties {
  switch (phase) {
    case 'idle':
      return { transform: 'scaleX(0)', transformOrigin: 'left', opacity: 0 };
    case 'covering':
      return {
        transform: 'scaleX(1)',
        transformOrigin: 'left',
        opacity: 1,
        transition: `transform ${duration}ms ${WIPE_EASING}`,
      };
    case 'covered':
      return { transform: 'scaleX(1)', transformOrigin: 'right', opacity: 1 };
    case 'revealing':
      return {
        transform: 'scaleX(0)',
        transformOrigin: 'right',
        opacity: 1,
        transition: `transform ${duration}ms ${WIPE_EASING}`,
      };
  }
}
