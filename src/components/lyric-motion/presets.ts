/**
 * LyricMotion プリセット集
 * よく使うエフェクトの組み合わせを定義
 */

import { EffectLayer } from './types';

// 縦ストレッチ（元の vStretch）
export const PRESET_V_STRETCH: EffectLayer[] = [
  { effect: 'fade', params: { duration: 0.2 } },
  { effect: 'stretchY', params: { intensity: 4, duration: 0.2 } },
  { effect: 'stretchX', params: { intensity: 0.5, duration: 0.2 } },
  { effect: 'translateY', params: { intensity: 50, duration: 0.2 } },
  { effect: 'blur', params: { intensity: 10, duration: 0.2 } },
];

// グリッチ風
export const PRESET_GLITCH: EffectLayer[] = [
  { effect: 'fade', params: { duration: 0.1 } },
  { effect: 'skewX', params: { intensity: 30, duration: 0.15 } },
  { effect: 'translateX', params: { intensity: 30, duration: 0.15 } },
];

// 横スキャン
export const PRESET_H_SCAN: EffectLayer[] = [
  { effect: 'fade', params: { duration: 0.25 } },
  { effect: 'stretchX', params: { intensity: 5, duration: 0.25 } },
  { effect: 'translateX', params: { intensity: 100, duration: 0.25 } },
  { effect: 'blur', params: { intensity: 15, duration: 0.25 } },
];

// フラッシュ（発光膨張）
export const PRESET_FLASH: EffectLayer[] = [
  { effect: 'fade', params: { duration: 0.2 } },
  { effect: 'scale', params: { intensity: 0.8, duration: 0.2 } },
  { effect: 'brightness', params: { intensity: 10, duration: 0.2 } },
  { effect: 'blur', params: { intensity: 10, duration: 0.2 } },
];

// 3Dフリップ
export const PRESET_FLIP: EffectLayer[] = [
  { effect: 'fade', params: { duration: 0.3 } },
  { effect: 'rotateY', params: { intensity: 90, duration: 0.3 } },
  { effect: 'translateZ', params: { intensity: -300, duration: 0.3 } },
];

// カスケード（落下）
export const PRESET_CASCADE: EffectLayer[] = [
  { effect: 'fade', params: { duration: 0.25 } },
  { effect: 'translateY', params: { intensity: -100, duration: 0.25 } },
  { effect: 'rotate', params: { intensity: -20, duration: 0.25 } },
];

// シンプルフェード
export const PRESET_FADE: EffectLayer[] = [
  { effect: 'fade', params: { duration: 0.3 } },
];

// ズームイン
export const PRESET_ZOOM_IN: EffectLayer[] = [
  { effect: 'fade', params: { duration: 0.3 } },
  { effect: 'scale', params: { intensity: 0.5, duration: 0.3 } },
];

// ズームアウト
export const PRESET_ZOOM_OUT: EffectLayer[] = [
  { effect: 'fade', params: { duration: 0.3 } },
  { effect: 'scale', params: { intensity: 1.5, duration: 0.3 } },
];

// 全プリセットをオブジェクトとしてエクスポート
export const PRESETS = {
  vStretch: PRESET_V_STRETCH,
  glitch: PRESET_GLITCH,
  hScan: PRESET_H_SCAN,
  flash: PRESET_FLASH,
  flip: PRESET_FLIP,
  cascade: PRESET_CASCADE,
  fade: PRESET_FADE,
  zoomIn: PRESET_ZOOM_IN,
  zoomOut: PRESET_ZOOM_OUT,
} as const;

export type PresetName = keyof typeof PRESETS;
