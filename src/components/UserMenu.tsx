'use client';

import clsx from 'clsx';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import UserIcon from './UserIcon';

/**
 * 設定アイコン
 */
function SettingsIcon() {
  return (
    <svg
      data-testid="settings-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

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

interface MenuItem {
  /** メニューアイテムのID */
  id: string;
  /** 表示ラベル */
  label: string;
  /** アイコンコンポーネント */
  Icon: React.ComponentType<{ className?: string }>;
  /** セパレーターを表示するか（このアイテムの前に表示） */
  hasSeparatorBefore?: boolean;
}

/**
 * メニューアイテムの定義
 */
const MENU_ITEMS: MenuItem[] = [
  {
    id: 'settings',
    label: '設定',
    Icon: SettingsIcon,
  },
  {
    id: 'logout',
    label: 'ログアウト',
    Icon: LogoutIcon,
    hasSeparatorBefore: true,
  },
];

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
  const handleMenuItemClick = (itemId: string) => {
    // モック実装: 実際の機能は動作しない
    console.log(`${itemId}がクリックされました（モック実装）`);
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
        {MENU_ITEMS.map((item) => (
          <div key={item.id}>
            {item.hasSeparatorBefore && <DropdownMenuSeparator />}
            <DropdownMenuItem onClick={() => handleMenuItemClick(item.id)}>
              <item.Icon />
              <span>{item.label}</span>
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
