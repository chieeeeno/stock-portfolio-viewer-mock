import { describe, expect, it } from 'vitest';
import { sortAssetsByHoldingRatio } from './assetUtils';
import type { HoldingAsset } from '@/app/_types/portfolio';

const createMockAsset = (ticker: string, holdingRatio: number): HoldingAsset => ({
  asset: {
    name: `Test Asset ${ticker}`,
    ticker_symbol: ticker,
    logo_url: `/logos/${ticker}.svg`,
  },
  asset_amount: 10000,
  gain_amount: 1000,
  gain_ratio: 10.0,
  holding_ratio: holdingRatio,
});

describe('sortAssetsByHoldingRatio', () => {
  it('保有比率の降順でソートする', () => {
    const assets = [
      createMockAsset('A', 10.0),
      createMockAsset('B', 30.0),
      createMockAsset('C', 20.0),
    ];

    const sorted = sortAssetsByHoldingRatio(assets);

    expect(sorted[0].asset.ticker_symbol).toBe('B');
    expect(sorted[1].asset.ticker_symbol).toBe('C');
    expect(sorted[2].asset.ticker_symbol).toBe('A');
  });

  it('元の配列を変更しない', () => {
    const assets = [createMockAsset('A', 10.0), createMockAsset('B', 30.0)];
    const originalOrder = assets.map((a) => a.asset.ticker_symbol);

    sortAssetsByHoldingRatio(assets);

    expect(assets.map((a) => a.asset.ticker_symbol)).toEqual(originalOrder);
  });

  it('空の配列を処理する', () => {
    const assets: HoldingAsset[] = [];

    const sorted = sortAssetsByHoldingRatio(assets);

    expect(sorted).toEqual([]);
  });

  it('1つの要素を持つ配列を処理する', () => {
    const assets = [createMockAsset('A', 100.0)];

    const sorted = sortAssetsByHoldingRatio(assets);

    expect(sorted).toHaveLength(1);
    expect(sorted[0].asset.ticker_symbol).toBe('A');
  });

  it('同じ保有比率の要素は元の順序を維持する', () => {
    const assets = [
      createMockAsset('A', 20.0),
      createMockAsset('B', 20.0),
      createMockAsset('C', 20.0),
    ];

    const sorted = sortAssetsByHoldingRatio(assets);

    // 同じ値の場合、ソートは安定しているので順序が維持される
    expect(sorted[0].asset.ticker_symbol).toBe('A');
    expect(sorted[1].asset.ticker_symbol).toBe('B');
    expect(sorted[2].asset.ticker_symbol).toBe('C');
  });

  it('小数点以下の保有比率を正しくソートする', () => {
    const assets = [
      createMockAsset('A', 10.55),
      createMockAsset('B', 10.56),
      createMockAsset('C', 10.54),
    ];

    const sorted = sortAssetsByHoldingRatio(assets);

    expect(sorted[0].asset.ticker_symbol).toBe('B');
    expect(sorted[1].asset.ticker_symbol).toBe('A');
    expect(sorted[2].asset.ticker_symbol).toBe('C');
  });
});
