/**
 * CardGallery - アーカイブ風カードギャラリー
 *
 * スプラッシュ画面通過後に表示されるナビゲーション画面。
 * 左: 詳細パネル + ゲーム風ナビボタン / 右: 大きなアーカイブカード
 * 背景: 斜めテキスト + 散らばった装飾カード
 * 切替時: 全テキストにグリッチ演出
 */
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

import { useTransition } from '@/components/transition';
import { ScrambleText } from '@/components/ui/scramble-text';
import { GALLERY_GLITCH, GALLERY_POPUP } from '@/lib/animations';
import { NAV_ITEMS } from '@/lib/constants';

import { DetailPanel } from './detail-panel';
import { GlitchPopup } from './glitch-popup';
import { MarginDecoration } from './margin-decoration';
import { NavigationCard } from './navigation-card';
import { NoiseOverlay } from './noise-overlay';
import { RedactedCard } from './redacted-card';

import type { NavItem } from '@/types';

// --- グリッチ切替アニメーション ---

function triggerGlitch(...refs: React.RefObject<HTMLDivElement | null>[]) {
  refs.forEach(ref =>
    ref.current?.animate(GALLERY_GLITCH.KEYFRAMES as Keyframe[], {
      duration: GALLERY_GLITCH.DURATION,
      easing: 'ease-out',
    }),
  );
}

// --- メインコンポーネント ---

type CardGalleryProps = {
  /** true でポップアップアニメーション発火。false で静止表示 */
  animateIn?: boolean;
};

export function CardGallery({ animateIn = true }: CardGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const { startTransition } = useTransition();
  const detailRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const glitchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const activeItem = NAV_ITEMS[activeIndex];
  const refNumber = String(activeIndex + 1).padStart(3, '0');

  useEffect(() => {
    return () => {
      if (glitchTimer.current) clearTimeout(glitchTimer.current);
    };
  }, []);

  const handleNavigate = useCallback(() => {
    startTransition(activeItem.href);
  }, [startTransition, activeItem.href]);

  const handleTabChange = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      setActiveIndex(index);
      triggerGlitch(detailRef, cardRef, bgRef);
      setIsGlitching(true);
      if (glitchTimer.current) clearTimeout(glitchTimer.current);
      glitchTimer.current = setTimeout(() => setIsGlitching(false), GALLERY_GLITCH.DURATION);
    },
    [activeIndex],
  );

  return (
    <div className="relative h-screen overflow-hidden bg-stone-200 font-serif text-neutral-500">
      <NoiseOverlay opacity={0.1} />
      <MarginDecoration side="left" />
      <MarginDecoration side="right" />

      <div ref={bgRef}>
        <BgText text={activeItem.bgText} />
      </div>
      <DecorativeCards />

      <div className="relative mx-auto flex h-full max-w-[1440px] items-center">
        {/* コンテンツ内装飾カード（クリック可） */}
        <RedactedCard
          width={260}
          height={300}
          style={{ left: '42%', top: '4%', transform: 'rotate(5deg)' }}
        />
        <RedactedCard
          width={280}
          height={320}
          style={{ right: '26%', bottom: '4%', transform: 'rotate(-12deg)' }}
        />
        <RedactedCard
          width={240}
          height={280}
          style={{ left: '24%', bottom: '6%', transform: 'rotate(10deg)' }}
        />

        {/* 左: DetailPanel + NavButtons */}
        <div className="relative z-10 flex w-5/12 flex-col justify-end pb-16 pl-16">
          <GlitchPopup delay={GALLERY_POPUP.STAGGER.DETAIL_PANEL} active={animateIn}>
            <div ref={detailRef}>
              <DetailPanel item={activeItem} refNumber={refNumber} />
            </div>
          </GlitchPopup>
          <GlitchPopup delay={GALLERY_POPUP.STAGGER.DETAIL_PANEL + 100} active={animateIn}>
            <NavButtonGroup
              items={NAV_ITEMS}
              activeIndex={activeIndex}
              onChange={handleTabChange}
            />
          </GlitchPopup>
        </div>

        {/* 右: 大きなアーカイブカード */}
        <div className="relative z-10 flex w-7/12 items-center justify-center">
          <GlitchPopup delay={GALLERY_POPUP.STAGGER.NAVIGATION_CARD} active={animateIn}>
            <div ref={cardRef}>
              <NavigationCard
                item={activeItem}
                refNumber={refNumber}
                onNavigate={handleNavigate}
                animateIn={animateIn}
              />
            </div>
          </GlitchPopup>
        </div>
      </div>

      {isGlitching && <SwitchGlitchOverlay />}
    </div>
  );
}

// --- サブコンポーネント ---

function BgText({ text }: { text: string }) {
  return (
    <div
      className="pointer-events-none absolute left-[10%] top-[5%] z-0 select-none text-[14rem] font-bold uppercase leading-none tracking-tight text-neutral-500/[0.04]"
      style={{ transform: 'rotate(-15deg)' }}
    >
      <ScrambleText duration={600}>{text}</ScrambleText>
    </div>
  );
}

function DecorativeCards() {
  return (
    <>
      <RedactedCard
        width={320}
        height={360}
        style={{ right: '18%', top: '6%', transform: 'rotate(8deg)' }}
      />
      <RedactedCard
        width={260}
        height={300}
        style={{ left: '16%', top: '10%', transform: 'rotate(-6deg)' }}
      />
    </>
  );
}

type NavButtonGroupProps = {
  items: NavItem[];
  activeIndex: number;
  onChange: (index: number) => void;
};

function NavButtonGroup({ items, activeIndex, onChange }: NavButtonGroupProps) {
  return (
    <div className="mt-8 flex flex-col gap-3">
      {items.map((item, i) => (
        <button
          key={item.id}
          onClick={() => onChange(i)}
          className={`border px-6 py-3 text-left font-mono text-xs uppercase tracking-widest transition-colors ${
            i === activeIndex
              ? 'border-l-4 border-l-neutral-500 border-neutral-500/50 bg-stone-300 text-neutral-500 shadow-md'
              : 'border-neutral-500/20 bg-stone-200/80 text-neutral-500/40 hover:border-neutral-500/30 hover:text-neutral-500/60'
          }`}
        >
          {item.title}
        </button>
      ))}
    </div>
  );
}

function SwitchGlitchOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <div
        className="absolute inset-0 bg-white/10"
        style={{ animation: 'glitch-flash 200ms ease-out both' }}
      />
      {GALLERY_GLITCH.SWITCH_SLICES.map((slice, i) => (
        <div
          key={i}
          className="absolute inset-x-0 bg-neutral-500/20"
          style={{
            top: slice.top,
            height: slice.height,
            animation: `glitch-slice 200ms ease-out ${i * 20}ms both`,
            '--slice-offset': `${slice.offset}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
