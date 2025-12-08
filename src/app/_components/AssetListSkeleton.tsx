import AssetCardSkeleton from './AssetCardSkeleton';

interface AssetListSkeletonProps {
  /** 表示するスケルトンカードの数（デフォルト: 5） */
  count?: number;
}

/**
 * AssetListのスケルトンコンポーネント
 * - 複数のAssetCardSkeletonを表示
 * - ダミーデータの件数に合わせてデフォルト5件
 */
export default function AssetListSkeleton({ count = 5 }: AssetListSkeletonProps) {
  return (
    <div data-testid="asset-list-skeleton" className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <AssetCardSkeleton key={`skeleton-card-${index}`} />
      ))}
    </div>
  );
}
