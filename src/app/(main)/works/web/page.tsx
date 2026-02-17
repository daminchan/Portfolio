import type { Metadata } from 'next';

import { WebGalleryContent } from '@/features/web-gallery';

export const metadata: Metadata = {
  title: 'Web Gallery | Portfolio',
  description: 'Web作品ギャラリー',
};

export default function WebGalleryPage() {
  return <WebGalleryContent />;
}
