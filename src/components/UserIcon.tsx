import clsx from 'clsx';
import { mdiAccountCircle } from '@mdi/js';
import Icon from '@/components/Icon';

type IconSize = 'md' | 'lg';

interface UserIconProps {
  /** ユーザー名（alt属性用） */
  name?: string;
  /** ユーザーアイコン画像のURL */
  imageUrl?: string;
  /** アイコンサイズ */
  size?: IconSize;
}

/**
 * ユーザーアイコンコンポーネント
 * - 画像URLが指定されている場合は画像を表示
 * - 画像がない場合はMDIのアカウントアイコンを表示
 */
export default function UserIcon({ name = 'User', imageUrl, size = 'lg' }: UserIconProps) {
  // サイズに応じたクラス名
  const sizeClasses = {
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const containerClass = sizeClasses[size];
  const imgSize = size === 'md' ? 32 : 40;

  if (imageUrl) {
    return (
      <div
        className={clsx(
          'flex items-center justify-center overflow-hidden rounded-full',
          containerClass
        )}
      >
        {/* NOTE: プリミティブコンポーネントとしてNext.jsから疎結合にするため、標準のimg要素を使用 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={name}
          width={imgSize}
          height={imgSize}
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
      size={size}
      data-testid="user-icon"
      className={clsx(containerClass, 'text-gray-500 dark:text-gray-400')}
    />
  );
}
