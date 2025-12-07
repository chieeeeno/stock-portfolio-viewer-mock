import PortfolioChart from './PortfolioChart';
import type { PortfolioResponse } from '@/types/portfolio';

/**
 * ポートフォリオデータをフェッチして表示するサーバーコンポーネント
 */
export default async function PortfolioContent() {
  // サーバー側でデータをフェッチ
  const data: PortfolioResponse = await import('@/data/dummy_response.json').then(
    (mod) => mod.default
  );

  return (
    <PortfolioChart
      holdingAssets={data.holding_assets}
      totalAssetAmount={data.total_asset_amount}
      totalGainAmount={data.total_gain_amount}
      totalGainRatio={data.total_gain_ratio}
    />
  );
}
