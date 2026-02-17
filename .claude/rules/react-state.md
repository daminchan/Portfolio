---
paths: "**/*.tsx"
---

# React State 管理

## useState vs useReducer 判断アルゴリズム

### レベル1: 排除チェック（useState を使用）

| 条件 | useState を使用 |
|------|----------------|
| 独立した単純な値（boolean, string, number） | `useState` |
| 他の state に依存しない | `useState` |
| 更新ロジックが `setState(newValue)` のみ | `useState` |

### レベル2: 肯定ルール（useReducer を使用）

- IF 関連する複数の値が同時に更新される → `useReducer`
- IF 次の状態が前の状態に依存する複雑なロジック → `useReducer`
- IF 状態遷移のパターンが3つ以上ある → `useReducer`
- IF フォーム状態が5フィールド以上 → `useReducer`

### レベル3: 核心的質問

**「この state の更新ロジックは `setState(newValue)` だけで表現できるか？」**

- はい → `useState`
- いいえ → `useReducer`

## 状態設計 5原則

1. **関連する状態はグループ化する**
   ```tsx
   // NG
   const [x, setX] = useState(0)
   const [y, setY] = useState(0)
   // OK
   const [position, setPosition] = useState({ x: 0, y: 0 })
   ```

2. **矛盾する状態を排除する**
   ```tsx
   // NG: isSending と isSent が同時にtrueになりうる
   const [isSending, setIsSending] = useState(false)
   const [isSent, setIsSent] = useState(false)
   // OK: status enum
   const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
   ```

3. **冗長な状態を排除する**（既存 state/props から計算できる値を state にしない）

4. **重複する状態を排除する**（ID で保持し、find で取得）
   ```tsx
   // NG
   const [selectedItem, setSelectedItem] = useState(null)
   // OK
   const [selectedId, setSelectedId] = useState<string | null>(null)
   const selectedItem = items.find(i => i.id === selectedId)
   ```

5. **深いネストを排除する**（フラット化するか、ID で参照）

## 必須ルール

- **MUST**: 派生値は state ではなく render 内で計算する
- **MUST**: リスト内の選択はオブジェクトではなく ID で保持する
- **NEVER**: props をそのまま state の初期値にコピーしない
- **SHOULD**: 状態遷移が複雑な場合は status enum パターンを使う

> Source: [React Docs - Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
