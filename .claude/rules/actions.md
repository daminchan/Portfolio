---
paths: actions/**/*.ts
---

# サーバーアクションルール

## 基本構造

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export interface ActionResult {
  success: boolean;
  message: string;
  error?: string;
}

export async function actionName(data: InputType): Promise<ActionResult> {
  try {
    // 1. 認証チェック
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: '認証が必要です', error: 'Unauthorized' };
    }

    // 2. バリデーション
    // 3. データベース操作
    // 4. キャッシュ再検証
    revalidatePath('/path');

    return { success: true, message: '成功しました' };
  } catch (error) {
    return { success: false, message: '失敗しました', error: 'Internal error' };
  }
}
```

## 使用場面

- DB作成・更新・削除
- 認証が必要な操作
- フォーム送信

## チェックリスト

- [ ] `'use server'`ディレクティブ
- [ ] 認証チェック実装
- [ ] バリデーション実装
- [ ] ActionResult型で返却
