import { router } from 'expo-router';

import { Screen } from '@/components/screen';
import { GroupedList, ListRow } from '@/components/ui/grouped-list';

// Placeholder: becomes "Your Data" (CSV export/import) in Milestone 7.
export default function SettingsScreen() {
  return (
    <Screen>
      <GroupedList header="Data" footer="Export and import arrive in Milestone 7.">
        <ListRow title="Your Data" chevron />
      </GroupedList>
      {/* __DEV__ is true only in development; this row is stripped from release builds. */}
      {__DEV__ ? (
        <GroupedList header="Developer">
          <ListRow title="Component Gallery" chevron onPress={() => router.push('/gallery')} />
          <ListRow title="Database" chevron onPress={() => router.push('/dev-db')} />
        </GroupedList>
      ) : null}
    </Screen>
  );
}
