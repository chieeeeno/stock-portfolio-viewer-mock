'use client';

import clsx from 'clsx';
import UserIcon from './UserIcon';
import ThemeToggle from './ThemeToggle';
import HelpButton from './HelpButton';
import { APP_NAME } from '@/utils/constants';

interface GlobalHeaderProps {
  /** アプリケーション名 */
  appName?: string;
  /** ユーザー名（UserIconに渡す） */
  userName?: string;
}

/**
 * グローバルヘッダーコンポーネント
 * - 左側にアプリケーション名
 * - 右側にヘルプボタン、テーマ切り替え、ユーザーアイコン
 * - ウィンドウ全幅表示
 * - スクロール時に上部固定
 */
export default function GlobalHeader({ appName = APP_NAME, userName }: GlobalHeaderProps) {
  return (
    <header
      className={clsx(
        'sticky top-0 z-50 w-full border-b border-gray-200 bg-white/70 backdrop-blur-md',
        'dark:border-zinc-800 dark:bg-zinc-900/80'
      )}
    >
      <div className={clsx('flex h-14 items-center justify-between px-4', 'sm:h-16 sm:px-6')}>
        <h1 className={clsx('text-xl font-bold text-gray-900', 'dark:text-white')}>{appName}</h1>
        <div className="flex items-center gap-2">
          <HelpButton />
          <ThemeToggle />
          <UserIcon name={userName} />
        </div>
      </div>
    </header>
  );
}
