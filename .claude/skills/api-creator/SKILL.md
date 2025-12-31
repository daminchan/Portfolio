---
name: api-creator
description: API Routeを作成する。外部API連携やWebhook受信が必要な時に使用。DB操作はサーバーアクションを推奨。
---

# API Creator

API Routeを作成するスキル。

## 基本構造

```typescript
// app/api/[feature]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await prisma.model.findMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('[API] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

## 使い分け

| 用途 | 推奨 |
|-----|------|
| DB操作 | サーバーアクション |
| 外部API連携 | API Route |
| Webhook | API Route |

## チェックリスト

- [ ] 認証チェック実装
- [ ] エラーハンドリング
- [ ] 適切なステータスコード
