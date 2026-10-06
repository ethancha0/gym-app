import { FlashList } from '@shopify/flash-list';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { SectionHeader } from '@/components/ui/section-header';
import { AppText } from '@/components/ui/text';
import { historyQuery } from '@/db/repositories/workouts';
import { formatDuration, formatVolume } from '@/domain/format';
import { cn } from '@/lib/utils';

type HistoryRow = {
  id: number;
  startedAt: Date;
  finishedAt: Date | null;
  routineName: string | null;
  setCount: number;
  volumeLb: number;
};

// One flat list mixing two kinds of items: month headers and workout rows.
// `first`/`last` mark a row's position inside its month, for rounded corners.
type Item =
  | { type: 'header'; key: string; title: string }
  | { type: 'row'; key: string; workout: HistoryRow; first: boolean; last: boolean };

function toItems(workouts: HistoryRow[]): Item[] {
  const items: Item[] = [];
  let month = '';
  workouts.forEach((w, i) => {
    const m = w.startedAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const isFirst = m !== month;
    if (isFirst) {
      month = m;
      items.push({ type: 'header', key: `h-${m}`, title: m });
    }
    const next = workouts[i + 1];
    const isLast =
      !next || next.startedAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) !== m;
    items.push({ type: 'row', key: `w-${w.id}`, workout: w, first: isFirst, last: isLast });
  });
  return items;
}

export default function HistoryScreen() {
  const { data } = useLiveQuery(historyQuery());
  const items = toItems(data);

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-background px-4 pt-40">
        <AppText tone="secondary" className="text-center">
          Finished workouts will show up here.
        </AppText>
      </View>
    );
  }

  return (
    <FlashList
      data={items}
      keyExtractor={(item) => item.key}
      // Headers and rows have different layouts; typing them lets FlashList
      // recycle a header view only as another header, and a row as a row.
      getItemType={(item) => item.type}
      contentInsetAdjustmentBehavior="automatic"
      className="bg-background"
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
      renderItem={({ item }) => {
        if (item.type === 'header') {
          return <SectionHeader title={item.title} className="pt-5" />;
        }
        const w = item.workout;
        const date = w.startedAt.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
        const duration = w.finishedAt
          ? formatDuration(w.finishedAt.getTime() - w.startedAt.getTime())
          : '';
        return (
          <Pressable
            onPress={() => router.push(`/history/${w.id}`)}
            role="button"
            className={cn(
              'min-h-[58px] flex-row items-center gap-3 bg-surface px-4 py-2.5 active:bg-surface-raised',
              item.first && 'rounded-t-card',
              item.last ? 'rounded-b-card' : 'border-b-[0.5px] border-separator',
            )}
          >
            <View className="flex-1">
              <AppText numberOfLines={1}>{w.routineName ?? 'Workout'}</AppText>
              <AppText variant="subheadline" tone="secondary" numeric numberOfLines={1}>
                {date} · {duration} · {w.setCount} sets · {formatVolume(w.volumeLb)} lb
              </AppText>
            </View>
            <Icon
              name="chevron.right"
              size={13}
              weight="semibold"
              className="text-label-tertiary"
            />
          </Pressable>
        );
      }}
    />
  );
}
