---
paths: components/**/*.tsx
---

# コンポーネント作成ルール

## 基本構造

```typescript
'use client';

import { useState } from 'react';
import { LABELS } from '@/lib/constants';

interface ComponentNameProps {
  userId: string;
  onAction?: () => void;
}

export function ComponentName({ userId, onAction }: ComponentNameProps) {
  // ロジック
  return <div>{/* UI */}</div>;
}
```

## 分割パターン

50行を超える場合：
```
components/[feature]/
├── [feature]-content.tsx      # 親コンポーネント
├── [section]-section.tsx      # セクション分割
└── [sub-component].tsx        # サブコンポーネント
```

## チェックリスト

- [ ] Props型を定義
- [ ] 50行超えは分割
- [ ] 定数はconstants.tsから取得
- [ ] 命名規則に従っている
