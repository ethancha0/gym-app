import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, TextInput, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconButton } from '@/components/ui/icon-button';
import { NumberField } from '@/components/ui/number-field';
import { AppText } from '@/components/ui/text';
import {
  deleteRoutine,
  getRoutineWithExercises,
  moveRoutineExercise,
  removeRoutineExercise,
  renameRoutine,
  updateRoutineExercise,
} from '@/db/repositories/routines';
import { parseReps } from '@/domain/format';
import { startOrResumeWorkout } from '@/lib/start-workout';
import { colors } from '@/theme/tokens';

// `[id]` in the file name is a dynamic segment: /routines/3 → id = "3".

export default function RoutineEditor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const routineId = Number(id);
  // deps: re-subscribe if the id changes (same screen, different routine).
  const { data: routine } = useLiveQuery(getRoutineWithExercises(routineId), [routineId]);

  if (!routine) return <Screen />;

  function confirmDelete() {
    Alert.alert(`Delete "${routine!.name}"?`, 'Past workouts stay in your history.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteRoutine(routineId);
          router.back();
        },
      },
    ]);
  }

  // Number fields here are *uncontrolled*: `defaultValue` sets the starting
  // text and the field keeps its own state while typing; we read the final
  // text in onEndEditing and save it. No store needed for a simple form.
  function saveNumber(
    reId: number,
    field: 'targetSets' | 'repMin' | 'repMax' | 'restSeconds',
    text: string,
  ) {
    const value = parseReps(text);
    if (value != null && value > 0) updateRoutineExercise(reId, { [field]: value });
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: routine.name }} />

      <TextInput
        defaultValue={routine.name}
        onEndEditing={(e) => {
          const name = e.nativeEvent.text.trim();
          if (name) renameRoutine(routineId, name);
        }}
        placeholder="Routine name"
        placeholderTextColor={colors.textTertiary}
        returnKeyType="done"
        className="rounded-input bg-surface px-4 py-3 text-title3 text-label"
        accessibilityLabel="Routine name"
      />

      <Button
        onPress={() => startOrResumeWorkout(routineId)}
        disabled={routine.exercises.length === 0}
      >
        <AppText>Start Workout</AppText>
      </Button>

      {routine.exercises.map((re, index) => (
        // Key by row id so fields stay attached to the right exercise when
        // the order changes.
        <Card key={re.id} className="gap-3">
          <View className="flex-row items-center">
            <AppText variant="headline" className="flex-1">
              {re.exercise.name}
            </AppText>
            <IconButton
              icon="arrow.up"
              size={17}
              accessibilityLabel={`Move ${re.exercise.name} up`}
              disabled={index === 0}
              onPress={() => moveRoutineExercise(re.id, -1)}
              className={index === 0 ? 'opacity-30' : undefined}
            />
            <IconButton
              icon="arrow.down"
              size={17}
              accessibilityLabel={`Move ${re.exercise.name} down`}
              disabled={index === routine.exercises.length - 1}
              onPress={() => moveRoutineExercise(re.id, 1)}
              className={index === routine.exercises.length - 1 ? 'opacity-30' : undefined}
            />
            <IconButton
              icon="minus.circle"
              size={19}
              accessibilityLabel={`Remove ${re.exercise.name}`}
              onPress={() => removeRoutineExercise(re.id)}
            />
          </View>
          <View className="flex-row gap-3">
            {(
              [
                ['Sets', 'targetSets', re.targetSets],
                ['Min reps', 'repMin', re.repMin],
                ['Max reps', 'repMax', re.repMax],
                ['Rest (s)', 'restSeconds', re.restSeconds],
              ] as const
            ).map(([label, field, value]) => (
              <View key={field} className="flex-1 gap-1">
                <AppText variant="footnote" tone="secondary">
                  {label}
                </AppText>
                <NumberField
                  kind="reps"
                  defaultValue={String(value)}
                  onEndEditing={(e) => saveNumber(re.id, field, e.nativeEvent.text)}
                  accessibilityLabel={`${re.exercise.name} ${label}`}
                  className="min-w-0"
                />
              </View>
            ))}
          </View>
        </Card>
      ))}

      <Button
        variant="secondary"
        onPress={() =>
          router.push({
            pathname: '/exercise-picker',
            params: { target: 'routine', routineId: String(routineId) },
          })
        }
      >
        <AppText>Add Exercise</AppText>
      </Button>

      <Button variant="plain" onPress={confirmDelete}>
        <AppText className="text-label-secondary">Delete Routine</AppText>
      </Button>
    </Screen>
  );
}
