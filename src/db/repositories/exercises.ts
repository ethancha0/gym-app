import { asc, eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { exercises } from '@/db/schema';

// Repository functions are the only place screens get data from. Screens
// never build queries themselves, so the SQL for each concept lives in one file.
//
// "...Query" functions return the query *without running it*. You can
// `await` it once, or hand it to `useLiveQuery` to re-run it whenever the
// tables it reads change.

/** All exercises, A to Z. SQL: SELECT * FROM exercises ORDER BY name ASC */
export function exercisesQuery() {
  return db.select().from(exercises).orderBy(asc(exercises.name));
}

export async function getExerciseBySlug(slug: string) {
  const [row] = await db.select().from(exercises).where(eq(exercises.slug, slug)).limit(1);
  return row;
}
