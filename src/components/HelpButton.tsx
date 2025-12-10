'use client';

import clsx from 'clsx';
import { useOnboardingContext } from './OnboardingProvider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * クエスチョンマークアイコン（ヘルプ用）
 */
function HelpIcon() {
  return (
    <svg
      data-testid="help-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

const TOOLTIP_TEXT = 'ガイドを再表示';

/**
 * ガイド再表示ボタンコンポーネント
 * - クリックでオンボーディングガイドを再開
 * - ホバー時にツールチップを表示
 */
export default function HelpButton() {
  const { startTour, isActive } = useOnboardingContext();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          data-testid="help-button"
          onClick={startTour}
          disabled={isActive}
          aria-label={TOOLTIP_TEXT}
          className={clsx(
            'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors',
            'text-gray-600 hover:bg-gray-100',
            'dark:text-gray-300 dark:hover:bg-zinc-700',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        >
          <HelpIcon />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={4}>
        {TOOLTIP_TEXT}
      </TooltipContent>
    </Tooltip>
  );
}
