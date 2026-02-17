---
name: component-creator
description: Reactコンポーネントを作成する。UIパーツが必要な時に使用。Server/Client判断・type定義・50行分割・compositionパターンを適用。
---

# Component Creator

Reactコンポーネントを作成するスキル。

## 作成前の判断

### Server or Client?（判断アルゴリズム）

**レベル1: 排除チェック（Client Component が必要）**

| 条件 | 理由 |
|------|------|
| useState / useEffect を使用 | Hooks は Client のみ |
| onClick 等のイベントハンドラ | ブラウザイベント |
| Framer Motion を使用 | `"use client"` 必須 |
| ブラウザAPI（window 等） | サーバーに存在しない |

**レベル2:** 上記いずれにも該当しない → **Server Component**

**レベル3: 核心的質問**
「このコンポーネントはユーザーインタラクションを処理するか？」

詳細: @.claude/rules/component-patterns.md

## Server Component テンプレート

```tsx
import Image from "next/image"

type FeatureCardProps = {
  title: string
  imageUrl: string
}

export function FeatureCard({ title, imageUrl }: FeatureCardProps) {
  return (
    <div>
      <Image src={imageUrl} alt={title} width={400} height={300} />
      <h3>{title}</h3>
    </div>
  )
}
```

## Client Component テンプレート

```tsx
"use client"

import { useState } from "react"

import { motion } from "framer-motion"

type FeatureContentProps = {
  id: string
  initialData?: string
}

export function FeatureContent({ id, initialData }: FeatureContentProps) {
  const [value, setValue] = useState(initialData ?? "")

  const handleSubmit = () => {
    // イベントハンドラでロジック処理（useEffect不要）
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={handleSubmit}>送信</button>
    </motion.div>
  )
}
```

## Composition パターン

```tsx
// Client: インタラクションのみ
"use client"
type WrapperProps = { children: React.ReactNode }
export function AnimatedWrapper({ children }: WrapperProps) {
  return <motion.div animate={{ opacity: 1 }}>{children}</motion.div>
}

// Server Component から children で渡す
<AnimatedWrapper>
  <ServerOnlyContent data={data} />
</AnimatedWrapper>
```

## 分割パターン（50行超え時）

```
components/[feature]/
├── [feature]-content.tsx      # 親
├── [section]-section.tsx      # セクション
└── [sub-component].tsx        # サブ
```

## チェックリスト

- [ ] Server/Client の判断は正しいか
- [ ] Props の `type` を定義したか
- [ ] Props は最小限のデータか（DBオブジェクト全体を渡していないか）
- [ ] 50行超えは分割したか
- [ ] `"use client"` は最小のリーフに配置したか
- [ ] 命名規則（ファイル: kebab-case / コンポーネント: PascalCase）
- [ ] アニメーションが必要なら Framer Motion パターンに従っているか

## 参照ルール

- @.claude/rules/component-patterns.md
- @.claude/rules/react-hooks.md
- @.claude/rules/animation.md
- @.claude/rules/typescript.md
