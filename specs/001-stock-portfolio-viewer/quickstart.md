# Quickstart: 株式ポートフォリオビューワー

**Date**: 2025-12-06
**Feature Branch**: `001-stock-portfolio-viewer`

## Prerequisites

- **Node.js**: v20.9 以上（Next.js 16の必須要件）
- **pnpm**: v8.x 以上
- **Git**: 最新版
- **Google Chrome**: 最新版（動作確認用）

---

## 1. プロジェクトセットアップ

### 1.1 Next.js プロジェクト作成

```bash
# プロジェクトを作成
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**オプション選択**:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: Yes
- App Router: Yes
- Turbopack for development: Yes
- Import alias: `@/*`

### 1.2 追加パッケージのインストール

```bash
# 本番依存
pnpm add recharts react-is

# 開発依存
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/dom jsdom prettier eslint-config-prettier
```

> **Note**: Recharts 3.x では `react-is` が必要です。インストールするReactバージョンと一致させてください。

---

## 2. 設定ファイル

### 2.1 Vitest 設定 (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 2.2 Vitest セットアップ (`vitest.setup.ts`)

```typescript
import '@testing-library/dom';
```

### 2.3 Prettier 設定 (`.prettierrc`)

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### 2.4 ESLint 設定更新 (`eslint.config.mjs`)

```javascript
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
];

export default eslintConfig;
```

### 2.5 package.json スクリプト追加

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css}\"",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## 3. ディレクトリ構造

```
src/
├── app/
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # メインページ
│   └── globals.css          # グローバルスタイル
├── components/
│   ├── PortfolioChart.tsx   # ドーナツチャート
│   ├── AssetList.tsx        # 銘柄一覧
│   └── AssetCard.tsx        # 個別銘柄カード
├── types/
│   └── portfolio.ts         # TypeScript型定義
├── utils/
│   └── formatters.ts        # 数値フォーマット
└── data/
    └── dummy_response.json  # モックデータ

__tests__/
├── components/
│   ├── PortfolioChart.test.tsx
│   └── AssetList.test.tsx
└── utils/
    └── formatters.test.ts
```

---

## 4. モックデータの配置

`src/data/dummy_response.json` を作成:

```json
{
  "total_asset_amount": 115500,
  "total_gain_amount": 15500,
  "total_gain_ratio": 15.5,
  "holding_assets": [
    {
      "asset": {
        "name": "S&P 500 ETF (Vanguard)",
        "ticker_symbol": "VOO",
        "logo_url": "https://storage.googleapis.com/brooklyn-asset-logo/alpaca/VOO.svg"
      },
      "asset_amount": 45969,
      "gain_amount": 5242,
      "gain_ratio": 12.87,
      "holding_ratio": 39.8
    },
    {
      "asset": {
        "name": "Apple Inc.",
        "ticker_symbol": "AAPL",
        "logo_url": "https://storage.googleapis.com/brooklyn-asset-logo/alpaca/AAPL.svg"
      },
      "asset_amount": 28500,
      "gain_amount": 4200,
      "gain_ratio": 17.28,
      "holding_ratio": 24.7
    },
    {
      "asset": {
        "name": "Microsoft Corporation",
        "ticker_symbol": "MSFT",
        "logo_url": "https://storage.googleapis.com/brooklyn-asset-logo/alpaca/MSFT.svg"
      },
      "asset_amount": 22800,
      "gain_amount": 3800,
      "gain_ratio": 20.00,
      "holding_ratio": 19.7
    },
    {
      "asset": {
        "name": "Tesla Inc.",
        "ticker_symbol": "TSLA",
        "logo_url": "https://storage.googleapis.com/brooklyn-asset-logo/alpaca/TSLA.svg"
      },
      "asset_amount": 11400,
      "gain_amount": 1520,
      "gain_ratio": 15.38,
      "holding_ratio": 9.9
    },
    {
      "asset": {
        "name": "Amazon.com Inc.",
        "ticker_symbol": "AMZN",
        "logo_url": "https://storage.googleapis.com/brooklyn-asset-logo/alpaca/AMZN.svg"
      },
      "asset_amount": 6831,
      "gain_amount": 738,
      "gain_ratio": 12.12,
      "holding_ratio": 5.9
    }
  ]
}
```

---

## 5. 開発コマンド

```bash
# 開発サーバー起動
pnpm dev

# ブラウザでアクセス
open http://localhost:3000

# リンター実行
pnpm lint

# フォーマット
pnpm format

# テスト実行
pnpm test

# テスト実行（単発）
pnpm test:run

# ビルド
pnpm build

# 本番モード起動
pnpm start
```

---

## 6. 動作確認チェックリスト

### 基本機能

- [ ] `pnpm install` が正常に完了する
- [ ] `pnpm dev` で開発サーバーが起動する
- [ ] `http://localhost:3000` にアクセスできる
- [ ] パイチャートが表示される
- [ ] 銘柄一覧が表示される

### UI 要件

- [ ] パイチャートが12時起点で時計回りに表示される
- [ ] パイチャート中央に資産総額が表示される
- [ ] 評価損益が緑色で表示される（プラスの場合）
- [ ] 各銘柄のロゴ、名前、ティッカーシンボルが表示される
- [ ] パイチャートのセグメントをクリックするとフォーカスされる
- [ ] フォーカス時、他の要素が半透過になる

### レスポンシブ

- [ ] スマートフォン表示で正常に動作する
- [ ] タブレット表示で正常に動作する
- [ ] PC表示で正常に動作する

### 品質

- [ ] `pnpm lint` がエラーなく完了する
- [ ] `pnpm test:run` が全テストパスする
- [ ] `pnpm build` が正常に完了する

---

## 7. トラブルシューティング

### pnpm install でエラー

```bash
# pnpm キャッシュクリア
pnpm store prune

# node_modules 削除して再インストール
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Recharts が SSR でエラー

Recharts コンポーネントに `'use client'` ディレクティブを追加:

```typescript
'use client';

import { PieChart, Pie, Cell } from 'recharts';
```

### Tailwind CSS が効かない

`tailwind.config.ts` の `content` パスを確認:

```typescript
content: [
  './src/**/*.{js,ts,jsx,tsx,mdx}',
],
```

### テストで型エラー

`tsconfig.json` に Vitest 型を追加:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

---

## 8. 提出準備

```bash
# 全テストが通ることを確認
pnpm test:run

# ビルドが通ることを確認
pnpm build

# Git bundle 作成
git add .
git commit -m "Complete portfolio viewer implementation"
git bundle create <アカウント名>_submission_<日付>.bundle main
```
