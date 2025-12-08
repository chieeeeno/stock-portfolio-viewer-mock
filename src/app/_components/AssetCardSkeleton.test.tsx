import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AssetCardSkeleton from './AssetCardSkeleton';

describe('AssetCardSkeleton', () => {
  // T068B: AssetCardSkeletonの描画テスト
  describe('rendering', () => {
    it('renders the skeleton card container', () => {
      render(<AssetCardSkeleton />);

      const skeleton = screen.getByTestId('asset-card-skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('renders the logo placeholder', () => {
      render(<AssetCardSkeleton />);

      const logo = screen.getByTestId('skeleton-logo');
      expect(logo).toBeInTheDocument();
    });

    it('renders the text placeholders for asset info', () => {
      render(<AssetCardSkeleton />);

      // 銘柄名用のプレースホルダー
      const nameLines = screen.getAllByTestId('skeleton-text-line');
      expect(nameLines.length).toBeGreaterThanOrEqual(2);
    });

    it('renders the gain info placeholder', () => {
      render(<AssetCardSkeleton />);

      const gainPlaceholder = screen.getByTestId('skeleton-gain');
      expect(gainPlaceholder).toBeInTheDocument();
    });
  });

  // T068C: スケルトンアニメーションクラスのテスト
  describe('animation', () => {
    it('applies pulse animation to the skeleton card', () => {
      render(<AssetCardSkeleton />);

      const skeleton = screen.getByTestId('asset-card-skeleton');
      expect(skeleton).toHaveClass('animate-pulse');
    });
  });
});
