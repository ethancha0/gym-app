import { eq, sql } from 'drizzle-orm';

import { db } from '@/db/client';
import { users } from '@/db/schema';

/** The signed-in user, if any. Live-query this to react to sign in/out. */
export function currentUserQuery() {
  return db.select().from(users).where(eq(users.signedIn, true)).limit(1);
}

/**
 * Records a successful Apple sign-in (one signed-in account per device).
 *
 * Upsert: insert the account, or if it's already known, mark it signed in.
 * `coalesce(excluded.email, users.email)` keeps the stored email when Apple
 * sends null (every sign-in after the first).
 */
export async function saveSignIn(input: {
  appleUserId: string;
  email: string | null;
  fullName: string | null;
}) {
  await db.update(users).set({ signedIn: false });
  await db
    .insert(users)
    .values({ ...input, signedIn: true })
    .onConflictDoUpdate({
      target: users.appleUserId,
      set: {
        signedIn: true,
        email: sql`coalesce(excluded.email, ${users.email})`,
        fullName: sql`coalesce(excluded.full_name, ${users.fullName})`,
      },
    });
}

export async function signOutAll() {
  await db.update(users).set({ signedIn: false });
}
