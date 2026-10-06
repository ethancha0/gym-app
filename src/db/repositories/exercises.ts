import { asc, eq, like } from 'drizzle-orm';

import { db } from '@/db/client';
import { exercises } from '@/db/schema';
import { customExerciseSlug, type Equipment, type Muscle } from '@/domain/exercise';

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

/**
 * Adds an exercise the user made up and returns its id. Slugs are unique, so
 * a second "Cable Y-Raise" gets custom-cable-y-raise-2.
 */
export async function createCustomExercise(input: {
  name: string;
  primaryMuscle: Muscle;
  equipment: Equipment;
}) {
  const name = input.name.trim();
  const base = customExerciseSlug(name);
  // SQL: SELECT slug FROM exercises WHERE slug LIKE 'custom-cable-y-raise%'
  const rows = await db
    .select({ slug: exercises.slug })
    .from(exercises)
    .where(like(exercises.slug, `${base}%`));
  const taken = new Set(rows.map((r) => r.slug));
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;

  const [row] = await db
    .insert(exercises)
    .values({ ...input, name, slug, isCustom: true })
    .returning({ id: exercises.id });
  return row.id;
}
