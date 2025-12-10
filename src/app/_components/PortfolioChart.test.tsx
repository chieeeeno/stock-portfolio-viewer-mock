import { render, screen, fireEvent } from '@/test-utils/test-utils';
import { describe, expect, it, vi } from 'vitest';
import PortfolioChart from './PortfolioChart';
import type { HoldingAsset } from '../_types/portfolio';

// Rechartsのモック（ResponsiveContainerはテスト環境でサイズ取得できないため）
vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container" style={{ width: 400, height: 400 }}>
        {children}
      </div>
    ),
    // PieChartコンポーネントをモック
    PieChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="pie-chart">{children}</div>
    ),
    // Pieコンポーネントをモックして、Cellの子要素をそのままレンダリング
    Pie: ({
      children,
      onClick,
      style,
    }: {
      children: React.ReactNode;
      onClick?: (data: unknown, index: number) => void;
      style?: React.CSSProperties;
    }) => (
      <div
        data-testid="pie"
        style={style}
        onClick={(e) => {
          // data-indexを持つ子要素がクリックされた場合、そのindexでonClickを呼ぶ
          const target = e.target as HTMLElement;
          const testId = target.getAttribute('data-testid');
          if (testId === 'chart-segment' && onClick) {
            const segments = Array.from(
              (e.currentTarget as HTMLElement).querySelectorAll('[data-testid="chart-segment"]')
            );
            const index = segments.indexOf(target);
            if (index >= 0) {
              onClick({}, index);
            }
          }
        }}
      >
        {children}
      </div>
    ),
    // Cellコンポーネントをモックしてテスト可能にする
    Cell: ({
      fill,
      className,
      'data-testid': dataTestId,
    }: {
      fill: string;
      className?: string;
      'data-testid'?: string;
    }) => <div data-testid={dataTestId} data-fill={fill} className={className} />,
  };
});

// テスト用のモックデータ
const mockHoldingAssets: HoldingAsset[] = [
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
  {
    asset: {
      name: 'Microsoft Corporation',
      ticker_symbol: 'MSFT',
      logo_url: 'https://example.com/msft.svg',
    },
    asset_amount: 22800,
    gain_amount: -1500,
    gain_ratio: -6.17,
    holding_ratio: 19.7,
  },
];

describe('PortfolioChart', () => {
  // T024: PortfolioChartの描画コンポーネントテスト
  describe('描画テスト', () => {
    it('ドーナツチャートが正しく描画される', () => {
      render(
        <PortfolioChart
          holdingAssets={mockHoldingAssets}
          totalAssetAmount={115500}
          totalGainAmount={15500}
          totalGainRatio={15.5}
        />
      );

      // ResponsiveContainerが存在することを確認
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    it('保有銘柄のセグメントが表示される', () => {
      render(
        <PortfolioChart
          holdingAssets={mockHoldingAssets}
          totalAssetAmount={115500}
          totalGainAmount={15500}
          totalGainRatio={15.5}
        />
      );

      // チャートコンテナが存在することを確認
      expect(screen.getByTestId('portfolio-chart')).toBeInTheDocument();
    });

    it('空の保有銘柄配列でもエラーなく描画される', () => {
      render(
        <PortfolioChart
          holdingAssets={[]}
          totalAssetAmount={0}
          totalGainAmount={0}
          totalGainRatio={0}
        />
      );

      expect(screen.getByTestId('portfolio-chart')).toBeInTheDocument();
    });
  });

  // T025: チャート中央ラベル表示のテスト
  describe('中央ラベル表示テスト', () => {
    it('資産総額が正しいフォーマットで表示される（¥115,500形式）', () => {
      render(
        <PortfolioChart
          holdingAssets={mockHoldingAssets}
          totalAssetAmount={115500}
          totalGainAmount={15500}
          totalGainRatio={15.5}
        />
      );

      // 資産総額が表示されていることを確認
      expect(screen.getByText('¥115,500')).toBeInTheDocument();
    });

    it('評価損益率と評価損益額が正しく表示される', () => {
      render(
        <PortfolioChart
          holdingAssets={mockHoldingAssets}
          totalAssetAmount={115500}
          totalGainAmount={15500}
          totalGainRatio={15.5}
        />
      );

      // 評価損益率が表示されていることを確認
      expect(screen.getByText(/\+15\.50%/)).toBeInTheDocument();
      // 評価損益情報コンテナ内に金額が表示されていることを確認
      const gainInfo = screen.getByTestId('gain-info');
      expect(gainInfo).toHaveTextContent('15,500');
    });

    it('マイナスの評価損益が正しく表示される', () => {
      render(
        <PortfolioChart
          holdingAssets={mockHoldingAssets}
          totalAssetAmount={100000}
          totalGainAmount={-5000}
          totalGainRatio={-4.76}
        />
      );

      // マイナスの評価損益率が表示されていることを確認
      expect(screen.getByText(/-4\.76%/)).toBeInTheDocument();
      // マイナスの評価損益額が表示されていることを確認
      expect(screen.getByText(/5,000/)).toBeInTheDocument();
    });

    it('評価損益がゼロの場合も正しく表示される', () => {
      render(
        <PortfolioChart
          holdingAssets={mockHoldingAssets}
          totalAssetAmount={100000}
          totalGainAmount={0}
          totalGainRatio={0}
        />
      );

      // ゼロの評価損益率が表示されていることを確認
      expect(screen.getByText(/0\.00%/)).toBeInTheDocument();
    });
  });

  // T026: 損益色ロジックのテスト
  describe('損益色ロジックテスト', () => {
    it('プラスの評価損益では緑色のスタイルが適用される', () => {
      render(
        <PortfolioChart
          holdingAssets={mockHoldingAssets}
          totalAssetAmount={115500}
          totalGainAmount={15500}
          totalGainRatio={15.5}
        />
      );

      const gainElement = screen.getByTestId('gain-info');
      expect(gainElement).toHaveClass('text-green-600');
    });

    it('マイナスの評価損益では赤色のスタイルが適用される', () => {
      render(
        <PortfolioChart
          holdingAssets={mockHoldingAssets}
          totalAssetAmount={100000}
          totalGainAmount={-5000}
          totalGainRatio={-4.76}
        />
      );

      const gainElement = screen.getByTestId('gain-info');
      expect(gainElement).toHaveClass('text-red-600');
    });

    it('ゼロの評価損益ではグレー色のスタイルが適用される', () => {
      render(
        <PortfolioChart
          holdingAssets={mockHoldingAssets}
          totalAssetAmount={100000}
          totalGainAmount={0}
          totalGainRatio={0}
        />
      );

      const gainElement = screen.getByTestId('gain-info');
      expect(gainElement).toHaveClass('text-gray-500');
    });
  });

  // T053: セグメントクリックハンドラのテスト
  describe('セグメントクリックハンドラテスト', () => {
    it('セグメントクリック時にonSegmentClickが呼ばれる', () => {
      const handleSegmentClick = vi.fn();
      render(
        <PortfolioChart
          holdingAssets={mockHoldingAssets}
          totalAssetAmount={115500}
          totalGainAmount={15500}
          totalGainRatio={15.5}
          onSegmentClick={handleSegmentClick}
        />
      );

      // セグメントをクリック
      const segments = screen.getAllByTestId('chart-segment');
      fireEvent.click(segments[0]);

      expect(handleSegmentClick).toHaveBeenCalledWith(0);
    });

    it('異なるセグメントクリックで異なるインデックスが渡される', () => {
      const handleSegmentClick = vi.fn();
      render(
        <PortfolioChart
          holdingAssets={mockHoldingAssets}
          totalAssetAmount={115500}
          totalGainAmount={15500}
          totalGainRatio={15.5}
          onSegmentClick={handleSegmentClick}
        />
      );

      // 2番目のセグメントをクリック
      const segments = screen.getAllByTestId('chart-segment');
      fireEvent.click(segments[1]);

      expect(handleSegmentClick).toHaveBeenCalledWith(1);
    });

    it('中央エリアクリックでonClearFocusが呼ばれる', () => {
      const handleClearFocus = vi.fn();
      render(
        <PortfolioChart
          holdingAssets={mockHoldingAssets}
          totalAssetAmount={115500}
          totalGainAmount={15500}
          totalGainRatio={15.5}
          focusedIndex={0}
          onClearFocus={handleClearFocus}
        />
      );

      // 中央エリアをクリック
      const centerArea = screen.getByTestId('chart-center');
      fireEvent.click(centerArea);

      expect(handleClearFocus).toHaveBeenCalled();
    });
  });

  // T054: フォーカス状態の透明度変更テスト
  describe('フォーカス状態透明度テスト', () => {
    it('focusedIndex指定時、フォーカスされたセグメントはopacity-100クラス', () => {
      render(
        <PortfolioChart
          holdingAssets={mockHoldingAssets}
          totalAssetAmount={115500}
          totalGainAmount={15500}
          totalGainRatio={15.5}
          focusedIndex={0}
        />
      );

      const segments = screen.getAllByTestId('chart-segment');
      // フォーカスされたセグメント（インデックス0）はopacity-100
      expect(segments[0]).toHaveClass('opacity-100');
    });

    it('focusedIndex指定時、他のセグメントはopacity-30クラス', () => {
      render(
        <PortfolioChart
          holdingAssets={mockHoldingAssets}
          totalAssetAmount={115500}
          totalGainAmount={15500}
          totalGainRatio={15.5}
          focusedIndex={0}
        />
      );

      const segments = screen.getAllByTestId('chart-segment');
      // フォーカスされていないセグメント（インデックス1, 2）はopacity-30
      expect(segments[1]).toHaveClass('opacity-30');
      expect(segments[2]).toHaveClass('opacity-30');
    });

    it('focusedIndexがnullの場合、すべてのセグメントはopacity-100クラス', () => {
      render(
        <PortfolioChart
          holdingAssets={mockHoldingAssets}
          totalAssetAmount={115500}
          totalGainAmount={15500}
          totalGainRatio={15.5}
          focusedIndex={null}
        />
      );

      const segments = screen.getAllByTestId('chart-segment');
      segments.forEach((segment) => {
        expect(segment).toHaveClass('opacity-100');
      });
    });

    it('セグメントにcursor-pointerクラスがある', () => {
      render(
        <PortfolioChart
          holdingAssets={mockHoldingAssets}
          totalAssetAmount={115500}
          totalGainAmount={15500}
          totalGainRatio={15.5}
          onSegmentClick={vi.fn()}
        />
      );

      // Cellコンポーネントにcursor-pointerクラスが適用される
      const segments = screen.getAllByTestId('chart-segment');
      segments.forEach((segment) => {
        expect(segment).toHaveClass('cursor-pointer');
      });
    });
  });
});
