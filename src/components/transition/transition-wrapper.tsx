/**
 * TransitionWrapper - トランジションラッパー
 *
 * レイアウトに配置するクライアントコンポーネント。
 * TransitionProviderとピクセルトランジションオーバーレイを含む。
 */
'use client';

import { ReactNode } from 'react';
import { TransitionProvider } from './transition-context';
import { PixelTransitionOverlay } from './pixel-transition-overlay';

export function TransitionWrapper({ children }: { children: ReactNode }) {
  return (
    <TransitionProvider>
      {children}
      <PixelTransitionOverlay />
    </TransitionProvider>
  );
}
