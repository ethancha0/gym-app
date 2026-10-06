import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Screen } from '@/components/screen';
import { Card } from '@/components/ui/card';
import { AppText } from '@/components/ui/text';
import { getWorkoutWithSets } from '@/db/repositories/workouts';
import { formatDuration, formatWeight } from '@/domain/format';

// Read-only view of a finished workout: same columns as the active workout,
// without inputs.
export default function WorkoutDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const workoutId = Number(id);
  const { data: workout } = useLiveQuery(getWorkoutWithSets(workoutId), [workoutId]);

  if (!workout) return <Screen />;

  // Group the flat, ordered set list into one block per exercise.
  const groups: { order: number; name: string; sets: typeof workout.sets }[] = [];
  for (const s of workout.sets) {
    const last = groups[groups.length - 1];
    if (last?.order === s.exerciseOrder) last.sets.push(s);
    else groups.push({ order: s.exerciseOrder, name: s.exercise.name, sets: [s] });
  }

  const date = workout.startedAt.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const duration = workout.finishedAt
    ? formatDuration(workout.finishedAt.getTime() - workout.startedAt.getTime())
    : '';

  return (
    <Screen>
      <Stack.Screen options={{ title: workout.routine?.name ?? 'Workout' }} />
      <View>
        <AppText variant="title2">{workout.routine?.name ?? 'Workout'}</AppText>
        <AppText variant="subheadline" tone="secondary">
          {date} · {duration}
        </AppText>
      </View>
      {groups.map((g) => (
        <Card key={g.order} className="gap-1">
          <AppText variant="headline" className="pb-1">
            {g.name}
          </AppText>
          {g.sets.map((s, i) => (
            <View key={s.id} className="min-h-[32px] flex-row items-center">
              <AppText tone="secondary" numeric className="w-10">
                {i + 1}
              </AppText>
              <AppText numeric>
                {s.weight != null ? `${formatWeight(s.weight)} ${s.weightUnit}` : 'Bodyweight'} ×{' '}
                {s.reps ?? 0}
              </AppText>
            </View>
          ))}
        </Card>
      ))}
    </Screen>
  );
}
