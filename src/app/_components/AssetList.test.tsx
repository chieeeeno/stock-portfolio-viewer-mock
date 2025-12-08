import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AssetList from './AssetList';
import type { HoldingAsset } from '../_types/portfolio';

// next/imageのモック
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    onError,
    ...props
  }: {
    src: string;
    alt: string;
    onError?: () => void;
    [key: string]: unknown;
  }) => {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} data-testid="asset-logo" onError={onError} {...props} />
    );
  },
}));

// テスト用のモックデータ（意図的に順序をバラバラに）
const mockHoldingAssets: HoldingAsset[] = [
  {
    asset: {
      name: 'Microsoft Corporation',
      ticker_symbol: 'MSFT',
      logo_url: 'https://example.com/msft.svg',
    },
    asset_amount: 22800,
    gain_amount: 3800,
    gain_ratio: 20.0,
    holding_ratio: 19.7,
  },
  {
    asset: {
      name: 'S&P 500 ETF (Vanguard)',
      ticker_symbol: 'VOO',
      logo_url: 'https://example.com/voo.svg',
    },
    asset_amount: 45969,
    gain_amount: 5242,
    gain_ratio: 12.87,
    holding_ratio: 39.8,
  },
  {
    asset: {
      name: 'Apple Inc.',
      ticker_symbol: 'AAPL',
      logo_url: 'https://example.com/aapl.svg',
    },
    asset_amount: 28500,
    gain_amount: 4200,
    gain_ratio: 17.28,
    holding_ratio: 24.7,
  },
];

describe('AssetList', () => {
  // T039: AssetListの描画コンポーネントテスト
  describe('描画テスト', () => {
    it('AssetListが正しく描画される', () => {
      render(<AssetList holdingAssets={mockHoldingAssets} />);

      expect(screen.getByTestId('asset-list')).toBeInTheDocument();
    });

    it('すべての銘柄カードが表示される', () => {
      render(<AssetList holdingAssets={mockHoldingAssets} />);

      const assetCards = screen.getAllByTestId('asset-card');
      expect(assetCards).toHaveLength(3);
    });

    it('各銘柄の名前が表示される', () => {
      render(<AssetList holdingAssets={mockHoldingAssets} />);

      expect(screen.getByText('S&P 500 ETF (Vanguard)')).toBeInTheDocument();
      expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
      expect(screen.getByText('Microsoft Corporation')).toBeInTheDocument();
    });

    it('空の配列でもエラーなく描画される', () => {
      render(<AssetList holdingAssets={[]} />);

      expect(screen.getByTestId('asset-list')).toBeInTheDocument();
      expect(screen.queryAllByTestId('asset-card')).toHaveLength(0);
    });
  });

  // T051: AssetListがholding_ratio降順で描画されることを確認
  describe('ソート順テスト', () => {
    it('銘柄がholding_ratio降順で表示される', () => {
      render(<AssetList holdingAssets={mockHoldingAssets} />);

      const assetCards = screen.getAllByTestId('asset-card');

      // 1番目: VOO (39.8%)
      expect(assetCards[0]).toHaveTextContent('VOO');
      expect(assetCards[0]).toHaveTextContent('39.8%');

      // 2番目: AAPL (24.7%)
      expect(assetCards[1]).toHaveTextContent('AAPL');
      expect(assetCards[1]).toHaveTextContent('24.7%');

      // 3番目: MSFT (19.7%)
      expect(assetCards[2]).toHaveTextContent('MSFT');
      expect(assetCards[2]).toHaveTextContent('19.7%');
    });
  });

  // カラーインデックスのテスト
  describe('カラーインデックステスト', () => {
    it('各カードに正しいカラーインデックスが割り当てられる', () => {
      render(<AssetList holdingAssets={mockHoldingAssets} />);

      const indicators = screen.getAllByTestId('color-indicator');
      expect(indicators).toHaveLength(3);
    });
  });
});
