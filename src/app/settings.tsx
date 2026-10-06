import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { router } from 'expo-router';
import { Alert } from 'react-native';

import { isFreeBuild, signOut } from '@/auth/apple';

import { Screen } from '@/components/screen';
import { GroupedList, ListRow } from '@/components/ui/grouped-list';
import { currentUserQuery } from '@/db/repositories/users';

// Placeholder: becomes "Your Data" (CSV export/import) in Milestone 7.
export default function SettingsScreen() {
  const { data } = useLiveQuery(currentUserQuery());
  const user = data[0];

  function confirmSignOut() {
    Alert.alert('Sign out?', 'Your workouts stay on this phone.', [
      { text: 'Cancel', style: 'cancel' },
      // The root layout's protected routes switch to the sign-in screen.
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
    ]);
  }

  return (
    <Screen>
      <GroupedList
        header="Account"
        footer={isFreeBuild ? 'Offline account on this iPhone.' : 'Signed in with Apple.'}
      >
        <ListRow
          title={user?.fullName ?? (isFreeBuild ? 'Offline' : 'Apple ID')}
          subtitle={user?.email ?? undefined}
        />
        <ListRow title="Sign Out" onPress={confirmSignOut} />
      </GroupedList>
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
