/**
 * TransitionWrapper - トランジションラッパー
 *
 * レイアウトに配置するクライアントコンポーネント。
 * TransitionProviderと各種トランジションオーバーレイを含む。
 *
 * トランジションタイプ:
 * - 'default': ひび割れ→ブロック縮小（従来の動き）
 * - 'pixel': ピクセル分割フェードアウト
 */
'use client';

import { ReactNode } from 'react';
import { TransitionProvider } from './transition-context';
import { TransitionOverlay } from './transition-overlay';
import { PixelTransitionOverlay } from './pixel-transition-overlay';

export function TransitionWrapper({ children }: { children: ReactNode }) {
  return (
    <TransitionProvider>
      {children}
      <TransitionOverlay />
      <PixelTransitionOverlay />
    </TransitionProvider>
  );
}
