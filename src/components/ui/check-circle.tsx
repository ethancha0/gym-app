import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

type CheckCircleProps = {
  checked: boolean;
  onToggle: () => void;
  /** e.g. "Complete set 2". */
  accessibilityLabel: string;
};

/**
 * Set check-off button. The visible circle is 28pt, but the Pressable is
 * 44×44 so it meets the minimum tap target (HANDOFF §3). Haptics are added
 * in Milestone 3.
 */
export function CheckCircle({ checked, onToggle, accessibilityLabel }: CheckCircleProps) {
  return (
    <Pressable
      onPress={onToggle}
      role="checkbox"
      accessibilityLabel={accessibilityLabel}
      // Tells VoiceOver the current state: "checked" / "not checked".
      accessibilityState={{ checked }}
      className="h-11 w-11 items-center justify-center active:opacity-60"
    >
      <View
        className={cn(
          'h-7 w-7 items-center justify-center rounded-full',
          checked ? 'bg-accent' : 'bg-surface-raised',
        )}
      >
        {checked ? (
          <Icon name="checkmark" size={14} weight="bold" className="text-on-accent" />
        ) : null}
      </View>
    </Pressable>
  );
}
