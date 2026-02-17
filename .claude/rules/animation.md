---
paths: "**/*.tsx"
---

# アニメーション実装

## 基本原則

- **MUST**: `transform`, `opacity` のみアニメーションする（GPU コンポジター層で処理）
- **MUST**: `prefers-reduced-motion` を尊重する（後述のアクセシビリティ節を参照）
- **MUST**: `transform-origin` を物理的に正しい位置に設定する
- **MUST**: hover / focus 等のインタラクティブアニメーションはリンク・ボタン等の操作可能な要素にのみ付与する
- **SHOULD**: アニメーションは因果関係の明示か意図的な快適性のために使う
- **SHOULD**: CSS Transition > Framer Motion の優先順で選択する
- **NEVER**: layout 系プロパティ（`margin`, `width`, `height`, `top`, `left`）をアニメーションしない
- **NEVER**: `will-change` を乱用しない（メモリ消費増加。本当に必要な場合のみ）
- **NEVER**: `backdrop-blur` を動画・アニメーション要素の近くで使用しない（GPU負荷でFPS低下）

---

## CSS vs Framer Motion 判断アルゴリズム

### レベル1: 排除チェック（該当すれば CSS Transition を使用）

| 条件 | 理由 |
|------|------|
| hover / focus / active 等の状態変化 | CSS のみで完結。JS 不要 |
| Server Component で使いたい | Framer Motion は `"use client"` が必須 |
| 単純な opacity / transform の遷移 | CSS `transition` で十分 |
| `group-hover` による親子連動 | Tailwind の `group` + CSS で実現可能 |

### レベル2: 肯定ルール（該当すれば Framer Motion を使用）

- IF スクロール連動の出現アニメーション（`whileInView`）が必要 → Framer Motion
- IF 複数要素の順次表示（`staggerChildren`）が必要 → Framer Motion
- IF 共有要素トランジション（`layoutId`）が必要 → Framer Motion
- IF ドラッグ / ジェスチャー制御が必要 → Framer Motion
- IF `clip-path` 等の複雑なプロパティの keyframe 制御 → Framer Motion
- IF ページ遷移アニメーション（`AnimatePresence`）が必要 → Framer Motion

### レベル3: 核心的質問

**「この動きは CSS の `transition` / `@keyframes` だけで実現できるか？」**

- はい → CSS Transition を使う（Server Component を維持、JS バンドル削減）
- いいえ → Framer Motion を使う（`"use client"` を追加）

---

## CSS Transition パターン

### hover 状態変化

```tsx
// MUST: transition プロパティを明示する（transition-all は避ける）
<button className="transition-colors duration-200 hover:bg-gray-100">

// SHOULD: transform 系は transition-transform を使う
<img className="transition-transform duration-500 group-hover:scale-110" />
```

### 複合 hover アニメーション（group パターン）

```tsx
<div className="group cursor-pointer">
  <img className="transition-transform duration-500 group-hover:scale-110" />
  <div className="translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
    <div className="h-px w-0 bg-gold-500 transition-all duration-300 group-hover:w-12" />
    <p className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
  </div>
</div>
```

---

## Framer Motion パターン

- **MUST**: `"use client"` を宣言する（Server Component では使用不可）
- **MUST**: `whileInView` には `viewport={{ once: true }}` を設定する（毎回再実行しない）
- **MUST**: リスト要素は `staggerChildren` で順次表示する
- **NEVER**: 毎フレームで state を更新しない（再レンダリング多発）
- **NEVER**: useEffect でアニメーション制御しない（Framer Motion の API を使う）

### スクロール連動の出現

```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  コンテンツ
</motion.div>
```

### staggerChildren（リスト順次表示）

```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={{
    visible: { transition: { staggerChildren: 0.1 } },
  }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

### ページ遷移（AnimatePresence）

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

---

## スムーズスクロール（Lenis）

ポートフォリオサイトの全体的なスクロール体験向上に使用:

- **SHOULD**: Lenis でスムーズスクロールを実装する
- **MUST**: `prefers-reduced-motion: reduce` のユーザーには無効化する

---

## イージング選択

- **SHOULD**: 出現は `ease-out`、退出は `ease-in` を基本にする
- **SHOULD**: ポートフォリオの幻想的なトーンに合わせ、ゆったりとしたイージング（`duration: 0.6-1.2s`）を使う

---

## アクセシビリティ

- **MUST**: `prefers-reduced-motion: reduce` のユーザーに対して、動きを抑制する
- **SHOULD**: Tailwind の `motion-safe:` / `motion-reduce:` バリアントを使用する

> Source: [Framer Motion](https://motion.dev/docs), [Lenis](https://lenis.darkroom.engineering/)
