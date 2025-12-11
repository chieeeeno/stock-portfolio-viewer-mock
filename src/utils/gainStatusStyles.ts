import type { GainStatus } from '@/app/_types/portfolio';

/**
 * 評価損益ステータスに対応するTailwind CSSカラークラスのマッピング
 * - positive: 緑色（プラスの損益）
 * - negative: 赤色（マイナスの損益）
 * - zero: グレー（損益なし）
 */
export const GAIN_STATUS_COLORS: Record<GainStatus, string> = {
  positive: 'text-green-600 dark:text-green-300',
  negative: 'text-red-600 dark:text-red-400',
  zero: 'text-gray-500 dark:text-gray-400',
};

/**
 * 評価損益ステータスに対応するカラークラスを取得する
 * @param status - 評価損益ステータス
 * @returns 対応するTailwind CSSクラス文字列
 */
export function getGainStatusColor(status: GainStatus): string {
  return GAIN_STATUS_COLORS[status];
}
