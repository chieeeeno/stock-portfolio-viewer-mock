import { mdiAccountCircle } from '@mdi/js';
import Icon from '@/components/Icon';

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
 */
export default function UserIcon({ name = 'User', imageUrl }: UserIconProps) {
  if (imageUrl) {
    return (
      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
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
      size="lg"
      data-testid="user-icon"
      className="h-10 w-10 text-gray-500 dark:text-gray-400"
    />
  );
}
