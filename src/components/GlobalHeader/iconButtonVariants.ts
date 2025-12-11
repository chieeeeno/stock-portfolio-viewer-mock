import { tv } from 'tailwind-variants';

/**
 * ヘッダーアイコンボタン用の共通スタイルバリアント
 * HelpButton, ThemeToggle などで使用
 *
 * Note: レスポンシブ対応はCSSメディアクエリで行い、
 * useBreakpointによるJSベースの切り替えは使用しない。
 * これによりSSR/ハイドレーション時のレイアウトシフトを防ぐ。
 */
export const iconButtonVariants = tv({
  base: [
    'flex cursor-pointer items-center justify-center rounded-full transition-colors',
    'h-8 w-8 sm:h-10 sm:w-10',
    'text-gray-600 hover:bg-gray-100',
    'dark:text-gray-300 dark:hover:bg-zinc-700',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
});
