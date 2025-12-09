'use client';

import { useState, useCallback } from 'react';
import type { HoldingAsset } from '../_types/portfolio';

interface MousePosition {
  x: number;
  y: number;
}

interface UseChartTooltipReturn {
  /** 現在のマウス位置 */
  mousePosition: MousePosition;
  /** ホバー中の銘柄（null=ホバーなし） */
  hoveredAsset: HoldingAsset | null;
  /** Pieセグメントにマウスが入った時のハンドラ */
  handlePieMouseEnter: (data: HoldingAsset) => void;
  /** チャート上でマウスが動いた時のハンドラ */
  handleChartMouseMove: (e: React.MouseEvent) => void;
  /** チャートからマウスが離れた時のハンドラ */
  handleChartMouseLeave: () => void;
}

/**
 * チャートツールチップのマウス追従ロジックを管理するカスタムフック
 *
 * 責務:
 * - マウス位置の追跡
 * - ホバー中の銘柄状態の管理
 * - 画面端でのツールチップ位置調整
 */
export function useChartTooltip(): UseChartTooltipReturn {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [hoveredAsset, setHoveredAsset] = useState<HoldingAsset | null>(null);

  // Pieセグメントにマウスが入った時
  const handlePieMouseEnter = useCallback((data: HoldingAsset) => {
    setHoveredAsset({
      asset: data.asset,
      asset_amount: data.asset_amount,
      gain_amount: data.gain_amount,
      gain_ratio: data.gain_ratio,
      holding_ratio: data.holding_ratio,
    });
  }, []);

  // チャート上でマウスが動いた時（ツールチップ位置更新）
  const handleChartMouseMove = useCallback((e: React.MouseEvent) => {
    const tooltipWidth = 200;
    let x = e.clientX + 15;
    const y = e.clientY + 15;

    // ツールチップが画面右端からはみ出す場合は左側に表示
    if (x + tooltipWidth > window.innerWidth) {
      x = e.clientX - tooltipWidth - 15;
    }

    setMousePosition({ x, y });
  }, []);

  // チャートからマウスが離れた時
  const handleChartMouseLeave = useCallback(() => {
    setHoveredAsset(null);
  }, []);

  return {
    mousePosition,
    hoveredAsset,
    handlePieMouseEnter,
    handleChartMouseMove,
    handleChartMouseLeave,
  };
}
