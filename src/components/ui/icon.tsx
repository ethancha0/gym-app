import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { cssInterop } from 'nativewind';
import type { ComponentType } from 'react';

import { cn } from '@/lib/utils';

// SymbolView renders an SF Symbol natively and takes its color as a
// `tintColor` prop, not a style. NativeWind only turns className into
// `style`, so `text-accent` would do nothing. cssInterop tells NativeWind to
// move the `color` it computes from className into the `tintColor` prop.
cssInterop(SymbolView, {
  className: { target: 'style', nativeStyleToProp: { color: 'tintColor' } },
});

type IconProps = SymbolViewProps & { className?: string };
const StyledSymbolView = SymbolView as ComponentType<IconProps>;

/** SF Symbol icon. Color it with a text color class: `<Icon name="plus" className="text-accent" />`. */
export function Icon({ className, size = 17, ...props }: IconProps) {
  return <StyledSymbolView className={cn('text-label', className)} size={size} {...props} />;
}
