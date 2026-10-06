import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import {
  ActionSheetIOS,
  Alert,
  InputAccessoryView,
  Keyboard,
  ScrollView,
  View,
} from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { AppText } from '@/components/ui/text';
import { ElapsedTime } from '@/components/workout/elapsed-time';
import { ExerciseCard } from '@/components/workout/exercise-card';
import { SET_INPUT_ACCESSORY_ID } from '@/components/workout/set-row';
import { getActiveWorkout } from '@/db/repositories/workouts';
import { formatVolume, parseReps, parseWeight, toLb } from '@/domain/format';
import { useActiveWorkout } from '@/stores/active-workout';

// The active workout, presented full-screen over the tabs (see _layout.tsx).
// It always shows the one unfinished workout in the database.

export default function WorkoutScreen() {
  const load = useActiveWorkout((s) => s.load);
  const workoutId = useActiveWorkout((s) => s.workoutId);
  const startedAt = useActiveWorkout((s) => s.startedAt);
  const title = useActiveWorkout((s) => s.title);
  // useShallow: this selector builds a new array each time; compare its
  // contents instead of its identity, or every store change would re-render.
  const exerciseOrders = useActiveWorkout(
    useShallow((s) => s.exercises.map((e) => e.exerciseOrder)),
  );
  const summary = useActiveWorkout(
    useShallow((s) => {
      const all = Object.values(s.sets);
      const done = all.filter((d) => d.completed);
      const volume = done.reduce((sum, d) => {
        const w = parseWeight(d.weight);
        const r = parseReps(d.reps);
        return w != null && r != null ? sum + toLb(w, d.weightUnit) * r : sum;
      }, 0);
      return { done: done.length, total: all.length, volume };
    }),
  );
  const finish = useActiveWorkout((s) => s.finish);
  const discard = useActiveWorkout((s) => s.discard);

  // Load whichever workout is in progress (just started, or recovered after
  // the app was killed).
  useEffect(() => {
    getActiveWorkout().then((w) => {
      if (w) load(w.id);
      else router.back();
    });
  }, [load]);

  function handleFinish() {
    Keyboard.dismiss();
    const remaining = summary.total - summary.done;
    const message =
      summary.done === 0
        ? 'No sets are checked off, so this workout will be discarded.'
        : remaining > 0
          ? `${remaining} unchecked ${remaining === 1 ? 'set' : 'sets'} will be removed.`
          : 'Save this workout to your history?';
    Alert.alert('Finish workout?', message, [
      { text: 'Keep Going', style: 'cancel' },
      {
        text: 'Finish',
        onPress: async () => {
          await finish();
          router.back();
        },
      },
    ]);
  }

  function handleOptions() {
    // Native iOS action sheet (the menu that slides up from the bottom).
    ActionSheetIOS.showActionSheetWithOptions(
      { options: ['Discard Workout', 'Cancel'], destructiveButtonIndex: 0, cancelButtonIndex: 1 },
      async (index) => {
        if (index !== 0) return;
        await discard();
        router.back();
      },
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Configure this screen's header from inside the screen, where the
          state it needs (timer, handlers) lives. */}
      <Stack.Screen
        options={{
          headerTitle: () => (startedAt ? <ElapsedTime startedAt={startedAt} /> : null),
          headerLeft: () => (
            <IconButton
              icon="ellipsis"
              accessibilityLabel="Workout options"
              onPress={handleOptions}
            />
          ),
          headerRight: () => (
            <Button size="compact" onPress={handleFinish}>
              <AppText>Finish</AppText>
            </Button>
          ),
        }}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        // iOS adds bottom inset while the keyboard is open, so the focused
        // field can scroll above it (instead of wrapping in KeyboardAvoidingView).
        automaticallyAdjustKeyboardInsets
        // Drag the list down to pull the keyboard away, like Messages.
        keyboardDismissMode="interactive"
        // Taps on buttons work while the keyboard is open (first tap isn't
        // swallowed just to dismiss it).
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-4 px-4 pb-32 pt-2"
      >
        <View className="pb-1">
          <AppText variant="largeTitle">{title}</AppText>
          <AppText variant="subheadline" tone="secondary" numeric>
            {summary.done} of {summary.total} sets · {formatVolume(summary.volume)} lb
          </AppText>
        </View>

        {exerciseOrders.map((order) => (
          <ExerciseCard key={order} exerciseOrder={order} />
        ))}

        <Button
          variant="secondary"
          disabled={workoutId == null}
          onPress={() =>
            router.push({ pathname: '/exercise-picker', params: { target: 'workout' } })
          }
        >
          <AppText>Add Exercise</AppText>
        </Button>
      </ScrollView>

      {/* iOS number pads have no Return key; this bar sits on top of the
          keyboard for every set field that references its nativeID. */}
      <InputAccessoryView nativeID={SET_INPUT_ACCESSORY_ID}>
        <View className="flex-row justify-end border-t border-separator bg-surface px-2">
          <Button variant="plain" onPress={() => Keyboard.dismiss()}>
            <AppText className="font-semibold">Done</AppText>
          </Button>
        </View>
      </InputAccessoryView>
    </View>
  );
}
