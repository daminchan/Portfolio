# コーディング規約

## 命名規則

| 対象 | 規則 | 例 |
|-----|------|-----|
| ファイル | kebab-case | `clip-card.tsx` |
| コンポーネント | PascalCase | `ClipCard` |
| 関数 | camelCase | `fetchClips` |
| 定数 | UPPER_SNAKE_CASE | `API_ENDPOINTS` |

## インポート順序

1. React/Next.js
2. 外部ライブラリ
3. 内部コンポーネント
4. ユーティリティ・型

## 型定義

- interfaceを優先使用
- 型は`types/`に集約
- Props型は必ず定義

## 定数管理

すべてのテキスト・ルート・エンドポイントは`lib/constants.ts`で管理：
```typescript
import { ROUTES, LABELS, API_ENDPOINTS } from '@/lib/constants';
```

## 分割基準

- コンポーネントが50行を超えたら分割
- ビジネスロジックが複雑ならカスタムフック化
