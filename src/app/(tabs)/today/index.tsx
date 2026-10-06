import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { router } from 'expo-router';

import { Screen } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GroupedList, ListRow } from '@/components/ui/grouped-list';
import { AppText } from '@/components/ui/text';
import { ElapsedTime } from '@/components/workout/elapsed-time';
import { routinesWithExercisesQuery } from '@/db/repositories/routines';
import { activeWorkoutQuery } from '@/db/repositories/workouts';
import { startOrResumeWorkout } from '@/lib/start-workout';

// MVP Today screen. The "Up next" card, week strip, coach and PR cards
// arrive in Milestones 6 and 9.
export default function TodayScreen() {
  const { data: active } = useLiveQuery(activeWorkoutQuery());
  const { data: routines } = useLiveQuery(routinesWithExercisesQuery());
  const inProgress = active[0];

  return (
    <Screen>
      {inProgress ? (
        <Card className="gap-3">
          <AppText variant="footnote" tone="secondary">
            WORKOUT IN PROGRESS
          </AppText>
          <AppText variant="title2">{inProgress.routineName ?? 'Workout'}</AppText>
          <ElapsedTime startedAt={inProgress.startedAt} />
          <Button onPress={() => router.push('/workout')}>
            <AppText>Resume Workout</AppText>
          </Button>
        </Card>
      ) : (
        <Button variant="secondary" onPress={() => startOrResumeWorkout()}>
          <AppText>Start Empty Workout</AppText>
        </Button>
      )}

      {routines.length > 0 ? (
        <GroupedList header="Start a routine">
          {routines.map((r) => (
            <ListRow
              key={r.id}
              title={r.name}
              subtitle={`${r.exercises.length} ${r.exercises.length === 1 ? 'exercise' : 'exercises'}`}
              chevron
              onPress={() => startOrResumeWorkout(r.id)}
            />
          ))}
        </GroupedList>
      ) : null}
    </Screen>
  );
}
