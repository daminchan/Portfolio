/**
 * HomeContainer - ホームコンテンツコンテナ
 *
 * スプラッシュ画面からカードギャラリーへの遷移を管理。
 * 初回訪問時はスプラッシュを表示し、クリック後にカードギャラリーへ切り替える。
 */
'use client';

import { useState } from 'react';
import { SplashScreen } from './splash-screen';
import { CardGallery } from './card-gallery';
import { SPLASH_ANIMATION } from '@/lib/animations';

export function HomeContainer() {
  const [showSplash, setShowSplash] = useState(true);

  const handleEnter = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onEnter={handleEnter} />;
  }

  return (
    <div className={SPLASH_ANIMATION.CLASS.FADE_IN}>
      <CardGallery />
    </div>
  );
}
