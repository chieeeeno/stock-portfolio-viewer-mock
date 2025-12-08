import colors from 'tailwindcss/colors';

/**
 * アプリケーション名
 */
export const APP_NAME = 'Portfolio Viewer';

/**
 * アプリケーションの説明
 */
export const APP_DESCRIPTION = '株式ポートフォリオビューワー';

/**
 * パイチャートの各セグメントに使用するカラーパレット
 */
export const CHART_COLORS = [
  colors.blue[500],
  colors.emerald[500],
  colors.amber[500],
  colors.red[500],
  colors.violet[500],
  colors.pink[500],
  colors.cyan[500],
  colors.orange[500],
];

/**
 * 評価損益の状態に応じた色
 */
export const GAIN_COLORS = {
  positive: colors.green[500],
  negative: colors.red[500],
  zero: colors.gray[500],
};
