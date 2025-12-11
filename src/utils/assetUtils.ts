import type { HoldingAsset } from '@/app/_types/portfolio';

/**
 * 保有比率の降順でアセットをソートする
 * @param assets - ソート対象の保有アセット配列
 * @returns 保有比率の降順でソートされた新しい配列
 */
export function sortAssetsByHoldingRatio(assets: HoldingAsset[]): HoldingAsset[] {
  return [...assets].sort((a, b) => b.holding_ratio - a.holding_ratio);
}
