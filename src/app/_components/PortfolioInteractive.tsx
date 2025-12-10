'use client';

import { useState, useCallback, useEffect, type MouseEvent } from 'react';
import type { PortfolioResponse } from '../_types/portfolio';
import PortfolioChart from './PortfolioChart';
import AssetList from './AssetList';
import clsx from 'clsx';

interface PortfolioInteractiveProps {
  /** ポートフォリオデータ */
  data: PortfolioResponse;
}

/**
 * ポートフォリオのインタラクティブ表示コンポーネント
 * - フォーカス状態を管理し、PortfolioChartとAssetListを連携
 * - T057: focusedIndex状態を管理
 * - T058: handleAssetClick（トグル/フォーカス設定）
 * - T059: handleClearFocus（フォーカス解除）
 * - T060, T064: 子コンポーネントにpropsを渡す
 */
export default function PortfolioInteractive({ data }: PortfolioInteractiveProps) {
  // T057: フォーカス中の銘柄インデックス（null=フォーカスなし）
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // T058: 銘柄クリックハンドラ（同じ銘柄でトグル、別の銘柄でフォーカス設定）
  const handleAssetClick = useCallback((index: number, e?: MouseEvent) => {
    e?.stopPropagation();
    setFocusedIndex((prev) => (prev === index ? null : index));
  }, []);

  // T059: フォーカス解除ハンドラ
  const handleClearFocus = useCallback(() => {
    setFocusedIndex(null);
  }, []);

  // 枠外クリック時のフォーカス解除（documentレベルでイベントを捕捉）
  useEffect(() => {
    if (focusedIndex === null) return;

    const handleDocumentClick = () => {
      setFocusedIndex(null);
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [focusedIndex]);

  return (
    <div className="flex flex-col gap-y-8 sm:gap-y-16">
      {/* T060: PortfolioChartにfocusedIndexとハンドラを渡す */}
      <PortfolioChart
        holdingAssets={data.holding_assets}
        totalAssetAmount={data.total_asset_amount}
        totalGainAmount={data.total_gain_amount}
        totalGainRatio={data.total_gain_ratio}
        focusedIndex={focusedIndex}
        onSegmentClick={handleAssetClick}
        onClearFocus={handleClearFocus}
      />
      <div onClick={(e) => e.stopPropagation()}>
        <h2 className={clsx('mb-2 text-xl font-bold text-gray-900 dark:text-white', 'sm:mb-4')}>
          保有銘柄
        </h2>
        {/* T064: AssetListにfocusedIndexとハンドラを渡す */}
        <AssetList
          holdingAssets={data.holding_assets}
          focusedIndex={focusedIndex}
          onAssetClick={handleAssetClick}
        />
      </div>
    </div>
  );
}
