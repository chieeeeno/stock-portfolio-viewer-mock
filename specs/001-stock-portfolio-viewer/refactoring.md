# リファクタリング計画書

**作成日**: 2025-12-12
**対象**: 株式ポートフォリオビューワー
**目的**: コードの保守性・一貫性・再利用性の向上

---

## 概要

コードベース全体の調査により、以下のカテゴリでリファクタリングの機会を特定しました。
機能に影響を与えない非破壊的な改善として、段階的に実施可能です。

---

## 優先度高（HIGH）

### R001: 符号付き数値フォーマット処理の共通化

**問題**:
`formatters.ts` 内の複数関数で符号付き数値の処理ロジックが重複している。

**対象ファイル**: `src/utils/formatters.ts`

**現状**:
```typescript
// formatGainRatio (line 37-40)
const sign = normalized > 0 ? '+' : '';
return `${sign}${normalized.toFixed(2)}%`;

// formatGainAmount (line 59-62)
const sign = normalized > 0 ? '+' : '';
return `${sign}${normalized.toLocaleString('ja-JP')}`;

// formatGainAmountWithCurrency (line 71-80)
const absAmount = Math.abs(normalized).toLocaleString('ja-JP');
if (normalized > 0) {
  return `+¥${absAmount}`;
} else if (normalized < 0) {
  return `-¥${absAmount}`;
} else {
  return `¥${absAmount}`;
}
```

**改善案**:
```typescript
/**
 * 符号付きの値をフォーマットするヘルパー関数
 */
function formatWithSign(value: number, formatter: (v: number) => string): string {
  if (value > 0) return `+${formatter(value)}`;
  if (value < 0) return `-${formatter(Math.abs(value))}`;
  return formatter(value);
}

// 使用例
export function formatGainRatio(value: number): string {
  const normalized = normalizeNumber(value);
  return formatWithSign(normalized, (v) => `${v.toFixed(2)}%`);
}
```

**影響範囲**: ~25行のコード削減、テスト追加

---

### R002: アセットソートロジックの共通化

**問題**:
同一のソートロジックが2箇所で重複している。

**対象ファイル**:
- `src/app/_components/PortfolioChart.tsx` (line 120-122)
- `src/app/_components/AssetList.tsx` (line 28-30)

**現状**:
```typescript
// 両ファイルで同一の実装
const sortedAssets = useMemo(() => {
  return [...holdingAssets].sort((a, b) => b.holding_ratio - a.holding_ratio);
}, [holdingAssets]);
```

**改善案**:
```typescript
// src/utils/assetUtils.ts (新規作成)
import type { HoldingAsset } from '@/app/_types/portfolio';

/**
 * 保有比率の降順でアセットをソートする
 */
export function sortAssetsByHoldingRatio(assets: HoldingAsset[]): HoldingAsset[] {
  return [...assets].sort((a, b) => b.holding_ratio - a.holding_ratio);
}
```

**影響範囲**: 新規ユーティリティ追加、2ファイルの修正

---

### R003: レスポンシブアイコンサイズ定数の共通化

**問題**:
レスポンシブなアイコンサイズのTailwindクラスが複数ファイルで重複定義されている。

**対象ファイル**:
- `src/components/ThemeToggle.tsx` (line 10)
- `src/components/HelpButton.tsx` (line 12)
- `src/components/UserIcon.tsx` (line 9-15)

**現状**:
```typescript
// ThemeToggle.tsx
const ICON_CLASS = 'h-5 w-5 sm:h-6 sm:w-6';

// HelpButton.tsx
const ICON_CLASS = 'h-5 w-5 sm:h-6 sm:w-6';

// UserIcon.tsx
const CONTAINER_CLASS = 'h-8 w-8 sm:h-10 sm:w-10';
```

**改善案**:
```typescript
// src/utils/responsiveClasses.ts (新規作成)
/**
 * レスポンシブなサイズクラス定義
 */
export const RESPONSIVE_SIZES = {
  /** アイコン用: h-5 w-5 → sm:h-6 sm:w-6 */
  icon: {
    sm: 'h-4 w-4 sm:h-5 sm:w-5',
    md: 'h-5 w-5 sm:h-6 sm:w-6',
    lg: 'h-6 w-6 sm:h-7 sm:w-7',
  },
  /** アバター/ユーザーアイコン用 */
  avatar: {
    sm: 'h-6 w-6 sm:h-8 sm:w-8',
    md: 'h-8 w-8 sm:h-10 sm:w-10',
    lg: 'h-10 w-10 sm:h-12 sm:w-12',
  },
} as const;
```

**影響範囲**: 新規ユーティリティ追加、3ファイルの修正

---

## 優先度中（MEDIUM）

### R004: GainStatus のデータとプレゼンテーション分離

**問題**:
`GainStatusInfo` インターフェースがデータ（status）とプレゼンテーション（colorClass）を混在させている。

**対象ファイル**:
- `src/app/_types/portfolio.ts` (line 60-63)
- `src/utils/formatters.ts` (line 89-98)

**現状**:
```typescript
// portfolio.ts
export interface GainStatusInfo {
  status: GainStatus;
  colorClass: string; // Tailwind CSS class - プレゼンテーション層
}

// formatters.ts
export function getGainStatus(amount: number): GainStatusInfo {
  if (amount > 0) {
    return { status: 'positive', colorClass: 'text-green-600 dark:text-green-300' };
  }
  // ...
}
```

**改善案**:
```typescript
// portfolio.ts - データのみ
export type GainStatus = 'positive' | 'negative' | 'zero';

// src/utils/gainStatusStyles.ts (新規作成) - プレゼンテーション
export const GAIN_STATUS_COLORS: Record<GainStatus, string> = {
  positive: 'text-green-600 dark:text-green-300',
  negative: 'text-red-600 dark:text-red-400',
  zero: 'text-gray-500 dark:text-gray-400',
};

// formatters.ts - シンプルな関数
export function getGainStatus(amount: number): GainStatus {
  if (amount > 0) return 'positive';
  if (amount < 0) return 'negative';
  return 'zero';
}

// 使用側
const status = getGainStatus(amount);
const colorClass = GAIN_STATUS_COLORS[status];
```

**影響範囲**: 型定義変更、複数コンポーネントの修正

---

### R005: ツールチップ位置計算のマジックナンバー解消

**問題**:
ツールチップの位置計算にハードコードされた数値が存在する。

**対象ファイル**: `src/app/_hooks/useChartTooltip.ts` (line 49-56)

**現状**:
```typescript
const handleChartMouseMove = useCallback((e: React.MouseEvent) => {
  const tooltipWidth = 200;  // マジックナンバー
  let x = e.clientX + 15;    // マジックナンバー
  const y = e.clientY + 15;  // マジックナンバー

  if (x + tooltipWidth > window.innerWidth) {
    x = e.clientX - tooltipWidth - 15;
  }
  // ...
}, []);
```

**改善案**:
```typescript
// 定数として抽出
const TOOLTIP_CONFIG = {
  width: 200,
  offset: 15,
} as const;

const handleChartMouseMove = useCallback((e: React.MouseEvent) => {
  const { width: tooltipWidth, offset } = TOOLTIP_CONFIG;
  let x = e.clientX + offset;
  const y = e.clientY + offset;

  if (x + tooltipWidth > window.innerWidth) {
    x = e.clientX - tooltipWidth - offset;
  }
  // ...
}, []);
```

**影響範囲**: 1ファイルの修正

---

### R006: Tailwindクラス管理方式の統一

**問題**:
`clsx`、`cn`、`tv()` の3つのパターンが混在しており、使い分けが不明確。

**対象**: プロジェクト全体

**現状**:
- `clsx()`: 単純なクラス結合
- `cn()`: tailwind-merge を含むクラス結合
- `tv()`: バリアント管理

**改善案**:
CLAUDE.md に以下のガイドラインを追記：

```markdown
### Tailwind クラス結合の使い分け

| ユースケース | 使用するAPI | 例 |
|-------------|------------|-----|
| 静的なクラスのグループ化 | `clsx()` | `clsx('flex items-center', 'sm:gap-4')` |
| 動的なクラスの結合（競合の可能性あり） | `cn()` | `cn(baseClass, props.className)` |
| コンポーネントのバリアント定義 | `tv()` | `tv({ base: '...', variants: {...} })` |
```

**影響範囲**: ドキュメント追加、既存コードの段階的な整理

---

### R007: 定数ファイルの整理

**問題**:
定数が複数ファイルに分散しており、関連する定数の発見が困難。

**現状の分散状況**:
- `src/utils/constants.ts`: チャート色、アプリメタデータ
- `src/app/_components/PortfolioChart.tsx`: `MIN_SEGMENT_THRESHOLD`
- `src/app/_hooks/useBreakpoint.ts`: ブレークポイント値
- `src/app/_hooks/useChartTooltip.ts`: ツールチップサイズ

**改善案**:
```
src/utils/
  ├── constants/
  │   ├── index.ts       # 再エクスポート
  │   ├── colors.ts      # チャート色、損益色
  │   ├── dimensions.ts  # ブレークポイント、サイズ
  │   ├── thresholds.ts  # MIN_SEGMENT_THRESHOLD など
  │   └── app.ts         # アプリメタデータ
```

**影響範囲**: ファイル構造変更、インポートパス更新

---

## 優先度低（LOW）

### R008: テストモックデータの共通化

**問題**:
テストファイル間でモックデータが重複定義されている。

**対象ファイル**:
- `src/app/_components/AssetCard.test.tsx` (line 28-62)
- `src/app/_components/PortfolioChart.test.tsx` (line 65-99)

**改善案**:
```typescript
// src/test-utils/mockData.ts (新規作成)
import type { HoldingAsset } from '@/app/_types/portfolio';

export const MOCK_HOLDING_ASSETS: Record<string, HoldingAsset> = {
  VOO: {
    asset: { name: 'Vanguard S&P 500 ETF', ticker_symbol: 'VOO', logo_url: '...' },
    market_value: 45969,
    gain_amount: 5242,
    gain_ratio: 12.87,
    holding_ratio: 39.81,
  },
  TSLA: { /* ... */ },
  // ...
};

export function createMockHoldingAsset(
  overrides?: Partial<HoldingAsset>
): HoldingAsset {
  return {
    ...MOCK_HOLDING_ASSETS.VOO,
    ...overrides,
  };
}
```

**影響範囲**: 新規ファイル追加、テストファイルの修正

---

### R009: 大規模コンポーネントの分割検討

**問題**:
一部のコンポーネントが大きくなり、サブコンポーネントへの分割が有効。

**対象ファイル**:
| ファイル | 行数 | 分割候補 |
|---------|-----|---------|
| `PortfolioChart.tsx` | 272 | ChartCenter, ChartSegments |
| `UserMenu.tsx` | 116 | MenuItemList |
| `PortfolioInteractive.tsx` | 110 | 状態管理を useReducer へ |

**改善案**: 将来的なリファクタリングとして検討。現状でも可読性は維持されている。

---

### R010: フックディレクトリの整理

**問題**:
フックが `app/_hooks/` と `hooks/` に分散している。

**現状**:
- `src/app/_hooks/`: useChartTooltip, useBreakpoint, useTouchDevice, useTheme, useChartColors
- `src/hooks/`: useOnboarding

**改善案**:
すべてのフックを `src/hooks/` に統合し、必要に応じてサブディレクトリで整理。
ただし、Next.js のコロケーションパターンに従い現状維持も妥当。

---

## 実施順序の推奨

```
Phase 1: ユーティリティ関数の改善（影響範囲が限定的）
  └── R001: formatWithSign ヘルパー追加
  └── R002: sortAssetsByHoldingRatio 追加
  └── R005: ツールチップ定数抽出

Phase 2: 共通定数の整理
  └── R003: レスポンシブサイズ定数
  └── R007: 定数ファイル構造の整理

Phase 3: 設計改善（影響範囲が広い）
  └── R004: GainStatus の分離
  └── R006: Tailwindクラス管理ガイドライン

Phase 4: テスト・ドキュメント改善
  └── R008: テストモックデータ共通化
```

---

## 非対応事項（現状維持）

以下の項目は現時点でリファクタリング不要と判断：

1. **R009 コンポーネント分割**: 現状でも可読性・テスト容易性は維持されている
2. **R010 フックディレクトリ**: Next.js コロケーションパターンに準拠しており妥当

---

## 備考

- すべての変更は機能に影響を与えない非破壊的な改善
- 各リファクタリングは独立して実施可能
- テストがパスすることを確認してからコミット
