import { useState } from 'react';
import { Alert, ScrollView, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { SectionHeader } from '@/components/ui/section-header';
import { AppText } from '@/components/ui/text';
import { createCustomExercise } from '@/db/repositories/exercises';
import { EQUIPMENT, labelFor, MUSCLES, type Equipment, type Muscle } from '@/domain/exercise';
import { colors } from '@/theme/tokens';

type CreateExerciseFormProps = {
  /** Prefills the name, e.g. with what was typed into the picker's search. */
  initialName: string;
  onCancel: () => void;
  /** Called with the new exercise's id once it's saved. */
  onCreated: (exerciseId: number) => void;
};

/** Name + muscle group + equipment for an exercise that isn't in the library. */
export function CreateExerciseForm({ initialName, onCancel, onCreated }: CreateExerciseFormProps) {
  const [name, setName] = useState(initialName);
  const [muscle, setMuscle] = useState<Muscle | null>(null);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [saving, setSaving] = useState(false);

  const canSave = name.trim() !== '' && muscle !== null && equipment !== null && !saving;

  async function save() {
    if (!canSave || !muscle || !equipment) return;
    setSaving(true);
    try {
      onCreated(await createCustomExercise({ name, primaryMuscle: muscle, equipment }));
    } catch (e) {
      setSaving(false);
      Alert.alert("Couldn't save exercise", (e as Error).message);
    }
  }

  return (
    <View className="flex-1 gap-3 pt-6">
      <View className="flex-row items-center justify-between px-4">
        <Button variant="plain" size="compact" className="px-0" onPress={onCancel}>
          <AppText>Cancel</AppText>
        </Button>
        <AppText variant="headline">New Exercise</AppText>
        <Button size="compact" disabled={!canSave} onPress={save}>
          <AppText>Add</AppText>
        </Button>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerClassName="gap-5 pb-10"
      >
        <View className="px-4">
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Exercise name"
            placeholderTextColor={colors.textSecondary}
            autoFocus={initialName === ''}
            autoCapitalize="words"
            returnKeyType="done"
            className="h-11 rounded-input bg-surface-high px-3 text-body text-label"
          />
        </View>

        <View>
          <SectionHeader title="Muscle Group" />
          <View className="flex-row flex-wrap gap-2 px-4">
            {MUSCLES.map((m) => (
              <Chip
                key={m}
                label={labelFor(m)}
                selected={muscle === m}
                onPress={() => setMuscle(m)}
              />
            ))}
          </View>
        </View>

        <View>
          <SectionHeader title="Equipment" />
          <View className="flex-row flex-wrap gap-2 px-4">
            {EQUIPMENT.map((eq) => (
              <Chip
                key={eq}
                label={labelFor(eq)}
                selected={equipment === eq}
                onPress={() => setEquipment(eq)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
