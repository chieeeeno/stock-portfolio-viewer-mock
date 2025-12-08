import PortfolioChart from './PortfolioChart';
import AssetList from './AssetList';
import type { PortfolioResponse } from '@/types/portfolio';

/**
 * APIのベースURLを取得
 * 環境変数 API_BASE_URL が設定されていない場合はエラー
 */
function getApiBaseUrl(): string {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    throw new Error('環境変数 API_BASE_URL が設定されていません');
  }
  return baseUrl;
}

/**
 * APIからポートフォリオデータを取得
 */
async function fetchPortfolioData(): Promise<PortfolioResponse> {
  const baseUrl = getApiBaseUrl();

  const response = await fetch(`${baseUrl}/api/portfolio`, {
    cache: 'no-store', // 常に最新データを取得
  });

  if (!response.ok) {
    throw new Error('ポートフォリオデータの取得に失敗しました');
  }

  return response.json();
}

/**
 * ポートフォリオデータをフェッチして表示するサーバーコンポーネント
 */
export default async function PortfolioContent() {
  const data = await fetchPortfolioData();

  return (
    <div className="flex flex-col gap-y-16">
      <PortfolioChart
        holdingAssets={data.holding_assets}
        totalAssetAmount={data.total_asset_amount}
        totalGainAmount={data.total_gain_amount}
        totalGainRatio={data.total_gain_ratio}
      />
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">保有銘柄</h2>
        <AssetList holdingAssets={data.holding_assets} />
      </div>
    </div>
  );
}
