import { PRESETS } from '@/components/lyric-motion';

import type { EffectLayer } from '@/components/lyric-motion';

export type TimelineItem = {
  id: string;
  text: string;
  effects: EffectLayer[];
  stagger?: number;
  size?: string;
};

export const TIMELINE: TimelineItem[] = [
  {
    id: 'signal',
    text: 'SIGNAL',
    effects: PRESETS.vStretch,
    stagger: 0.03,
    size: 'text-8xl',
  },
  {
    id: 'beyond',
    text: 'BEYOND',
    effects: PRESETS.vStretch,
    stagger: 0.03,
    size: 'text-9xl',
  },
  {
    id: 'flash',
    text: 'FLASH',
    effects: [
      { effect: 'fade', params: { duration: 0.15 } },
      { effect: 'stretchY', params: { intensity: 6, duration: 0.15 } },
      { effect: 'stretchX', params: { intensity: 0.3, duration: 0.15 } },
      { effect: 'blur', params: { intensity: 15, duration: 0.15 } },
    ],
    stagger: 0.02,
    size: 'text-[12rem]',
  },
];
