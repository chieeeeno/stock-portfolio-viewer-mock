'use client';

import { tv } from 'tailwind-variants';
import { mdiHelpCircleOutline } from '@mdi/js';
import { useOnboardingContext } from './OnboardingProvider';
import { useBreakpoint } from '@/app/_hooks/useBreakpoint';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Icon from '@/components/Icon';

const TOOLTIP_TEXT = 'ガイドを再表示';

const buttonVariants = tv({
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

/**
 * ガイド再表示ボタンコンポーネント
 * - クリックでオンボーディングガイドを再開
 * - ホバー時にツールチップを表示
 */
export default function HelpButton() {
  const { startTour, isActive } = useOnboardingContext();
  const breakpoint = useBreakpoint();

  // SP時はアイコンとボタンを小さく表示
  const size = breakpoint === 'mobile' ? 'md' : 'lg';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          data-testid="help-button"
          onClick={startTour}
          disabled={isActive}
          aria-label={TOOLTIP_TEXT}
          className={buttonVariants({ size })}
        >
          <Icon path={mdiHelpCircleOutline} size={size} data-testid="help-icon" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={4}>
        {TOOLTIP_TEXT}
      </TooltipContent>
    </Tooltip>
  );
}
