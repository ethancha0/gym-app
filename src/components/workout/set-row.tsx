import * as Haptics from 'expo-haptics';
import { Pressable, View } from 'react-native';

import { CheckCircle } from '@/components/ui/check-circle';
import { NumberField } from '@/components/ui/number-field';
import { AppText } from '@/components/ui/text';
import { formatWeight } from '@/domain/format';
import { useActiveWorkout, type PreviousSet } from '@/stores/active-workout';
import { cn } from '@/lib/utils';

/** Shared with the "Done" bar above the number pad (see workout.tsx). */
export const SET_INPUT_ACCESSORY_ID = 'set-input-accessory';

type SetRowProps = {
  setId: number;
  number: number;
  previous?: PreviousSet;
};

export function SetRow({ setId, number, previous }: SetRowProps) {
  // Selector: this row re-renders only when *its* set changes, not when any
  // other cell in the workout does.
  const draft = useActiveWorkout((s) => s.sets[setId]);
  const setField = useActiveWorkout((s) => s.setField);
  const commitSet = useActiveWorkout((s) => s.commitSet);
  const toggleComplete = useActiveWorkout((s) => s.toggleComplete);
  const removeSet = useActiveWorkout((s) => s.removeSet);

  if (!draft) return null;

  const previousWeight = previous?.weight != null ? formatWeight(previous.weight) : '';
  const previousReps = previous?.reps != null ? String(previous.reps) : '';
  const previousLabel = previous ? `${previousWeight || 'BW'} × ${previousReps}` : '—';

  async function handleToggle() {
    const ok = await toggleComplete(setId);
    // Haptics: a light tap on check-off, an error buzz when there's nothing to log.
    if (!ok) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    else if (!draft.completed) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  return (
    <View
      className={cn(
        'flex-row items-center gap-2 rounded-input px-1',
        draft.completed && 'bg-completed-row',
      )}
    >
      {/* Long-press the set number to delete the set. */}
      <Pressable
        onLongPress={() => removeSet(setId)}
        accessibilityLabel={`Set ${number}`}
        accessibilityHint="Long press to delete this set"
        className="h-11 w-8 items-center justify-center"
      >
        <AppText variant="headline" numeric>
          {number}
        </AppText>
      </Pressable>
      <AppText tone="tertiary" numeric numberOfLines={1} className="flex-1">
        {previousLabel}
      </AppText>
      <NumberField
        kind="weight"
        value={draft.weight}
        placeholder={previousWeight}
        onChangeText={(t) => setField(setId, 'weight', t)}
        onEndEditing={() => commitSet(setId)}
        inputAccessoryViewID={SET_INPUT_ACCESSORY_ID}
        accessibilityLabel={`Set ${number} weight`}
        className="w-[76px]"
      />
      <NumberField
        kind="reps"
        value={draft.reps}
        placeholder={previousReps}
        onChangeText={(t) => setField(setId, 'reps', t)}
        onEndEditing={() => commitSet(setId)}
        inputAccessoryViewID={SET_INPUT_ACCESSORY_ID}
        accessibilityLabel={`Set ${number} reps`}
        className="w-[60px] min-w-0"
      />
      <CheckCircle
        checked={draft.completed}
        onToggle={handleToggle}
        accessibilityLabel={`Complete set ${number}`}
      />
    </View>
  );
}
