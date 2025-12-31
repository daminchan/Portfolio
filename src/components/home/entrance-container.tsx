/**
 * EntranceContainer - エントランス制御コンテナ
 *
 * スプラッシュ画面からメインコンテンツへの遷移を管理。
 * 初回訪問時はスプラッシュを表示し、クリック後にメインコンテンツへ切り替える。
 */
'use client';

import { useState } from 'react';
import { SplashScreen } from '@/components/splash';
import { MainContent } from './main-content';
import { SPLASH_ANIMATION } from '@/lib/animations';

export function EntranceContainer() {
  const [showSplash, setShowSplash] = useState(true);

  const handleEnter = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onEnter={handleEnter} />;
  }

  return (
    <div className={SPLASH_ANIMATION.CLASS.FADE_IN}>
      <MainContent />
    </div>
  );
}
