---
paths: "src/app/**/*.{ts,tsx}"
---

# Next.js App Router

## Server vs Client Components

- **MUST**: デフォルトは Server Component（`"use client"` を書かない）
- **MUST**: Client Component はインタラクティブが必要な場合のみ（useState, onClick, Framer Motion 等）
- **NEVER**: `"use client"` を乱用しない
- **NEVER**: Client Component でデータフェッチしない（特別な理由がない限り）

## ファイル規則

| ファイル | 用途 |
|----------|------|
| `page.tsx` | ルートUI |
| `layout.tsx` | 共有レイアウト |
| `loading.tsx` | ローディングUI |
| `error.tsx` | エラーバウンダリ |

## metadata API

- **MUST**: 各ページに `metadata` を export する（SEO対策）
- **SHOULD**: 動的ページでは `generateMetadata` を使用する

```tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Page Title | Portfolio",
  description: "Page description",
}
```

## リンク

- **MUST**: 内部・外部リンク問わず、すべて `<Link>` を使用する
- **NEVER**: `<a>` タグを直接使わない

```tsx
<Link
  href={url}
  target={isExternal ? "_blank" : undefined}
  rel={isExternal ? "noopener noreferrer" : undefined}
>
  リンクテキスト
</Link>
```

## 禁止事項

- **NEVER**: app ディレクトリにコンポーネントを詰め込まない
- **NEVER**: page.tsx に `"use client"` を付けない
