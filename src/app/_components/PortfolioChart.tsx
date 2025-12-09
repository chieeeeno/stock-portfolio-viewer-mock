'use client';

import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import ChartTooltip from './ChartTooltip';
import { useChartTooltip } from '../_hooks/useChartTooltip';
import { useBreakpoint } from '../_hooks/useBreakpoint';
import { useChartColors } from '../_hooks/useChartColors';
import { tv } from 'tailwind-variants';
import type { HoldingAsset } from '../_types/portfolio';
import {
  formatCurrency,
  formatGainAmountWithCurrency,
  formatGainRatio,
  getGainStatus,
} from '@/utils/formatters';
import { cn } from '@/utils/cn';
import clsx from 'clsx';

import type { Breakpoint } from '../_hooks/useBreakpoint';

// ブレークポイントに応じたチャートサイズ設定
const CHART_SIZES: Record<Breakpoint, { innerRadius: number; outerRadius: number; centerSize: number }> = {
  mobile: { innerRadius: 90, outerRadius: 130, centerSize: 180 },
  tablet: { innerRadius: 110, outerRadius: 160, centerSize: 220 },
  desktop: { innerRadius: 130, outerRadius: 190, centerSize: 260 },
};

// チャート中央エリアのスタイルバリアント
const chartCenterVariants = tv({
  base: 'absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full',
  variants: {
    clickable: {
      true: 'cursor-pointer',
      false: 'pointer-events-none',
    },
  },
  defaultVariants: {
    clickable: false,
  },
});

// チャートセグメント（Cell）のスタイルバリアント
const chartSegmentVariants = tv({
  base: 'cursor-pointer transition-opacity duration-200',
  variants: {
    focused: {
      true: 'opacity-100',
      false: 'opacity-30',
    },
  },
  defaultVariants: {
    focused: true,
  },
});

interface PortfolioChartProps {
  /** 保有銘柄のリスト */
  holdingAssets: HoldingAsset[];
  /** 資産総額（円） */
  totalAssetAmount: number;
  /** 評価損益額（円） */
  totalGainAmount: number;
  /** 評価損益率（%） */
  totalGainRatio: number;
  /** フォーカス中の銘柄インデックス（null=フォーカスなし） */
  focusedIndex?: number | null;
  /** セグメントクリック時のコールバック */
  onSegmentClick?: (index: number) => void;
  /** フォーカス解除時のコールバック */
  onClearFocus?: () => void;
}

/**
 * ポートフォリオのドーナツチャートコンポーネント
 * - 保有銘柄の構成をドーナツ型パイチャートで表示
 * - チャート中央に資産総額と評価損益を表示
 * - 12時位置起点、保有比率の大きい順に時計回り
 */
export default function PortfolioChart({
  holdingAssets,
  totalAssetAmount,
  totalGainAmount,
  totalGainRatio,
  focusedIndex = null,
  onSegmentClick,
  onClearFocus,
}: PortfolioChartProps) {
  // ブレークポイントに応じたサイズを取得
  const breakpoint = useBreakpoint();
  const chartSize = CHART_SIZES[breakpoint];

  // テーマに応じたチャートカラーを取得
  const chartColors = useChartColors();

  // マウス追従ツールチップのロジック
  const {
    mousePosition,
    hoveredAsset,
    handlePieMouseEnter,
    handleChartMouseMove,
    handleChartMouseLeave,
  } = useChartTooltip();

  // T034: holding_ratioの降順で銘柄をソート
  const sortedAssets = useMemo(() => {
    return [...holdingAssets].sort((a, b) => b.holding_ratio - a.holding_ratio);
  }, [holdingAssets]);

  // チャート用のデータ形式に変換（ツールチップ用にHoldingAsset全体を含む）
  const chartData = useMemo(() => {
    return sortedAssets.map((holding) => ({
      name: holding.asset.ticker_symbol,
      value: holding.holding_ratio,
      // ツールチップでHoldingAsset全体にアクセスするためにpayloadに含める
      ...holding,
    }));
  }, [sortedAssets]);

  // T032: 評価損益の状態を取得
  const gainStatus = getGainStatus(totalGainAmount);

  // フォーカス中かつクリアハンドラがある場合、中央エリアをクリック可能にする
  const isCenterClickable = focusedIndex !== null && !!onClearFocus;

  return (
    <div data-testid="portfolio-chart" className="w-full" onClick={(e) => e.stopPropagation()}>
      {/* 白いカードで囲む */}
      <div
        className={clsx(
          'rounded-2xl bg-white p-4 shadow-sm',
          'sm:p-6',
          'lg:p-8',
          'dark:bg-zinc-800'
        )}
      >
        <div
          className={clsx(
            'relative h-[300px] w-full',
            'sm:h-[380px]',
            'lg:h-[450px]',
            '**:outline-none'
          )}
          onMouseMove={handleChartMouseMove}
          onMouseLeave={handleChartMouseLeave}
        >
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 300, height: 300 }}>
            <PieChart>
              {/* T028, T029: ドーナツ形状、12時位置起点（startAngle=90）、時計回り（endAngle=-270） */}
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={chartSize.innerRadius}
                outerRadius={chartSize.outerRadius}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                paddingAngle={1}
                onClick={onSegmentClick ? (_, index) => onSegmentClick(index) : undefined}
                onMouseEnter={handlePieMouseEnter}
                onMouseLeave={handleChartMouseLeave}
              >
                {/* T033, T061, T062: セグメントの色とフォーカス時の透明度を設定 */}
                {chartData.map((_, index) => {
                  const isSegmentFocused = focusedIndex === null || focusedIndex === index;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      data-testid="chart-segment"
                      fill={chartColors[index % chartColors.length]}
                      className={chartSegmentVariants({ focused: isSegmentFocused })}
                    />
                  );
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* T030, T031, T063: 中央ラベル（資産総額と評価損益）- クリックでフォーカス解除 */}
          {/* ドーナツの穴の部分のみをカバーするように配置 */}
          <div
            data-testid="chart-center"
            className={chartCenterVariants({ clickable: isCenterClickable })}
            style={{ width: chartSize.centerSize, height: chartSize.centerSize }}
            onClick={isCenterClickable ? onClearFocus : undefined}
          >
            {/* 資産総額ラベル */}
            <div
              className={clsx(
                'text-sm text-gray-500',
                'sm:text-base',
                'lg:text-lg',
                'dark:text-gray-400'
              )}
            >
              資産総額
            </div>
            {/* 資産総額 */}
            <div
              className={clsx(
                'text-2xl font-bold text-gray-900',
                'sm:text-3xl',
                'lg:text-4xl',
                'dark:text-white'
              )}
            >
              ¥{formatCurrency(totalAssetAmount)}
            </div>
            {/* 評価損益（額と率を別行で表示） */}
            <div data-testid="gain-info" className={cn('text-center', gainStatus.colorClass)}>
              <div className={clsx('text-lg font-semibold', 'sm:text-xl', 'lg:text-2xl')}>
                {formatGainAmountWithCurrency(totalGainAmount)}
              </div>
              <div className={clsx('text-base', 'sm:text-lg', 'lg:text-xl')}>
                {formatGainRatio(totalGainRatio)}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* T093, T094: マウス追従ツールチップ（createPortalでbodyに直接レンダリング） */}
      {hoveredAsset &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            data-testid="floating-tooltip"
            className="pointer-events-none fixed z-50"
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
            }}
          >
            <ChartTooltip active payload={[{ payload: hoveredAsset }]} />
          </div>,
          document.body
        )}
    </div>
  );
}
