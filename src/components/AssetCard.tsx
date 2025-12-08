'use client';

import { useState } from 'react';
import Image from 'next/image';
import { tv } from 'tailwind-variants';
import type { HoldingAsset } from '@/types/portfolio';
import {
  formatGainAmountWithCurrency,
  formatGainRatio,
  formatHoldingRatio,
  getGainStatus,
} from '@/utils/formatters';
import { CHART_COLORS } from '@/utils/constants';
import { cn } from '@/utils/cn';

// カードのスタイルバリアント定義
const cardVariants = tv({
  base: 'flex items-center gap-4 rounded-xl bg-white px-5 py-5 shadow-sm transition-all duration-200 dark:bg-zinc-800',
  variants: {
    focused: {
      true: 'ring-2 ring-blue-500',
    },
    dimmed: {
      true: 'opacity-30',
    },
    clickable: {
      true: 'cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700',
    },
  },
});

interface AssetCardProps {
  /** 保有銘柄の情報 */
  asset: HoldingAsset;
  /** カラーインデックス（CHART_COLORSの配列インデックス） */
  colorIndex: number;
  /** フォーカス状態かどうか */
  isFocused?: boolean;
  /** 半透過状態かどうか */
  isDimmed?: boolean;
  /** クリック時のコールバック */
  onClick?: () => void;
}

/**
 * 個別銘柄の詳細情報を表示するカードコンポーネント
 * - カラフルな丸アイコン（ティッカー2文字）またはロゴ画像
 * - 銘柄名
 * - ティッカーシンボル・保有比率
 * - 評価損益（額と率を縦並び）
 */
export default function AssetCard({
  asset,
  colorIndex,
  isFocused = false,
  isDimmed = false,
  onClick,
}: AssetCardProps) {
  const [imageError, setImageError] = useState(false);

  const { asset: assetInfo, gain_amount, gain_ratio, holding_ratio } = asset;
  const gainStatus = getGainStatus(gain_amount);
  const segmentColor = CHART_COLORS[colorIndex % CHART_COLORS.length];

  // ティッカーシンボルの先頭2文字を取得
  const tickerInitials = assetInfo.ticker_symbol.slice(0, 2).toUpperCase();

  return (
    <div
      data-testid="asset-card"
      className={cardVariants({
        focused: isFocused,
        dimmed: isDimmed,
        clickable: !!onClick,
      })}
      onClick={onClick}
    >
      {/* カラフルな丸アイコン */}
      <div
        data-testid="color-indicator"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
        style={{ backgroundColor: segmentColor }}
      >
        {imageError ? (
          <span data-testid="logo-fallback">{tickerInitials}</span>
        ) : (
          <Image
            src={assetInfo.logo_url}
            alt={assetInfo.name}
            width={48}
            height={48}
            className="h-full w-full rounded-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* 銘柄情報 */}
      <div className="min-w-0 flex-1">
        {/* T044: 銘柄名 */}
        <div className="truncate text-base font-semibold text-gray-900 dark:text-white">
          {assetInfo.name}
        </div>
        {/* T045: ティッカー・比率 */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {assetInfo.ticker_symbol} • {formatHoldingRatio(holding_ratio)}
        </div>
      </div>

      {/* 損益情報（縦並び） */}
      <div data-testid="asset-gain" className={cn('shrink-0 text-right', gainStatus.colorClass)}>
        {/* 損益額 */}
        <div className="text-xl font-semibold">{formatGainAmountWithCurrency(gain_amount)}</div>
        {/* 損益率 */}
        <div className="text-base">{formatGainRatio(gain_ratio)}</div>
      </div>
    </div>
  );
}
