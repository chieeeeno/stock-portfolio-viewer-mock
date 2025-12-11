import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('GET /api/portfolio', () => {
  it('レスポンスがPortfolioResponse構造を持つこと', async () => {
    const response = await GET();
    const data = await response.json();

    // 必須フィールドの存在確認
    expect(data).toHaveProperty('total_asset_amount');
    expect(data).toHaveProperty('total_gain_amount');
    expect(data).toHaveProperty('total_gain_ratio');
    expect(data).toHaveProperty('holding_assets');
  });

  it('total_asset_amountが正の数値であること', async () => {
    const response = await GET();
    const data = await response.json();

    expect(typeof data.total_asset_amount).toBe('number');
    expect(data.total_asset_amount).toBeGreaterThan(0);
  });

  it('holding_assetsが配列で、各要素が正しい構造を持つこと', async () => {
    const response = await GET();
    const data = await response.json();

    expect(Array.isArray(data.holding_assets)).toBe(true);
    expect(data.holding_assets.length).toBeGreaterThan(0);

    // 最初の要素の構造を検証
    const firstAsset = data.holding_assets[0];
    expect(firstAsset).toHaveProperty('asset');
    expect(firstAsset).toHaveProperty('asset_amount');
    expect(firstAsset).toHaveProperty('gain_amount');
    expect(firstAsset).toHaveProperty('gain_ratio');
    expect(firstAsset).toHaveProperty('holding_ratio');

    // assetオブジェクトの構造を検証
    expect(firstAsset.asset).toHaveProperty('name');
    expect(firstAsset.asset).toHaveProperty('ticker_symbol');
    expect(firstAsset.asset).toHaveProperty('logo_url');
  });

  it('レスポンスのContent-Typeがapplication/jsonであること', async () => {
    const response = await GET();

    expect(response.headers.get('content-type')).toContain('application/json');
  });
});
