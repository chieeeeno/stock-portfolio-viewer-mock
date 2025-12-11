/**
 * テスト用モックデータファクトリ
 * テスト間で共通のモックデータを提供し、一貫性と保守性を向上させる
 */
import type { Asset, HoldingAsset, PortfolioResponse } from '@/app/_types/portfolio';

// ============================================================================
// 基本モックデータ定義
// ============================================================================

/**
 * 事前定義されたモックアセット
 * キーはティッカーシンボルで、テストで頻繁に使用する銘柄を提供
 */
export const MOCK_ASSETS: Record<string, Asset> = {
  VOO: {
    name: 'S&P 500 ETF (Vanguard)',
    ticker_symbol: 'VOO',
    logo_url: 'https://example.com/voo.svg',
  },
  AAPL: {
    name: 'Apple Inc.',
    ticker_symbol: 'AAPL',
    logo_url: 'https://example.com/aapl.svg',
  },
  MSFT: {
    name: 'Microsoft Corporation',
    ticker_symbol: 'MSFT',
    logo_url: 'https://example.com/msft.svg',
  },
  TSLA: {
    name: 'Tesla Inc.',
    ticker_symbol: 'TSLA',
    logo_url: 'https://example.com/tsla.svg',
  },
  GOOGL: {
    name: 'Alphabet Inc.',
    ticker_symbol: 'GOOGL',
    logo_url: 'https://example.com/googl.svg',
  },
};

/**
 * 事前定義された保有銘柄モックデータ
 * 各シナリオ（プラス損益、マイナス損益、ゼロ損益）をカバー
 */
export const MOCK_HOLDING_ASSETS: Record<string, HoldingAsset> = {
  VOO: {
    asset: MOCK_ASSETS.VOO,
    asset_amount: 45969,
    gain_amount: 5242,
    gain_ratio: 12.87,
    holding_ratio: 39.8,
  },
  AAPL: {
    asset: MOCK_ASSETS.AAPL,
    asset_amount: 28500,
    gain_amount: 4200,
    gain_ratio: 17.28,
    holding_ratio: 24.7,
  },
  MSFT: {
    asset: MOCK_ASSETS.MSFT,
    asset_amount: 22800,
    gain_amount: 0,
    gain_ratio: 0,
    holding_ratio: 19.7,
  },
  TSLA: {
    asset: MOCK_ASSETS.TSLA,
    asset_amount: 11400,
    gain_amount: -1520,
    gain_ratio: -15.38,
    holding_ratio: 9.9,
  },
  GOOGL: {
    asset: MOCK_ASSETS.GOOGL,
    asset_amount: 6831,
    gain_amount: 578,
    gain_ratio: 9.24,
    holding_ratio: 5.9,
  },
};

// ============================================================================
// ファクトリ関数
// ============================================================================

/**
 * カスタマイズ可能なHoldingAssetを作成
 * @param overrides - デフォルト値を上書きするプロパティ
 * @returns HoldingAssetオブジェクト
 *
 * @example
 * // デフォルト値でVOOを作成
 * const asset = createMockHoldingAsset();
 *
 * @example
 * // カスタム値で作成
 * const asset = createMockHoldingAsset({
 *   asset: { name: 'Custom', ticker_symbol: 'CUST', logo_url: '' },
 *   gain_amount: -1000,
 * });
 */
export function createMockHoldingAsset(
  overrides?: Partial<HoldingAsset> & { asset?: Partial<Asset> }
): HoldingAsset {
  const baseAsset = MOCK_HOLDING_ASSETS.VOO;
  const assetOverrides = overrides?.asset;

  return {
    ...baseAsset,
    ...overrides,
    asset: {
      ...baseAsset.asset,
      ...assetOverrides,
    },
  };
}

/**
 * 特定のシナリオ用のHoldingAssetを取得
 */
export const mockAssetScenarios = {
  /** プラス損益のアセット */
  positive: (): HoldingAsset => MOCK_HOLDING_ASSETS.VOO,

  /** マイナス損益のアセット */
  negative: (): HoldingAsset => MOCK_HOLDING_ASSETS.TSLA,

  /** ゼロ損益のアセット */
  zero: (): HoldingAsset => MOCK_HOLDING_ASSETS.MSFT,
} as const;

/**
 * 複数のHoldingAssetのリストを作成
 * @param count - 作成する数（デフォルト: 3）
 * @returns HoldingAssetの配列
 */
export function createMockHoldingAssetList(count: number = 3): HoldingAsset[] {
  const keys = Object.keys(MOCK_HOLDING_ASSETS);
  return keys.slice(0, Math.min(count, keys.length)).map((key) => MOCK_HOLDING_ASSETS[key]);
}

/**
 * PortfolioResponseモックデータを作成
 * @param overrides - デフォルト値を上書きするプロパティ
 * @returns PortfolioResponseオブジェクト
 */
export function createMockPortfolioResponse(
  overrides?: Partial<PortfolioResponse>
): PortfolioResponse {
  const defaultAssets = createMockHoldingAssetList(3);
  const defaultTotalAmount = defaultAssets.reduce((sum, a) => sum + a.asset_amount, 0);
  const defaultTotalGain = defaultAssets.reduce((sum, a) => sum + a.gain_amount, 0);
  const defaultTotalRatio =
    defaultTotalAmount > 0 ? (defaultTotalGain / (defaultTotalAmount - defaultTotalGain)) * 100 : 0;

  return {
    total_asset_amount: defaultTotalAmount,
    total_gain_amount: defaultTotalGain,
    total_gain_ratio: Math.round(defaultTotalRatio * 100) / 100,
    holding_assets: defaultAssets,
    ...overrides,
  };
}

// ============================================================================
// テスト用プリセット
// ============================================================================

/**
 * PortfolioChartテスト用のプリセットデータの型
 */
interface PortfolioChartTestPreset {
  holdingAssets: HoldingAsset[];
  totalAssetAmount: number;
  totalGainAmount: number;
  totalGainRatio: number;
}

/**
 * PortfolioChartテスト用のプリセットデータ
 */
export const portfolioChartTestPresets: Record<string, PortfolioChartTestPreset> = {
  /** 標準的なポートフォリオ（3銘柄） */
  standard: {
    holdingAssets: [MOCK_HOLDING_ASSETS.VOO, MOCK_HOLDING_ASSETS.AAPL, MOCK_HOLDING_ASSETS.MSFT],
    totalAssetAmount: 115500,
    totalGainAmount: 15500,
    totalGainRatio: 15.5,
  },

  /** プラス損益のポートフォリオ */
  positiveGain: {
    holdingAssets: [MOCK_HOLDING_ASSETS.VOO, MOCK_HOLDING_ASSETS.AAPL],
    totalAssetAmount: 74469,
    totalGainAmount: 9442,
    totalGainRatio: 14.52,
  },

  /** マイナス損益のポートフォリオ */
  negativeGain: {
    holdingAssets: [MOCK_HOLDING_ASSETS.TSLA, MOCK_HOLDING_ASSETS.MSFT],
    totalAssetAmount: 100000,
    totalGainAmount: -5000,
    totalGainRatio: -4.76,
  },

  /** ゼロ損益のポートフォリオ */
  zeroGain: {
    holdingAssets: [MOCK_HOLDING_ASSETS.MSFT],
    totalAssetAmount: 100000,
    totalGainAmount: 0,
    totalGainRatio: 0,
  },

  /** 空のポートフォリオ */
  empty: {
    holdingAssets: [],
    totalAssetAmount: 0,
    totalGainAmount: 0,
    totalGainRatio: 0,
  },
};
