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
}

/**
 * カード位置タイプ
 */
export type CardPosition = 'front' | 'backLeft' | 'backRight';

/**
 * カード位置のスタイル定義
 */
export interface CardPositionStyle {
  zIndex: number;
  scale: number;
  translateY: string;
  translateX: string;
  opacity: number;
  blur: number;
}
