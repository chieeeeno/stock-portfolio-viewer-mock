'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { HoldingAsset } from '@/types/portfolio';
import {
  formatCurrency,
  formatGainRatio,
  formatHoldingRatio,
  getGainStatus,
} from '@/utils/formatters';
import { CHART_COLORS } from '@/utils/constants';

interface AssetCardProps {
  /** 保有銘柄の情報 */
  asset: HoldingAsset;
  /** カラーインデックス（CHART_COLORSの配列インデックス） */
  colorIndex: number;
}

/**
 * 個別銘柄の詳細情報を表示するカードコンポーネント
 * - カラフルな丸アイコン（ティッカー2文字）またはロゴ画像
 * - 銘柄名
 * - ティッカーシンボル・保有比率
 * - 評価損益（額と率を縦並び）
 */
export default function AssetCard({ asset, colorIndex }: AssetCardProps) {
  const [imageError, setImageError] = useState(false);

  const { asset: assetInfo, gain_amount, gain_ratio, holding_ratio } = asset;
  const gainStatus = getGainStatus(gain_amount);
  const segmentColor = CHART_COLORS[colorIndex % CHART_COLORS.length];

  // ティッカーシンボルの先頭2文字を取得
  const tickerInitials = assetInfo.ticker_symbol.slice(0, 2).toUpperCase();

  return (
    <div
      data-testid="asset-card"
      className="flex items-center gap-4 rounded-xl bg-white px-5 py-5 shadow-sm dark:bg-zinc-800"
    >
      {/* カラフルな丸アイコン */}
      <div
        data-testid="color-indicator"
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
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
      <div data-testid="asset-gain" className={`flex-shrink-0 text-right ${gainStatus.colorClass}`}>
        {/* 損益額 */}
        <div className="text-xl font-semibold">
          {gain_amount >= 0 ? '+' : ''}¥{formatCurrency(Math.abs(gain_amount))}
        </div>
        {/* 損益率 */}
        <div className="text-base">{formatGainRatio(gain_ratio)}</div>
      </div>
    </div>
  );
}
