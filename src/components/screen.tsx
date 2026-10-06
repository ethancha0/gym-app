import { ScrollView, type ScrollViewProps } from 'react-native';

import { cn } from '@/lib/utils';

type ScreenProps = ScrollViewProps & { contentContainerClassName?: string };

/**
 * Scrollable screen body for screens with a native header.
 *
 * `contentInsetAdjustmentBehavior="automatic"` lets iOS inset the content
 * below the (large-title) header and above the tab bar, i.e. it handles the
 * safe area for us, and lets the large title collapse as you scroll.
 * Without it, content would slide under the header.
 */
export function Screen({ className, contentContainerClassName, ...props }: ScreenProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className={cn('flex-1 bg-background', className)}
      contentContainerClassName={cn('gap-4 px-4 pb-8 pt-2', contentContainerClassName)}
      {...props}
    />
  );
}
