import * as AppleAuthentication from 'expo-apple-authentication';
import { useEffect, useState } from 'react';

import { isFreeBuild } from '@/auth/apple';

/**
 * Whether Sign in with Apple can be used here: null while checking.
 *
 * False in free builds (no capability) and wherever the native module is
 * missing, which includes some Expo Go versions: the library then reports
 * unavailable instead of throwing.
 */
export function useAppleSignInAvailable() {
  const [available, setAvailable] = useState<boolean | null>(isFreeBuild ? false : null);

  useEffect(() => {
    if (!isFreeBuild) AppleAuthentication.isAvailableAsync().then(setAvailable);
  }, []);

  return available;
}
