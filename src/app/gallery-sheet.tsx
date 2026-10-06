import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { NumberField } from '@/components/ui/number-field';
import { AppText } from '@/components/ui/text';

// Dev-only demo of the bottom sheet presentation (see `sheetOptions`).
// Drag the grabber to switch between half and full height, or swipe down to close.
export default function GallerySheet() {
  const [weight, setWeight] = useState('185');
  const [reps, setReps] = useState('8');

  return (
    <View className="flex-1 gap-4 px-4 pt-6">
      <AppText variant="title3">Bottom sheet</AppText>
      <AppText variant="subheadline" tone="secondary">
        Inputs inside a sheet use the lighter surfaceHigh background.
      </AppText>
      <View className="flex-row gap-3">
        <NumberField
          kind="weight"
          onSheet
          value={weight}
          onChangeText={setWeight}
          accessibilityLabel="Weight"
        />
        <NumberField
          kind="reps"
          onSheet
          value={reps}
          onChangeText={setReps}
          accessibilityLabel="Reps"
        />
      </View>
      <Button onPress={() => router.back()}>
        <AppText>Log 1 Set</AppText>
      </Button>
      <Button variant="secondary" onSurface onPress={() => router.back()}>
        <AppText>Cancel</AppText>
      </Button>
    </View>
  );
}
