/**
 * TransitionOverlay - ページ遷移オーバーレイ
 *
 * フロー:
 * 1. クリック → prefetch開始
 * 2. ひび割れアニメーション（線が現れる）
 * 3. ひび割れ完了 → 同じ形状のブロックで画面を覆う
 * 4. 遷移完了していれば遷移先はブロックの下でレンダリング済み
 * 5. ブロックが縮小 + 遷移先アニメーション発火
 * 6. 縮小しながら遷移先が見える
 */
'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from './transition-context';

// アニメーション時間
const CRACK_DURATION = 400;      // ひび割れ
const BLOCK_DELAY = 100;         // ひび割れ→ブロック切り替え
const CONTRACT_DURATION = 600;   // 縮小
const FADE_OUT_DURATION = 300;   // フェードアウト

// フェーズ
type Phase = 'idle' | 'cracking' | 'blocked' | 'contracting' | 'done';

// ひび割れ/ブロックのパターンを生成
function generateFragments() {
  const fragments: {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    crackDelay: number;
    contractDelay: number;
    rotation: number;
    color: string;
  }[] = [];

  // 色（BG色と薄いグレーの2色）
  const colors = [
    'rgb(245, 240, 232)',  // BG色
    'rgb(220, 215, 208)',  // 薄いグレー
  ];

  // サイズパターン（3種類）
  const sizes = [
    { w: 22, h: 22 },   // 小
    { w: 28, h: 28 },   // 中
    { w: 35, h: 35 },   // 大
  ];

  // グリッドベースで配置（5列 x 4行）
  const cols = 5;
  const rows = 4;
  const cellW = 100 / cols;
  const cellH = 100 / rows;

  let id = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // サイズを交互に変える
      const sizeIndex = (row + col) % 3;
      const size = sizes[sizeIndex];

      // 少しランダムにずらす（控えめに）
      const offsetX = (Math.random() - 0.5) * 6;
      const offsetY = (Math.random() - 0.5) * 6;

      // 位置
      const x = col * cellW + (cellW - size.w) / 2 + offsetX;
      const y = row * cellH + (cellH - size.h) / 2 + offsetY;

      // 中心からの距離
      const centerX = 50;
      const centerY = 50;
      const distFromCenter = Math.sqrt(
        Math.pow(x + size.w / 2 - centerX, 2) + Math.pow(y + size.h / 2 - centerY, 2)
      );
      const maxDist = 60;

      // 色を交互に
      const colorIndex = (row + col) % 2;

      fragments.push({
        id: id++,
        x,
        y,
        width: size.w + (Math.random() - 0.5) * 4,
        height: size.h + (Math.random() - 0.5) * 4,
        crackDelay: (distFromCenter / maxDist) * 0.2,
        contractDelay: (1 - distFromCenter / maxDist) * 0.15,
        rotation: (Math.random() - 0.5) * 4,
        color: colors[colorIndex],
      });
    }
  }

  return fragments;
}

export function TransitionOverlay() {
  const router = useRouter();
  const pathname = usePathname();
  const { isTransitioning, targetHref, transitionType, endTransition, setTransitionComplete } = useTransition();

  const [phase, setPhase] = useState<Phase>('idle');
  const [fragments, setFragments] = useState(() => generateFragments());
  const [isNavigationComplete, setIsNavigationComplete] = useState(false);

  const hasNavigatedRef = useRef(false);
  const hasPrefetchedRef = useRef(false);
  const startPathnameRef = useRef<string | null>(null);

  // フラグメントをメモ化
  const memoizedFragments = useMemo(() => fragments, [fragments]);

  // トランジション開始時にパスを記録
  useEffect(() => {
    if (isTransitioning && targetHref) {
      startPathnameRef.current = pathname;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransitioning, targetHref]);

  // トランジション開始
  useEffect(() => {
    if (!isTransitioning || !targetHref || transitionType !== 'default') return;

    // 状態リセット
    setFragments(generateFragments());
    setPhase('idle');
    setIsNavigationComplete(false);
    hasNavigatedRef.current = false;
    hasPrefetchedRef.current = false;

    // プリフェッチ開始
    if (!hasPrefetchedRef.current) {
      hasPrefetchedRef.current = true;
      router.prefetch(targetHref);
    }

    // ひび割れ開始
    const crackTimer = setTimeout(() => {
      setPhase('cracking');
    }, 50);

    return () => {
      clearTimeout(crackTimer);
    };
  }, [isTransitioning, targetHref, router]);

  // ひび割れ完了 → ブロック化 + 遷移実行
  useEffect(() => {
    if (phase !== 'cracking') return;

    const blockTimer = setTimeout(() => {
      setPhase('blocked');

      // 遷移実行
      if (!hasNavigatedRef.current && targetHref) {
        hasNavigatedRef.current = true;
        router.push(targetHref);
      }
    }, CRACK_DURATION + BLOCK_DELAY);

    return () => clearTimeout(blockTimer);
  }, [phase, targetHref, router]);

  // 遷移完了を検知（pathname変化）
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

  // ブロック化完了 AND 遷移完了 → 縮小開始
  useEffect(() => {
    if (phase === 'blocked' && isNavigationComplete) {
      // 少し待ってから縮小開始
      const contractTimer = setTimeout(() => {
        setPhase('contracting');
        setTransitionComplete(true);  // 縮小開始時点でページアニメーション発火
      }, 100);
      return () => clearTimeout(contractTimer);
    }
  }, [phase, isNavigationComplete, setTransitionComplete]);

  // 縮小完了 → 終了
  useEffect(() => {
    if (phase !== 'contracting') return;

    const endTimer = setTimeout(() => {
      setPhase('done');
      endTransition();
    }, CONTRACT_DURATION + FADE_OUT_DURATION);

    return () => clearTimeout(endTimer);
  }, [phase, endTransition]);

  // 終了後にリセット
  useEffect(() => {
    if (phase === 'done') {
      const resetTimer = setTimeout(() => {
        setPhase('idle');
      }, 100);
      return () => clearTimeout(resetTimer);
    }
  }, [phase]);

  // pixelタイプの場合はPixelTransitionOverlayが処理する
  if (transitionType !== 'default') return null;
  if (phase === 'idle' && !isTransitioning) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {/* フラグメント（ひび割れ線 & ブロック） */}
      {memoizedFragments.map((fragment) => {
        const isCracking = phase === 'cracking';
        const isBlocked = phase === 'blocked';
        const isContracting = phase === 'contracting' || phase === 'done';

        // ひび割れ線のスタイル（縮小時は消える）
        const crackOpacity = isCracking || isBlocked ? 1 : 0;

        // ブロックのスタイル
        let blockTransform = 'scale(1)';
        let blockOpacity = 0;

        if (isBlocked) {
          blockOpacity = 1;
          blockTransform = 'scale(1)';
        } else if (isContracting) {
          blockOpacity = phase === 'done' ? 0 : 1;
          blockTransform = 'scale(0)';
        }

        return (
          <div
            key={fragment.id}
            className="absolute"
            style={{
              left: `${fragment.x}%`,
              top: `${fragment.y}%`,
              width: `${fragment.width}%`,
              height: `${fragment.height}%`,
            }}
          >
            {/* ひび割れ線（境界線） */}
            <div
              className="absolute inset-0"
              style={{
                border: '1px solid rgba(80, 70, 60, 0.3)',
                opacity: crackOpacity,
                transition: isContracting
                  ? `opacity ${CONTRACT_DURATION * 0.3}ms ease-out`
                  : `opacity ${CRACK_DURATION * 0.5}ms ease-out`,
                transitionDelay: isContracting ? '0s' : `${fragment.crackDelay}s`,
              }}
            />

            {/* ブロック（塗りつぶし） */}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: fragment.color,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                opacity: blockOpacity,
                transform: isContracting
                  ? `scale(0) rotate(${fragment.rotation * 2}deg)`
                  : `scale(1) rotate(${fragment.rotation}deg)`,
                transformOrigin: 'center center',
                transition: isContracting
                  ? `opacity ${FADE_OUT_DURATION}ms ease-out, transform ${CONTRACT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
                  : `opacity ${BLOCK_DELAY}ms ease-out, transform ${BLOCK_DELAY}ms ease-out`,
                transitionDelay: isContracting ? `${fragment.contractDelay}s` : '0s',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
