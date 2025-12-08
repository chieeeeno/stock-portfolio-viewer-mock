/**
 * AssetCardのスケルトンコンポーネント
 * - カードの形状を模倣したプレースホルダー
 * - ロゴ、銘柄名、ティッカー・比率、損益情報のプレースホルダー
 * - パルスアニメーションで読み込み中を表現
 */
export default function AssetCardSkeleton() {
  return (
    <div
      data-testid="asset-card-skeleton"
      className="flex animate-pulse items-center gap-4 rounded-xl bg-white px-5 py-5 shadow-sm dark:bg-zinc-800"
    >
      {/* ロゴプレースホルダー */}
      <div
        data-testid="skeleton-logo"
        className="h-12 w-12 shrink-0 rounded-full bg-gray-200 dark:bg-zinc-600"
      />

      {/* 銘柄情報プレースホルダー */}
      <div className="min-w-0 flex-1 space-y-2">
        {/* 銘柄名 */}
        <div
          data-testid="skeleton-text-line"
          className="h-5 w-32 rounded bg-gray-200 dark:bg-zinc-600"
        />
        {/* ティッカー・比率 */}
        <div
          data-testid="skeleton-text-line"
          className="h-4 w-24 rounded bg-gray-200 dark:bg-zinc-600"
        />
      </div>

      {/* 損益情報プレースホルダー */}
      <div data-testid="skeleton-gain" className="shrink-0 space-y-2 text-right">
        {/* 損益額 */}
        <div className="ml-auto h-6 w-24 rounded bg-gray-200 dark:bg-zinc-600" />
        {/* 損益率 */}
        <div className="ml-auto h-4 w-16 rounded bg-gray-200 dark:bg-zinc-600" />
      </div>
    </div>
  );
}
