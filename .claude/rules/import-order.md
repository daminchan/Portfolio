---
paths: "**/*.{ts,tsx}"
---

# Import 順序

## グループ順序（上から順、グループ間は空行1行）

1. React 関連
2. 外部ライブラリ（node_modules）
3. 内部エイリアス（`@/` で始まるもの）
4. 相対パス（同一 feature 内等）

```tsx
import { useState } from "react"

import { motion } from "framer-motion"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import type { CardProps } from "@/types/card"

import { SECTION_DATA } from "../constants"
```

## ルール

- **MUST**: グループ内はアルファベット順
- **MUST**: `import type` は通常 import の後に配置
- **MUST**: グループ間に空行を入れる
- **MUST**: 3つ以上の名前付き import は複数行に展開
- **NEVER**: `import * as Foo` を乱用しない（tree-shaking が効かない）
- **NEVER**: 未使用の import を残さない
- **NEVER**: 循環 import を作らない
