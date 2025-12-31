'use client';

import { LABELS } from '@/lib/constants';

export function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">{LABELS.APP_NAME}</span>
      </div>
    </header>
  );
}
