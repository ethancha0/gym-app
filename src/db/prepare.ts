import { migrate } from 'drizzle-orm/expo-sqlite/migrator';

import { db } from '@/db/client';
import migrations from '@/db/migrations/migrations';
import { seedExercises } from '@/db/seed/seed';

/**
 * Gets the database ready on app start: run new migrations, then seed.
 *
 * `migrate` compares the migrations bundled in this build with the ones
 * already recorded in the database (Drizzle keeps a `__drizzle_migrations`
 * table) and runs only the new ones, in order. On a fresh install that's all
 * of them; on a normal launch it's none. Both steps are safe to repeat.
 */
export async function prepareDatabase() {
  await migrate(db, migrations);
  seedExercises();
}
