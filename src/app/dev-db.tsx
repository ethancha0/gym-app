import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { FlatList, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { GroupedList, ListRow } from '@/components/ui/grouped-list';
import { SectionHeader } from '@/components/ui/section-header';
import { AppText } from '@/components/ui/text';
import { exercisesQuery, getExerciseBySlug } from '@/db/repositories/exercises';
import {
  addExerciseToRoutine,
  createRoutine,
  deleteRoutine,
  routinesWithExercisesQuery,
} from '@/db/repositories/routines';

// Dev-only database inspector (Settings → Developer → Database).
// Milestone 2 test: create a test routine, kill the app, reopen — it's still here.

async function createTestRoutine(n: number) {
  const routineId = await createRoutine({ name: `Test Routine ${n}`, programName: 'Debug' });
  for (const slug of ['barbell-bench-press', 'back-squat']) {
    const exercise = await getExerciseBySlug(slug);
    if (exercise) await addExerciseToRoutine(routineId, exercise.id);
  }
}

export default function DevDbScreen() {
  // useLiveQuery runs the query, then re-runs it whenever a table it reads
  // changes (thanks to enableChangeListener in db/client.ts). No manual
  // refresh after inserting or deleting.
  const { data: exercises } = useLiveQuery(exercisesQuery());
  const { data: routines } = useLiveQuery(routinesWithExercisesQuery());

  const header = (
    <View className="gap-6 pb-4">
      <Button onPress={() => createTestRoutine(routines.length + 1)}>
        <AppText>Create Test Routine</AppText>
      </Button>
      <GroupedList
        header={`Routines (${routines.length})`}
        footer="Tap a routine to delete it. Its exercise rows are removed by ON DELETE CASCADE."
      >
        {routines.length === 0 ? <ListRow title="No routines yet" /> : null}
        {routines.map((r) => (
          <ListRow
            key={r.id}
            title={r.name}
            subtitle={r.exercises.map((re) => re.exercise.name).join(', ') || 'No exercises'}
            value={`#${r.id}`}
            onPress={() => deleteRoutine(r.id)}
          />
        ))}
      </GroupedList>
      <SectionHeader title={`Exercises (${exercises.length})`} className="-mb-6" />
    </View>
  );

  return (
    // FlatList only renders the rows near the screen (virtualization), so it
    // must not sit inside a ScrollView; the buttons go in its header instead.
    <FlatList
      data={exercises}
      keyExtractor={(e) => String(e.id)}
      ListHeaderComponent={header}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 bg-background"
      contentContainerClassName="px-4 pb-8 pt-2"
      // The wrapper's surface color fills the 16pt inset, like GroupedList.
      ItemSeparatorComponent={() => (
        <View className="bg-surface">
          <View className="ml-4 h-[0.5px] bg-separator" />
        </View>
      )}
      renderItem={({ item }) => (
        <View className="min-h-[44px] justify-center bg-surface px-4 py-2">
          <AppText>{item.name}</AppText>
          <AppText variant="footnote" tone="secondary">
            {item.primaryMuscle.replaceAll('_', ' ')} · {item.equipment.replaceAll('_', ' ')} ·{' '}
            {item.slug}
          </AppText>
        </View>
      )}
    />
  );
}
