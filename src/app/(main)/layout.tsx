import { TransitionWrapper } from '@/components/transition';
import { MainLayoutClient } from '@/components/layout/main-layout-client';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TransitionWrapper>
      <MainLayoutClient>{children}</MainLayoutClient>
    </TransitionWrapper>
  );
}
