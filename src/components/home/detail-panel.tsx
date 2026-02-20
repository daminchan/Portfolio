'use client';

import { BlockWipeText } from '@/components/ui/block-wipe-text';
import { ScrambleText } from '@/components/ui/scramble-text';

import type { NavItem } from '@/types';

type DetailPanelProps = {
  item: NavItem;
  refNumber: string;
};

export function DetailPanel({ item, refNumber }: DetailPanelProps) {
  return (
    <div className="relative">
      <RefLine refNumber={refNumber} />
      <TitleBlock item={item} />
      <SubDescriptionBlock item={item} />
    </div>
  );
}

function RefLine({ refNumber }: { refNumber: string }) {
  return (
    <div className="mb-4 flex items-center gap-4 opacity-70">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
      <span className="font-mono text-sm uppercase tracking-[0.2em]">
        <BlockWipeText duration={250}>
          {`Archive_Ref // ${refNumber}`}
        </BlockWipeText>
      </span>
    </div>
  );
}

function TitleBlock({ item }: { item: NavItem }) {
  return (
    <h1 className="mb-2 text-5xl font-bold uppercase leading-none tracking-tighter text-neutral-500">
      <BlockWipeText duration={250}>
        {`${item.title} (${item.archiveLabel})`}
      </BlockWipeText>
    </h1>
  );
}

function SubDescriptionBlock({ item }: { item: NavItem }) {
  return (
    <>
      <p className="mb-8 inline-block border-b border-neutral-500/30 pb-4 text-xl tracking-widest opacity-80">
        <BlockWipeText duration={250}>
          {item.subtitle}
        </BlockWipeText>
      </p>
      <p className="max-w-md border-l-4 border-neutral-500 bg-stone-300/95 p-6 text-lg leading-relaxed opacity-90 shadow-md">
        <ScrambleText duration={500}>
          {item.longDescription}
        </ScrambleText>
      </p>
    </>
  );
}
