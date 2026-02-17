export type GalleryItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  tags: string[];
  /** 画像パス（public/ 配下）。未設定時はプレースホルダーグラデーション */
  image: string | null;
};

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'portfolio',
    title: 'Portfolio Site',
    description: 'Next.js + Framer Motion で構築した幻想的なポートフォリオサイト',
    href: 'https://example.com/portfolio',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    image: null,
  },
  {
    id: 'landing-page',
    title: 'Landing Page',
    description: 'モダンなランディングページのデザイン・コーディング',
    href: 'https://example.com/landing',
    tags: ['HTML', 'CSS', 'JavaScript'],
    image: null,
  },
  {
    id: 'web-app',
    title: 'Web Application',
    description: 'フルスタックWebアプリケーションの設計・開発',
    href: 'https://example.com/webapp',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    image: null,
  },
];
