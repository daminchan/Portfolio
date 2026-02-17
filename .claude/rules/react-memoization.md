---
paths: "**/*.tsx"
---

# React Memoization

## 基本方針

React 19 + React Compiler により、手動メモ化は原則不要。
まず **メモ化なしで実装** する。

## memo 判断アルゴリズム

### レベル1: 排除チェック（memo 不要）

| 条件 | 理由 |
|------|------|
| React Compiler が有効 | 自動最適化される |
| 描画コストが低い | memo のオーバーヘッドの方が大きい |
| props が毎回変化する | memo が無効化されるため無意味 |
| パフォーマンス問題が計測されていない | 予防的メモ化は不要 |

### レベル2: 肯定ルール（memo を検討）

- IF 描画コストが高い + props が安定 + 計測でボトルネック確認 → `React.memo`
- IF `console.time` で 1ms 以上の計算 → `useMemo`
- IF メモ化された子に渡すコールバック → `useCallback`

### レベル3: 核心的質問

**「パフォーマンス問題は実際に計測で確認されたか？」**

- はい → メモ化を適用
- いいえ → メモ化なしで実装

## memo を不要にする4テクニック（優先）

1. **children パターン** — 変化する state を持つ親から children で渡す
2. **state の局所化** — state を使うコンポーネントだけに閉じ込める
3. **primitive props** — オブジェクトではなく primitive 値を渡す
4. **値の射影** — オブジェクト全体ではなく必要なプロパティだけ渡す

```tsx
// NG
<UserName user={user} />
// OK
<UserName name={user.name} />
```

## 禁止事項

- **NEVER**: すべての変数に予防的に `useMemo` を付けない
- **NEVER**: 計測なしに `React.memo` をラップしない

> Source: [React Docs - useMemo](https://react.dev/reference/react/useMemo)
