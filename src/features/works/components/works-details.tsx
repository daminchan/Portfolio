'use client';

import Link from 'next/link';

import { HyperText } from '@/components/ui/hyper-text';

import type { WorkItem } from '../constants';

type WorksDetailsProps = {
  currentItem: WorkItem;
  currentDetails: string[];
  selectedId: string;
  visibleItems: Set<string>;
};

export function WorksDetails({
  currentItem,
  currentDetails,
  selectedId,
  visibleItems,
}: WorksDetailsProps) {
  const isVisible = visibleItems.has('details');

  return (
    <>
      <div
        className="border-t border-border pt-8 mt-10"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        }}
      >
        <p className="text-lg text-secondary-foreground mb-4 tracking-wider">
          {isVisible && (
            <HyperText key={selectedId}>{currentItem.label}</HyperText>
          )}
        </p>
        <div className="space-y-2">
          {currentDetails.map((line, index) => (
            <p
              key={`${selectedId}-${index}`}
              className="text-base text-muted-foreground"
              style={{
                opacity: isVisible ? 1 : 0,
                transition: `opacity 0.3s ease-out ${index * 0.1}s`,
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      <Link
        href="/"
        className="inline-block mt-10 px-4 py-2 text-base text-muted-foreground tracking-wider transition-all hover:bg-muted hover:text-foreground hover:font-medium"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.5s ease-out 0.3s, background-color 0.2s, color 0.2s',
        }}
      >
        ← TOP に戻る
      </Link>
    </>
  );
}
