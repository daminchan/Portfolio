---
paths: "**/*.{ts,tsx}"
---

# Security

## server-only

- **MUST**: サーバー専用モジュール（DB接続、API Key使用）のファイル先頭に `import "server-only"` を記述する

## 環境変数

- **MUST**: サーバー専用の秘密情報は `NEXT_PUBLIC_` プレフィックスなしで定義する
- **MUST**: クライアントで使用する環境変数のみ `NEXT_PUBLIC_` を付ける
- **NEVER**: API Key・DB接続文字列に `NEXT_PUBLIC_` を付けない
- **MUST**: 環境変数は `.env.local` で管理し、`.gitignore` に含める

## 入力バリデーション

- **MUST**: Server Action の入力は zod でバリデーションする
- **MUST**: Route Handler のリクエストボディもバリデーションする
- **NEVER**: クライアントからの入力を信頼しない

## 禁止事項

- **NEVER**: 機密情報をソースコードにハードコードしない
- **NEVER**: `dangerouslySetInnerHTML` をユーザー入力に対して使用しない
- **SHOULD**: 認証チェックは Server Component / Server Action のサーバー側で行う
