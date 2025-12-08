import clsx from 'clsx';

/**
 * PortfolioChartのスケルトンコンポーネント
 * - ドーナツチャートの形状を模倣したプレースホルダー
 * - 中央に資産総額・評価損益のテキストプレースホルダー
 * - パルスアニメーションで読み込み中を表現
 * - レスポンシブ対応: モバイル(<640px)、タブレット(640-1023px)、デスクトップ(>=1024px)
 */
export default function PortfolioChartSkeleton() {
  return (
    <div data-testid="portfolio-chart-skeleton" className="w-full">
      {/* 白いカードで囲む（PortfolioChartと同じスタイル） */}
      <div
        className={clsx(
          'rounded-2xl bg-white p-4 shadow-sm',
          'sm:p-6',
          'lg:p-8',
          'dark:bg-zinc-800'
        )}
      >
        <div
          className={clsx(
            'relative flex h-[300px] w-full items-center justify-center',
            'sm:h-[380px]',
            'lg:h-[450px]'
          )}
        >
          {/* ドーナツ形状のスケルトン - レスポンシブサイズ */}
          <div
            data-testid="chart-skeleton-donut"
            className={clsx(
              'relative h-[260px] w-[260px] animate-pulse rounded-full bg-gray-200',
              'sm:h-[320px] sm:w-[320px]',
              'lg:h-[380px] lg:w-[380px]',
              'dark:bg-zinc-700'
            )}
          >
            {/* ドーナツの穴（中央の白い円） - レスポンシブサイズ */}
            <div
              className={clsx(
                'absolute top-1/2 left-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white',
                'sm:h-[220px] sm:w-[220px]',
                'lg:h-[260px] lg:w-[260px]',
                'dark:bg-zinc-800'
              )}
            />
          </div>

          {/* 中央ラベルエリアのスケルトン */}
          <div
            data-testid="chart-skeleton-center"
            className={clsx(
              'absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 animate-pulse flex-col items-center gap-2',
              'sm:gap-3'
            )}
          >
            {/* 資産総額ラベル */}
            <div
              data-testid="skeleton-line"
              className={clsx('h-4 w-14 rounded bg-gray-200', 'sm:h-5 sm:w-16', 'dark:bg-zinc-600')}
            />
            {/* 資産総額 */}
            <div
              data-testid="skeleton-line"
              className={clsx(
                'h-7 w-28 rounded bg-gray-200',
                'sm:h-9 sm:w-36',
                'lg:h-10 lg:w-40',
                'dark:bg-zinc-600'
              )}
            />
            {/* 評価損益 */}
            <div
              data-testid="skeleton-line"
              className={clsx(
                'h-5 w-20 rounded bg-gray-200',
                'sm:h-7 sm:w-28',
                'lg:h-8 lg:w-32',
                'dark:bg-zinc-600'
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
