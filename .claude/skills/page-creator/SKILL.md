---
name: page-creator
description: Next.js App Routerのページを作成する。新しいページが必要な時に使用。async Server Component・Suspense・metadata API・Server/Client分離パターンを適用。
---

# Page Creator

Next.js App Router のページを作成するスキル。

## 基本原則

- **MUST**: `app/**/page.tsx` は Server Component（`"use client"` 禁止）
- **MUST**: metadata を export する（SEO対策）
- **MUST**: インタラクティブな部分は Client Component に分離する
- **SHOULD**: データ取得は Server Component 内で async/await

## 手順

### 1. Server Component（ページ本体）

```tsx
// app/[feature]/page.tsx
import { Suspense } from "react"

import { FeatureContent } from "@/features/[feature]/components/[feature]-content"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Feature | Portfolio",
  description: "Feature description",
}

export default async function FeaturePage() {
  const data = await fetchData()

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <FeatureContent initialData={data} />
      </Suspense>
    </main>
  )
}
```

### 2. Client Component（インタラクティブ部分）

```tsx
// features/[feature]/components/[feature]-content.tsx
"use client"

import { motion } from "framer-motion"

type FeatureContentProps = {
  initialData: FeatureData
}

export function FeatureContent({ initialData }: FeatureContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* UI */}
    </motion.div>
  )
}
```

## metadata API

```tsx
// 静的 metadata
export const metadata: Metadata = {
  title: "Page Title | Portfolio",
  description: "Page description",
}

// 動的 metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await fetchItem(params.id)
  return {
    title: `${item.title} | Portfolio`,
    description: item.description,
  }
}
```

## Suspense + Streaming

```tsx
export default async function Page() {
  return (
    <>
      <Header />
      <Suspense fallback={<ItemsSkeleton />}>
        <AsyncItemsList />
      </Suspense>
    </>
  )
}

async function AsyncItemsList() {
  const items = await fetchItems()
  return <ItemsList items={items} />
}
```

## 並列データ取得

```tsx
export default async function Page() {
  const [items, categories] = await Promise.all([
    fetchItems(),
    fetchCategories(),
  ])
  return <Content items={items} categories={categories} />
}
```

## チェックリスト

- [ ] `page.tsx` に `"use client"` がないか
- [ ] `metadata` を export しているか
- [ ] インタラクティブ部分は Client Component に分離したか
- [ ] 遅いデータ取得は Suspense で囲んだか
- [ ] ページロードアニメーションを検討したか

## 参照ルール

- @.claude/rules/next-app-router.md
- @.claude/rules/component-patterns.md
- @.claude/rules/data-fetching.md
- @.claude/rules/animation.md
