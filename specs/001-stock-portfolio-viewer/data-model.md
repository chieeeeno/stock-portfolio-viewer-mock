# Data Model: 株式ポートフォリオビューワー

**Date**: 2025-12-06
**Feature Branch**: `001-stock-portfolio-viewer`

## Overview

このドキュメントは、株式ポートフォリオビューワーのデータモデルを定義します。
PDFに記載されたAPIレスポンス仕様に基づいて設計されています。

---

## Entity Relationship

```
┌─────────────────────────────────────────────────────────┐
│                    PortfolioResponse                     │
│  (APIレスポンスのルートオブジェクト)                        │
├─────────────────────────────────────────────────────────┤
│  total_asset_amount: number (円)                        │
│  total_gain_amount: number (円)                         │
│  total_gain_ratio: number (%)                           │
│  holding_assets: HoldingAsset[]                         │
└─────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────┐
│                      HoldingAsset                        │
│  (保有銘柄情報)                                           │
├─────────────────────────────────────────────────────────┤
│  asset: Asset                                           │
│  asset_amount: number (円)                              │
│  gain_amount: number (円)                               │
│  gain_ratio: number (%)                                 │
│  holding_ratio: number (%)                              │
└─────────────────────────────────────────────────────────┘
                              │
                              │ 1:1
                              ▼
┌─────────────────────────────────────────────────────────┐
│                         Asset                            │
│  (銘柄基本情報)                                           │
├─────────────────────────────────────────────────────────┤
│  name: string                                           │
│  ticker_symbol: string                                  │
│  logo_url: string                                       │
└─────────────────────────────────────────────────────────┘
```

---

## TypeScript Type Definitions

### `src/types/portfolio.ts`

```typescript
/**
 * 銘柄の基本情報
 */
export interface Asset {
  /** 銘柄名 (例: "S&P 500 ETF (Vanguard)") */
  name: string;

  /** ティッカーシンボル (例: "VOO") */
  ticker_symbol: string;

  /** ロゴ画像のURL */
  logo_url: string;
}

/**
 * 保有銘柄の詳細情報
 */
export interface HoldingAsset {
  /** 銘柄の基本情報 */
  asset: Asset;

  /** 保有金額（円、整数） */
  asset_amount: number;

  /** 評価損益額（円、整数、プラス/マイナス可） */
  gain_amount: number;

  /** 評価損益率（%、小数点以下2桁） */
  gain_ratio: number;

  /** ポートフォリオ内の保有比率（%、小数点以下1桁） */
  holding_ratio: number;
}

/**
 * ポートフォリオのAPIレスポンス
 */
export interface PortfolioResponse {
  /** 資産総額（円、整数） */
  total_asset_amount: number;

  /** 評価損益額の合計（円、整数、プラス/マイナス可） */
  total_gain_amount: number;

  /** 評価損益率の合計（%、小数点以下1桁） */
  total_gain_ratio: number;

  /** 保有銘柄のリスト */
  holding_assets: HoldingAsset[];
}

/**
 * 評価損益の状態を表す列挙型
 */
export type GainStatus = 'positive' | 'negative' | 'zero';

/**
 * 評価損益の状態を判定するユーティリティ関数の戻り値型
 */
export interface GainStatusInfo {
  status: GainStatus;
  colorClass: string;  // Tailwind CSSクラス
}
```

---

## Validation Rules

### PortfolioResponse

| フィールド | 型 | 制約 | 備考 |
|-----------|-----|------|------|
| `total_asset_amount` | number | >= 0, 整数 | 資産総額は0以上 |
| `total_gain_amount` | number | 整数 | プラス/マイナス/ゼロ可 |
| `total_gain_ratio` | number | 小数点以下1桁 | プラス/マイナス/ゼロ可 |
| `holding_assets` | array | 0件以上 | 空配列の場合はエッジケース対応 |

### HoldingAsset

| フィールド | 型 | 制約 | 備考 |
|-----------|-----|------|------|
| `asset` | Asset | 必須 | nullは許可しない |
| `asset_amount` | number | >= 0, 整数 | 保有金額は0以上 |
| `gain_amount` | number | 整数 | プラス/マイナス/ゼロ可 |
| `gain_ratio` | number | 小数点以下2桁 | プラス/マイナス/ゼロ可 |
| `holding_ratio` | number | 0-100, 小数点以下1桁 | 全銘柄の合計が100%になる |

### Asset

| フィールド | 型 | 制約 | 備考 |
|-----------|-----|------|------|
| `name` | string | 非空文字列 | 銘柄名 |
| `ticker_symbol` | string | 非空文字列 | 英大文字とドットで構成 |
| `logo_url` | string | 有効なURL | 画像取得失敗時はフォールバック |

---

## State Management

### Application State

```typescript
/**
 * アプリケーションの状態管理（React useState）
 */
interface AppState {
  /** ポートフォリオデータ（APIレスポンス） */
  portfolio: PortfolioResponse | null;

  /** データ読み込み状態 */
  isLoading: boolean;

  /** エラー状態 */
  error: Error | null;

  /** フォーカス中の銘柄インデックス（null = フォーカスなし） */
  focusedAssetIndex: number | null;
}
```

### State Transitions

```
初期状態
    │
    ▼
┌─────────────┐
│  isLoading  │ ──── データ取得中
│    true     │
└─────────────┘
    │
    ├── 成功 ────────────────────┐
    │                            ▼
    │                   ┌─────────────────┐
    │                   │   portfolio     │
    │                   │   (データあり)    │
    │                   │   isLoading:    │
    │                   │     false       │
    │                   └─────────────────┘
    │                            │
    │                   クリック/タップ
    │                            │
    │                   ┌─────────────────┐
    │                   │  focusedIndex   │
    │                   │   (n | null)    │
    │                   └─────────────────┘
    │
    └── 失敗 ────────────────────┐
                                 ▼
                        ┌─────────────────┐
                        │     error       │
                        │   (エラー表示)   │
                        │   isLoading:    │
                        │     false       │
                        └─────────────────┘
```

---

## Sample Data

### `src/data/dummy_response.json`

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

## Utility Functions

### `src/utils/formatters.ts`

```typescript
/**
 * 数値を日本円形式でフォーマット（カンマ区切り）
 * @param amount - 金額（円）
 * @returns フォーマットされた文字列 (例: "115,500")
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('ja-JP');
}

/**
 * 評価損益率をフォーマット（小数点以下2桁、符号付き）
 * @param ratio - 評価損益率（%）
 * @returns フォーマットされた文字列 (例: "+12.87%", "-5.00%")
 */
export function formatGainRatio(ratio: number): string {
  const sign = ratio > 0 ? '+' : '';
  return `${sign}${ratio.toFixed(2)}%`;
}

/**
 * 保有比率をフォーマット（小数点以下1桁）
 * @param ratio - 保有比率（%）
 * @returns フォーマットされた文字列 (例: "39.8%")
 */
export function formatHoldingRatio(ratio: number): string {
  return `${ratio.toFixed(1)}%`;
}

/**
 * 評価損益の状態を判定
 * @param amount - 評価損益額
 * @returns GainStatusInfo オブジェクト
 */
export function getGainStatus(amount: number): GainStatusInfo {
  if (amount > 0) {
    return { status: 'positive', colorClass: 'text-green-500' };
  } else if (amount < 0) {
    return { status: 'negative', colorClass: 'text-red-500' };
  } else {
    return { status: 'zero', colorClass: 'text-gray-500' };
  }
}

/**
 * 評価損益額をフォーマット（カンマ区切り、符号付き）
 * @param amount - 評価損益額（円）
 * @returns フォーマットされた文字列 (例: "+15,500", "-3,000")
 */
export function formatGainAmount(amount: number): string {
  const sign = amount > 0 ? '+' : '';
  return `${sign}${amount.toLocaleString('ja-JP')}`;
}
```

---

## Notes

### データソートルール
- パイチャートは `holding_ratio` の降順でソート（12時位置から時計回り）
- 銘柄一覧も同様に `holding_ratio` の降順で表示

### エッジケース対応
1. **空のポートフォリオ**: `holding_assets` が空配列の場合、専用メッセージを表示
2. **ロゴ画像エラー**: `logo_url` が無効な場合、ティッカーシンボルをテキスト表示
3. **極端に小さい比率**: 0.1%未満の銘柄は最小サイズ（3度）を確保
