/**
 * PortfolioChartのスケルトンコンポーネント
 * - ドーナツチャートの形状を模倣したプレースホルダー
 * - 中央に資産総額・評価損益のテキストプレースホルダー
 * - パルスアニメーションで読み込み中を表現
 */
export default function PortfolioChartSkeleton() {
  return (
    <div data-testid="portfolio-chart-skeleton" className="w-full">
      {/* 白いカードで囲む（PortfolioChartと同じスタイル） */}
      <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-800">
        <div className="relative flex h-[450px] w-full items-center justify-center">
          {/* ドーナツ形状のスケルトン */}
          <div
            data-testid="chart-skeleton-donut"
            className="relative h-[380px] w-[380px] animate-pulse rounded-full bg-gray-200 dark:bg-zinc-700"
          >
            {/* ドーナツの穴（中央の白い円） */}
            <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white dark:bg-zinc-800" />
          </div>

          {/* 中央ラベルエリアのスケルトン */}
          <div
            data-testid="chart-skeleton-center"
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 animate-pulse flex-col items-center gap-3"
          >
            {/* 資産総額ラベル */}
            <div
              data-testid="skeleton-line"
              className="h-5 w-16 rounded bg-gray-200 dark:bg-zinc-600"
            />
            {/* 資産総額 */}
            <div
              data-testid="skeleton-line"
              className="h-10 w-40 rounded bg-gray-200 dark:bg-zinc-600"
            />
            {/* 評価損益 */}
            <div
              data-testid="skeleton-line"
              className="h-8 w-32 rounded bg-gray-200 dark:bg-zinc-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
