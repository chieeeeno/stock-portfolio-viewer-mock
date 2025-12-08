'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { tv } from 'tailwind-variants';
import type { HoldingAsset } from '@/types/portfolio';
import {
  formatCurrency,
  formatGainAmountWithCurrency,
  formatGainRatio,
  getGainStatus,
} from '@/utils/formatters';
import { CHART_COLORS } from '@/utils/constants';
import { cn } from '@/utils/cn';

// チャート中央エリアのスタイルバリアント
const chartCenterVariants = tv({
  base: 'absolute left-1/2 top-1/2 flex h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full',
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
  // T034: holding_ratioの降順で銘柄をソート
  const sortedAssets = useMemo(() => {
    return [...holdingAssets].sort((a, b) => b.holding_ratio - a.holding_ratio);
  }, [holdingAssets]);

  // チャート用のデータ形式に変換
  const chartData = useMemo(() => {
    return sortedAssets.map((holding) => ({
      name: holding.asset.ticker_symbol,
      value: holding.holding_ratio,
    }));
  }, [sortedAssets]);

  // T032: 評価損益の状態を取得
  const gainStatus = getGainStatus(totalGainAmount);

  // フォーカス中かつクリアハンドラがある場合、中央エリアをクリック可能にする
  const isCenterClickable = focusedIndex !== null && !!onClearFocus;

  return (
    <div data-testid="portfolio-chart" className="w-full">
      {/* 白いカードで囲む */}
      <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-800">
        <div className="relative h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {/* T028, T029: ドーナツ形状、12時位置起点（startAngle=90）、時計回り（endAngle=-270） */}
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={130}
                outerRadius={190}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                paddingAngle={1}
                onClick={onSegmentClick ? (_, index) => onSegmentClick(index) : undefined}
                style={{ cursor: onSegmentClick ? 'pointer' : 'default' }}
              >
                {/* T033, T061, T062: セグメントの色とフォーカス時の透明度を設定 */}
                {chartData.map((_, index) => {
                  const isSegmentFocused = focusedIndex === null || focusedIndex === index;
                  const opacity = isSegmentFocused ? 1 : 0.3;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      data-testid="chart-segment"
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                      style={{ opacity, transition: 'opacity 0.2s ease-in-out' }}
                    />
                  );
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* T030, T031, T063: 中央ラベル（資産総額と評価損益）- クリックでフォーカス解除 */}
          {/* ドーナツの穴の部分のみをカバーするように配置（innerRadius=130pxに合わせる） */}
          <div
            data-testid="chart-center"
            className={chartCenterVariants({ clickable: isCenterClickable })}
            onClick={isCenterClickable ? onClearFocus : undefined}
          >
            {/* 資産総額ラベル */}
            <div className="text-lg text-gray-500 dark:text-gray-400">資産総額</div>
            {/* 資産総額 */}
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              ¥{formatCurrency(totalAssetAmount)}
            </div>
            {/* 評価損益（額と率を別行で表示） */}
            <div data-testid="gain-info" className={cn('text-center', gainStatus.colorClass)}>
              <div className="text-2xl font-semibold">
                {formatGainAmountWithCurrency(totalGainAmount)}
              </div>
              <div className="text-xl">{formatGainRatio(totalGainRatio)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
