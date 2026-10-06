import { asc, eq, max } from 'drizzle-orm';

import { db } from '@/db/client';
import { routineExercises, routines } from '@/db/schema';

/** All routines in display order. */
export function routinesQuery() {
  return db.select().from(routines).orderBy(asc(routines.position), asc(routines.id));
}

/**
 * One routine with its exercises (in order), each with its exercise details.
 * This uses Drizzle's relational query API (the `relations` in schema.ts)
 * instead of writing the JOINs by hand.
 */
export function getRoutineWithExercises(routineId: number) {
  return db.query.routines.findFirst({
    where: eq(routines.id, routineId),
    with: {
      exercises: {
        orderBy: asc(routineExercises.position),
        with: { exercise: true },
      },
    },
  });
}

/** Adds a routine at the end of the list and returns its new id. */
export async function createRoutine(input: { name: string; programName?: string }) {
  const [{ last }] = await db.select({ last: max(routines.position) }).from(routines);
  const [row] = await db
    .insert(routines)
    .values({ ...input, position: (last ?? -1) + 1 })
    // RETURNING gives back the inserted row (SQLite 3.35+), including its new id.
    .returning({ id: routines.id });
  return row.id;
}

/** Appends an exercise to a routine with default sets/reps/rest. */
export async function addExerciseToRoutine(routineId: number, exerciseId: number) {
  const [{ last }] = await db
    .select({ last: max(routineExercises.position) })
    .from(routineExercises)
    .where(eq(routineExercises.routineId, routineId));
  await db.insert(routineExercises).values({
    routineId,
    exerciseId,
    position: (last ?? -1) + 1,
  });
}

/** Deletes a routine. Its routine_exercises rows go too (ON DELETE CASCADE). */
export async function deleteRoutine(routineId: number) {
  await db.delete(routines).where(eq(routines.id, routineId));
}

/** All routines with their exercises, for lists that show what's in each routine. */
export function routinesWithExercisesQuery() {
  return db.query.routines.findMany({
    orderBy: [asc(routines.position), asc(routines.id)],
    with: {
      exercises: {
        orderBy: asc(routineExercises.position),
        with: { exercise: true },
      },
    },
  });
}
