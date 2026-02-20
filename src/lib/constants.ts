import type { NavItem } from '@/types';

// ルート定義
export const ROUTES = {
  HOME: '/',
  GITHUB: 'https://github.com/',
  CONTACT: '/contact',
} as const;

// ラベル定義
export const LABELS = {
  APP_NAME: 'Portfolio',
  NAV: {
    HOME: 'ホーム',
    GITHUB: 'Github',
    CONTACT: 'お問い合わせ',
  },
  SPLASH: {
    TITLE: 'welcome',
    SUBTITLE: 'Portfolio',
    CTA: 'Touch to Begin',
  },
  HOME: {
    TITLE: 'Main Content',
    SUBTITLE: 'Portfolio Site',
  },
} as const;

// ホーム画面ナビゲーション
export const NAV_ITEMS: NavItem[] = [
  {
    id: 'about',
    title: 'About',
    description: '自己紹介',
    href: '/about',
    characterImage: '/characters/character1.png',
    cardBackground: '/cards/card3.jpg',
    subtitle: 'Introduction of Identity',
    longDescription:
      '自己紹介。これまでの経歴や、デザインに対する想い、使用可能なスキルセットをアーカイブしています。',
    bgText: 'ABOUT',
    archiveLabel: 'IDENTITY_LOG',
  },
  {
    id: 'works',
    title: 'Works',
    description: '制作物',
    href: '/works',
    characterImage: '/characters/character1.png',
    cardBackground: '/cards/card.jpg',
    subtitle: 'Operational Artifacts',
    longDescription:
      '製作したwebサイトやグラフィックデザインなどの実戦記録。各プロジェクトのコンセプトと解決した課題を公開中。',
    bgText: 'WORKS',
    archiveLabel: 'PRODUCED_ASSETS',
  },
  {
    id: 'contact',
    title: 'Contact',
    description: 'お問い合わせ',
    href: '/contact',
    characterImage: '/characters/character1.png',
    cardBackground: '/cards/card2.jpg',
    subtitle: 'Communication Node',
    longDescription:
      'お問合せはこちら。プロジェクトの依頼やご相談、その他メッセージは、この通信端末から送信可能です。',
    bgText: 'CONTACT',
    archiveLabel: 'COMM_TERMINAL',
  },
];
