import * as AppleAuthentication from 'expo-apple-authentication';
import { Alert, View } from 'react-native';

import { signInAsDeveloper, signInOffline, signInWithApple } from '@/auth/apple';
import { useAppleSignInAvailable } from '@/auth/use-apple-sign-in-available';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { AppText } from '@/components/ui/text';

export default function SignInScreen() {
  const available = useAppleSignInAvailable();

  async function handlePress() {
    try {
      // On success the users table changes, the root layout's live query
      // flips the guard, and the app screens appear on their own.
      await signInWithApple();
    } catch (e) {
      Alert.alert('Sign in failed', (e as Error).message);
    }
  }

  return (
    <View className="flex-1 justify-between bg-background px-6 pb-16 pt-40">
      <View className="items-center gap-4">
        <Icon name="dumbbell.fill" size={56} className="text-accent" />
        <AppText variant="largeTitle">Gym</AppText>
        <AppText tone="secondary" className="text-center">
          Log workouts, track progress, and train smarter.
        </AppText>
      </View>

      <View className="gap-3">
        {available === false ? (
          // Free builds and Expo Go without the Apple module: a local account
          // instead. Workouts aren't tied to an account, so nothing is lost.
          <>
            <AppText tone="secondary" className="text-center">
              Sign in with Apple isn&apos;t available here. Your workouts are saved on this phone.
            </AppText>
            <Button onPress={() => signInOffline()}>
              <AppText>Continue Without Signing In</AppText>
            </Button>
          </>
        ) : available ? (
          // Apple's own button: required styling for Sign in with Apple, drawn
          // natively. It takes explicit size via `style`, not className.
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
            cornerRadius={12}
            style={{ height: 50, width: '100%' }}
            onPress={handlePress}
          />
        ) : null}
        {/* Development only (stripped from release builds): lets you use the
          simulator when it isn't signed into an Apple ID. */}
        {__DEV__ && available !== false ? (
          <Button variant="plain" onPress={() => signInAsDeveloper()}>
            <AppText>Continue as Developer</AppText>
          </Button>
        ) : null}
      </View>
    </View>
  );
}
