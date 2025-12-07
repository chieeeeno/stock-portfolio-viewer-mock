'use client';

import { useEffect, useState } from 'react';
import PortfolioChart from '@/components/PortfolioChart';
import type { PortfolioResponse } from '@/types/portfolio';

/**
 * ポートフォリオビューワーのメインページ
 * - モックデータを読み込んでパイチャートを表示
 * - ローディング状態とエラー状態を適切に処理
 */
export default function Home() {
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // T035: モックデータの読み込み
  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // モックデータをfetchで読み込み
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
          throw new Error('ポートフォリオデータの取得に失敗しました');
        }
        const data: PortfolioResponse = await response.json();
        setPortfolio(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadPortfolioData();
  }, []);

  // T036: ローディング状態の処理
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
        </div>
      </div>
    );
  }

  // T037: エラー状態の処理
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-4xl">&#9888;</div>
          <p className="text-lg font-medium text-red-600 dark:text-red-400">エラー</p>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-colors"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  // ポートフォリオデータが存在しない場合
  if (!portfolio) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-md px-4 py-8">
        <h1 className="mb-6 text-center text-xl font-bold text-gray-900 dark:text-white">
          ポートフォリオ
        </h1>
        <PortfolioChart
          holdingAssets={portfolio.holding_assets}
          totalAssetAmount={portfolio.total_asset_amount}
          totalGainAmount={portfolio.total_gain_amount}
          totalGainRatio={portfolio.total_gain_ratio}
        />
      </main>
    </div>
  );
}
