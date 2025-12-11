'use client';

import clsx from 'clsx';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import UserIcon from './UserIcon';

/**
 * ログアウトアイコン
 */
function LogoutIcon() {
  return (
    <svg
      data-testid="logout-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

interface UserMenuProps {
  /** ユーザー名（頭文字表示用） */
  userName?: string;
  /** ユーザーアイコン画像のURL */
  imageUrl?: string;
}

/**
 * ユーザーメニューコンポーネント
 * - ユーザーアイコンをクリックするとドロップダウンメニューを表示
 * - メニューには「ログアウト」リンクが含まれる（モック実装）
 * - アイコンにホバーで「ユーザーメニュー」ツールチップを表示
 * - Escキーでメニューを閉じる
 */
export default function UserMenu({ userName = 'User', imageUrl }: UserMenuProps) {
  const handleLogoutClick = () => {
    // モック実装: 実際のログアウト機能は動作しない
    console.log('ログアウトがクリックされました（モック実装）');
  };

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              data-testid="user-menu-trigger"
              aria-label="ユーザーメニュー"
              className={clsx(
                'cursor-pointer transition-opacity',
                'hover:opacity-80',
                'focus:rounded-full focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none',
                'dark:focus:ring-offset-zinc-900'
              )}
            >
              <UserIcon name={userName} imageUrl={imageUrl} />
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={4}>
          ユーザーメニュー
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" sideOffset={8}>
        <DropdownMenuItem onClick={handleLogoutClick}>
          <LogoutIcon />
          <span>ログアウト</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
