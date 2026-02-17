---
name: implementation-check
description: 実装前後のチェックリスト。コードを書く前後に必ず確認する。
---

# 実装前チェックリスト

## 1. プロジェクト理解（必須）
- [ ] 関連ファイルを読み込んだか？
- [ ] 既存のパターン・規約を確認したか？
- [ ] 理解した内容をユーザーに確認したか？

## 2. 実装方針の確認
- [ ] この実装は適切な手法か？
- [ ] 単一責任の原則に違反していないか？
- [ ] 既存コンポーネントを再利用できないか？
- [ ] ベストプラクティスを調査したか？（特に複雑な実装）

## 3. Hooks使用の確認
useEffectを使おうとしている場合：
- [ ] 計算で導出できないか？ → 直接計算 or useMemo
- [ ] ユーザー操作への反応か？ → イベントハンドラ
- [ ] 親からkeyと一緒に渡せないか？ → keyでリセット
- [ ] 外部システムとの同期か？ → useEffect OK

詳細: @.claude/rules/react-hooks.md

## 4. 条件分岐の確認
- [ ] 早期リターンで簡潔にできないか？
- [ ] 3つ以上の離散値分岐 → switchを検討
- [ ] 複雑な条件式 → if-elseを使用

詳細: @.claude/rules/coding-general.md

## 5. ディレクトリ構造の確認（ファイル作成時）

新しいファイル/フォルダを作成する前に確認:

| チェック項目 | 確認内容 |
|-------------|----------|
| 配置場所 | @.claude/rules/directory-structure.md の判断アルゴリズムに従っているか？ |
| 既存パターン | 類似ファイルの配置場所を確認したか？ |
| Feature間インポート | 他のfeatureから直接インポートしていないか？（禁止） |
| フォルダ作成 | 本当に必要なフォルダのみ作成しているか？ |
| 命名規則 | kebab-caseでファイル/フォルダ名を付けているか？ |

**配置判断クイックリファレンス**:

| 作成するもの | 配置場所 |
|-------------|----------|
| 機能固有コンポーネント | `features/[name]/components/` |
| 機能固有の定数・型 | `features/[name]/constants.ts` |
| 機能固有フック | `features/[name]/hooks/` |
| 共有UIコンポーネント | `components/ui/` |
| グローバル定数 | `lib/constants.ts` |
| 共有型 | `types/` |
| 共有フック | `hooks/` |

詳細: @.claude/rules/directory-structure.md

## 6. アニメーション実装の確認（該当する場合）
- [ ] CSS Transition で十分か？ Framer Motion が必要か？（判断アルゴリズムに従う）
- [ ] transformプロパティを使用しているか？（GPU最適化）
- [ ] prefers-reduced-motionを尊重しているか？
- [ ] 不要な再レンダリングを避けているか？
- [ ] staggerChildrenで分散しているか？（リスト）
- [ ] whileInView に viewport={{ once: true }} を付けたか？

詳細: @.claude/rules/animation.md

## 7. UIコンポーネント実装の確認（該当する場合）

### data-slot属性の判断

| 配置 | data-slot |
|------|-----------|
| `components/ui/` | 推奨 |
| `features/*/components/` | 基本不要 |

**自動判断できるケース（確認不要）:**
- `components/ui/`配下 → data-slot付与
- 複合コンポーネント（Card, Accordion等） → data-slot必須
- ページ固有（features内） → data-slot不要

詳細: @.claude/rules/ui-components.md

---

# 実装後チェックリスト（必須報告）

## 1. 基本確認
- [ ] TypeScriptの型は適切か？（`as`/`any` は使用禁止）
- [ ] 不要な`"use client"`を使っていないか？
- [ ] コンポーネントの責任は単一か？
- [ ] 50行を超えるコンポーネントは分割したか？
- [ ] コンソールログは削除したか？
- [ ] 不要なコード・重複コードはないか？

## 2. 必須報告事項
実装完了時は以下を**必ず**明言すること：

### 報告フォーマット
```
## 実装完了報告

### どこ（何を）
- [ファイルパス]: [実装/修正内容]

### 何をしたか
- [具体的な変更内容]

### なぜそうしたか
- [理由・根拠]

### ソース/適用ルール
- [参照した公式ドキュメントURL]
- [適用したルール名]
```

### 報告例
```
## 実装完了報告

### どこ（何を）
- src/features/hero/components/hero-section.tsx: フェードインアニメーション追加

### 何をしたか
- whileInViewでスクロール連動アニメーション実装
- viewport: { once: true }で一度だけ実行に設定

### なぜそうしたか
- ファーストビューのインパクト向上
- once: trueでパフォーマンス最適化

### ソース/適用ルール
- https://motion.dev/docs/react-scroll-animations
- .claude/rules/animation.md
```

---

# リファクタリング時チェックリスト

## 1. data-slot属性の整合性確認

### 不整合パターン1: data-slotがあるが使われていない
→ ユーザーに確認:「このdata-slotは現在使用されていません。削除しますか？」

### 不整合パターン2: 同コンポーネントが複数箇所で異なるスタイル
→ ユーザーに確認:「data-slotを追加して親からターゲットしやすくしますか？」

### 不整合パターン3: 複合コンポーネントなのにdata-slotがない
→ ユーザーに提案:「shadcn/ui v4のパターンに従いdata-slotの追加を推奨します」

詳細: @.claude/rules/ui-components.md
