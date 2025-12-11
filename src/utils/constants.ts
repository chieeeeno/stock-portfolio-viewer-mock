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
 * サイトURL（OGP用）
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * OGP画像パス
 */
export const OG_IMAGE_PATH = '/og-image.png';

/**
 * パイチャートの各セグメントに使用するカラーパレット（ライトモード用）
 */
export const CHART_COLORS_LIGHT = [
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
 * パイチャートの各セグメントに使用するカラーパレット（ダークモード用）
 * 彩度を抑えて暗い背景でも見やすくする
 */
export const CHART_COLORS_DARK = [
  colors.blue[400],
  colors.emerald[400],
  colors.amber[400],
  colors.red[400],
  colors.violet[400],
  colors.pink[400],
  colors.cyan[400],
  colors.orange[400],
];

/**
 * 評価損益の状態に応じた色
 */
export const GAIN_COLORS = {
  positive: colors.green[500],
  negative: colors.red[500],
  zero: colors.gray[500],
};
