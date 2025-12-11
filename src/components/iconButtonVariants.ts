import { tv } from 'tailwind-variants';

/**
 * ヘッダーアイコンボタン用の共通スタイルバリアント
 * HelpButton, ThemeToggle などで使用
 */
export const iconButtonVariants = tv({
  base: [
    'flex cursor-pointer items-center justify-center rounded-full transition-colors',
    'text-gray-600 hover:bg-gray-100',
    'dark:text-gray-300 dark:hover:bg-zinc-700',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  variants: {
    size: {
      md: 'h-8 w-8',
      lg: 'h-10 w-10',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});
