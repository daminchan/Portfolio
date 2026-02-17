---
paths: "src/**/*.{ts,tsx}"
---

# 命名規則

## 一覧

| 対象 | 規則 | 例 |
|------|------|-----|
| ファイル名 | kebab-case | `hero-background.tsx` |
| フォルダ名 | kebab-case | `hero/`, `lyric-motion/` |
| コンポーネント名 | PascalCase | `HeroBackground` |
| 関数・変数 | camelCase | `handleClick`, `userName` |
| 定数 | UPPER_SNAKE_CASE | `MAX_HEIGHT`, `NAV_ITEMS` |
| Hooks | camelCase + use接頭辞 | `use-scroll.ts` → `useScroll()` |
| 型・type | PascalCase | `ButtonProps`, `UserData` |

## ファイル名: kebab-case

- **MUST**: kebab-case を使用する（クロスプラットフォーム互換、URL親和性）
- **MUST**: ファイル名とエクスポート名を対応させる（`clip-card.tsx` → `export function ClipCard`）
- **NEVER**: PascalCase、camelCase、snake_case をファイル名に使わない

## コンポーネント名: PascalCase

- **MUST**: JSX がコンポーネントを認識するために大文字開始が必須

## 禁止事項

- **NEVER**: 型に I/T 接頭辞を付けない（TypeScript公式で非推奨）
- **NEVER**: 略語の乱用（`btn` → `button`）
- **NEVER**: 数字開始の変数名
