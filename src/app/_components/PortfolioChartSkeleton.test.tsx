import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PortfolioChartSkeleton from './PortfolioChartSkeleton';

describe('PortfolioChartSkeleton', () => {
  // T068A: PortfolioChartSkeletonの描画テスト
  describe('rendering', () => {
    it('renders the skeleton container', () => {
      render(<PortfolioChartSkeleton />);

      const skeleton = screen.getByTestId('portfolio-chart-skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('renders the donut shape skeleton', () => {
      render(<PortfolioChartSkeleton />);

      const donut = screen.getByTestId('chart-skeleton-donut');
      expect(donut).toBeInTheDocument();
    });

    it('renders the center label skeleton', () => {
      render(<PortfolioChartSkeleton />);

      const centerLabel = screen.getByTestId('chart-skeleton-center');
      expect(centerLabel).toBeInTheDocument();
    });

    it('renders all center label placeholder lines', () => {
      render(<PortfolioChartSkeleton />);

      // 中央には3行のプレースホルダーがある（資産総額ラベル、資産総額、評価損益）
      const lines = screen.getAllByTestId('skeleton-line');
      expect(lines.length).toBeGreaterThanOrEqual(3);
    });
  });

  // T068C: スケルトンアニメーションクラスのテスト
  describe('animation', () => {
    it('applies pulse animation to the donut skeleton', () => {
      render(<PortfolioChartSkeleton />);

      const donut = screen.getByTestId('chart-skeleton-donut');
      expect(donut).toHaveClass('animate-pulse');
    });

    it('applies pulse animation to the center label skeleton', () => {
      render(<PortfolioChartSkeleton />);

      const centerLabel = screen.getByTestId('chart-skeleton-center');
      expect(centerLabel).toHaveClass('animate-pulse');
    });
  });
});
