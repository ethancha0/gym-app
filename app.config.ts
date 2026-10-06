import type { ConfigContext, ExpoConfig } from 'expo/config';
import { withEntitlementsPlist } from 'expo/config-plugins';

// Extends app.json. EXPO_PUBLIC_FREE_BUILD=1 marks a build signed with a free
// Apple ID (no paid developer account): free accounts can't use the Sign in
// with Apple capability, so it's left out and the sign-in screen offers an
// offline account instead (see `isFreeBuild` in src/auth/apple.ts).
const isFreeBuild = process.env.EXPO_PUBLIC_FREE_BUILD === '1';

export default ({ config }: ConfigContext): ExpoConfig => {
  const base = { ...(config as ExpoConfig), ios: { ...config.ios, usesAppleSignIn: !isFreeBuild } };
  if (!isFreeBuild) return base;

  // expo-apple-authentication's plugin adds the entitlement unconditionally;
  // this mod runs after it and takes it back out.
  return withEntitlementsPlist(base, (mod) => {
    delete mod.modResults['com.apple.developer.applesignin'];
    return mod;
  });
};
