import { View } from 'react-native';

import { cn } from '@/lib/utils';

type ProgressBarProps = {
  /** 0 to 1. Values outside the range are clamped. */
  value: number;
  tone?: 'accent' | 'warning';
  className?: string;
};

/**
 * Thin horizontal progress bar (rest timer, weekly sets per muscle).
 * Static for now; Milestone 4 animates it on the UI thread with Reanimated.
 */
export function ProgressBar({ value, tone = 'accent', className }: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, value));
  return (
    <View
      role="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      className={cn('h-1.5 overflow-hidden rounded-full bg-surface-raised', className)}
    >
      <View
        className={cn('h-full rounded-full', tone === 'warning' ? 'bg-warning' : 'bg-accent')}
        // A dynamic, computed value goes in `style`; classNames are for
        // values known at build time.
        style={{ width: `${clamped * 100}%` }}
      />
    </View>
  );
}
