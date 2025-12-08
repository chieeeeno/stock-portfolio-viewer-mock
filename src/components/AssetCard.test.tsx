import { render, screen, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AssetCard from './AssetCard';
import type { HoldingAsset } from '@/types/portfolio';
import { CHART_COLORS } from '@/utils/constants';

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

// テスト用のモックデータ
const mockAsset: HoldingAsset = {
  asset: {
    name: 'S&P 500 ETF (Vanguard)',
    ticker_symbol: 'VOO',
    logo_url: 'https://example.com/voo.svg',
  },
  asset_amount: 45969,
  gain_amount: 5242,
  gain_ratio: 12.87,
  holding_ratio: 39.8,
};

const mockAssetNegative: HoldingAsset = {
  asset: {
    name: 'Tesla Inc.',
    ticker_symbol: 'TSLA',
    logo_url: 'https://example.com/tsla.svg',
  },
  asset_amount: 11400,
  gain_amount: -1520,
  gain_ratio: -15.38,
  holding_ratio: 9.9,
};

const mockAssetZero: HoldingAsset = {
  asset: {
    name: 'Microsoft Corporation',
    ticker_symbol: 'MSFT',
    logo_url: 'https://example.com/msft.svg',
  },
  asset_amount: 22800,
  gain_amount: 0,
  gain_ratio: 0,
  holding_ratio: 19.7,
};

describe('AssetCard', () => {
  // T038: AssetCardの描画コンポーネントテスト
  describe('描画テスト', () => {
    it('AssetCardが正しく描画される', () => {
      render(<AssetCard asset={mockAsset} colorIndex={0} />);

      expect(screen.getByTestId('asset-card')).toBeInTheDocument();
    });

    it('ロゴ画像が表示される', () => {
      render(<AssetCard asset={mockAsset} colorIndex={0} />);

      const logo = screen.getByTestId('asset-logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', mockAsset.asset.logo_url);
      expect(logo).toHaveAttribute('alt', mockAsset.asset.name);
    });

    it('銘柄名が表示される', () => {
      render(<AssetCard asset={mockAsset} colorIndex={0} />);

      expect(screen.getByText('S&P 500 ETF (Vanguard)')).toBeInTheDocument();
    });

    it('カラーインジケーターバーが表示される', () => {
      render(<AssetCard asset={mockAsset} colorIndex={0} />);

      const indicator = screen.getByTestId('color-indicator');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveStyle({ backgroundColor: CHART_COLORS[0] });
    });

    it('異なるcolorIndexで正しい色が適用される', () => {
      render(<AssetCard asset={mockAsset} colorIndex={2} />);

      const indicator = screen.getByTestId('color-indicator');
      expect(indicator).toHaveStyle({ backgroundColor: CHART_COLORS[2] });
    });
  });

  // T040: 「VOO / 39.8%」形式の表示テスト
  describe('ティッカー/比率表示テスト', () => {
    it('ティッカーシンボルと保有比率が「VOO / 39.8%」形式で表示される', () => {
      render(<AssetCard asset={mockAsset} colorIndex={0} />);

      expect(screen.getByText('VOO / 39.8%')).toBeInTheDocument();
    });

    it('異なる銘柄でも正しい形式で表示される', () => {
      render(<AssetCard asset={mockAssetNegative} colorIndex={0} />);

      expect(screen.getByText('TSLA / 9.9%')).toBeInTheDocument();
    });
  });

  // T046: 保有金額の表示テスト
  describe('保有金額表示テスト', () => {
    it('保有金額が¥45,969形式で表示される', () => {
      render(<AssetCard asset={mockAsset} colorIndex={0} />);

      expect(screen.getByText('¥45,969')).toBeInTheDocument();
    });
  });

  // T041: 「+12.87%(¥5,242)」形式の損益表示テスト
  describe('損益表示テスト', () => {
    it('プラスの損益が「+12.87%(¥+5,242)」形式で表示される', () => {
      render(<AssetCard asset={mockAsset} colorIndex={0} />);

      expect(screen.getByText(/\+12\.87%/)).toBeInTheDocument();
      expect(screen.getByText(/¥\+5,242/)).toBeInTheDocument();
    });

    it('マイナスの損益が「-15.38%(¥-1,520)」形式で表示される', () => {
      render(<AssetCard asset={mockAssetNegative} colorIndex={0} />);

      expect(screen.getByText(/-15\.38%/)).toBeInTheDocument();
      expect(screen.getByText(/¥-1,520/)).toBeInTheDocument();
    });

    it('ゼロの損益が「0.00%(¥0)」形式で表示される', () => {
      render(<AssetCard asset={mockAssetZero} colorIndex={0} />);

      expect(screen.getByText(/0\.00%/)).toBeInTheDocument();
    });
  });

  // T048: 損益テキストに損益色（緑/赤/グレー）を適用
  describe('損益色テスト', () => {
    it('プラスの損益では緑色のスタイルが適用される', () => {
      render(<AssetCard asset={mockAsset} colorIndex={0} />);

      const gainElement = screen.getByTestId('asset-gain');
      expect(gainElement).toHaveClass('text-green-500');
    });

    it('マイナスの損益では赤色のスタイルが適用される', () => {
      render(<AssetCard asset={mockAssetNegative} colorIndex={0} />);

      const gainElement = screen.getByTestId('asset-gain');
      expect(gainElement).toHaveClass('text-red-500');
    });

    it('ゼロの損益ではグレー色のスタイルが適用される', () => {
      render(<AssetCard asset={mockAssetZero} colorIndex={0} />);

      const gainElement = screen.getByTestId('asset-gain');
      expect(gainElement).toHaveClass('text-gray-500');
    });
  });

  // T043: ロゴ画像エラー時のフォールバック
  describe('ロゴフォールバックテスト', () => {
    it('ロゴ画像エラー時にティッカーシンボルのフォールバックが表示される', async () => {
      render(<AssetCard asset={mockAsset} colorIndex={0} />);

      // ロゴのonErrorをトリガー（actでラップしてReact状態更新を待つ）
      const logo = screen.getByTestId('asset-logo');
      await act(async () => {
        logo.dispatchEvent(new Event('error'));
      });

      // フォールバック（ティッカーシンボル）が表示されることを確認
      expect(screen.getByTestId('logo-fallback')).toBeInTheDocument();
      expect(screen.getByTestId('logo-fallback')).toHaveTextContent('VOO');
    });
  });
});
