import { FlashList } from '@shopify/flash-list';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { AppText } from '@/components/ui/text';
import { CreateExerciseForm } from '@/components/workout/create-exercise-form';
import { exercisesQuery } from '@/db/repositories/exercises';
import { addExerciseToRoutine } from '@/db/repositories/routines';
import { colors } from '@/theme/tokens';
import { useActiveWorkout } from '@/stores/active-workout';

// Sheet for choosing an exercise. Where the choice goes comes from the URL:
//   /exercise-picker?target=workout            → the active workout
//   /exercise-picker?target=routine&routineId=3 → routine 3
// A route can't receive a callback prop, so it receives plain params instead.

export default function ExercisePicker() {
  const { target, routineId } = useLocalSearchParams<{ target: string; routineId?: string }>();
  const addToWorkout = useActiveWorkout((s) => s.addExercise);
  const { data: exercises } = useLiveQuery(exercisesQuery());
  const [search, setSearch] = useState('');
  // The sheet swaps to the "New Exercise" form in place instead of opening
  // a second sheet; a new exercise is added straight to the target.
  const [creating, setCreating] = useState(false);

  const query = search.trim().toLowerCase();
  const filtered = query
    ? exercises.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.primaryMuscle.replaceAll('_', ' ').includes(query),
      )
    : exercises;

  async function choose(exerciseId: number) {
    if (target === 'routine' && routineId) {
      await addExerciseToRoutine(Number(routineId), exerciseId);
    } else {
      await addToWorkout(exerciseId);
    }
    router.back();
  }

  if (creating) {
    return (
      <CreateExerciseForm
        initialName={search.trim()}
        onCancel={() => setCreating(false)}
        onCreated={choose}
      />
    );
  }

  return (
    <View className="flex-1 gap-3 pt-6">
      <View className="gap-3 px-4">
        <AppText variant="title3">Add Exercise</AppText>
        <View className="h-10 flex-row items-center gap-2 rounded-input bg-surface-high px-3">
          <Icon name="magnifyingglass" size={15} className="text-label-secondary" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search exercises or muscles"
            placeholderTextColor={colors.textSecondary}
            autoCorrect={false}
            clearButtonMode="while-editing"
            className="flex-1 text-body text-label"
          />
        </View>
      </View>

      {/* FlashList recycles row views as you scroll (a row leaving the top is
          reused for one entering at the bottom), so long lists stay smooth. */}
      <FlashList
        data={filtered}
        keyExtractor={(e) => String(e.id)}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        renderItem={({ item }) => (
          <Pressable
            onPress={() => choose(item.id)}
            role="button"
            className="min-h-[52px] justify-center border-b-[0.5px] border-separator px-4 py-2 active:bg-surface-high"
          >
            <AppText>{item.name}</AppText>
            <AppText variant="footnote" tone="secondary">
              {item.primaryMuscle.replaceAll('_', ' ')} · {item.equipment.replaceAll('_', ' ')}
            </AppText>
          </Pressable>
        )}
        // After the list (or alone, when nothing matches the search).
        ListFooterComponent={
          <Pressable
            onPress={() => setCreating(true)}
            role="button"
            className="min-h-[52px] flex-row items-center gap-3 px-4 py-2 active:bg-surface-high"
          >
            <Icon name="plus.circle.fill" size={20} className="text-accent" />
            <AppText tone="accent">
              {query ? `Create “${search.trim()}”` : 'Create Exercise'}
            </AppText>
          </Pressable>
        }
      />
    </View>
  );
}
