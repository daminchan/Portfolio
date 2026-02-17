/**
 * LyricMotion エフェクト関数
 * 各エフェクトはパラメータを受け取り、hidden/visible/exit状態を返す
 */

import { EffectParams, EffectResult, EffectLayer } from './types';

// エフェクト関数の型
type EffectFunction = (params: EffectParams) => EffectResult;

// ============================================
// 個別エフェクト関数
// ============================================

export const EFFECTS: Record<string, EffectFunction> = {
  // フェードイン/アウト
  fade: (params: EffectParams = {}): EffectResult => {
    const { duration = 0.2, ease = "easeOut" } = params;
    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration, ease }
      },
      exit: { opacity: 0, transition: { duration: 0.1 } }
    };
  },

  // 縦方向のストレッチ
  stretchY: (params: EffectParams = {}): EffectResult => {
    const { intensity = 4, duration = 0.2, ease = [0.33, 1, 0.68, 1] } = params;
    return {
      hidden: { scaleY: intensity },
      visible: {
        scaleY: 1,
        transition: { duration, ease }
      },
      exit: { scaleY: 0, transition: { duration: 0.1 } }
    };
  },

  // 横方向のストレッチ
  stretchX: (params: EffectParams = {}): EffectResult => {
    const { intensity = 0.5, duration = 0.2, ease = [0.33, 1, 0.68, 1] } = params;
    return {
      hidden: { scaleX: intensity },
      visible: {
        scaleX: 1,
        transition: { duration, ease }
      },
      exit: { scaleX: 0, transition: { duration: 0.1 } }
    };
  },

  // Y軸移動
  translateY: (params: EffectParams = {}): EffectResult => {
    const { intensity = 50, duration = 0.2, ease = [0.33, 1, 0.68, 1] } = params;
    return {
      hidden: { y: intensity },
      visible: {
        y: 0,
        transition: { duration, ease }
      },
      exit: { y: -intensity, transition: { duration: 0.1 } }
    };
  },

  // X軸移動
  translateX: (params: EffectParams = {}): EffectResult => {
    const { intensity = 50, duration = 0.2, ease = [0.33, 1, 0.68, 1] } = params;
    return {
      hidden: { x: intensity },
      visible: {
        x: 0,
        transition: { duration, ease }
      },
      exit: { x: -intensity, transition: { duration: 0.1 } }
    };
  },

  // ぼかし
  blur: (params: EffectParams = {}): EffectResult => {
    const { intensity = 10, duration = 0.2, ease = "easeOut" } = params;
    return {
      hidden: { filter: `blur(${intensity}px)` },
      visible: {
        filter: 'blur(0px)',
        transition: { duration, ease }
      },
      exit: { filter: `blur(${intensity / 2}px)`, transition: { duration: 0.1 } }
    };
  },

  // スケール（均等）
  scale: (params: EffectParams = {}): EffectResult => {
    const { intensity = 0, duration = 0.2, ease = "easeOut" } = params;
    return {
      hidden: { scale: intensity },
      visible: {
        scale: 1,
        transition: { duration, ease }
      },
      exit: { scale: 0.5, transition: { duration: 0.1 } }
    };
  },

  // 回転
  rotate: (params: EffectParams = {}): EffectResult => {
    const { intensity = 90, duration = 0.3, ease = "easeOut" } = params;
    return {
      hidden: { rotate: intensity },
      visible: {
        rotate: 0,
        transition: { duration, ease }
      },
      exit: { rotate: -intensity / 2, transition: { duration: 0.1 } }
    };
  },

  // 傾き（skewX）
  skewX: (params: EffectParams = {}): EffectResult => {
    const { intensity = 30, duration = 0.2, ease = "easeOut" } = params;
    return {
      hidden: { skewX: intensity },
      visible: {
        skewX: 0,
        transition: { duration, ease }
      },
      exit: { skewX: -intensity / 2, transition: { duration: 0.1 } }
    };
  },

  // 傾き（skewY）
  skewY: (params: EffectParams = {}): EffectResult => {
    const { intensity = 30, duration = 0.2, ease = "easeOut" } = params;
    return {
      hidden: { skewY: intensity },
      visible: {
        skewY: 0,
        transition: { duration, ease }
      },
      exit: { skewY: -intensity / 2, transition: { duration: 0.1 } }
    };
  },

  // 3D回転X
  rotateX: (params: EffectParams = {}): EffectResult => {
    const { intensity = 90, duration = 0.3, ease = "easeOut" } = params;
    return {
      hidden: { rotateX: intensity },
      visible: {
        rotateX: 0,
        transition: { duration, ease }
      },
      exit: { rotateX: -intensity / 2, transition: { duration: 0.1 } }
    };
  },

  // 3D回転Y
  rotateY: (params: EffectParams = {}): EffectResult => {
    const { intensity = 90, duration = 0.3, ease = "easeOut" } = params;
    return {
      hidden: { rotateY: intensity },
      visible: {
        rotateY: 0,
        transition: { duration, ease }
      },
      exit: { rotateY: -intensity / 2, transition: { duration: 0.1 } }
    };
  },

  // 奥行き（Z軸）
  translateZ: (params: EffectParams = {}): EffectResult => {
    const { intensity = -500, duration = 0.3, ease = "easeOut" } = params;
    return {
      hidden: { z: intensity },
      visible: {
        z: 0,
        transition: { duration, ease }
      },
      exit: { z: intensity / 2, transition: { duration: 0.1 } }
    };
  },

  // 明るさ（brightness）
  brightness: (params: EffectParams = {}): EffectResult => {
    const { intensity = 10, duration = 0.2, ease = "easeOut" } = params;
    return {
      hidden: { filter: `brightness(${intensity})` },
      visible: {
        filter: 'brightness(1)',
        transition: { duration, ease }
      },
      exit: { filter: `brightness(${intensity / 2})`, transition: { duration: 0.1 } }
    };
  },
};

// ============================================
// エフェクト合成ユーティリティ
// ============================================

/**
 * 複数のエフェクトをマージして1つの variants オブジェクトにする
 */
export const mergeEffects = (layers: EffectLayer[]): EffectResult => {
  const results = layers.map(layer => {
    const effectFn = EFFECTS[layer.effect];
    if (!effectFn) {
      console.warn(`Unknown effect: ${layer.effect}`);
      return { hidden: {}, visible: {}, exit: {} };
    }
    return effectFn(layer.params || {});
  });

  const merged: EffectResult = {
    hidden: {},
    visible: {},
    exit: {}
  };

  results.forEach(result => {
    // hidden をマージ
    merged.hidden = { ...merged.hidden, ...result.hidden };

    // visible をマージ（transitionは最後のものを使用）
    const { transition: visibleTransition, ...visibleRest } = result.visible as Record<string, unknown>;
    merged.visible = { ...merged.visible, ...visibleRest };
    if (visibleTransition) {
      merged.visible.transition = visibleTransition;
    }

    // exit をマージ
    if (result.exit) {
      const { transition: exitTransition, ...exitRest } = result.exit as Record<string, unknown>;
      merged.exit = { ...merged.exit, ...exitRest };
      if (exitTransition) {
        merged.exit!.transition = exitTransition;
      }
    }
  });

  return merged;
};

// エフェクト名の一覧を取得
export const getEffectNames = (): string[] => Object.keys(EFFECTS);
