import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AssetListSkeleton from './AssetListSkeleton';

describe('AssetListSkeleton', () => {
  describe('rendering', () => {
    it('renders the skeleton list container', () => {
      render(<AssetListSkeleton />);

      const skeleton = screen.getByTestId('asset-list-skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('renders 5 skeleton cards by default', () => {
      render(<AssetListSkeleton />);

      const cards = screen.getAllByTestId('asset-card-skeleton');
      expect(cards).toHaveLength(5);
    });

    it('renders the specified number of skeleton cards', () => {
      render(<AssetListSkeleton count={3} />);

      const cards = screen.getAllByTestId('asset-card-skeleton');
      expect(cards).toHaveLength(3);
    });
  });
});
