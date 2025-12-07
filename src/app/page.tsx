import { Suspense } from 'react';
import PortfolioContent from '@/components/PortfolioContent';

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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-md px-4 py-8">
        <h1 className="mb-6 text-center text-xl font-bold text-gray-900 dark:text-white">
          ポートフォリオ
        </h1>
        <Suspense fallback={<PortfolioSkeleton />}>
          <PortfolioContent />
        </Suspense>
      </main>
    </div>
  );
}
