'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { HoldingAsset } from '@/types/portfolio';
import {
  formatCurrency,
  formatGainRatio,
  formatGainAmount,
  getGainStatus,
} from '@/utils/formatters';
import { CHART_COLORS } from '@/utils/constants';

interface PortfolioChartProps {
  /** 保有銘柄のリスト */
  holdingAssets: HoldingAsset[];
  /** 資産総額（円） */
  totalAssetAmount: number;
  /** 評価損益額（円） */
  totalGainAmount: number;
  /** 評価損益率（%） */
  totalGainRatio: number;
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

  return (
    <div data-testid="portfolio-chart" className="w-full">
      <div className="relative h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* T028, T029: ドーナツ形状、12時位置起点（startAngle=90）、時計回り（endAngle=-270） */}
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              paddingAngle={1}
            >
              {/* T033: CHART_COLORS定数を使用してセグメントの色を設定 */}
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* T030, T031: 中央ラベル（資産総額と評価損益） */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {/* 資産総額 */}
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            ¥{formatCurrency(totalAssetAmount)}
          </div>
          {/* 評価損益（率と額を併記） */}
          <div data-testid="gain-info" className={`text-sm ${gainStatus.colorClass}`}>
            {formatGainRatio(totalGainRatio)}(¥{formatGainAmount(totalGainAmount)})
          </div>
        </div>
      </div>
    </div>
  );
}
