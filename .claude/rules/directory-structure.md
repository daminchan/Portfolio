---
paths: "src/**/*.{ts,tsx}"
---

# ディレクトリ構造

## 基本原則

- **MUST**: 機能ベース（feature-based）でグループ化する。技術種別で分けない
- **MUST**: Colocation（関連コードは使用場所の近くに配置）。複数箇所で使う場合のみ共有フォルダへ移動
- **MUST**: 依存方向は `shared → features → app` の一方向。Feature間インポートは禁止
- **MUST**: ディレクトリ深さは最大3-4階層まで
- **MUST**: 必要なフォルダのみ作成する（全部作らない）

> Source: [Bulletproof React](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md), [Kent C. Dodds - Colocation](https://kentcdodds.com/blog/colocation)

## プロジェクト構造

```
src/
├── app/                    # ルーティングのみ（App Router）
├── components/
│   ├── ui/                 # shadcn/ui（汎用UI部品）
│   └── layout/             # Header, Footer, Navigation
├── features/               # 機能ベースモジュール
│   └── [feature-name]/
│       ├── components/     # 機能固有コンポーネント
│       ├── hooks/          # 機能固有フック（必要時のみ）
│       ├── constants.ts    # 機能固有の定数・型
│       └── index.ts        # 公開API
├── hooks/                  # 共有カスタムフック（2+ featureで使用時のみ）
├── lib/                    # ユーティリティ・定数
│   ├── utils.ts
│   └── constants.ts
└── types/                  # 共有型定義（2+ featureで使用時のみ）
```

## 配置判断アルゴリズム

### レベル1: 排除チェック（該当すれば指定場所へ）

| 条件 | 配置場所 |
|------|----------|
| ルーティング関連（page, layout, loading, error） | `app/` |
| shadcn/ui コンポーネント | `components/ui/` |
| Header, Footer 等レイアウト | `components/layout/` |
| cn() 等の汎用ユーティリティ | `lib/utils.ts` |
| サイト設定等グローバル定数 | `lib/constants.ts` |
| 複数 feature で共有する型 | `types/` |

### レベル2: 肯定ルール

- IF 特定機能専用のコンポーネント → `features/[name]/components/`
- IF 特定機能専用のフック → `features/[name]/hooks/`
- IF 特定機能専用の定数 → `features/[name]/constants.ts`
- IF 2つ以上の feature で使うフック → `hooks/`
- IF 2つ以上の feature で使う型 → `types/`

### レベル3: 核心的質問

**「このコードは他の feature でも使う可能性があるか？」**

- いいえ → `features/[name]/` 内に配置
- はい → 共有フォルダに配置
- 不明 → まず feature 内に配置、後で必要になったら移動

## Feature 間インポート禁止

- **NEVER**: 異なる feature 間で直接インポートしない
- **MUST**: 共通化が必要なら `components/`, `hooks/`, `types/` に抽出する
- **MUST**: app 層で feature を組み合わせる

> Source: [Bulletproof React](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)
