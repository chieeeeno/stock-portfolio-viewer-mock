import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChartTooltip } from './useChartTooltip';
import type { HoldingAsset } from '../_types/portfolio';

// モックデータ
const mockHoldingAsset: HoldingAsset = {
  asset: {
    asset_id: 1,
    name: 'S&P 500 ETF (Vanguard)',
    ticker_symbol: 'VOO',
    logo_url: 'https://example.com/voo.png',
  },
  asset_amount: 45969,
  gain_amount: 5242,
  gain_ratio: 12.87,
  holding_ratio: 39.8,
};

describe('useChartTooltip', () => {
  beforeEach(() => {
    // window.innerWidthをモック
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  describe('初期状態', () => {
    it('mousePositionの初期値は { x: 0, y: 0 }', () => {
      const { result } = renderHook(() => useChartTooltip());

      expect(result.current.mousePosition).toEqual({ x: 0, y: 0 });
    });

    it('hoveredAssetの初期値はnull', () => {
      const { result } = renderHook(() => useChartTooltip());

      expect(result.current.hoveredAsset).toBeNull();
    });
  });

  describe('handlePieMouseEnter', () => {
    it('ホバーした銘柄がhoveredAssetに設定される', () => {
      const { result } = renderHook(() => useChartTooltip());

      act(() => {
        result.current.handlePieMouseEnter(mockHoldingAsset);
      });

      expect(result.current.hoveredAsset).toEqual(mockHoldingAsset);
    });

    it('別の銘柄をホバーするとhoveredAssetが更新される', () => {
      const { result } = renderHook(() => useChartTooltip());
      const anotherAsset: HoldingAsset = {
        ...mockHoldingAsset,
        asset: { ...mockHoldingAsset.asset, ticker_symbol: 'VTI' },
      };

      act(() => {
        result.current.handlePieMouseEnter(mockHoldingAsset);
      });

      act(() => {
        result.current.handlePieMouseEnter(anotherAsset);
      });

      expect(result.current.hoveredAsset?.asset.ticker_symbol).toBe('VTI');
    });
  });

  describe('handleChartMouseMove', () => {
    it('マウス位置が更新される', () => {
      const { result } = renderHook(() => useChartTooltip());
      const mockEvent = {
        clientX: 100,
        clientY: 200,
      } as React.MouseEvent;

      act(() => {
        result.current.handleChartMouseMove(mockEvent);
      });

      // x = clientX + 15 = 115, y = clientY + 15 = 215
      expect(result.current.mousePosition).toEqual({ x: 115, y: 215 });
    });

    it('画面右端に近い場合、ツールチップは左側に表示される', () => {
      // 画面幅を狭く設定
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 300,
      });

      const { result } = renderHook(() => useChartTooltip());
      const mockEvent = {
        clientX: 200, // 200 + 15 + 200(tooltipWidth) = 415 > 300
        clientY: 100,
      } as React.MouseEvent;

      act(() => {
        result.current.handleChartMouseMove(mockEvent);
      });

      // x = clientX - tooltipWidth - 15 = 200 - 200 - 15 = -15
      expect(result.current.mousePosition.x).toBe(-15);
      expect(result.current.mousePosition.y).toBe(115);
    });
  });

  describe('handleChartMouseLeave', () => {
    it('hoveredAssetがnullにリセットされる', () => {
      const { result } = renderHook(() => useChartTooltip());

      // まずホバー状態にする
      act(() => {
        result.current.handlePieMouseEnter(mockHoldingAsset);
      });

      expect(result.current.hoveredAsset).not.toBeNull();

      // マウスが離れる
      act(() => {
        result.current.handleChartMouseLeave();
      });

      expect(result.current.hoveredAsset).toBeNull();
    });

    it('mousePositionは維持される', () => {
      const { result } = renderHook(() => useChartTooltip());
      const mockEvent = {
        clientX: 100,
        clientY: 200,
      } as React.MouseEvent;

      act(() => {
        result.current.handleChartMouseMove(mockEvent);
        result.current.handlePieMouseEnter(mockHoldingAsset);
      });

      act(() => {
        result.current.handleChartMouseLeave();
      });

      // mousePositionはリセットされない（次回ホバー時にすぐ使える）
      expect(result.current.mousePosition).toEqual({ x: 115, y: 215 });
    });
  });

  describe('ハンドラの参照安定性', () => {
    it('再レンダリングしてもハンドラの参照は変わらない', () => {
      const { result, rerender } = renderHook(() => useChartTooltip());

      const initialHandlers = {
        handlePieMouseEnter: result.current.handlePieMouseEnter,
        handleChartMouseMove: result.current.handleChartMouseMove,
        handleChartMouseLeave: result.current.handleChartMouseLeave,
      };

      rerender();

      expect(result.current.handlePieMouseEnter).toBe(initialHandlers.handlePieMouseEnter);
      expect(result.current.handleChartMouseMove).toBe(initialHandlers.handleChartMouseMove);
      expect(result.current.handleChartMouseLeave).toBe(initialHandlers.handleChartMouseLeave);
    });
  });
});
