---
paths: "**/*.{ts,tsx}"
---

# TypeScript

## Props 定義

- **MUST**: `type` で明示的に定義する
- **NEVER**: `React.FC` を使わない（React 18以降非推奨）
- **MUST**: children は `React.ReactNode` で明示する

```tsx
type FeatureCardProps = {
  title: string
  imageUrl: string
  onSelect?: (id: string) => void
  children?: React.ReactNode
}
```

## 型配置の判断アルゴリズム

### レベル1: 排除チェック

| 条件 | 配置場所 |
|------|----------|
| コンポーネントの Props 型 | 同一ファイル内 |
| Zod スキーマから生成する型 | スキーマファイル内（`z.infer`） |
| 複数 feature で共有する型 | `src/types/` |

### レベル2: 肯定ルール

- IF 定数と一緒に使う型 → `constants.ts` に併記
- IF feature 内で3ファイル以上が使う → `constants.ts` or `types.ts`
- IF 型が5つ以上で複雑 → `types.ts` に分離
- IF 1ファイルでしか使わない → そのファイル内

### レベル3: 核心的質問

**「この型を消すとき、どのファイルと一緒に消えるべきか？」**

- コンポーネントと一緒に → 同一ファイル内
- 定数と一緒に → `constants.ts`
- feature 全体と一緒に → feature 内の `types.ts`
- 消えるべきでない → `src/types/`

## 型定義の重複禁止

- **NEVER**: 同じ型定義を複数作成しない
- **MUST**: 共有型は一箇所で定義し `import type` で参照する

## スキーマ駆動開発

- **MUST**: API レスポンス・フォーム入力は Zod スキーマから型を生成する（`z.infer`）
- **SHOULD**: ランタイムバリデーションで外部入力を検証する

## 型エクスポート

- **MUST**: 型のエクスポートには `export type` を使用する
- **MUST**: `import type` で型を明示的にインポートする

## バレルファイル

- **MUST**: `features/*/index.ts` は公開インターフェースとして許容
- **NEVER**: `components/ui/` や `lib/` でバレルファイルを作らない（直接 import）

## 禁止事項

- **NEVER**: `any` を使わない（`unknown` + 型ガードを使用）
- **NEVER**: `as` による型アサーションを使わない（型ガード、Zod を使用）
- **NEVER**: `// @ts-ignore` を使わない
- **NEVER**: `*.d.ts` で型定義しない（通常の `.ts` ファイルを使用）
- **NEVER**: I/T 接頭辞を付けない（`IUser`, `TUser` ではなく `User`）
