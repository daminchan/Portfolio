/**
 * GlitchText - NieR風グリッチテキストアニメーション
 *
 * 文字がランダムな記号から回転しながら正しい文字に変化する
 */
'use client';

import { useState, useEffect, useCallback } from 'react';

// グリッチ用の記号
const GLITCH_CHARS = '■□▪▫◆◇○●△▽▲▼◁▷◀▶★☆◎';

interface GlitchTextProps {
  text: string;
  isVisible: boolean;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export function GlitchText({
  text,
  isVisible,
  delay = 0,
  className = '',
  onComplete,
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [letterStates, setLetterStates] = useState<
    { char: string; rotation: number; opacity: number; scale: number }[]
  >([]);

  const animate = useCallback(() => {
    setIsAnimating(true);
    const letters = text.split('');
    const totalDuration = 800; // 全体のアニメーション時間
    const letterDelay = 80; // 各文字の遅延

    // 初期状態: すべてグリッチ文字
    setLetterStates(
      letters.map(() => ({
        char: GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)],
        rotation: (Math.random() - 0.5) * 90,
        opacity: 0.3,
        scale: 0.5,
      }))
    );

    // 各文字を順番にアニメーション
    letters.forEach((letter, index) => {
      const startTime = index * letterDelay;

      // グリッチフェーズ (複数回文字が変わる)
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          setLetterStates((prev) => {
            const newStates = [...prev];
            if (newStates[index]) {
              newStates[index] = {
                char: i < 3 ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] : letter,
                rotation: i < 3 ? (Math.random() - 0.5) * 60 : 0,
                opacity: 0.3 + (i / 4) * 0.7,
                scale: 0.5 + (i / 4) * 0.5,
              };
            }
            return newStates;
          });
        }, startTime + i * 50);
      }

      // 最終状態
      setTimeout(() => {
        setLetterStates((prev) => {
          const newStates = [...prev];
          if (newStates[index]) {
            newStates[index] = {
              char: letter,
              rotation: 0,
              opacity: 1,
              scale: 1,
            };
          }
          return newStates;
        });
      }, startTime + 200);
    });

    // アニメーション完了
    setTimeout(() => {
      setDisplayText(text);
      setIsAnimating(false);
      onComplete?.();
    }, totalDuration + letters.length * letterDelay);
  }, [text, onComplete]);

  useEffect(() => {
    if (isVisible && !isAnimating && displayText !== text) {
      const timer = setTimeout(animate, delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isAnimating, displayText, text, delay, animate]);

  // 非表示時はリセット
  useEffect(() => {
    if (!isVisible) {
      setDisplayText('');
      setLetterStates([]);
    }
  }, [isVisible]);

  if (!isVisible && !displayText) {
    return <span className={className}>&nbsp;</span>;
  }

  // アニメーション中
  if (letterStates.length > 0 && isAnimating) {
    return (
      <span className={className}>
        {letterStates.map((state, index) => (
          <span
            key={index}
            className="inline-block transition-all duration-100"
            style={{
              transform: `rotate(${state.rotation}deg) scale(${state.scale})`,
              opacity: state.opacity,
            }}
          >
            {state.char}
          </span>
        ))}
      </span>
    );
  }

  // 完了後
  return <span className={className}>{displayText || text}</span>;
}
