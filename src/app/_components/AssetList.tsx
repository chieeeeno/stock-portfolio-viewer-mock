'use client';

import { useMemo, type MouseEvent } from 'react';
import type { HoldingAsset } from '../_types/portfolio';
import AssetCard from './AssetCard';

interface AssetListProps {
  /** 保有銘柄のリスト */
  holdingAssets: HoldingAsset[];
  /** フォーカス中の銘柄インデックス（null=フォーカスなし） */
  focusedIndex?: number | null;
  /** 銘柄クリック時のコールバック */
  onAssetClick?: (index: number, e?: MouseEvent) => void;
}

/**
 * 保有銘柄の一覧を表示するコンポーネント
 * - holding_ratio（保有比率）の降順で銘柄をソート
 * - 各銘柄をAssetCardにマッピング
 * - チャートセグメントと同じ順序・色で表示
 */
export default function AssetList({
  holdingAssets,
  focusedIndex = null,
  onAssetClick,
}: AssetListProps) {
  // T051: holding_ratioの降順で銘柄をソート
  const sortedAssets = useMemo(() => {
    return [...holdingAssets].sort((a, b) => b.holding_ratio - a.holding_ratio);
  }, [holdingAssets]);

  return (
    <div
      data-testid="asset-list"
      className="flex flex-col gap-4"
      onClick={(e) => e.stopPropagation()}
    >
      {sortedAssets.map((asset, index) => {
        // T065: 各AssetCardにisFocusedとisDimmedプロップを渡す
        const isFocused = focusedIndex === index;
        const isDimmed = focusedIndex !== null && focusedIndex !== index;

        return (
          <AssetCard
            key={asset.asset.ticker_symbol}
            asset={asset}
            colorIndex={index}
            isFocused={isFocused}
            isDimmed={isDimmed}
            onClick={onAssetClick ? (e) => onAssetClick(index, e) : undefined}
          />
        );
      })}
    </div>
  );
}
