'use client';

import { type ComponentProps } from 'react';
import { Provider, Root, Trigger, Portal, Content, Arrow } from '@radix-ui/react-tooltip';

import { cn } from '@/lib/utils';

function TooltipProvider({ delayDuration = 0, ...props }: ComponentProps<typeof Provider>) {
  return <Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />;
}

function Tooltip({ ...props }: ComponentProps<typeof Root>) {
  return (
    <TooltipProvider>
      <Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({ ...props }: ComponentProps<typeof Trigger>) {
  return <Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: ComponentProps<typeof Content>) {
  return (
    <Portal>
      <Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          // ベーススタイル
          'z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance',
          'bg-foreground text-background',
          // アニメーション（表示時）
          'animate-in fade-in-0 zoom-in-95 origin-(--radix-tooltip-content-transform-origin)',
          // アニメーション（非表示時）
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          // スライド方向
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          // ダークモード（背景・文字色を反転）
          'dark:bg-background dark:text-foreground',
          className
        )}
        {...props}
      >
        {children}
        {/* shadcn/ui標準スタイル。矢印の位置微調整と角丸にarbitrary valueが必要（2px相当の標準クラスなし） */}
        <Arrow
          className={cn(
            'z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]',
            'bg-foreground fill-foreground',
            'dark:bg-background dark:fill-background'
          )}
        />
      </Content>
    </Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
