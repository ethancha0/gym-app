import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
};

/** Small rounded label, e.g. a warm-up step ("135 × 5") or a filter option. */
export function Chip({ label, selected = false, onPress, className }: ChipProps) {
  const chipClass = cn(
    'min-h-[32px] items-center justify-center rounded-input px-3',
    selected ? 'bg-accent' : 'bg-surface-raised',
    className,
  );
  const text = (
    <AppText variant="subheadline" tone={selected ? 'onAccent' : 'primary'} numeric>
      {label}
    </AppText>
  );

  // Only interactive chips are buttons; display-only chips stay plain Views
  // so VoiceOver doesn't announce them as tappable.
  if (!onPress) return <View className={chipClass}>{text}</View>;
  return (
    <Pressable
      onPress={onPress}
      role="button"
      accessibilityState={{ selected }}
      // 32pt tall + 6pt above and below = 44pt touch area.
      hitSlop={{ top: 6, bottom: 6 }}
      className={cn(chipClass, 'active:opacity-70')}
    >
      {text}
    </Pressable>
  );
}
