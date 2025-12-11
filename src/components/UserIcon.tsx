import { tv } from 'tailwind-variants';
import { mdiAccountCircle } from '@mdi/js';
import Icon from '@/components/Icon';

type IconSize = 'md' | 'lg';

const containerVariants = tv({
  base: 'flex items-center justify-center overflow-hidden rounded-full',
  variants: {
    size: {
      md: 'h-8 w-8',
      lg: 'h-10 w-10',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

// アイコンの色のみを管理（サイズはIconコンポーネントのsizeプロップで制御）
const ICON_COLOR_CLASS = 'text-gray-500 dark:text-gray-400';

interface UserIconProps {
  /** ユーザー名（alt属性用） */
  name?: string;
  /** ユーザーアイコン画像のURL */
  imageUrl?: string;
  /** アイコンサイズ */
  size?: IconSize;
}

const IMG_SIZES = { md: 32, lg: 40 } as const;

/**
 * ユーザーアイコンコンポーネント
 * - 画像URLが指定されている場合は画像を表示
 * - 画像がない場合はMDIのアカウントアイコンを表示
 */
export default function UserIcon({ name = 'User', imageUrl, size = 'lg' }: UserIconProps) {
  if (imageUrl) {
    return (
      <div className={containerVariants({ size })}>
        {/* NOTE: プリミティブコンポーネントとしてNext.jsから疎結合にするため、標準のimg要素を使用 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={name}
          width={IMG_SIZES[size]}
          height={IMG_SIZES[size]}
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
      className={ICON_COLOR_CLASS}
    />
  );
}
