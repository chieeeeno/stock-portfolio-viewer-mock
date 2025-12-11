'use client';

import clsx from 'clsx';
import { mdiWeatherSunny, mdiWeatherNight } from '@mdi/js';
import { useTheme } from '@/app/_hooks/useTheme';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Icon from '@/components/Icon';

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
    <Icon path={mdiWeatherSunny} data-testid="sun-icon" />
  ) : (
    <Icon path={mdiWeatherNight} data-testid="moon-icon" />
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          data-driver="theme-toggle"
          onClick={toggleTheme}
          aria-label={tooltipText}
          className={clsx(
            'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors',
            'text-gray-600 hover:bg-gray-100',
            'dark:text-gray-300 dark:hover:bg-zinc-700'
          )}
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
