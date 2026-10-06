import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { AppText } from '@/components/ui/text';
import { useActiveWorkout } from '@/stores/active-workout';

import { SetRow } from './set-row';

export function ExerciseCard({ exerciseOrder }: { exerciseOrder: number }) {
  const exercise = useActiveWorkout((s) =>
    s.exercises.find((e) => e.exerciseOrder === exerciseOrder),
  );
  const addSet = useActiveWorkout((s) => s.addSet);
  if (!exercise) return null;

  return (
    <Card className="gap-1 px-3">
      <View className="px-1 pb-2">
        <AppText variant="title3">{exercise.name}</AppText>
        <AppText variant="subheadline" tone="secondary">
          {exercise.equipment.replaceAll('_', ' ')}
        </AppText>
      </View>

      {/* Column labels, aligned with the set row widths. */}
      <View className="flex-row items-center gap-2 px-1">
        <AppText variant="footnote" tone="secondary" className="w-8 text-center">
          SET
        </AppText>
        <AppText variant="footnote" tone="secondary" className="flex-1">
          PREVIOUS
        </AppText>
        <AppText variant="footnote" tone="secondary" className="w-[76px] text-center">
          LB
        </AppText>
        <AppText variant="footnote" tone="secondary" className="w-[60px] text-center">
          REPS
        </AppText>
        <View className="w-11 items-center">
          <Icon name="checkmark" size={13} className="text-label-secondary" />
        </View>
      </View>

      {exercise.setIds.map((setId, i) => (
        <SetRow key={setId} setId={setId} number={i + 1} previous={exercise.previous[i]} />
      ))}

      <Button variant="plain" className="self-start" onPress={() => addSet(exerciseOrder)}>
        <Icon name="plus" size={15} className="text-accent" />
        <AppText>Add Set</AppText>
      </Button>
    </Card>
  );
}
