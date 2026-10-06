import { Link, Stack } from 'expo-router';

import { IconButton } from '@/components/ui/icon-button';
import { largeTitleOptions } from '@/theme/navigation';

// Each tab has its own stack so screens can push inside the tab
// while the tab bar stays visible.
export default function TodayLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Today',
          ...largeTitleOptions,
          headerRight: () => (
            // Link + asChild: the IconButton becomes the link's pressable
            // element, instead of Link wrapping it in its own Text.
            <Link href="/settings" asChild>
              <IconButton icon="gearshape" accessibilityLabel="Settings" />
            </Link>
          ),
        }}
      />
    </Stack>
  );
}
