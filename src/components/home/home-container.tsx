/**
 * HomeContainer - イントロアニメーション管理
 *
 * Scene 1: Welcome（グリッチ画像）
 * Scene 1→2: クロスディゾルブ
 * Scene 2: タイトルテキスト + 幾何学ブロック
 * Scene 2→3: ブロックリビールトランジション
 * Scene 3: CardGallery（トップページ）
 */
'use client';

import { useEffect, useState } from 'react';

import { INTRO_TITLE } from '@/lib/animations';

import { CardGallery } from './card-gallery';
import { IntroReveal } from './intro-reveal';
import { IntroTitle } from './intro-title';
import { IntroWelcome } from './intro-welcome';

type Scene = 'scene1' | 'scene1to2' | 'scene2' | 'scene2to3' | 'scene3';

export function HomeContainer() {
  const [scene, setScene] = useState<Scene>('scene1');
  const [fadeReady, setDissolveVisible] = useState(false);

  useEffect(() => {
    if (scene !== 'scene1to2') return;

    const rafId = requestAnimationFrame(() => {
      setDissolveVisible(true);
    });

    const timer = setTimeout(() => {
      setScene('scene2');
    }, INTRO_TITLE.FADE_IN_DURATION);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [scene]);

  const showWelcome = scene === 'scene1' || scene === 'scene1to2';
  const showTitle = scene === 'scene1to2' || scene === 'scene2' || scene === 'scene2to3';
  const showGallery = scene === 'scene2' || scene === 'scene2to3' || scene === 'scene3';
  const showReveal = scene === 'scene2to3';
  const galleryAnimateIn = scene === 'scene2to3' || scene === 'scene3';

  return (
    <>
      {/* Scene 1: Welcome（グリッチ画像） */}
      {showWelcome && (
        <IntroWelcome onComplete={() => setScene('scene1to2')} />
      )}

      {/* Scene 2: タイトルテキスト + 幾何学ブロック */}
      {showTitle && (
        <div
          className="relative z-[60]"
          style={{
            opacity: scene !== 'scene1to2' || fadeReady ? 1 : 0,
            transition: `opacity ${INTRO_TITLE.FADE_IN_DURATION}ms ease-out`,
          }}
        >
          <IntroTitle onComplete={() => setScene('scene2to3')} />
        </div>
      )}

      {/* Scene 3: CardGallery — scene2 から裏で待機、同一ツリー位置を維持 */}
      {showGallery && (
        <div
          className={showReveal ? 'intro-gallery fixed inset-0' : 'fixed inset-0'}
          style={{
            zIndex: 65,
            ...(scene === 'scene2' ? { visibility: 'hidden' as const } : {}),
          }}
        >
          <CardGallery animateIn={galleryAnimateIn} />
        </div>
      )}

      {/* Scene 2→3 トランジション: ブロックリビール */}
      {showReveal && (
        <IntroReveal onComplete={() => setScene('scene3')} />
      )}
    </>
  );
}
