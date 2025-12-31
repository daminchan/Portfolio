---
paths: app/**/page.tsx
---

# ページ作成ルール

## 必須: サーバーコンポーネント

`app/*/page.tsx`には`'use client'`を書かない。

## パターン

```typescript
// app/[feature]/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { FeatureContent } from '@/components/[feature]/[feature]-content';
import { ROUTES } from '@/lib/constants';

export default async function FeaturePage() {
  const session = await auth();
  if (!session?.user) {
    redirect(ROUTES.LOGIN);
  }
  return <FeatureContent userId={session.user.id!} />;
}
```

## チェックリスト

- [ ] `'use client'`を書いていない
- [ ] サーバー側で認証チェック
- [ ] クライアントコンポーネントは`[feature]-content.tsx`形式
- [ ] 定数はconstants.tsから取得
