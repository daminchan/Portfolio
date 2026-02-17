import type { Metadata } from 'next';

import { AboutContent } from '@/features/about';

export const metadata: Metadata = {
  title: 'About | Portfolio',
  description: 'LyricMotion デモ',
};

export default function AboutPage() {
  return <AboutContent />;
}
