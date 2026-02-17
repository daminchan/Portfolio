'use client';

/**
 * LyricMotion コンポーネント
 *
 * JSON形式でエフェクトを定義し、テキストや画像にアニメーションを適用する
 *
 * @example
 * // テキストに適用（文字ごとにアニメーション）
 * <LyricMotion
 *   effects={[
 *     { effect: 'fade', params: { duration: 0.2 } },
 *     { effect: 'stretchY', params: { intensity: 4 } },
 *   ]}
 *   stagger={0.03}
 *   size="text-8xl"
 * >
 *   FLASH
 * </LyricMotion>
 *
 * @example
 * // 画像に適用
 * <LyricMotion
 *   effects={[{ effect: 'scale', params: { intensity: 0.8 } }]}
 * >
 *   <img src="/hero.png" alt="" />
 * </LyricMotion>
 *
 * @example
 * // プリセットを使用
 * import { PRESETS } from '@/components/lyric-motion/presets';
 * <LyricMotion effects={PRESETS.vStretch}>FLASH</LyricMotion>
 */

import { useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { LyricMotionProps } from './types';
import { mergeEffects } from './effects';

// 文字単位のコンポーネント
interface CharacterProps {
  char: string;
  index: number;
  mergedEffect: ReturnType<typeof mergeEffects>;
  size: string;
  rgbSplit: boolean;
}

const Character = ({ char, index, mergedEffect, size, rgbSplit }: CharacterProps) => {
  // RGB色収差エフェクト
  const rgbAnimate = useMemo(() => ({
    x: [0, (Math.random() - 0.5) * 30, 0],
    opacity: [0, 1, 0],
    transition: { duration: 0.2, delay: index * 0.01 }
  }), [index]);

  return (
    <div className="relative inline-block" style={{ transformStyle: 'preserve-3d' }}>
      <motion.span
        custom={index}
        variants={{
          hidden: mergedEffect.hidden,
          visible: mergedEffect.visible,
          exit: mergedEffect.exit || {}
        } as Variants}
        className={`inline-block font-black text-white mix-blend-difference leading-none ${size}`}
        style={{ backfaceVisibility: 'hidden' }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>

      {rgbSplit && (
        <>
          {/* RGB Split (Red) */}
          <motion.span
            animate={rgbAnimate}
            className={`absolute inset-0 pointer-events-none font-black text-red-600 mix-blend-screen opacity-0 ${size}`}
          >
            {char}
          </motion.span>

          {/* RGB Split (Cyan) */}
          <motion.span
            animate={{ ...rgbAnimate, x: [0, (Math.random() - 0.5) * -30, 0] }}
            className={`absolute inset-0 pointer-events-none font-black text-cyan-400 mix-blend-screen opacity-0 ${size}`}
          >
            {char}
          </motion.span>
        </>
      )}
    </div>
  );
};

// メインコンポーネント
export const LyricMotion = ({
  children,
  effects,
  stagger = 0.03,
  size = 'text-6xl',
  className = '',
  rgbSplit = true,
}: LyricMotionProps) => {
  // エフェクトをマージ
  const mergedEffect = useMemo(() => mergeEffects(effects), [effects]);

  // children が文字列かどうかを判定
  const isTextContent = typeof children === 'string';

  if (isTextContent) {
    // テキストの場合: 文字ごとに分割してアニメーション
    const text = children as string;

    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ staggerChildren: stagger }}
        className={`flex flex-wrap justify-center gap-1 ${className}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {text.split("").map((char, i) => (
          <Character
            key={i}
            char={char}
            index={i}
            mergedEffect={mergedEffect}
            size={size}
            rgbSplit={rgbSplit}
          />
        ))}
      </motion.div>
    );
  }

  // 画像やその他の要素の場合: 全体にアニメーション
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        hidden: mergedEffect.hidden,
        visible: mergedEffect.visible,
        exit: mergedEffect.exit || {}
      } as Variants}
      className={className}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
};

// 名前付きエクスポート
export { EFFECTS, mergeEffects, getEffectNames } from './effects';
export { PRESETS } from './presets';
export type { EffectLayer, EffectParams, LyricMotionProps } from './types';

// デフォルトエクスポート
export default LyricMotion;
