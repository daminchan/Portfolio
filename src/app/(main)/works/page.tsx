import type { Metadata } from 'next';

import { WorksContent } from '@/features/works';

export const metadata: Metadata = {
  title: 'Works | Portfolio',
  description: '制作物一覧',
};

export default function WorksPage() {
  return <WorksContent />;
}
