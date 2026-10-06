import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { router, Stack } from 'expo-router';

import { Screen } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { GroupedList, ListRow } from '@/components/ui/grouped-list';
import { IconButton } from '@/components/ui/icon-button';
import { AppText } from '@/components/ui/text';
import { createRoutine, routinesWithExercisesQuery } from '@/db/repositories/routines';

export default function RoutinesScreen() {
  const { data: routines } = useLiveQuery(routinesWithExercisesQuery());

  async function handleNew() {
    const id = await createRoutine({ name: 'New Routine' });
    router.push(`/routines/${id}`);
  }

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerRight: () => (
            <IconButton icon="plus" accessibilityLabel="New routine" onPress={handleNew} />
          ),
        }}
      />
      {routines.length === 0 ? (
        <>
          <AppText tone="secondary">
            No routines yet. Create one to plan your exercises, sets and reps.
          </AppText>
          <Button onPress={handleNew}>
            <AppText>New Routine</AppText>
          </Button>
        </>
      ) : (
        <GroupedList header="My Routines">
          {routines.map((r) => (
            <ListRow
              key={r.id}
              title={r.name}
              subtitle={r.exercises.map((re) => re.exercise.name).join(', ') || 'No exercises'}
              chevron
              onPress={() => router.push(`/routines/${r.id}`)}
            />
          ))}
        </GroupedList>
      )}
    </Screen>
  );
}
