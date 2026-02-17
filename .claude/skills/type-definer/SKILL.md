---
name: type-definer
description: TypeScript型定義を作成する。新しいデータ構造・Props型・Server Action戻り値型が必要な時に使用。type優先。
---

# Type Definer

TypeScript型定義を作成するスキル。

## 基本ルール

- **MUST**: `type` を優先使用する
- **MUST**: `import type` で型をインポートする
- **NEVER**: `any` 型を使用しない（`unknown` + 型ガードで絞り込む）
- **NEVER**: `as` による型アサーションを使わない
- **NEVER**: I/T 接頭辞を付けない（`IUser` ではなく `User`）

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
- IF 1ファイルでしか使わない → そのファイル内

### レベル3: 核心的質問

**「この型を消すとき、どのファイルと一緒に消えるべきか？」**

- コンポーネントと一緒に → 同一ファイル内
- 定数と一緒に → `constants.ts`
- feature 全体と一緒に → feature 内の `types.ts`
- 消えるべきでない → `src/types/`

## Props 型テンプレート

```tsx
// 同一ファイル内で定義
type FeatureCardProps = {
  id: string
  title: string
  imageUrl: string
  onSelect?: (id: string) => void
}
```

## データ型テンプレート

```typescript
// types/[feature].ts
export type FeatureItem = {
  id: string
  title: string
  description?: string
  createdAt: Date | string
}

export type FeatureResponse = {
  data: FeatureItem[]
  total: number
  hasMore: boolean
}
```

## Server Action 戻り値型

```typescript
export type ActionResult<T = undefined> = {
  success: boolean
  message: string
  data?: T
  error?: string
}
```

## Union型・Discriminated Union

```typescript
type Status = "idle" | "loading" | "success" | "error"

type ApiState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string }
```

## スキーマ駆動開発

```typescript
import { z } from "zod"

const itemSchema = z.object({
  title: z.string().min(1).max(100),
  email: z.string().email(),
})

type ItemInput = z.infer<typeof itemSchema>
```

## チェックリスト

- [ ] `type` を使用しているか（`interface` ではなく）
- [ ] `import type` でインポートしているか
- [ ] `any` を使用していないか
- [ ] 配置場所は判断アルゴリズムに従っているか

## 参照ルール

- @.claude/rules/typescript.md
