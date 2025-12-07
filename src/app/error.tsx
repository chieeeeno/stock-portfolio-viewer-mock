'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * エラー状態を表示するError Boundaryコンポーネント
 * Suspense内でエラーが発生した場合に表示される
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // エラーをログに記録（本番環境ではエラー監視サービスに送信）
    console.error('ポートフォリオ読み込みエラー:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md px-4 py-8 text-center">
        <div className="mb-4 text-4xl">&#x26A0;&#xFE0F;</div>
        <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          データの読み込みに失敗しました
        </h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          ポートフォリオデータを取得できませんでした。
          <br />
          しばらくしてからもう一度お試しください。
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          再試行
        </button>
      </div>
    </div>
  );
}
