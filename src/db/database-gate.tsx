import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, type ReactNode } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { prepareDatabase } from '@/db/prepare';

// Keep the native splash screen up until the database is ready, instead of
// flashing an empty screen. Called at import time, before the first render.
SplashScreen.preventAutoHideAsync();

type Status = { state: 'loading' } | { state: 'ready' } | { state: 'error'; error: Error };

/** Renders its children only once the database is migrated and seeded. */
export function DatabaseGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>({ state: 'loading' });

  useEffect(() => {
    // The effect starts outside work; state is set only in its callbacks,
    // when that work finishes (not synchronously in the effect body).
    prepareDatabase()
      .then(() => setStatus({ state: 'ready' }))
      .catch((error: Error) => setStatus({ state: 'error', error }))
      .finally(() => SplashScreen.hideAsync());
  }, []);

  if (status.state === 'error') {
    return (
      <View className="flex-1 justify-center gap-2 bg-background px-6">
        <AppText variant="title3">Database error</AppText>
        <AppText tone="secondary">{status.error.message}</AppText>
      </View>
    );
  }
  // The splash screen is still showing, so rendering nothing is invisible.
  if (status.state === 'loading') return null;
  return children;
}
