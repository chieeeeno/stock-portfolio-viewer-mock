import type { Metadata } from 'next';
import { Suspense } from 'react';
import clsx from 'clsx';
import PortfolioContent from './_components/PortfolioContent';
import PortfolioChartSkeleton from './_components/PortfolioChartSkeleton';
import AssetListSkeleton from './_components/AssetListSkeleton';
import { APP_NAME, APP_DESCRIPTION } from '@/utils/constants';

/**
 * ポートフォリオページのメタデータ
 */
export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: '/',
  },
  twitter: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
};

/**
 * ローディング中のスケルトンUI
 * - PortfolioInteractiveと同じ構造でスケルトンを表示
 * - レイアウトのガタツキを防ぐため、見出しも含める
 */
function PortfolioSkeleton() {
  return (
    <div className="flex flex-col gap-y-16">
      <PortfolioChartSkeleton />
      <div>
        <h2 className={clsx('mb-4 text-xl font-bold text-gray-900', 'dark:text-white')}>
          保有銘柄
        </h2>
        <AssetListSkeleton />
      </div>
    </div>
  );
}

/**
 * ポートフォリオビューワーのメインページ（サーバーコンポーネント）
 * - Suspenseを使用して非同期データ取得
 * - サーバー側でデータをフェッチしてクライアントに渡す
 */
export default function Home() {
  return (
    <main className={clsx('mx-auto w-full max-w-4xl px-4 py-8', 'sm:px-6')}>
      <div className="mb-6">
        <h2 className={clsx('text-2xl font-bold text-gray-900', 'dark:text-white')}>
          ポートフォリオ
        </h2>
        <p className={clsx('mt-1 text-sm text-gray-500', 'dark:text-gray-400')}>
          あなたの資産運用状況を確認できます
        </p>
      </div>
      <Suspense fallback={<PortfolioSkeleton />}>
        <PortfolioContent />
      </Suspense>
    </main>
  );
}
