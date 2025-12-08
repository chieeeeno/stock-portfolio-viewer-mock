/**
 * AssetCardのスケルトンコンポーネント
 * - カードの形状を模倣したプレースホルダー
 * - ロゴ、銘柄名、ティッカー・比率、損益情報のプレースホルダー
 * - パルスアニメーションで読み込み中を表現
 * - レスポンシブ対応: モバイル(<640px)とそれ以上で異なるサイズ
 */
export default function AssetCardSkeleton() {
  return (
    <div
      data-testid="asset-card-skeleton"
      className="flex animate-pulse items-center gap-3 rounded-xl bg-white px-3 py-4 shadow-sm sm:gap-4 sm:px-5 sm:py-5 dark:bg-zinc-800"
    >
      {/* ロゴプレースホルダー */}
      <div
        data-testid="skeleton-logo"
        className="h-10 w-10 shrink-0 rounded-full bg-gray-200 sm:h-12 sm:w-12 dark:bg-zinc-600"
      />

      {/* 銘柄情報プレースホルダー */}
      <div className="min-w-0 flex-1 space-y-2">
        {/* 銘柄名 */}
        <div
          data-testid="skeleton-text-line"
          className="h-4 w-28 rounded bg-gray-200 sm:h-5 sm:w-32 dark:bg-zinc-600"
        />
        {/* ティッカー・比率 */}
        <div
          data-testid="skeleton-text-line"
          className="h-3 w-20 rounded bg-gray-200 sm:h-4 sm:w-24 dark:bg-zinc-600"
        />
      </div>

      {/* 損益情報プレースホルダー */}
      <div data-testid="skeleton-gain" className="shrink-0 space-y-2 text-right">
        {/* 損益額 */}
        <div className="ml-auto h-5 w-20 rounded bg-gray-200 sm:h-6 sm:w-24 dark:bg-zinc-600" />
        {/* 損益率 */}
        <div className="ml-auto h-3 w-14 rounded bg-gray-200 sm:h-4 sm:w-16 dark:bg-zinc-600" />
      </div>
    </div>
  );
}
