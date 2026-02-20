/**
 * MarginDecoration - サイドマージンのデータ風装飾テキスト
 *
 * max-w-6xl の外側余白に表示されるモノスペース装飾。
 * ゲームのシステムログ風の雰囲気を演出する。
 */
'use client';

type MarginDecorationProps = {
  side: 'left' | 'right';
};

const TEXTS_LEFT = [
  'ARCHIVE_SYSTEM v2.1',
  'STATUS: ONLINE',
  'SESSION: 0x4A2F8B',
];

const TEXTS_RIGHT = [
  'DATA.STREAM // ACTIVE',
  'UPLINK: CONNECTED',
  'REF: PORTFOLIO.SYS',
];

const POSITIONS = ['18%', '48%', '76%'];

export function MarginDecoration({ side }: MarginDecorationProps) {
  const texts = side === 'left' ? TEXTS_LEFT : TEXTS_RIGHT;

  return (
    <div
      className={`pointer-events-none absolute top-0 z-20 h-full select-none ${
        side === 'left' ? 'left-4' : 'right-4'
      }`}
    >
      {texts.map((text, i) => (
        <span
          key={i}
          className="absolute whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-500/[0.12]"
          style={{
            top: POSITIONS[i],
            writingMode: 'vertical-rl',
            animation: `fade-in 800ms ease-out ${600 + i * 200}ms both`,
          }}
          aria-hidden="true"
        >
          {text}
        </span>
      ))}
    </div>
  );
}
