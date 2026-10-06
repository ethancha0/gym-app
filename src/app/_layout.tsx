// Imported once at the root so NativeWind's compiled styles are registered
// before any screen renders.
import '@/global.css';

import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { navTheme } from '@/theme/navigation';

// Root stack: the tab bar is one screen; full-screen flows (active workout,
// settings, the dev gallery) push on top of it and cover the tabs.
export default function RootLayout() {
  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style="light" />
      {/* "minimal" = just the back chevron, no previous-screen title (the tab
          group's route would otherwise show up as "(tabs)"). */}
      <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        <Stack.Screen name="gallery" options={{ title: 'Component Gallery' }} />
      </Stack>
    </ThemeProvider>
  );
}
