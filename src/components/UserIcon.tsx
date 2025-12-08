interface UserIconProps {
  /** ユーザー名（頭文字表示用） */
  name?: string;
  /** ユーザーアイコン画像のURL */
  imageUrl?: string;
}

/**
 * ユーザーアイコンコンポーネント
 * - 画像URLが指定されている場合は画像を表示
 * - 画像がない場合はユーザー名の頭文字を表示
 * - デフォルトは「U」
 */
export default function UserIcon({ name = 'User', imageUrl }: UserIconProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-blue-500 text-sm font-bold text-white">
      {imageUrl ? (
        // NOTE: プリミティブコンポーネントとしてNext.jsから疎結合にするため、標準のimg要素を使用
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={name}
          width={40}
          height={40}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        initial
      )}
    </div>
  );
}
