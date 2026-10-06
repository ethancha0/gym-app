import { router } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useEffect } from 'react';

import { getActiveWorkout } from '@/db/repositories/workouts';
import { colors } from '@/theme/tokens';

// Module-level flag: survives this layout re-mounting (e.g. sign out/in),
// so the crash-recovery check runs once per app launch.
let checkedForUnfinishedWorkout = false;

// NativeTabs renders the real iOS UITabBar (Liquid Glass on iOS 26), not a
// JavaScript imitation, so it can't be styled with classNames. We pass
// token colors directly. Each `name` matches a folder in this directory.
export default function TabLayout() {
  // Crash recovery: if the app was killed mid-workout, the unfinished workout
  // is still in the database. Reopen it straight away on launch.
  useEffect(() => {
    if (checkedForUnfinishedWorkout) return;
    checkedForUnfinishedWorkout = true;
    getActiveWorkout().then((w) => {
      if (w) router.push('/workout');
    });
  }, []);

  return (
    <NativeTabs tintColor={colors.accent}>
      <NativeTabs.Trigger name="today">
        <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'sun.max', selected: 'sun.max.fill' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="routines">
        <NativeTabs.Trigger.Label>Routines</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="list.bullet.rectangle.portrait" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="history">
        <NativeTabs.Trigger.Label>History</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="clock.arrow.circlepath" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="progress">
        <NativeTabs.Trigger.Label>Progress</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="chart.line.uptrend.xyaxis" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
