import clsx from 'clsx';
import { mdiAccountCircle } from '@mdi/js';
import Icon from '@/components/Icon';
import { HEADER_AVATAR_SIZE } from './constants';

interface UserIconProps {
  /** ユーザー名（alt属性用） */
  name?: string;
  /** ユーザーアイコン画像のURL */
  imageUrl?: string;
}

/**
 * ユーザーアイコンコンポーネント
 * - 画像URLが指定されている場合は画像を表示
 * - 画像がない場合はMDIのアカウントアイコンを表示
 *
 * Note: レスポンシブ対応はCSSメディアクエリで行い、
 * useBreakpointによるJSベースの切り替えは使用しない。
 * これによりSSR/ハイドレーション時のレイアウトシフトを防ぐ。
 */
export default function UserIcon({ name = 'User', imageUrl }: UserIconProps) {
  if (imageUrl) {
    return (
      <div
        className={clsx(
          'flex items-center justify-center overflow-hidden rounded-full',
          HEADER_AVATAR_SIZE
        )}
      >
        {/* NOTE: プリミティブコンポーネントとしてNext.jsから疎結合にするため、標準のimg要素を使用 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={name}
          width={40}
          height={40}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <Icon
      path={mdiAccountCircle}
      data-testid="user-icon"
      className={clsx(HEADER_AVATAR_SIZE, 'text-gray-500 dark:text-gray-400')}
    />
  );
}
