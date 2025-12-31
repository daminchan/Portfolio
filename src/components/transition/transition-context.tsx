/**
 * TransitionContext - ページ遷移状態の管理
 *
 * レイアウトレベルでトランジション状態を保持し、
 * ページ遷移時もオーバーレイが消えないようにする。
 */
'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type TransitionType = 'default' | 'pixel';

interface TransitionContextType {
  isTransitioning: boolean;
  targetHref: string | null;
  isTransitionComplete: boolean;  // トランジション完全終了フラグ
  transitionType: TransitionType;  // トランジションタイプ
  startTransition: (href: string, type?: TransitionType) => void;
  endTransition: () => void;
  setTransitionComplete: (value: boolean) => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetHref, setTargetHref] = useState<string | null>(null);
  const [isTransitionComplete, setIsTransitionComplete] = useState(true);
  const [transitionType, setTransitionType] = useState<TransitionType>('default');

  const startTransition = useCallback((href: string, type: TransitionType = 'default') => {
    setTargetHref(href);
    setTransitionType(type);
    setIsTransitioning(true);
    setIsTransitionComplete(false);  // トランジション開始時にリセット
  }, []);

  const endTransition = useCallback(() => {
    setIsTransitioning(false);
    setTargetHref(null);
  }, []);

  const setTransitionComplete = useCallback((value: boolean) => {
    setIsTransitionComplete(value);
  }, []);

  return (
    <TransitionContext.Provider
      value={{
        isTransitioning,
        targetHref,
        isTransitionComplete,
        transitionType,
        startTransition,
        endTransition,
        setTransitionComplete,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within TransitionProvider');
  }
  return context;
}
