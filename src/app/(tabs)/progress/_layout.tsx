import { Stack } from 'expo-router';

import { largeTitleOptions } from '@/theme/navigation';

// Each tab has its own stack so screens can push inside the tab
// while the tab bar stays visible.
export default function ProgressLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Progress', ...largeTitleOptions }} />
    </Stack>
  );
}
