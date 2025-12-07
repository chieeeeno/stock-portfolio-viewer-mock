import { headers } from 'next/headers';
import PortfolioChart from './PortfolioChart';
import type { PortfolioResponse } from '@/types/portfolio';

/**
 * APIからポートフォリオデータを取得
 */
async function fetchPortfolioData(): Promise<PortfolioResponse> {
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

  const response = await fetch(`${protocol}://${host}/api/portfolio`, {
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
    <PortfolioChart
      holdingAssets={data.holding_assets}
      totalAssetAmount={data.total_asset_amount}
      totalGainAmount={data.total_gain_amount}
      totalGainRatio={data.total_gain_ratio}
    />
  );
}
