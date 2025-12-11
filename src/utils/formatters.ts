import type { GainStatusInfo } from '@/app/_types/portfolio';

/**
 * 数値が有効かどうかをチェック（NaN, Infinity, -Infinityを除外）
 * @param value - チェックする数値
 * @returns 有効な数値の場合はtrue
 */
function isValidNumber(value: number): boolean {
  return Number.isFinite(value);
}

/**
 * 無効な数値を0に正規化
 * @param value - 正規化する数値
 * @returns 有効な数値の場合はそのまま、無効な場合は0
 */
function normalizeNumber(value: number): number {
  return isValidNumber(value) ? value : 0;
}

/**
 * 符号付きの値をフォーマットするヘルパー関数
 * @param value - フォーマットする数値
 * @param formatter - 絶対値をフォーマットする関数
 * @returns 符号付きでフォーマットされた文字列
 */
export function formatWithSign(value: number, formatter: (v: number) => string): string {
  if (value > 0) return `+${formatter(value)}`;
  if (value < 0) return `-${formatter(Math.abs(value))}`;
  return formatter(value);
}

/**
 * 数値を日本円形式でフォーマット（カンマ区切り）
 * @param amount - 金額（円）
 * @returns フォーマットされた文字列 (例: "115,500")
 * @remarks NaN, Infinityの場合は"0"を返す
 */
export function formatCurrency(amount: number): string {
  return normalizeNumber(amount).toLocaleString('ja-JP');
}

/**
 * 評価損益率をフォーマット（小数点以下2桁、符号付き）
 * @param ratio - 評価損益率（%）
 * @returns フォーマットされた文字列 (例: "+12.87%", "-5.00%")
 * @remarks NaN, Infinityの場合は"0.00%"を返す
 */
export function formatGainRatio(ratio: number): string {
  const normalized = normalizeNumber(ratio);
  return formatWithSign(normalized, (v) => `${v.toFixed(2)}%`);
}

/**
 * 保有比率をフォーマット（小数点以下1桁）
 * @param ratio - 保有比率（%）
 * @returns フォーマットされた文字列 (例: "39.8%")
 * @remarks NaN, Infinityの場合は"0.0%"を返す
 */
export function formatHoldingRatio(ratio: number): string {
  return `${normalizeNumber(ratio).toFixed(1)}%`;
}

/**
 * 評価損益額をフォーマット（カンマ区切り、符号付き）
 * @param amount - 評価損益額（円）
 * @returns フォーマットされた文字列 (例: "+15,500", "-3,000")
 * @remarks NaN, Infinityの場合は"0"を返す
 */
export function formatGainAmount(amount: number): string {
  const normalized = normalizeNumber(amount);
  return formatWithSign(normalized, (v) => v.toLocaleString('ja-JP'));
}

/**
 * 評価損益額を円記号付きでフォーマット（カンマ区切り、符号付き）
 * @param amount - 評価損益額（円）
 * @returns フォーマットされた文字列 (例: "+¥15,500", "-¥3,000", "¥0")
 * @remarks NaN, Infinityの場合は"¥0"を返す
 */
export function formatGainAmountWithCurrency(amount: number): string {
  const normalized = normalizeNumber(amount);
  return formatWithSign(normalized, (v) => `¥${v.toLocaleString('ja-JP')}`);
}

/**
 * 評価損益の状態を判定
 * @param amount - 評価損益額
 * @returns GainStatusInfo オブジェクト
 * @remarks NaN, Infinityの場合はzeroステータスを返す
 */
export function getGainStatus(amount: number): GainStatusInfo {
  const normalized = normalizeNumber(amount);
  if (normalized > 0) {
    return { status: 'positive', colorClass: 'text-green-600 dark:text-green-300' };
  } else if (normalized < 0) {
    return { status: 'negative', colorClass: 'text-red-600 dark:text-red-400' };
  } else {
    return { status: 'zero', colorClass: 'text-gray-500 dark:text-gray-400' };
  }
}
