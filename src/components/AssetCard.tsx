'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { HoldingAsset } from '@/types/portfolio';
import {
  formatCurrency,
  formatGainRatio,
  formatGainAmount,
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
 * - ロゴ画像（エラー時はティッカーシンボルにフォールバック）
 * - 銘柄名
 * - ティッカーシンボル / 保有比率
 * - 保有金額
 * - 評価損益（率と額）
 * - カラーインジケーターバー（チャートセグメントと対応）
 */
export default function AssetCard({ asset, colorIndex }: AssetCardProps) {
  const [imageError, setImageError] = useState(false);

  const { asset: assetInfo, asset_amount, gain_amount, gain_ratio, holding_ratio } = asset;
  const gainStatus = getGainStatus(gain_amount);
  const segmentColor = CHART_COLORS[colorIndex % CHART_COLORS.length];

  return (
    <div
      data-testid="asset-card"
      className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm dark:bg-zinc-800"
    >
      {/* T049: カラーインジケーターバー */}
      <div
        data-testid="color-indicator"
        className="h-12 w-1 flex-shrink-0 rounded-full"
        style={{ backgroundColor: segmentColor }}
      />

      {/* T043: ロゴ画像（エラー時はフォールバック） */}
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-700">
        {imageError ? (
          <span
            data-testid="logo-fallback"
            className="text-xs font-bold text-gray-600 dark:text-gray-300"
          >
            {assetInfo.ticker_symbol}
          </span>
        ) : (
          <Image
            src={assetInfo.logo_url}
            alt={assetInfo.name}
            width={40}
            height={40}
            className="h-full w-full object-contain"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* 銘柄情報 */}
      <div className="min-w-0 flex-1">
        {/* T044: 銘柄名 */}
        <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
          {assetInfo.name}
        </div>
        {/* T045: ティッカー / 比率 */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {assetInfo.ticker_symbol} / {formatHoldingRatio(holding_ratio)}
        </div>
      </div>

      {/* 金額情報 */}
      <div className="flex-shrink-0 text-right">
        {/* T046: 保有金額 */}
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          ¥{formatCurrency(asset_amount)}
        </div>
        {/* T047, T048: 損益表示（色付き） */}
        <div data-testid="asset-gain" className={`text-xs ${gainStatus.colorClass}`}>
          {formatGainRatio(gain_ratio)}(¥{formatGainAmount(gain_amount)})
        </div>
      </div>
    </div>
  );
}
