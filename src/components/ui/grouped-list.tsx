import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { SectionHeader } from '@/components/ui/section-header';
import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type GroupedListProps = {
  header?: string;
  footer?: string;
  children: ReactNode;
  className?: string;
};

/**
 * iOS inset-grouped list: optional uppercase header, a rounded card of rows,
 * and 0.5pt separators between rows (inset 16pt, like Settings.app).
 */
export function GroupedList({ header, footer, children, className }: GroupedListProps) {
  // Skip null/false children (e.g. `{isDev && <ListRow />}`) so we don't
  // draw separators around rows that aren't there.
  const rows = Children.toArray(children).filter(isValidElement);
  return (
    <View className={className}>
      {header ? <SectionHeader title={header} /> : null}
      {/* overflow-hidden clips each row's pressed highlight to the rounded corners. */}
      <View className="overflow-hidden rounded-card bg-surface">
        {rows.map((row, i) => (
          <Fragment key={row.key ?? i}>
            {i > 0 ? <View className="ml-4 h-[0.5px] bg-separator" /> : null}
            {row}
          </Fragment>
        ))}
      </View>
      {footer ? (
        <AppText variant="footnote" tone="secondary" className="px-4 pt-1.5">
          {footer}
        </AppText>
      ) : null}
    </View>
  );
}

type ListRowProps = {
  title: string;
  subtitle?: string;
  /** Gray text on the right, e.g. "Mon" or "2:00". */
  value?: string;
  /** Element before the title, e.g. an "up next" dot. */
  leading?: ReactNode;
  /** Element at the far right, e.g. a <Switch />. */
  trailing?: ReactNode;
  /** Show a disclosure chevron (the row navigates somewhere). */
  chevron?: boolean;
  onPress?: () => void;
};

/** One row in a GroupedList. Rows with a subtitle grow to ~58pt automatically. */
export function ListRow({
  title,
  subtitle,
  value,
  leading,
  trailing,
  chevron,
  onPress,
}: ListRowProps) {
  return (
    <Pressable
      onPress={onPress}
      // Without onPress the row is plain layout, not a button.
      disabled={!onPress}
      role={onPress ? 'button' : undefined}
      className={cn(
        'min-h-[44px] flex-row items-center gap-3 px-4 py-2.5',
        onPress && 'active:bg-surface-raised',
      )}
    >
      {leading}
      <View className="flex-1">
        <AppText numberOfLines={1}>{title}</AppText>
        {subtitle ? (
          <AppText variant="subheadline" tone="secondary" numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {value ? <AppText tone="secondary">{value}</AppText> : null}
      {trailing}
      {chevron ? (
        <Icon name="chevron.right" size={13} weight="semibold" className="text-label-tertiary" />
      ) : null}
    </Pressable>
  );
}
