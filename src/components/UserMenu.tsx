'use client';

import clsx from 'clsx';
import { mdiCog, mdiLogout } from '@mdi/js';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useBreakpoint } from '@/app/_hooks/useBreakpoint';
import Icon from '@/components/Icon';
import UserIcon from './UserIcon';

/**
 * 設定アイコン
 */
function SettingsIcon() {
  return <Icon path={mdiCog} size="sm" data-testid="settings-icon" />;
}

/**
 * ログアウトアイコン
 */
function LogoutIcon() {
  return <Icon path={mdiLogout} size="sm" data-testid="logout-icon" />;
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
  const breakpoint = useBreakpoint();

  // SP時はアイコンを小さく表示
  const iconSize = breakpoint === 'mobile' ? 'md' : 'lg';

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
              <UserIcon name={userName} imageUrl={imageUrl} size={iconSize} />
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
