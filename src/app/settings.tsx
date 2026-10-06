import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { router } from 'expo-router';
import { Alert } from 'react-native';

import { isFreeBuild, isLocalAccount, signInWithApple, signOut } from '@/auth/apple';

import { Screen } from '@/components/screen';
import { GroupedList, ListRow } from '@/components/ui/grouped-list';
import { currentUserQuery } from '@/db/repositories/users';

// Placeholder: becomes "Your Data" (CSV export/import) in Milestone 7.
export default function SettingsScreen() {
  const { data } = useLiveQuery(currentUserQuery());
  const user = data[0];
  // Signed in with the Developer (or offline) stand-in: offer the real thing.
  const canUpgrade = !!user && isLocalAccount(user.appleUserId) && !isFreeBuild;

  function confirmSignOut() {
    Alert.alert('Sign out?', 'Your workouts stay on this phone.', [
      { text: 'Cancel', style: 'cancel' },
      // The root layout's protected routes switch to the sign-in screen.
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
    ]);
  }

  async function upgradeToApple() {
    try {
      // Saving the Apple account signs out the stand-in; workouts aren't tied
      // to an account, so they all stay.
      await signInWithApple();
    } catch (e) {
      Alert.alert('Sign in failed', (e as Error).message);
    }
  }

  const accountFooter = isFreeBuild
    ? 'Offline account on this iPhone.'
    : canUpgrade
      ? 'Not signed in with Apple. Your workouts stay on this phone either way.'
      : 'Signed in with Apple.';

  return (
    <Screen>
      <GroupedList header="Account" footer={accountFooter}>
        <ListRow
          title={user?.fullName ?? (isFreeBuild ? 'Offline' : 'Apple ID')}
          subtitle={user?.email ?? undefined}
        />
        {canUpgrade ? <ListRow title="Sign in with Apple" onPress={upgradeToApple} /> : null}
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
