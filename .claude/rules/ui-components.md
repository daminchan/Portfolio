---
paths: "src/components/ui/**/*.tsx"
---

# UI コンポーネント

## 基本方針

- **MUST**: shadcn/ui をベースにプロジェクト仕様へカスタマイズする
- **MUST**: CVA（class-variance-authority）でバリアント管理する
- **MUST**: デザイントークン（CSS変数 / Tailwind クラス）を使用し、ハードコードを避ける

## カラー・スペーシング

- **MUST**: Semantic Tokens（`bg-primary`, `text-foreground` 等）を使用する
- **MUST**: gap / padding を使用する
- **SHOULD**: margin は避ける（gap/padding で代替）
- **NEVER**: ハードコードの色を使わない（`bg-[#1E3A5F]` → `bg-primary`）
- **NEVER**: `!important` を使わない
- **NEVER**: インラインスタイルを使わない

## data-slot 属性

React 19 + Tailwind CSS v4 環境でコンポーネントの役割を明示し、外部スタイリングを可能にする。

### レベル1: 排除チェック（不要なケース）

- 一時的なプロトタイプ・検証コード → 不要
- 外部からターゲットしない内部ユーティリティ → 不要
- ページ固有のコンポーネント（`features/` 内等） → 不要

### レベル2: 肯定ルール

- IF 複合コンポーネント（Card, Accordion, Dialog 等） → **必須**
- IF `:has()` でフォーカス/状態連携が必要 → **必須**
- IF 再利用可能な UI 部品（`components/ui/`） → **推奨**

### レベル3: 核心的質問

**「このコンポーネントは外部からターゲットされる可能性があるか？」**

- はい → data-slot 付与
- いいえ → 省略可

### 命名規則

- **MUST**: kebab-case を使用する（`data-slot="card-header"`）
- **MUST**: 親子関係はハイフンで接続する（`data-slot="input-group-control"`）

> Source: [shadcn/ui Tailwind v4 Changelog](https://ui.shadcn.com/docs/changelog/2025-02-tailwind-v4)
