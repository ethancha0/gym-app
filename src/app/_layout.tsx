// Imported once at the root so NativeWind's compiled styles are registered
// before any screen renders.
import '@/global.css';

import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { isFreeBuild, verifyAppleCredential } from '@/auth/apple';
import { DatabaseGate } from '@/db/database-gate';
import { currentUserQuery } from '@/db/repositories/users';
import { navTheme, sheetOptions } from '@/theme/navigation';

export default function RootLayout() {
  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style="light" />
      {/* No screen renders until the database is migrated and seeded. */}
      <DatabaseGate>
        <RootNavigator />
      </DatabaseGate>
    </ThemeProvider>
  );
}

// Lives inside DatabaseGate because it queries the `users` table, which
// doesn't exist until migrations have run.
function RootNavigator() {
  // Live query: signing in or out writes to `users`, this re-runs, and the
  // guards below swap which screens exist, with no manual navigation needed.
  const { data: signedInUsers } = useLiveQuery(currentUserQuery());
  const user = signedInUsers[0];
  const appleUserId = user?.appleUserId;

  // Once per sign-in: sign out if the Apple ID revoked access to this app.
  useEffect(() => {
    if (appleUserId && !isFreeBuild) verifyAppleCredential(appleUserId);
  }, [appleUserId]);

  return (
    // "minimal" = just the back chevron, no previous-screen title (the tab
    // group's route would otherwise show up as "(tabs)").
    <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
      {/* Protected routes: a screen only exists while its guard is true.
          Signing out removes every app screen from history, so "back"
          can't return to them. */}
      <Stack.Protected guard={!user}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!!user}>
        {/* "/" redirects to /today (src/app/index.tsx). It's inside the guard
            so that, signed out, "/" is blocked and the router falls back to
            the first allowed screen: sign-in. */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* The tab bar is one screen; full-screen flows push on top of it. */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="workout"
          // Covers the tabs; no swipe-down to dismiss, so a stray gesture
          // can't close a workout (Finish/Discard are explicit).
          options={{ presentation: 'fullScreenModal', gestureEnabled: false }}
        />
        <Stack.Screen
          name="exercise-picker"
          options={{ ...sheetOptions, sheetAllowedDetents: [1] }}
        />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        <Stack.Screen name="gallery" options={{ title: 'Component Gallery' }} />
        <Stack.Screen name="gallery-sheet" options={sheetOptions} />
        <Stack.Screen name="dev-db" options={{ title: 'Database' }} />
      </Stack.Protected>
    </Stack>
  );
}
