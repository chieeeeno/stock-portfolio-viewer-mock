'use client';

import { useState, useCallback, useEffect, type MouseEvent } from 'react';
import type { PortfolioResponse } from '../_types/portfolio';
import PortfolioChart from './PortfolioChart';
import AssetList from './AssetList';
import { useTouchDevice } from '../_hooks/useTouchDevice';
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

  // タッチデバイス検出
  const isTouchDevice = useTouchDevice();

  // 該当する銘柄カードへスクロール
  const scrollToAssetCard = useCallback((index: number) => {
    const card = document.querySelector(`[data-asset-index="${index}"]`);
    card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  // T058: 銘柄クリックハンドラ（同じ銘柄でトグル、別の銘柄でフォーカス設定）
  // タッチデバイスの場合は該当銘柄カードへスクロールも実行
  const handleAssetClick = useCallback(
    (index: number, e?: MouseEvent) => {
      e?.stopPropagation();
      setFocusedIndex((prev) => (prev === index ? null : index));

      // タッチデバイスの場合、該当銘柄カードへスクロール
      if (isTouchDevice) {
        scrollToAssetCard(index);
      }
    },
    [isTouchDevice, scrollToAssetCard]
  );

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

  // T117: 空のポートフォリオエッジケースを処理
  // Note: Hooksのルールに従い、全てのHooksの後で早期returnを行う
  if (data.holding_assets.length === 0) {
    return (
      <div
        data-testid="empty-portfolio"
        className={clsx(
          'flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-16 shadow-sm',
          'dark:bg-zinc-800'
        )}
      >
        <p className={clsx('text-lg text-gray-500', 'dark:text-gray-400')}>保有銘柄がありません</p>
      </div>
    );
  }

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
