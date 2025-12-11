'use client';

import { useTheme } from './useTheme';
import { CHART_COLORS_LIGHT, CHART_COLORS_DARK } from '@/utils/constants';

/**
 * 現在のテーマに応じたチャートカラーを返すフック
 * - ライトモード: CHART_COLORS_LIGHT（500系）
 * - ダークモード: CHART_COLORS_DARK（400系）
 */
export function useChartColors(): string[] {
  const { isDarkMode } = useTheme();
  return isDarkMode ? CHART_COLORS_DARK : CHART_COLORS_LIGHT;
}
