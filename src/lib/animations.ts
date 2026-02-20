// アニメーション定数
// プロジェクト全体で一貫したアニメーションを使用するための定義

// デュレーション
export const DURATION = {
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 500,
} as const;

// イージング
export const EASING = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// Tailwindクラス用のアニメーション定義
export const TRANSITION = {
  // 基本トランジション
  base: 'transition-all duration-200 ease-out',
  fast: 'transition-all duration-150 ease-out',
  slow: 'transition-all duration-300 ease-out',

  // 特定プロパティのトランジション
  opacity: 'transition-opacity duration-200 ease-out',
  transform: 'transition-transform duration-200 ease-out',
  colors: 'transition-colors duration-150 ease-out',
  width: 'transition-[width] duration-300 ease-out',

  // サイドバー専用
  sidebar: 'transition-[width] duration-300 ease-out',
  sidebarContent: 'transition-[opacity,max-width] duration-300 ease-out',
} as const;

// レイアウト定数（サイドバー関連）
export const LAYOUT = {
  sidebar: {
    open: 'w-60',
    closed: 'w-0 lg:w-16',
  },
  main: {
    open: 'lg:pl-60',
    closed: 'lg:pl-16',
  },
} as const;

// アニメーション状態クラス
export const ANIMATE = {
  // フェード
  fadeIn: 'animate-in fade-in',
  fadeOut: 'animate-out fade-out',

  // スライド
  slideInLeft: 'animate-in slide-in-from-left',
  slideInRight: 'animate-in slide-in-from-right',
  slideInTop: 'animate-in slide-in-from-top',
  slideInBottom: 'animate-in slide-in-from-bottom',

  // スケール
  scaleIn: 'animate-in zoom-in-95',
  scaleOut: 'animate-out zoom-out-95',

  // 組み合わせ
  fadeInScale: 'animate-in fade-in zoom-in-95',
  fadeOutScale: 'animate-out fade-out zoom-out-95',
  fadeInSlideUp: 'animate-in fade-in slide-in-from-bottom-2',
  fadeInSlideDown: 'animate-in fade-in slide-in-from-top-2',
} as const;

// イントロ Scene 1: Welcome（グリッチ画像）
export const INTRO_WELCOME = {
  DELAY: {
    WELCOME: 150,
  },
  TIMING: {
    GLITCH_IMAGE_DURATION: 833,
    POST_WELCOME_HOLD: 0,
    EXIT_DELAY: 300,
  },
  TRANSITION: {
    SCREEN: 'transition-opacity duration-[800ms]',
  },
} as const;

// イントロ Scene 2: タイトル + 幾何学ブロック
export const INTRO_TITLE = {
  FADE_IN_DURATION: 200,
  DISPLAY_DURATION: 600,
  FADE_OUT_DURATION: 200,
} as const;

// イントロ Scene 2: 画面レベル幾何学ブロック定義
const EXPO_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export const INTRO_TITLE_BLOCKS = {
  /** viewport端から出現するブロック（左4 + 右4） */
  VIEWPORT: [
    // 左側: 瞬間出現系（block-blink）
    { side: 'left', top: '26%', width: '38%', height: 100, animation: 'block-blink 160ms linear 30ms both' },
    { side: 'left', top: '40%', width: '32%', height: 180, animation: 'block-blink 180ms linear 100ms both' },
    { side: 'left', top: '56%', width: '42%', height: 70,  animation: 'block-blink 140ms linear 170ms both' },
    { side: 'left', top: '65%', width: '20%', height: 35,  animation: 'block-blink 120ms linear 230ms both' },
    // 右側: 伸縮系（block-flash-x）
    { side: 'right', top: '32%', width: '40%', height: 120, animation: `block-flash-x 230ms ${EXPO_EASE} 60ms both`, transformOrigin: 'right' },
    { side: 'right', top: '58%', width: '30%', height: 50,  animation: `block-flash-x 200ms ${EXPO_EASE} 150ms both`, transformOrigin: 'right' },
    // 右側: 瞬間出現系（block-blink）
    { side: 'right', top: '45%', width: '22%', height: 90,  animation: 'block-blink 150ms linear 110ms both' },
    { side: 'right', top: '24%', width: '16%', height: 28,  animation: 'block-blink 130ms linear 200ms both' },
  ],
  /** テキスト周辺の装飾ブロック（■ × 3） */
  DECORATIVE: [
    { className: '-left-3 -top-10',     width: 20, height: 20, transformOrigin: 'top',    animation: `block-pop 300ms ${EXPO_EASE} 60ms both` },
    { className: '-bottom-14 -right-7', width: 44, height: 44, transformOrigin: 'bottom', animation: `block-pop 320ms ${EXPO_EASE} 140ms both` },
    { className: '-bottom-20 -left-10', width: 64, height: 64, transformOrigin: 'bottom', animation: `block-pop 350ms ${EXPO_EASE} 220ms both` },
  ],
} as const;

// イントロ Scene 2→3: ブロックリビールトランジション
export const INTRO_REVEAL = {
  GRID_LINE_DURATION: 200,
  TOTAL_REVEAL_TIME: 800,
  BATCH_INTERVAL: 30,
  GRID: { ROWS: 4, COLS: 6 },
  SEED: 54321,
  FADE_OUT_DURATION: 300,
} as const;

// カードギャラリー グリッチ切替（Web Animations API）
export const GALLERY_GLITCH = {
  KEYFRAMES: [
    { transform: 'translateX(0) skewX(0)' },
    { transform: 'translateX(-6px) skewX(-0.8deg)', offset: 0.08 },
    { transform: 'translateX(5px) skewX(0.5deg)', offset: 0.16 },
    { transform: 'translateX(-4px) skewX(-0.3deg)', offset: 0.24 },
    { transform: 'translateX(3px)', offset: 0.32 },
    { transform: 'translateX(-2px) skewX(0.2deg)', offset: 0.4 },
    { transform: 'translateX(1px)', offset: 0.55 },
    { transform: 'translateX(0)', offset: 0.7 },
    { transform: 'translateX(0)' },
  ] as Keyframe[],
  DURATION: 300,
  CARD_KEYFRAMES: [
    { transform: 'translateX(0) skewX(0)', opacity: 1 },
    { transform: 'translateX(-14px) skewX(-2deg)', opacity: 0.2, offset: 0.1 },
    { transform: 'translateX(12px) skewX(1.5deg)', opacity: 1, offset: 0.2 },
    { transform: 'translateX(-10px) skewX(-1deg)', opacity: 0.3, offset: 0.3 },
    { transform: 'translateX(8px) skewX(2deg)', opacity: 0.9, offset: 0.4 },
    { transform: 'translateX(-5px) skewX(-0.5deg)', opacity: 0.4, offset: 0.55 },
    { transform: 'translateX(3px)', opacity: 1, offset: 0.7 },
    { transform: 'translateX(0) skewX(0)', opacity: 1 },
  ] as Keyframe[],
  CARD_DURATION: 400,
  ERROR_DISPLAY_DURATION: 2000,
  SWITCH_SLICES: [
    { top: '22%', height: '2%', offset: 10 },
    { top: '48%', height: '3%', offset: -8 },
    { top: '72%', height: '2%', offset: 12 },
  ],
} as const;

// カードギャラリー ポップアップ+グリッチ
export const GALLERY_POPUP = {
  POPUP_DURATION: 400,
  GLITCH_OFFSET: 350,
  GLITCH_JITTER_DURATION: 300,
  GLITCH_SLICE_DURATION: 250,
  STAGGER: {
    BACKGROUND: 100,
    DETAIL_PANEL: 300,
    NAVIGATION_CARD: 500,
  },
} as const;

