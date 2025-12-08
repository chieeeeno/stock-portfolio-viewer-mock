import type { Metadata } from 'next';
import { Suspense } from 'react';
import PortfolioContent from './_components/PortfolioContent';
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
 */
function PortfolioSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
      <p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
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
    <main className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ポートフォリオ</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          あなたの資産運用状況を確認できます
        </p>
      </div>
      <Suspense fallback={<PortfolioSkeleton />}>
        <PortfolioContent />
      </Suspense>
    </main>
  );
}
