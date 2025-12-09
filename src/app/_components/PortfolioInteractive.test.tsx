import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PortfolioInteractive from './PortfolioInteractive';
import type { PortfolioResponse } from '../_types/portfolio';

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
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} data-testid="asset-logo" onError={onError} {...props} />;
  },
}));

// Rechartsのモック
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({
    data,
    onClick,
  }: {
    data: Array<{ name: string }>;
    onClick?: (data: unknown, index: number) => void;
  }) => (
    <div data-testid="pie">
      {data.map((entry, index) => (
        <div
          key={entry.name}
          data-testid={`pie-segment-${index}`}
          onClick={() => onClick?.(entry, index)}
          style={{ opacity: 1 }}
        />
      ))}
    </div>
  ),
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

const mockData: PortfolioResponse = {
  total_asset_amount: 115500,
  total_gain_amount: 11130,
  total_gain_ratio: 10.67,
  holding_assets: [
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
  ],
};

describe('PortfolioInteractive', () => {
  describe('フォーカス機能', () => {
    it('カードをクリックするとフォーカス状態になる', () => {
      render(<PortfolioInteractive data={mockData} />);

      const cards = screen.getAllByTestId('asset-card');
      fireEvent.click(cards[0]);

      // フォーカスされたカードにはring-2クラスが付く
      expect(cards[0]).toHaveClass('ring-2');
    });

    it('同じカードを再クリックするとフォーカスが解除される', () => {
      render(<PortfolioInteractive data={mockData} />);

      const cards = screen.getAllByTestId('asset-card');
      fireEvent.click(cards[0]);
      fireEvent.click(cards[0]);

      expect(cards[0]).not.toHaveClass('ring-2');
    });

    it('別のカードをクリックするとフォーカスが切り替わる', () => {
      render(<PortfolioInteractive data={mockData} />);

      const cards = screen.getAllByTestId('asset-card');
      fireEvent.click(cards[0]);
      fireEvent.click(cards[1]);

      expect(cards[0]).not.toHaveClass('ring-2');
      expect(cards[1]).toHaveClass('ring-2');
    });

    it('documentをクリックするとフォーカスが解除される', () => {
      render(<PortfolioInteractive data={mockData} />);

      const cards = screen.getAllByTestId('asset-card');
      fireEvent.click(cards[0]);

      // フォーカス状態を確認
      expect(cards[0]).toHaveClass('ring-2');

      // documentをクリック
      fireEvent.click(document.body);

      // フォーカスが解除される
      expect(cards[0]).not.toHaveClass('ring-2');
    });

    it('フォーカス中にカード外の余白をクリックするとフォーカスが解除される', () => {
      const { container } = render(<PortfolioInteractive data={mockData} />);

      const cards = screen.getAllByTestId('asset-card');
      fireEvent.click(cards[0]);

      expect(cards[0]).toHaveClass('ring-2');

      // コンテナ外をクリック（documentレベル）
      fireEvent.click(container.parentElement || document.body);

      expect(cards[0]).not.toHaveClass('ring-2');
    });
  });

  describe('チャートセグメントクリック', () => {
    it('チャートセグメントをクリックするとフォーカス状態になる', () => {
      render(<PortfolioInteractive data={mockData} />);

      const segment = screen.getByTestId('pie-segment-0');
      fireEvent.click(segment);

      const cards = screen.getAllByTestId('asset-card');
      expect(cards[0]).toHaveClass('ring-2');
    });
  });
});
