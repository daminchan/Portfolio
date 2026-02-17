---
paths: "**/*.{ts,tsx}"
---

# コーディング一般

## 早期リターン

- **MUST**: バリデーション・エラーケースは先に処理して抜ける（Guard Clause）
- **NEVER**: 3段階以上のネストを作らない

```tsx
// MUST: 早期リターン
function processUser(user: User | null) {
  if (!user?.isActive) return null
  return user.name
}
```

## if vs switch の選択

- **MUST**: 単一値に対する3つ以上の分岐 → switch
- **MUST**: 文字列リテラル/enum のマッチング → switch
- **MUST**: 複雑な条件式（AND/OR）や範囲チェック → if-else
- **MUST**: 2つ以下の分岐 → if-else

## 定数管理

- **MUST**: テキスト・ルート・エンドポイント等のリテラル値は `lib/constants.ts` で管理する
- **NEVER**: コンポーネント内にマジックナンバーやハードコード文字列を埋め込まない

## フォーマット

- **MUST**: 2スペースインデント
- **MUST**: シングルクォート
- **MUST**: セミコロンあり
- **MUST**: 末尾カンマあり（trailing comma）

## 禁止事項

- **NEVER**: 複雑な三項演算子のネストを作らない
- **NEVER**: マジックナンバーを使わない（定数化すること）
- **NEVER**: コンソールログを残さない（デバッグ完了後に削除）
