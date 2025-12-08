import UserIcon from './UserIcon';
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
 * - 右側にユーザーアイコン
 * - ウィンドウ全幅表示
 * - スクロール時に上部固定
 */
export default function GlobalHeader({
  appName = APP_NAME,
  userName,
}: GlobalHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex h-16 items-center justify-between px-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{appName}</h1>
        <UserIcon name={userName} />
      </div>
    </header>
  );
}
