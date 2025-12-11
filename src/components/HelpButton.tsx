'use client';

import { mdiHelpCircleOutline } from '@mdi/js';
import { useOnboardingContext } from './OnboardingProvider';
import { useBreakpoint } from '@/app/_hooks/useBreakpoint';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Icon from '@/components/Icon';
import { iconButtonVariants } from './iconButtonVariants';

const TOOLTIP_TEXT = 'ガイドを再表示';

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
          className={iconButtonVariants({ size })}
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
