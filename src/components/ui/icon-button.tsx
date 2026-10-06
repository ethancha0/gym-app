import { Pressable, type PressableProps } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import type { SymbolViewProps } from 'expo-symbols';

type IconButtonProps = Omit<PressableProps, 'children'> & {
  icon: SymbolViewProps['name'];
  /** Required: an icon has no text for VoiceOver to read. */
  accessibilityLabel: string;
  size?: number;
  className?: string;
  iconClassName?: string;
};

/** Icon-only button with a 44×44pt tap target (HANDOFF §3). */
export function IconButton({
  icon,
  size = 22,
  className,
  iconClassName,
  ...props
}: IconButtonProps) {
  return (
    <Pressable
      role="button"
      className={cn('h-11 w-11 items-center justify-center active:opacity-50', className)}
      {...props}
    >
      <Icon name={icon} size={size} className={cn('text-accent', iconClassName)} />
    </Pressable>
  );
}
