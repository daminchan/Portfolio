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

// スプラッシュ画面用アニメーション
export const SPLASH_ANIMATION = {
  // 各要素の出現ディレイ（ms）
  DELAY: {
    WELCOME: 300,
    PORTFOLIO: 1000,
    CTA: 2000,
  },
  // 画面遷移タイミング（ms）
  TIMING: {
    EXIT_DELAY: 600,
  },
  // トランジション
  TRANSITION: {
    SCREEN: 'transition-opacity duration-[800ms]',
  },
} as const;

