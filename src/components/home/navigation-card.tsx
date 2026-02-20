/**
 * NavigationCard - アーカイブカード（単体表示）
 *
 * カードフレームは固定、中身のテキストのみ ScrambleText で切り替え。
 * タブ切り替えは外部の NavButtonGroup が担当。
 */
'use client';

import { useEffect, useRef } from 'react';

import Image from 'next/image';
import { User, Briefcase, Mail, Terminal, ChevronRight } from 'lucide-react';

import { ScrambleText } from '@/components/ui/scramble-text';

import type { NavItem } from '@/types';

type NavigationCardProps = {
  item: NavItem;
  refNumber: string;
  onNavigate: () => void;
  animateIn?: boolean;
};

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  about: User,
  works: Briefcase,
  contact: Mail,
};

export function NavigationCard({
  item,
  refNumber,
  onNavigate,
  animateIn = false,
}: NavigationCardProps) {
  const Icon = ICON_MAP[item.id] || User;

  return (
    <div
      className="w-[480px] cursor-pointer border border-neutral-500/30 border-l-4 border-l-neutral-500 bg-stone-300 shadow-[25px_25px_60px_rgba(0,0,0,0.2)]"
      onClick={onNavigate}
    >
      <CardBody item={item} refNumber={refNumber} icon={Icon} animateIn={animateIn} itemId={item.id} />
    </div>
  );
}

// --- サブコンポーネント ---

function CardBody({
  item,
  refNumber,
  icon: Icon,
  animateIn,
  itemId,
}: {
  item: NavItem;
  refNumber: string;
  icon: React.ComponentType<{ size?: number }>;
  animateIn: boolean;
  itemId: string;
}) {
  return (
    <div className="relative flex h-[480px] flex-col p-6">
      <CardHeader item={item} refNumber={refNumber} icon={Icon} />
      <CardPlaceholder animateIn={animateIn} itemId={itemId} />
      <CardFooter />
    </div>
  );
}

function CardHeader({
  item,
  refNumber,
  icon: Icon,
}: {
  item: NavItem;
  refNumber: string;
  icon: React.ComponentType<{ size?: number }>;
}) {
  return (
    <>
      <div className="absolute right-6 top-0 border-x border-b border-neutral-500/20 bg-neutral-500/10 px-3 py-1 font-mono text-[10px]">
        <ScrambleText duration={400}>
          {`REF: ${refNumber}`}
        </ScrambleText>
      </div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest opacity-60">
            System.Archive
          </p>
          <h3 className="text-lg font-bold uppercase leading-tight">
            <ScrambleText duration={400}>
              {item.title}
            </ScrambleText>
          </h3>
        </div>
        <div className="border border-neutral-500 p-1.5">
          <Icon size={16} />
        </div>
      </div>
    </>
  );
}

/** 初回のみ GlitchPopup 完了を待つ: delay(500ms) + popup(400ms) */
const MOCHI_INITIAL_DELAY_MS = 900;

function CardPlaceholder({ animateIn, itemId }: { animateIn: boolean; itemId: string }) {
  const hasPlayedOnce = useRef(false);

  const delay = animateIn && !hasPlayedOnce.current ? MOCHI_INITIAL_DELAY_MS : 0;

  useEffect(() => {
    if (animateIn) hasPlayedOnce.current = true;
  }, [animateIn]);

  return (
    <div className="relative flex grow items-center justify-center border border-neutral-500/10 bg-neutral-500/5">
      <Image
        key={itemId}
        src="/icons/logo-icon-sample.png"
        alt=""
        width={540}
        height={540}
        className={animateIn ? 'animate-mochi-bounce' : 'opacity-0'}
        style={animateIn ? { animationDelay: `${delay}ms` } : undefined}
      />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-neutral-500" />
    </div>
  );
}

function CardFooter() {
  return (
    <div className="mt-auto flex justify-between pt-2 opacity-60">
      <Terminal size={14} />
      <ChevronRight size={14} className="animate-bounce-x" />
    </div>
  );
}
