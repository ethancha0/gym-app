import { router } from 'expo-router';
import { Alert } from 'react-native';

import { getActiveWorkout, startWorkout } from '@/db/repositories/workouts';

/**
 * Starts a workout (from a routine, or empty) and opens it. Only one workout
 * can be in progress: if one exists, offer to resume it instead.
 */
export async function startOrResumeWorkout(routineId?: number) {
  const active = await getActiveWorkout();
  if (active) {
    Alert.alert('Workout in progress', 'Finish or discard it before starting another.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Resume', onPress: () => router.push('/workout') },
    ]);
    return;
  }
  await startWorkout(routineId);
  router.push('/workout');
}
