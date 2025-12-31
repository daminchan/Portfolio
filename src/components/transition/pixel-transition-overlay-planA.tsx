/**
 * PixelTransitionOverlay - ピクセル分割フェードトランジション (Aプラン)
 *
 * Worksトランジションと同じDOMオーバーレイ方式。
 * 違いは最後の消え方（縮小ではなくフェードアウト）。
 *
 * 【フロー】
 * 1. クリック → グリッド線を表示
 * 2. グリッド線表示後 → ブロックを背景色で塗りつぶし
 * 3. router.push()で遷移
 * 4. 遷移完了後 → ブロックがランダム順にフェードアウト
 */
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from './transition-context';

// アニメーション時間
const GRID_LINE_DURATION = 300;   // グリッド線が現れる
const BLOCK_FILL_DELAY = 100;     // グリッド線→ブロック塗りつぶし
const FADE_DURATION = 400;        // 各ブロックのフェード
const MAX_FADE_DELAY = 500;       // フェード開始の最大遅延

// グリッド設定
const GRID_ROWS = 5;
const GRID_COLS = 7;

// 背景色
const BG_COLORS = [
  'rgb(245, 240, 232)',  // メイン背景色
  'rgb(235, 230, 222)',  // 少し暗め
];

type Phase = 'idle' | 'gridLines' | 'blocked' | 'fading' | 'done';

interface Block {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fadeDelay: number;
  color: string;
}

function createBlocks(): Block[] {
  const blocks: Block[] = [];
  const blockWidth = 100 / GRID_COLS;
  const blockHeight = 100 / GRID_ROWS;

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const id = row * GRID_COLS + col;

      // 固定シードの擬似ランダム
      const seed = (id * 9301 + 49297) % 233280;
      const fadeDelay = (seed / 233280) * MAX_FADE_DELAY;

      // 色を交互に
      const colorIndex = (row + col) % 2;

      blocks.push({
        id,
        x: col * blockWidth,
        y: row * blockHeight,
        width: blockWidth,
        height: blockHeight,
        fadeDelay,
        color: BG_COLORS[colorIndex],
      });
    }
  }

  return blocks;
}

export function PixelTransitionOverlay() {
  const router = useRouter();
  const pathname = usePathname();
  const { isTransitioning, targetHref, transitionType, endTransition, setTransitionComplete } =
    useTransition();

  const [phase, setPhase] = useState<Phase>('idle');
  const [blocks] = useState(() => createBlocks());
  const [isNavigationComplete, setIsNavigationComplete] = useState(false);

  const hasNavigatedRef = useRef(false);
  const startPathnameRef = useRef<string | null>(null);

  // トランジション開始時にパスを記録（一度だけ）
  useEffect(() => {
    if (isTransitioning && targetHref && transitionType === 'pixel') {
      if (startPathnameRef.current === null) {
        startPathnameRef.current = pathname;
      }
    }
  }, [isTransitioning, targetHref, transitionType, pathname]);

  // トランジション開始
  useEffect(() => {
    if (!isTransitioning || !targetHref || transitionType !== 'pixel') return;
    if (hasNavigatedRef.current) return;

    // 状態リセット
    setPhase('idle');
    setIsNavigationComplete(false);
    hasNavigatedRef.current = false;

    // プリフェッチ
    router.prefetch(targetHref);

    // グリッド線開始
    const gridTimer = setTimeout(() => {
      setPhase('gridLines');
    }, 50);

    return () => clearTimeout(gridTimer);
  }, [isTransitioning, targetHref, transitionType, router]);

  // グリッド線完了 → ブロック塗りつぶし + 遷移
  useEffect(() => {
    if (phase !== 'gridLines') return;

    const blockTimer = setTimeout(() => {
      setPhase('blocked');

      // 遷移実行
      if (!hasNavigatedRef.current && targetHref) {
        hasNavigatedRef.current = true;
        router.push(targetHref);
      }
    }, GRID_LINE_DURATION + BLOCK_FILL_DELAY);

    return () => clearTimeout(blockTimer);
  }, [phase, targetHref, router]);

  // 遷移完了を検知
  useEffect(() => {
    if (
      isTransitioning &&
      startPathnameRef.current &&
      pathname !== startPathnameRef.current &&
      !isNavigationComplete
    ) {
      setIsNavigationComplete(true);
    }
  }, [pathname, isTransitioning, isNavigationComplete]);

  // ブロック塗りつぶし完了 AND 遷移完了 → フェードアウト開始
  useEffect(() => {
    if (phase === 'blocked' && isNavigationComplete) {
      const fadeTimer = setTimeout(() => {
        setPhase('fading');
        setTransitionComplete(true);
      }, 100);
      return () => clearTimeout(fadeTimer);
    }
  }, [phase, isNavigationComplete, setTransitionComplete]);

  // フェードアウト完了 → 終了
  useEffect(() => {
    if (phase !== 'fading') return;

    const endTimer = setTimeout(() => {
      setPhase('done');
      endTransition();
    }, MAX_FADE_DELAY + FADE_DURATION + 100);

    return () => clearTimeout(endTimer);
  }, [phase, endTransition]);

  // 終了後にリセット
  useEffect(() => {
    if (phase === 'done') {
      const resetTimer = setTimeout(() => {
        setPhase('idle');
        hasNavigatedRef.current = false;
        startPathnameRef.current = null;
      }, 100);
      return () => clearTimeout(resetTimer);
    }
  }, [phase]);

  // pixel以外は表示しない
  if (transitionType !== 'pixel') return null;
  if (phase === 'idle' && !isTransitioning) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {blocks.map((block) => {
        const isGridLines = phase === 'gridLines';
        const isBlocked = phase === 'blocked';
        const isFading = phase === 'fading' || phase === 'done';

        // グリッド線の表示
        const lineOpacity = isGridLines || isBlocked || isFading ? 1 : 0;

        // ブロックの表示
        let blockOpacity = 0;
        if (isBlocked) {
          blockOpacity = 1;
        } else if (isFading) {
          blockOpacity = phase === 'done' ? 0 : 1;
        }

        return (
          <div
            key={block.id}
            className="absolute"
            style={{
              left: `${block.x}%`,
              top: `${block.y}%`,
              width: `${block.width}%`,
              height: `${block.height}%`,
            }}
          >
            {/* グリッド線 */}
            <div
              className="absolute inset-0"
              style={{
                border: '1px solid rgba(80, 70, 60, 0.3)',
                opacity: lineOpacity,
                transition: `opacity ${GRID_LINE_DURATION}ms ease-out`,
              }}
            />

            {/* ブロック（塗りつぶし） */}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: block.color,
                opacity: isFading ? 0 : blockOpacity,
                transition: isFading
                  ? `opacity ${FADE_DURATION}ms ease-out`
                  : `opacity ${BLOCK_FILL_DELAY}ms ease-out`,
                transitionDelay: isFading ? `${block.fadeDelay}ms` : '0ms',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
