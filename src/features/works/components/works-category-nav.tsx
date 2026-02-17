'use client';

import { HyperText } from '@/components/ui/hyper-text';

import type { WorkItem } from '../constants';

type WorksCategoryNavProps = {
  categories: WorkItem[];
  selectedId: string;
  visibleItems: Set<string>;
  onCategoryChange: (id: string) => void;
};

export function WorksCategoryNav({
  categories,
  selectedId,
  visibleItems,
  onCategoryChange,
}: WorksCategoryNavProps) {
  return (
    <nav className="space-y-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`flex items-center w-full text-left transition-all duration-300 ${
            selectedId === category.id
              ? 'text-primary'
              : 'text-muted-foreground hover:text-card-foreground'
          }`}
          style={{
            opacity: visibleItems.has(category.id) ? 1 : 0,
            transform: visibleItems.has(category.id)
              ? 'translateX(0)'
              : 'translateX(-20px)',
            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
          }}
        >
          <span
            className={`w-4 h-4 mr-4 flex-shrink-0 transition-colors ${
              selectedId === category.id ? 'bg-accent' : 'bg-stone-400'
            }`}
          />
          <span className="relative py-3 px-4 flex-grow">
            <span
              className={`absolute inset-0 transition-all ${
                selectedId === category.id
                  ? 'bg-border/60'
                  : 'bg-muted/40'
              }`}
            />
            <span className="relative text-xl tracking-widest">
              {visibleItems.has(category.id) && (
                <HyperText>{category.label}</HyperText>
              )}
            </span>
          </span>
        </button>
      ))}
    </nav>
  );
}
