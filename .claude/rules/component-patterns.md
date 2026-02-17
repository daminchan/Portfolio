---
paths: "src/components/**/*.tsx"
---

# Component Patterns

## Server vs Client 判断アルゴリズム

### レベル1: 排除チェック（Client Component が必要）

| 条件 | 理由 |
|------|------|
| useState / useEffect / useRef を使用 | React Hooks は Client のみ |
| onClick / onChange 等のイベントハンドラ | ブラウザイベントは Client のみ |
| ブラウザAPI（window, localStorage）を使用 | サーバーに存在しない |
| Framer Motion を使用 | `"use client"` 必須 |

### レベル2: 肯定ルール（Server Component を使用）

- IF データフェッチ（async/await） → Server Component
- IF 機密情報（API Key等）を使用 → Server Component
- IF 上記いずれにも該当しない → Server Component（デフォルト）

### レベル3: 核心的質問

**「このコンポーネントはユーザーインタラクションを処理するか？」**

- はい → Client Component
- いいえ → Server Component

## "use client" 境界

- **MUST**: `"use client"` は最小のリーフコンポーネントに配置する
- **NEVER**: ページレベル（`app/**/page.tsx`）に `"use client"` を付けない
- **SHOULD**: インタラクティブな部分だけを Client Component として分離する

## children パターン（Server を Client 内に配置）

```tsx
// Client: インタラクションのみ担当
"use client"
type LayoutProps = { children: React.ReactNode }
export function InteractiveLayout({ children }: LayoutProps) {
  const [isOpen, setIsOpen] = useState(false)
  return <div>{isOpen && children}</div>
}

// Server: children として渡す
export default async function Page() {
  const data = await fetchData()
  return (
    <InteractiveLayout>
      <ServerContent data={data} />
    </InteractiveLayout>
  )
}
```

## Context Provider パターン

- **MUST**: Provider は専用ファイルに分離する（`providers/[name]-provider.tsx`）
- **MUST**: Provider ファイルには `"use client"` を付ける

## Props ルール

- **MUST**: Props の type を必ず定義する
- **MUST**: 最小限のデータのみ渡す（DBオブジェクト全体を渡さない）
- **SHOULD**: primitive 値を優先的に渡す
- **NEVER**: `any` 型を Props に使わない

## 分割基準

- **MUST**: 50行を超えるコンポーネントは分割する

```
components/[feature]/
├── [feature]-content.tsx      # 親コンポーネント
├── [section]-section.tsx      # セクション分割
└── [sub-component].tsx        # サブコンポーネント
```
