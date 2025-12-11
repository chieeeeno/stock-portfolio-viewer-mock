'use client';

import clsx from 'clsx';
import type { HoldingAsset } from '../_types/portfolio';
import {
  formatCurrency,
  formatHoldingRatio,
  formatGainAmount,
  formatGainRatio,
  getGainStatus,
} from '@/utils/formatters';
import { getGainStatusColor } from '@/utils/gainStatusStyles';

/**
 * Rechartsのツールチップから渡されるペイロードの型
 */
interface TooltipPayload {
  payload: HoldingAsset;
}

interface ChartTooltipProps {
  /** ツールチップがアクティブ（表示中）かどうか */
  active?: boolean;
  /** Rechartsから渡されるペイロード配列 */
  payload?: TooltipPayload[];
}

/**
 * パイチャートのカスタムツールチップコンポーネント
 * - 銘柄名、ティッカー、保有比率、評価額、評価損益を表示
 */
export default function ChartTooltip({ active, payload }: ChartTooltipProps) {
  // アクティブでない、またはペイロードがない場合は表示しない
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;
  const gainColorClass = getGainStatusColor(getGainStatus(data.gain_amount));

  return (
    <div
      data-testid="chart-tooltip"
      className={clsx(
        'rounded-lg bg-white px-3 py-2 shadow-lg',
        'border border-gray-200',
        'dark:border-zinc-600 dark:bg-zinc-800'
      )}
    >
      {/* 銘柄名 */}
      <div className={clsx('truncate text-sm font-semibold text-gray-900', 'dark:text-white')}>
        {data.asset.name}
      </div>

      {/* ティッカーシンボル */}
      <div className={clsx('text-sm text-gray-500', 'dark:text-gray-400')}>
        {data.asset.ticker_symbol}
      </div>

      {/* 詳細情報 */}
      <div className="mt-2 space-y-1 text-sm">
        {/* 保有比率 */}
        <div className={clsx('text-gray-700', 'dark:text-gray-300')}>
          保有比率: {formatHoldingRatio(data.holding_ratio)}
        </div>

        {/* 評価額 */}
        <div className={clsx('text-gray-700', 'dark:text-gray-300')}>
          評価額: ¥{formatCurrency(data.asset_amount)}
        </div>

        {/* 評価損益（色付き） */}
        <div className={gainColorClass}>
          評価損益: {formatGainAmount(data.gain_amount)}円 ({formatGainRatio(data.gain_ratio)})
        </div>
      </div>
    </div>
  );
}
