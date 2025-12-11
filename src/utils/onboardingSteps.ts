import type { DriveStep } from 'driver.js';

/**
 * オンボーディングガイドのステップ定義
 * - 各ステップは対象UI要素をハイライトし、説明を表示
 * - driver.js の DriveStep 型に準拠
 */
export const ONBOARDING_STEPS: DriveStep[] = [
  // ステップ1: パイチャート全体
  {
    element: '[data-driver="portfolio-chart"]',
    popover: {
      title: 'ポートフォリオチャート',
      description:
        'ポートフォリオの構成を円グラフで表示しています。各セグメントは保有銘柄を表します。',
      side: 'bottom',
      align: 'center',
    },
  },
  // ステップ2: パイチャート中央（資産総額・評価損益）
  {
    element: '[data-driver="chart-center"]',
    popover: {
      title: '資産総額と評価損益',
      description:
        '中央には資産総額と評価損益が表示されます。緑色はプラス、赤色はマイナスを示します。',
      side: 'bottom',
      align: 'center',
    },
  },
  // ステップ3: 銘柄一覧
  {
    element: '[data-driver="asset-list"]',
    popover: {
      title: '保有銘柄一覧',
      description:
        '各銘柄の詳細情報を確認できます。ロゴ、銘柄名、保有比率、評価損益が表示されます。',
      side: 'top',
      align: 'center',
    },
  },
  // ステップ4: フォーカス機能（セグメントクリック）
  {
    element: '[data-driver="portfolio-chart"]',
    popover: {
      title: 'フォーカス機能',
      description: 'セグメントをクリックすると、その銘柄にフォーカスできます。',
      side: 'bottom',
      align: 'center',
    },
  },
  // ステップ5: テーマ切り替えスイッチ
  {
    element: '[data-driver="theme-toggle"]',
    popover: {
      title: 'テーマ切り替え',
      description: 'こちらでライトモード/ダークモードを切り替えられます。',
      side: 'bottom',
      align: 'end',
    },
  },
];

/**
 * オンボーディング完了状態を保存するlocalStorageのキー
 */
export const ONBOARDING_COMPLETED_KEY = 'onboarding-completed';
