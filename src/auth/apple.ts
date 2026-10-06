import * as AppleAuthentication from 'expo-apple-authentication';

import { saveSignIn, signOutAll } from '@/db/repositories/users';

/**
 * True in a build signed with a free Apple ID (EXPO_PUBLIC_FREE_BUILD=1, see
 * app.config.ts). Sign in with Apple isn't available there, so the app uses
 * an offline account that lives only on this device.
 */
export const isFreeBuild = process.env.EXPO_PUBLIC_FREE_BUILD === '1';

/**
 * Shows Apple's native sign-in sheet (Face ID / passcode) and stores the
 * account locally. Returns false if the user cancelled.
 *
 * In Expo Go the user ID Apple returns belongs to Expo Go's app, not ours;
 * it changes once we ship our own build (Milestone 10).
 */
export async function signInWithApple(): Promise<boolean> {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    const { givenName, familyName } = credential.fullName ?? {};
    const fullName = [givenName, familyName].filter(Boolean).join(' ') || null;
    await saveSignIn({ appleUserId: credential.user, email: credential.email, fullName });
    return true;
  } catch (e) {
    // Closing Apple's sheet is not an error worth showing.
    if ((e as { code?: string }).code === 'ERR_REQUEST_CANCELED') return false;
    throw e;
  }
}

/**
 * Signs out if the person revoked this app in Settings → Apple ID →
 * Sign in with Apple. Errors are ignored: the check isn't available
 * everywhere (e.g. some simulators), and staying signed in is the safe default.
 */
export async function verifyAppleCredential(appleUserId: string) {
  try {
    const state = await AppleAuthentication.getCredentialStateAsync(appleUserId);
    if (state === AppleAuthentication.AppleAuthenticationCredentialState.REVOKED) {
      await signOutAll();
    }
  } catch {
    // ignore
  }
}

export async function signOut() {
  await signOutAll();
}

/**
 * Development-only stand-in for when Sign in with Apple isn't available
 * (e.g. a simulator not signed into an Apple ID). Never shown in release
 * builds: the button that calls it is wrapped in `__DEV__`.
 */
export async function signInAsDeveloper() {
  await saveSignIn({ appleUserId: 'dev-user', email: null, fullName: 'Developer' });
}

/** Free builds only: a local account in place of Sign in with Apple. */
export async function signInOffline() {
  await saveSignIn({ appleUserId: 'offline-user', email: null, fullName: null });
}
