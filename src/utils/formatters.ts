import type { GainStatusInfo } from '@/types/portfolio';

/**
 * 数値を日本円形式でフォーマット（カンマ区切り）
 * @param amount - 金額（円）
 * @returns フォーマットされた文字列 (例: "115,500")
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('ja-JP');
}

/**
 * 評価損益率をフォーマット（小数点以下2桁、符号付き）
 * @param ratio - 評価損益率（%）
 * @returns フォーマットされた文字列 (例: "+12.87%", "-5.00%")
 */
export function formatGainRatio(ratio: number): string {
  const sign = ratio > 0 ? '+' : '';
  return `${sign}${ratio.toFixed(2)}%`;
}

/**
 * 保有比率をフォーマット（小数点以下1桁）
 * @param ratio - 保有比率（%）
 * @returns フォーマットされた文字列 (例: "39.8%")
 */
export function formatHoldingRatio(ratio: number): string {
  return `${ratio.toFixed(1)}%`;
}

/**
 * 評価損益額をフォーマット（カンマ区切り、符号付き）
 * @param amount - 評価損益額（円）
 * @returns フォーマットされた文字列 (例: "+15,500", "-3,000")
 */
export function formatGainAmount(amount: number): string {
  const sign = amount > 0 ? '+' : '';
  return `${sign}${amount.toLocaleString('ja-JP')}`;
}

/**
 * 評価損益の状態を判定
 * @param amount - 評価損益額
 * @returns GainStatusInfo オブジェクト
 */
export function getGainStatus(amount: number): GainStatusInfo {
  if (amount > 0) {
    return { status: 'positive', colorClass: 'text-green-500' };
  } else if (amount < 0) {
    return { status: 'negative', colorClass: 'text-red-500' };
  } else {
    return { status: 'zero', colorClass: 'text-gray-500' };
  }
}
