---
paths: "**/*.tsx"
---

# React コンポーネント・Hooks

## 基本原則

- **MUST**: 1コンポーネント = 1つの責任（「and」で説明が必要なら分割）
- **MUST**: Props は `type` で明示的に定義し、`React.FC` は使わない
- **MUST**: 50行を超えるコンポーネントは分割する

## useEffect 使用判断アルゴリズム

### レベル1: 排除チェック（該当すれば useEffect 不使用）

| 該当条件 | 代替手段 |
|----------|----------|
| API データ取得 | Server Component / fetch |
| 外部ストアの購読 | `useSyncExternalStore` |
| Props/State から計算できる値（低コスト） | レンダリング中に直接計算 |
| Props/State から計算できる値（高コスト） | `useMemo` |
| ユーザー操作への反応 | イベントハンドラ |
| Props 変更時の State リセット | `key` 属性でコンポーネント再マウント |
| フォーム送信（React 19） | `useActionState` / `useOptimistic` |

### レベル2: 肯定ルール（該当すれば useEffect 使用）

- IF 外部システムとの同期（WebSocket、タイマー、DOM操作） → useEffect
- IF ブラウザ API との連携（IntersectionObserver、ResizeObserver） → useEffect
- IF サードパーティライブラリの初期化・クリーンアップ → useEffect
- **MUST**: クリーンアップ関数を必ず実装する

### レベル3: 核心的質問

**「このコードはなぜ実行される必要があるのか？」**

- 表示されたから → useEffect
- 操作したから → イベントハンドラ
- 値が変化したから → 直接計算 / useMemo
- 外部データ取得 → Server Component

### レベル4: 具体例

```tsx
// NG: 派生値を useEffect で計算
const [fullName, setFullName] = useState("")
useEffect(() => {
  setFullName(`${firstName} ${lastName}`)
}, [firstName, lastName])

// OK: render で直接計算
const fullName = `${firstName} ${lastName}`
```

```tsx
// NG: useEffect でリセット
useEffect(() => {
  setSelection(null)
}, [itemId])

// OK: key prop で全リセット
<ItemDetail key={itemId} item={item} />
```

```tsx
// OK: 外部システムとの同期（cleanup 必須）
useEffect(() => {
  const observer = new IntersectionObserver(callback)
  observer.observe(ref.current)
  return () => observer.disconnect()
}, [])
```

## 禁止事項

- **NEVER**: useEffect で API データ取得しない
- **NEVER**: 計算可能な値を useEffect で State 更新しない
- **NEVER**: useEffect 内で直接 async 関数定義しない
- **NEVER**: クリーンアップ関数を省略しない
- **NEVER**: useEffect 連鎖（A→B→Cの連鎖）を作らない

## 計算コストの判断

- < 1ms → メモ化不要（直接計算）
- >= 1ms → `useMemo` を検討

## カスタムフック化の基準

- **SHOULD**: 同じ Effect + State パターンが2箇所以上 → カスタムフック化
- **SHOULD**: state 3つ以上 + effect → カスタムフック化
- **MUST**: カスタムフック名は `use` で始める
- **MUST**: `hooks/` ディレクトリに配置（ファイル名: `use-[name].ts`）

> Source: [React Docs - You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
