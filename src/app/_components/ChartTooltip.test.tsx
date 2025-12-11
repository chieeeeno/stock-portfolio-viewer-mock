import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ChartTooltip from './ChartTooltip';
import type { HoldingAsset } from '../_types/portfolio';

// テスト用のモックデータ
const mockHoldingAsset: HoldingAsset = {
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

describe('ChartTooltip', () => {
  // T086: ツールチップ表示のコンポーネントテスト
  describe('描画テスト', () => {
    it('ツールチップが正しく描画される', () => {
      render(<ChartTooltip active payload={[{ payload: mockHoldingAsset }]} />);

      expect(screen.getByTestId('chart-tooltip')).toBeInTheDocument();
    });

    it('activeがfalseの場合はnullを返す', () => {
      const { container } = render(
        <ChartTooltip active={false} payload={[{ payload: mockHoldingAsset }]} />
      );

      expect(container.firstChild).toBeNull();
    });

    it('payloadが空の場合はnullを返す', () => {
      const { container } = render(<ChartTooltip active payload={[]} />);

      expect(container.firstChild).toBeNull();
    });

    it('payloadがundefinedの場合はnullを返す', () => {
      const { container } = render(<ChartTooltip active payload={undefined} />);

      expect(container.firstChild).toBeNull();
    });
  });

  // T087: ツールチップに銘柄名、保有金額、保有比率が表示されることをテスト
  describe('コンテンツ表示テスト', () => {
    it('銘柄名が表示される', () => {
      render(<ChartTooltip active payload={[{ payload: mockHoldingAsset }]} />);

      expect(screen.getByText('S&P 500 ETF (Vanguard)')).toBeInTheDocument();
    });

    it('ティッカーシンボルが表示される', () => {
      render(<ChartTooltip active payload={[{ payload: mockHoldingAsset }]} />);

      expect(screen.getByText('VOO')).toBeInTheDocument();
    });

    it('保有比率が表示される', () => {
      render(<ChartTooltip active payload={[{ payload: mockHoldingAsset }]} />);

      expect(screen.getByText(/保有比率:.*39\.8%/)).toBeInTheDocument();
    });

    it('評価額が¥形式で表示される', () => {
      render(<ChartTooltip active payload={[{ payload: mockHoldingAsset }]} />);

      expect(screen.getByText(/評価額:.*¥45,969/)).toBeInTheDocument();
    });

    it('評価損益が色付きで表示される', () => {
      render(<ChartTooltip active payload={[{ payload: mockHoldingAsset }]} />);

      // 評価損益が表示される（+5,242円 (+12.87%)）
      expect(screen.getByText(/評価損益:.*5,242.*12\.87%/)).toBeInTheDocument();
    });

    it('異なる銘柄のデータが正しく表示される', () => {
      const differentAsset: HoldingAsset = {
        asset: {
          name: 'Apple Inc.',
          ticker_symbol: 'AAPL',
          logo_url: 'https://example.com/aapl.svg',
        },
        asset_amount: 28500,
        gain_amount: 4200,
        gain_ratio: 17.28,
        holding_ratio: 24.7,
      };

      render(<ChartTooltip active payload={[{ payload: differentAsset }]} />);

      expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
      expect(screen.getByText('AAPL')).toBeInTheDocument();
      expect(screen.getByText(/保有比率:.*24\.7%/)).toBeInTheDocument();
      expect(screen.getByText(/評価額:.*¥28,500/)).toBeInTheDocument();
    });

    it('マイナスの評価損益が正しく表示される', () => {
      const negativeGainAsset: HoldingAsset = {
        asset: {
          name: 'Microsoft Corporation',
          ticker_symbol: 'MSFT',
          logo_url: 'https://example.com/msft.svg',
        },
        asset_amount: 22800,
        gain_amount: -1500,
        gain_ratio: -6.17,
        holding_ratio: 19.7,
      };

      render(<ChartTooltip active payload={[{ payload: negativeGainAsset }]} />);

      expect(screen.getByText(/評価損益:.*-1,500.*-6\.17%/)).toBeInTheDocument();
    });
  });

  // T092: ツールチップのスタイリングテスト
  describe('スタイリングテスト', () => {
    it('ツールチップに背景色のクラスがある', () => {
      render(<ChartTooltip active payload={[{ payload: mockHoldingAsset }]} />);

      const tooltip = screen.getByTestId('chart-tooltip');
      expect(tooltip).toHaveClass('bg-white');
    });

    it('ツールチップに影のクラスがある', () => {
      render(<ChartTooltip active payload={[{ payload: mockHoldingAsset }]} />);

      const tooltip = screen.getByTestId('chart-tooltip');
      expect(tooltip).toHaveClass('shadow-lg');
    });

    it('ツールチップに角丸のクラスがある', () => {
      render(<ChartTooltip active payload={[{ payload: mockHoldingAsset }]} />);

      const tooltip = screen.getByTestId('chart-tooltip');
      expect(tooltip).toHaveClass('rounded-lg');
    });
  });
});
