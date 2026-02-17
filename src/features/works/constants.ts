import type { WorkItem } from '@/components/works';

export type { WorkItem };

// カテゴリデータ
export const CATEGORIES: WorkItem[] = [
  {
    id: 'youtube',
    icon: 'youtube',
    label: 'YouTube',
    href: 'https://youtube.com/',
  },
  {
    id: 'web',
    icon: 'code',
    label: 'Web作品',
    href: '/works/web',
  },
];

// カテゴリ詳細
export const CATEGORY_DETAILS: Record<string, string[]> = {
  youtube: [
    '切り抜きチャンネルを運営：登録者数3600人',
    '約二か月で登録者数1000人突破',
    '技術スタック：Premiere Pro / Photoshop',
  ],
  web: [
    'Webデザイン・制作案件をまとめています',
    '詳細は準備中です',
  ],
};
