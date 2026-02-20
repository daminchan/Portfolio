// 共通の型定義

/**
 * ナビゲーションカードのアイテム
 */
export interface NavItem {
  id: string;
  title: string;
  description: string;
  href: string;
  characterImage: string;
  cardBackground: string | null;
  subtitle: string;
  longDescription: string;
  bgText: string;
  archiveLabel: string;
}
