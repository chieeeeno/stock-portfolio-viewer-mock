'use client';

import { mdiHelpCircleOutline } from '@mdi/js';
import { useOnboardingContext } from './OnboardingProvider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Icon from '@/components/Icon';
import { iconButtonVariants } from './iconButtonVariants';

const TOOLTIP_TEXT = 'ガイドを再表示';

/** アイコンのレスポンシブサイズ（CSSメディアクエリでレイアウトシフト防止） */
const ICON_CLASS = 'h-5 w-5 sm:h-6 sm:w-6';

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
          className={iconButtonVariants()}
        >
          <Icon path={mdiHelpCircleOutline} className={ICON_CLASS} data-testid="help-icon" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={4}>
        {TOOLTIP_TEXT}
      </TooltipContent>
    </Tooltip>
  );
}
