/**
 * PixelTransitionOverlay - 長方形ブロック方式
 *
 * 遷移先ページを長方形ブロック単位でランダムに表示する。
 * clip-pathで遷移先をクリップし、ホームが見える状態から
 * ブロック単位で遷移先が現れる。
 */
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from './transition-context';

// アニメーション時間
const GRID_LINE_DURATION = 200;
const TOTAL_REVEAL_TIME = 800;
const BATCH_INTERVAL = 30;

// グリッド設定
const GRID_ROWS = 4;
const GRID_COLS = 6;

type Phase = 'idle' | 'waiting' | 'gridLines' | 'revealing' | 'done';

interface Block {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

// シード付きシャッフル
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
  const blockWidth = 100 / GRID_COLS;
  const blockHeight = 100 / GRID_ROWS;

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      blocks.push({
        id: row * GRID_COLS + col,
        x: col * blockWidth,
        y: row * blockHeight,
        width: blockWidth,
        height: blockHeight,
      });
    }
  }

  return blocks;
}

function createRevealOrder(totalBlocks: number): number[] {
  return seededShuffle(
    Array.from({ length: totalBlocks }, (_, i) => i),
    12345
  );
}

export function PixelTransitionOverlay() {
  const router = useRouter();
  const pathname = usePathname();
  const { isTransitioning, targetHref, endTransition, setTransitionComplete } =
    useTransition();

  const [phase, setPhase] = useState<Phase>('idle');
  const [blocks] = useState(() => createBlocks());
  const [revealOrder] = useState(() => createRevealOrder(GRID_ROWS * GRID_COLS));
  const [revealedCount, setRevealedCount] = useState(0);
  const [gridOpacity, setGridOpacity] = useState(0);

  const hasNavigatedRef = useRef(false);
  const startPathnameRef = useRef<string | null>(null);
  const animationRef = useRef<number | null>(null);

  const revealedBlocks = new Set(revealOrder.slice(0, revealedCount));

  const cleanup = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isTransitioning && targetHref) {
      if (startPathnameRef.current === null) {
        startPathnameRef.current = pathname;
      }
    }
  }, [isTransitioning, targetHref, pathname]);

  useEffect(() => {
    if (!isTransitioning || !targetHref) return;
    if (hasNavigatedRef.current) return;

    hasNavigatedRef.current = true;
    setRevealedCount(0);
    setPhase('waiting');
    setGridOpacity(0);

    router.prefetch(targetHref);
    router.push(targetHref);
  }, [isTransitioning, targetHref, router]);

  useEffect(() => {
    if (!isTransitioning) return;
    if (!startPathnameRef.current) return;
    if (pathname === startPathnameRef.current) return;
    if (phase !== 'waiting') return;

    const timer = setTimeout(() => {
      setPhase('gridLines');
      setGridOpacity(1);
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname, isTransitioning, phase]);

  useEffect(() => {
    if (phase !== 'gridLines') return;

    const timer = setTimeout(() => {
      setPhase('revealing');
      setTransitionComplete(true);
    }, GRID_LINE_DURATION);

    return () => clearTimeout(timer);
  }, [phase, setTransitionComplete]);

  useEffect(() => {
    if (phase !== 'revealing') return;

    const totalBlocks = blocks.length;
    const blocksPerBatch = Math.ceil(totalBlocks / (TOTAL_REVEAL_TIME / BATCH_INTERVAL));
    let currentCount = 0;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - lastTime;

      if (elapsed >= BATCH_INTERVAL) {
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

  useEffect(() => {
    if (phase !== 'revealing') return;
    if (revealedCount < blocks.length) return;

    setGridOpacity(0);

    const timer = setTimeout(() => {
      setPhase('done');
      endTransition();
    }, 300);

    return () => clearTimeout(timer);
  }, [phase, revealedCount, blocks.length, endTransition]);

  useEffect(() => {
    if (phase === 'done') {
      const timer = setTimeout(() => {
        setPhase('idle');
        hasNavigatedRef.current = false;
        startPathnameRef.current = null;
        setRevealedCount(0);
        cleanup();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [phase, cleanup]);

  if (phase === 'idle' && !isTransitioning) return null;

  const showGrid = phase !== 'idle' && phase !== 'done';
  const isRevealing = phase === 'revealing' || phase === 'done';
  const isComplete = revealedCount >= blocks.length;

  return (
    <>
      {/* SVG ClipPath定義 */}
      <svg
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          overflow: 'hidden',
        }}
      >
        <defs>
          <clipPath id="pixel-reveal-clip" clipPathUnits="objectBoundingBox">
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

      {/* グリッド線 */}
      {showGrid && (
        <div
          className="fixed inset-0 pointer-events-none overflow-hidden"
          style={{
            zIndex: 30,
            opacity: gridOpacity,
            transition: `opacity ${GRID_LINE_DURATION}ms ease-out`,
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

      {/* 遷移先ページのclip-pathを制御 */}
      <style>{`
        .page-overlay {
          clip-path: ${isComplete ? 'none' : isRevealing && revealedCount > 0 ? 'url(#pixel-reveal-clip)' : 'polygon(0 0, 0 0, 0 0, 0 0)'};
        }
      `}</style>
    </>
  );
}
