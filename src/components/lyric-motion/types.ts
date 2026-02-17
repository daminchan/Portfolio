/**
 * LyricMotion 型定義
 */

// エフェクトのパラメータ
export interface EffectParams {
  intensity?: number;
  duration?: number;
  delay?: number;
  ease?: number[] | string;
}

// エフェクトの結果（hidden/visible/exit状態）
export interface EffectResult {
  hidden: Record<string, unknown>;
  visible: Record<string, unknown>;
  exit?: Record<string, unknown>;
}

// エフェクトレイヤー（1つのエフェクト設定）
export interface EffectLayer {
  effect: string;
  params?: EffectParams;
}

// LyricMotion コンポーネントの Props
export interface LyricMotionProps {
  children: React.ReactNode;
  effects: EffectLayer[];
  stagger?: number;
  size?: string;
  className?: string;
  // RGB色収差を有効にするか
  rgbSplit?: boolean;
}
