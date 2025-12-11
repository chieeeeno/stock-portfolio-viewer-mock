'use client';

import { mdiWeatherSunny, mdiWeatherNight } from '@mdi/js';
import { useTheme } from '@/app/_hooks/useTheme';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Icon from '@/components/Icon';
import { iconButtonVariants } from './iconButtonVariants';

/** アイコンのレスポンシブサイズ（CSSメディアクエリでレイアウトシフト防止） */
const ICON_CLASS = 'h-5 w-5 sm:h-6 sm:w-6';

/**
 * テーマ切り替えトグルボタン
 * - ライトモード: 月アイコン表示（クリックでダークへ）
 * - ダークモード: 太陽アイコン表示（クリックでライトへ）
 * - ハイドレーション中は月アイコン（ライトモード想定）を表示してSSR/クライアント一致を保証
 * - ホバー時にツールチップを表示
 */
export default function ThemeToggle() {
  const { isDarkMode, toggleTheme, isHydrated } = useTheme();

  // ハイドレーション完了前は固定値を使用（SSRと一致させる）
  const showDarkModeIcon = isHydrated ? isDarkMode : false;

  const tooltipText = showDarkModeIcon ? 'ライトモードに切り替える' : 'ダークモードに切り替える';
  const themeIcon = showDarkModeIcon ? (
    <Icon path={mdiWeatherSunny} className={ICON_CLASS} data-testid="sun-icon" />
  ) : (
    <Icon path={mdiWeatherNight} className={ICON_CLASS} data-testid="moon-icon" />
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          data-driver="theme-toggle"
          onClick={toggleTheme}
          aria-label={tooltipText}
          className={iconButtonVariants()}
        >
          {themeIcon}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={4}>
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  );
}
