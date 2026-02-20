'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

import { INTRO_REVEAL } from '@/lib/animations';

type Phase = 'gridLines' | 'revealing' | 'done';

type Block = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

type IntroRevealProps = {
  onComplete: () => void;
};

const { ROWS, COLS } = INTRO_REVEAL.GRID;

function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function createBlocks(): Block[] {
  const blocks: Block[] = [];
  const blockWidth = 100 / COLS;
  const blockHeight = 100 / ROWS;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      blocks.push({
        id: row * COLS + col,
        x: col * blockWidth,
        y: row * blockHeight,
        width: blockWidth,
        height: blockHeight,
      });
    }
  }

  return blocks;
}

export function IntroReveal({ onComplete }: IntroRevealProps) {
  const [phase, setPhase] = useState<Phase>('gridLines');
  const [blocks] = useState(createBlocks);
  const [revealOrder] = useState(() =>
    seededShuffle(
      Array.from({ length: ROWS * COLS }, (_, i) => i),
      INTRO_REVEAL.SEED,
    ),
  );
  const [revealedCount, setRevealedCount] = useState(0);
  const [gridOpacity, setGridOpacity] = useState(0);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const animationRef = useRef<number | null>(null);

  const revealedBlocks = new Set(revealOrder.slice(0, revealedCount));
  const isRevealing = phase === 'revealing' || phase === 'done';
  const isComplete = revealedCount >= blocks.length;

  const cleanup = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // Phase 1: グリッド線を表示
  useEffect(() => {
    const raf = requestAnimationFrame(() => setGridOpacity(1));
    const timer = setTimeout(() => setPhase('revealing'), INTRO_REVEAL.GRID_LINE_DURATION);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  // Phase 2: ブロックを順次表示
  useEffect(() => {
    if (phase !== 'revealing') return;

    const totalBlocks = blocks.length;
    const blocksPerBatch = Math.ceil(
      totalBlocks / (INTRO_REVEAL.TOTAL_REVEAL_TIME / INTRO_REVEAL.BATCH_INTERVAL),
    );
    let currentCount = 0;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - lastTime;

      if (elapsed >= INTRO_REVEAL.BATCH_INTERVAL) {
        currentCount = Math.min(currentCount + blocksPerBatch, totalBlocks);
        setRevealedCount(currentCount);
        lastTime = time;
      }

      if (currentCount < totalBlocks) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return cleanup;
  }, [phase, blocks.length, cleanup]);

  // Phase 3: 完了
  useEffect(() => {
    if (phase !== 'revealing' || !isComplete) return;

    setGridOpacity(0);

    const timer = setTimeout(() => {
      setPhase('done');
      onCompleteRef.current();
    }, INTRO_REVEAL.FADE_OUT_DURATION);

    return () => clearTimeout(timer);
  }, [phase, isComplete]);

  const clipPath = isComplete
    ? 'none'
    : isRevealing && revealedCount > 0
      ? 'url(#intro-reveal-clip)'
      : 'polygon(0 0, 0 0, 0 0, 0 0)';

  return (
    <>
      {/* SVG ClipPath 定義 */}
      <svg
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      >
        <defs>
          <clipPath id="intro-reveal-clip" clipPathUnits="objectBoundingBox">
            {blocks
              .filter((block) => revealedBlocks.has(block.id))
              .map((block) => (
                <rect
                  key={block.id}
                  x={block.x / 100}
                  y={block.y / 100}
                  width={block.width / 100 + 0.001}
                  height={block.height / 100 + 0.001}
                />
              ))}
          </clipPath>
        </defs>
      </svg>

      {/* .intro-gallery の clip-path を制御 */}
      <style>{`
        .intro-gallery { clip-path: ${clipPath}; }
      `}</style>

      {/* グリッド線オーバーレイ */}
      {phase !== 'done' && (
        <div
          className="pointer-events-none fixed inset-0 overflow-hidden"
          style={{
            zIndex: 70,
            opacity: gridOpacity,
            transition: `opacity ${INTRO_REVEAL.GRID_LINE_DURATION}ms ease-out`,
          }}
        >
          {blocks.map((block) => (
            <div
              key={block.id}
              className="absolute"
              style={{
                left: `${block.x}%`,
                top: `${block.y}%`,
                width: `${block.width}%`,
                height: `${block.height}%`,
                border: '1px solid rgba(80, 70, 60, 0.25)',
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
