---
paths: "**/*.tsx"
---

# Performance

## next/image

- **MUST**: `<img>` タグの代わりに `next/image` を使用する
- **MUST**: `width` と `height` を指定する（または `fill` を使用）
- **SHOULD**: ファーストビューの画像には `priority` を付ける
- **SHOULD**: `sizes` を指定してレスポンシブ最適化する

## next/font

- **MUST**: Google Fonts は `next/font/google` 経由で読み込む（外部CSSリンク禁止）
- **MUST**: `display: "swap"` を指定する
- **SHOULD**: 独自性のあるフォントを選択する（Inter, Roboto 等の汎用フォントを避ける）

## Dynamic Import

- **SHOULD**: 初期表示に不要な重いコンポーネントは `dynamic()` で遅延読み込みする
- **SHOULD**: モーダル・ドロワー・重いアニメーション要素は動的インポートの候補

```tsx
import dynamic from "next/dynamic"

const HeavyAnimation = dynamic(
  () => import("@/components/heavy-animation"),
  { loading: () => <Skeleton />, ssr: false }
)
```

## Suspense + Streaming

- **SHOULD**: 遅いデータ取得を含む部分は `<Suspense>` で囲む
- **SHOULD**: fallback に適切なスケルトンUIを配置する

## CSS パフォーマンス

- **MUST**: アニメーションは `transform` と `opacity` のみ使用する
- **NEVER**: `backdrop-blur` を動画・アニメーション要素の近くで使用しない
- **NEVER**: layout 系プロパティ（width, height, top, left）をアニメーションしない
- **SHOULD**: `backdrop-blur` の代わりに不透明度を上げる（`bg-black/90`）

詳細: @.claude/rules/animation.md
