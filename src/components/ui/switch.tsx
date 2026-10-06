import { Switch as RNSwitch, type SwitchProps } from 'react-native';

import { colors } from '@/theme/tokens';

/**
 * React Native's built-in Switch is the real iOS UISwitch, so it already
 * looks and feels native (haptics, drag, VoiceOver). We only pass token
 * colors as props; it doesn't accept className.
 */
export function Switch(props: SwitchProps) {
  return (
    <RNSwitch
      trackColor={{ false: colors.switchOff, true: colors.accent }}
      ios_backgroundColor={colors.switchOff}
      thumbColor="#FFFFFF"
      {...props}
    />
  );
}
