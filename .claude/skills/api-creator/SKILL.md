---
name: api-creator
description: Server ActionまたはAPI Routeを作成する。データ変更にはServer Actionを優先。外部API連携・Webhook受信にはRoute Handlerを使用。
---

# API Creator

Server Action / API Route を作成するスキル。

## 判断アルゴリズム

### レベル1: 排除チェック（Route Handler を使用）

| 条件 | 理由 |
|------|------|
| 外部サービスからのWebhook受信 | HTTP エンドポイントが必要 |
| ストリーミングレスポンス | Server Action では不可 |
| 外部API連携のプロキシ | CORS回避等 |

### レベル2: 肯定ルール

- IF DB 作成・更新・削除 → **Server Action**
- IF フォーム送信 → **Server Action**
- IF 認証が必要なデータ変更 → **Server Action**

### レベル3: 核心的質問

**「外部からHTTPエンドポイントとしてアクセスされる必要があるか？」**

- はい → Route Handler
- いいえ → Server Action

## Server Action テンプレート

```typescript
"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

const createItemSchema = z.object({
  title: z.string().min(1).max(100),
})

type ActionResult<T = undefined> = {
  success: boolean
  message: string
  data?: T
  error?: string
}

export async function createItem(formData: FormData): Promise<ActionResult> {
  const parsed = createItemSchema.safeParse({
    title: formData.get("title"),
  })
  if (!parsed.success) {
    return { success: false, message: "バリデーションエラー" }
  }

  // DB操作
  revalidatePath("/items")
  return { success: true, message: "作成しました" }
}
```

## クライアント側連携（React 19）

### useActionState

```tsx
"use client"
import { useActionState } from "react"
import { createItem } from "@/lib/actions/items"

export function CreateForm() {
  const [state, action, isPending] = useActionState(createItem, null)
  return (
    <form action={action}>
      <input name="title" required />
      <button disabled={isPending}>
        {isPending ? "送信中..." : "作成"}
      </button>
      {state?.error && <p>{state.message}</p>}
    </form>
  )
}
```

## Route Handler テンプレート（外部API用のみ）

```typescript
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Webhook処理等
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
```

## チェックリスト

- [ ] Server Action vs Route Handler の判断は正しいか
- [ ] `"use server"` ディレクティブがあるか
- [ ] zod で入力バリデーションしたか
- [ ] `ActionResult` 型で返却しているか
- [ ] `revalidatePath` でキャッシュ更新しているか

## 参照ルール

- @.claude/rules/data-fetching.md
- @.claude/rules/security.md
