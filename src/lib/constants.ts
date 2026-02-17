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
    TITLE: 'Welcome',
    SUBTITLE: 'Portfolio Site',
    CTA: 'Touch to Begin',
    FOOTER: 'Portfolio Entrance',
  },
  HOME: {
    TITLE: 'Main Content',
    SUBTITLE: 'Portfolio Site',
  },
} as const;

// サイドバーナビゲーション
export const SIDEBAR_NAV = [
  { id: 'home', label: LABELS.NAV.HOME, href: ROUTES.HOME, icon: 'Home' },
  { id: 'github', label: LABELS.NAV.GITHUB, href: ROUTES.GITHUB, icon: 'Github', external: true },
  { id: 'contact', label: LABELS.NAV.CONTACT, href: ROUTES.CONTACT, icon: 'Mail' },
] as const;

// ホーム画面ナビゲーション
export const NAV_ITEMS: NavItem[] = [
  {
    id: 'works',
    title: 'Works',
    description: '制作物',
    href: '/works',
    characterImage: '/characters/placeholder.png',
    cardBackground: '/cards/card.jpg',
  },
  {
    id: 'about',
    title: 'About',
    description: '自己紹介',
    href: '/about',
    characterImage: '/characters/placeholder.png',
    cardBackground: '/cards/card3.jpg',
  },
  {
    id: 'contact',
    title: 'Contact',
    description: 'お問い合わせ',
    href: '/contact',
    characterImage: '/characters/placeholder.png',
    cardBackground: '/cards/card2.jpg',
  },
];
