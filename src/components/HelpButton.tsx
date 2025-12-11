'use client';

import clsx from 'clsx';
import { mdiHelpCircleOutline } from '@mdi/js';
import { useOnboardingContext } from './OnboardingProvider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Icon from '@/components/Icon';

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
          <Icon path={mdiHelpCircleOutline} data-testid="help-icon" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={4}>
        {TOOLTIP_TEXT}
      </TooltipContent>
    </Tooltip>
  );
}
