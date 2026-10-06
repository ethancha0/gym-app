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

export async function renameRoutine(routineId: number, name: string) {
  await db.update(routines).set({ name }).where(eq(routines.id, routineId));
}

export async function updateRoutineExercise(
  id: number,
  patch: Partial<
    Pick<typeof routineExercises.$inferInsert, 'targetSets' | 'repMin' | 'repMax' | 'restSeconds'>
  >,
) {
  await db.update(routineExercises).set(patch).where(eq(routineExercises.id, id));
}

export async function removeRoutineExercise(id: number) {
  await db.delete(routineExercises).where(eq(routineExercises.id, id));
}

/** Swaps an exercise with its neighbor above (-1) or below (+1). */
export async function moveRoutineExercise(id: number, direction: -1 | 1) {
  const [current] = await db.select().from(routineExercises).where(eq(routineExercises.id, id));
  if (!current) return;
  const siblings = await db
    .select()
    .from(routineExercises)
    .where(eq(routineExercises.routineId, current.routineId))
    .orderBy(asc(routineExercises.position));
  const index = siblings.findIndex((s) => s.id === id);
  const neighbor = siblings[index + direction];
  if (!neighbor) return;
  await db
    .update(routineExercises)
    .set({ position: neighbor.position })
    .where(eq(routineExercises.id, current.id));
  await db
    .update(routineExercises)
    .set({ position: current.position })
    .where(eq(routineExercises.id, neighbor.id));
}
