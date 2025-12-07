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
  colorClass: string; // Tailwind CSSクラス
}
