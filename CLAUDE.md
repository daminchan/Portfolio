# Portfolio

幻想的かつ現代的なポートフォリオサイト

## Tech Stack

Next.js 14 (App Router) / TypeScript / Tailwind CSS / shadcn/ui / Framer Motion

## Commands

```bash
npm run dev          # 開発サーバー
npm run build        # ビルド
```

## Architecture

- ルール: `.claude/rules/` 参照（20ファイル、1ファイル1トピック）
- スキル: `.claude/skills/` 参照
- ディレクトリ構造: @.claude/rules/directory-structure.md

## Implementation Flow

1. **理解確認** — 不明点があれば必ず質問
2. **実装宣言** — タスク・変更ファイル・方針を提示 → ユーザー確認
3. **実装前チェック** — @.claude/skills/implementation-check を実行
4. **実装** — 都度進捗を表示
5. **実装後チェック** — 報告フォーマットで報告
6. **ビルド確認** — `npm run build`
7. **コミット確認** — ユーザー承認後のみ実行

## Non-negotiables

- **NEVER** 機密情報をコードに含めない（環境変数は `.env.local`）
- **MUST** `app/**/page.tsx` は Server Component（`"use client"` 禁止）
- **MUST** コミット・プッシュはユーザー承認後のみ実行
- **MUST** 実装前後に implementation-check を実行する
