import { db } from '@/db/client';
import { exercises } from '@/db/schema';

import { SEED_EXERCISES } from './exercises';

/**
 * Inserts any built-in exercises that aren't in the database yet.
 *
 * Safe to run on every launch: `onConflictDoNothing` on the unique slug
 * skips rows that already exist (SQL: INSERT ... ON CONFLICT (slug) DO NOTHING).
 * It's one INSERT statement, and a single SQLite statement is all-or-nothing,
 * so a crash halfway can't leave a partial library.
 */
export function seedExercises() {
  return db
    .insert(exercises)
    .values(SEED_EXERCISES)
    .onConflictDoNothing({ target: exercises.slug })
    .run();
}
