import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

/** Rounded gray surface for grouping content (Up Next, Coach, exercise cards). */
export function Card({ className, ...props }: ViewProps) {
  return <View className={cn('rounded-card bg-surface p-4', className)} {...props} />;
}
