# トランジションアーキテクチャ設計書

## 目的

特定のトランジション表現を実現する。

### トランジションの詳細

ホーム画面（`/`）から各ページに遷移する際、ホーム画面の要素を表示したまま遷移先を徐々に表示する。

**イメージ**: ホーム画面が不規則にブロック化され、ブロック単位で遷移先に変化していく。

---

## 技術的な課題

### 通常のページ遷移の問題

1. **画面が一瞬白くなる問題**
   - Next.jsのルーティングでは、ページコンポーネントがアンマウント→再マウントされる
   - この間、遷移元の画面が消え、遷移先がまだ表示されていない瞬間が発生
   - 通常はこれをマスク（ローディング画面など）で隠す

2. **スクリーンショット方式の問題**
   - 遷移前の画面をキャプチャして遷移後に渡す方法もある
   - しかし、ホーム画面のカードがアニメーションで動いている場合、静止画では不自然になる

### 必要な条件

- **遷移前と遷移後の画面が同時に存在すること**
- 遷移前の画面がリアルタイムで動き続けること（アニメーション継続）

---

## 解決策：Layout内常駐パターン

ホーム画面のコンテンツをlayout内に配置し、常に存在させる。

### レイヤー構造

```
zIndex: 30  ┌─────────────────────────────┐
            │ PixelTransitionOverlay      │ ← グリッド線・clip-path制御
            │ (トランジション中のみ表示)    │
            └─────────────────────────────┘

zIndex: 10  ┌─────────────────────────────┐
            │ 遷移先ページ (children)      │ ← clip-pathで部分表示
            │ page-overlay クラス          │
            │ position: fixed             │
            └─────────────────────────────┘

zIndex: 1   ┌─────────────────────────────┐
            │ EntranceContainer           │ ← 常に存在（カードギャラリー）
            │ (スプラッシュ + カード選択)   │
            │ position: fixed (非ホーム時) │
            └─────────────────────────────┘
```

---

## ファイル構成と役割

### ルートレイアウト

**`src/app/layout.tsx`**
```typescript
<TransitionWrapper>
  {children}
</TransitionWrapper>
```
- アプリ全体をTransitionWrapperでラップ
- トランジション状態の管理とオーバーレイを提供

### メインレイアウト

**`src/app/(main)/layout.tsx`**
```typescript
<MainLayoutClient>{children}</MainLayoutClient>
```
- MainLayoutClientにchildrenを渡す
- (main)グループ内の全ページに適用

### レイアウトクライアント（核心部分）

**`src/components/layout/main-layout-client.tsx`**
```typescript
const pathname = usePathname();
const isHome = pathname === '/';

return (
  <div>
    {/* カードギャラリー：常に存在 */}
    <div style={{
      position: isHome ? 'relative' : 'fixed',
      zIndex: isHome ? undefined : 1,
    }}>
      <EntranceContainer />
    </div>

    {/* 遷移先ページ：ホーム以外で表示 */}
    {!isHome && (
      <main className="page-overlay" style={{
        position: 'fixed',
        zIndex: 10,
      }}>
        {children}
      </main>
    )}
  </div>
);
```

| 状態 | EntranceContainer | children (遷移先) |
|-----|-------------------|-------------------|
| ホーム (`/`) | `position: relative` で通常表示 | 非表示 |
| 他ページ | `position: fixed`, `zIndex: 1` で背景化 | `zIndex: 10` でオーバーレイ表示 |

### ホームページ

**`src/app/(main)/page.tsx`**
```typescript
export default function HomePage() {
  return null;
}
```
- **ルート定義のためだけに存在**
- 中身はnull（layout内のEntranceContainerが表示を担当）
- 削除すると`/`ルートが存在しなくなり404エラーになる

### トランジションオーバーレイ

**`src/components/transition/pixel-transition-overlay.tsx`**

遷移先ページの表示を`clip-path`で制御：

```typescript
<style>{`
  .page-overlay {
    clip-path: ${isComplete ? 'none' : 'url(#pixel-reveal-clip)'};
  }
`}</style>
```

1. 遷移開始時：`clip-path: polygon(0 0, 0 0, 0 0, 0 0)` → 完全に隠れる
2. 遷移中：ブロック単位で`clip-path`を拡大 → 徐々に見える
3. 遷移完了：`clip-path: none` → 完全に表示

### トランジションコンテキスト

**`src/components/transition/transition-context.tsx`**

トランジション状態を管理：
- `isTransitioning`: トランジション中かどうか
- `targetHref`: 遷移先URL
- `startTransition()`: トランジション開始
- `endTransition()`: トランジション終了

---

## トランジションの流れ

```
1. ユーザーがカードをクリック
   └── startTransition('/works') を呼び出し

2. PixelTransitionOverlay が検知
   ├── router.push('/works') でページ遷移
   └── phase: 'waiting' に移行

3. pathname が変わったことを検知
   ├── phase: 'gridLines' → グリッド線表示
   └── phase: 'revealing' → ブロック単位で遷移先を表示

4. MainLayoutClient
   ├── isHome = false になる
   ├── EntranceContainer: position: fixed, zIndex: 1（背景化）
   └── children (/works): zIndex: 10, clip-pathで部分表示

5. 全ブロック表示完了
   ├── clip-path: none（遷移先が完全表示）
   └── endTransition() でトランジション終了
```

---

## なぜこの設計が必要か

| 要件 | 解決方法 |
|-----|---------|
| 遷移前後の画面が同時に存在 | EntranceContainerをlayout内に常駐 |
| 遷移前のアニメーションが継続 | コンポーネントがアンマウントされない |
| ブロック単位の表示制御 | clip-pathで遷移先を部分的にマスク |
| ホーム画面が背景として機能 | zIndexとpositionで層を分離 |

---

## 関連ファイル一覧

| ファイル | 役割 |
|---------|------|
| `src/app/layout.tsx` | TransitionWrapperを適用 |
| `src/app/(main)/layout.tsx` | MainLayoutClientを適用 |
| `src/app/(main)/page.tsx` | ルート定義（return null） |
| `src/components/layout/main-layout-client.tsx` | 層の制御・EntranceContainer常駐 |
| `src/components/transition/transition-wrapper.tsx` | Provider + Overlay のラッパー |
| `src/components/transition/transition-context.tsx` | トランジション状態管理 |
| `src/components/transition/pixel-transition-overlay.tsx` | clip-pathによるブロック表示制御 |
| `src/components/home/entrance-container.tsx` | スプラッシュ↔カードギャラリー切り替え |

---

## 補足：用語

| コード上の名前 | 実際の役割 |
|--------------|----------|
| EntranceContainer | スプラッシュ画面とカードギャラリーの切り替え制御 |
| MainContent | カード選択画面（3Dカードギャラリー） |
| page-overlay | 遷移先ページのラッパー（clip-path適用対象） |
| PixelTransitionOverlay | ブロック単位のトランジションアニメーション制御 |
