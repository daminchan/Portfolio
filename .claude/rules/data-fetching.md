---
paths:
  - "src/app/**/*.tsx"
  - "src/lib/actions/**/*.ts"
---

# Data Fetching

## Server Component での直接 fetch

- **MUST**: データ取得は Server Component 内で `async/await` を使用する
- **SHOULD**: 複数の独立したデータ取得は `Promise.all` で並列化する

```tsx
export default async function Page() {
  const [items, categories] = await Promise.all([
    fetchItems(),
    fetchCategories(),
  ])
  return <Content items={items} categories={categories} />
}
```

## Server Action vs Route Handler 判断

| 用途 | 推奨 |
|------|------|
| DB 作成・更新・削除 | **Server Action** |
| フォーム送信 | **Server Action** |
| 外部API連携（Webhook受信等） | Route Handler |
| ストリーミングレスポンス | Route Handler |

→ **迷ったら Server Action を優先**

## Server Action 構造

```typescript
"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

const schema = z.object({ title: z.string().min(1).max(100) })

type ActionResult = {
  success: boolean
  message: string
  error?: string
}

export async function createItem(formData: FormData): Promise<ActionResult> {
  const parsed = schema.safeParse({ title: formData.get("title") })
  if (!parsed.success) {
    return { success: false, message: "バリデーションエラー" }
  }
  // DB操作
  revalidatePath("/items")
  return { success: true, message: "作成しました" }
}
```

## 必須ルール

- **MUST**: Server Action 先頭に `"use server"` ディレクティブ
- **MUST**: 入力バリデーション（zod 推奨）
- **MUST**: `ActionResult` 型で統一的に返却
- **MUST**: `revalidatePath` / `revalidateTag` でキャッシュ更新
- **SHOULD**: Server Action ファイルは `lib/actions/` に配置

## クライアント側連携（React 19）

- `useActionState` — フォーム送信 + pending 状態
- `useOptimistic` — 即座にUI更新、サーバー応答後に確定

## キャッシュ戦略

- `revalidatePath(path)` — 特定パスのキャッシュ無効化
- `revalidateTag(tag)` — タグベースのキャッシュ無効化
- `{ next: { revalidate: 3600 } }` — 時間ベースの再検証（ISR）
- `{ cache: "no-store" }` — キャッシュ無効（動的データ）
