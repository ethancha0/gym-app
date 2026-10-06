import { and, asc, desc, eq, isNotNull, isNull, max, ne, sql } from 'drizzle-orm';

import { db } from '@/db/client';
import { routineExercises, routines, sets, workouts } from '@/db/schema';

// Workouts are written to SQLite as they happen ("write-through"): starting a
// workout creates its row, and every set change is saved immediately. If the
// app is killed mid-workout, the unfinished workout (finished_at IS NULL) is
// still on disk and gets reopened on next launch.

/** Creates a workout (optionally from a routine, with its planned sets) and returns its id. */
export async function startWorkout(routineId?: number) {
  const [{ id }] = await db
    .insert(workouts)
    .values({ routineId: routineId ?? null, startedAt: new Date() })
    .returning({ id: workouts.id });

  if (routineId != null) {
    const planned = await db
      .select()
      .from(routineExercises)
      .where(eq(routineExercises.routineId, routineId))
      .orderBy(asc(routineExercises.position));
    const rows = planned.flatMap((re, exerciseOrder) =>
      Array.from({ length: re.targetSets }, (_, setOrder) => ({
        workoutId: id,
        exerciseId: re.exerciseId,
        exerciseOrder,
        setOrder,
        weightUnit: re.incrementUnit,
      })),
    );
    if (rows.length > 0) await db.insert(sets).values(rows);
  }
  return id;
}

/** The workout in progress, if any (there is at most one). */
export async function getActiveWorkout() {
  const [row] = await db
    .select()
    .from(workouts)
    .where(isNull(workouts.finishedAt))
    .orderBy(desc(workouts.startedAt))
    .limit(1);
  return row;
}

export function activeWorkoutQuery() {
  return db
    .select({ id: workouts.id, startedAt: workouts.startedAt, routineName: routines.name })
    .from(workouts)
    .leftJoin(routines, eq(workouts.routineId, routines.id))
    .where(isNull(workouts.finishedAt))
    .limit(1);
}

/** A workout with its routine and all sets (each with its exercise), in order. */
export function getWorkoutWithSets(workoutId: number) {
  return db.query.workouts.findFirst({
    where: eq(workouts.id, workoutId),
    with: {
      routine: true,
      sets: {
        orderBy: [asc(sets.exerciseOrder), asc(sets.setOrder)],
        with: { exercise: true },
      },
    },
  });
}

export async function updateSet(
  setId: number,
  patch: { weight?: number | null; reps?: number | null; completedAt?: Date | null },
) {
  await db.update(sets).set(patch).where(eq(sets.id, setId));
}

/** Adds an empty set at the end of one exercise in a workout. Returns its id. */
export async function addSet(workoutId: number, exerciseId: number, exerciseOrder: number) {
  const [{ last }] = await db
    .select({ last: max(sets.setOrder) })
    .from(sets)
    .where(and(eq(sets.workoutId, workoutId), eq(sets.exerciseOrder, exerciseOrder)));
  const [{ id }] = await db
    .insert(sets)
    .values({ workoutId, exerciseId, exerciseOrder, setOrder: (last ?? -1) + 1 })
    .returning({ id: sets.id });
  return id;
}

export async function deleteSet(setId: number) {
  await db.delete(sets).where(eq(sets.id, setId));
}

/** Adds an exercise (with one empty set) after the last exercise in a workout. */
export async function addExerciseToWorkout(workoutId: number, exerciseId: number) {
  const [{ last }] = await db
    .select({ last: max(sets.exerciseOrder) })
    .from(sets)
    .where(eq(sets.workoutId, workoutId));
  await db
    .insert(sets)
    .values({ workoutId, exerciseId, exerciseOrder: (last ?? -1) + 1, setOrder: 0 });
}

/**
 * Finishes a workout: drops sets that were never checked off, then stamps
 * finished_at. A workout with no completed sets is discarded instead.
 * Returns whether anything was saved to history.
 */
export async function finishWorkout(workoutId: number) {
  await db.delete(sets).where(and(eq(sets.workoutId, workoutId), isNull(sets.completedAt)));
  const [{ remaining }] = await db
    .select({ remaining: sql<number>`count(*)` })
    .from(sets)
    .where(eq(sets.workoutId, workoutId));
  if (remaining === 0) {
    await discardWorkout(workoutId);
    return false;
  }
  await db.update(workouts).set({ finishedAt: new Date() }).where(eq(workouts.id, workoutId));
  return true;
}

/** Deletes a workout; its sets go with it (ON DELETE CASCADE). */
export async function discardWorkout(workoutId: number) {
  await db.delete(workouts).where(eq(workouts.id, workoutId));
}

/**
 * The "Previous" column: the completed working sets for an exercise from the
 * most recent *finished* workout that included it (excluding the current one).
 */
export async function getPreviousSets(exerciseId: number, excludeWorkoutId: number) {
  const [latest] = await db
    .select({ workoutId: sets.workoutId })
    .from(sets)
    .innerJoin(workouts, eq(sets.workoutId, workouts.id))
    .where(
      and(
        eq(sets.exerciseId, exerciseId),
        eq(sets.isWarmup, false),
        isNotNull(sets.completedAt),
        isNotNull(workouts.finishedAt),
        ne(workouts.id, excludeWorkoutId),
      ),
    )
    .orderBy(desc(workouts.startedAt))
    .limit(1);
  if (!latest) return [];
  return db
    .select({ weight: sets.weight, weightUnit: sets.weightUnit, reps: sets.reps })
    .from(sets)
    .where(
      and(
        eq(sets.workoutId, latest.workoutId),
        eq(sets.exerciseId, exerciseId),
        eq(sets.isWarmup, false),
        isNotNull(sets.completedAt),
      ),
    )
    .orderBy(asc(sets.setOrder));
}

/**
 * Finished workouts, newest first, with per-workout totals computed by SQLite
 * (GROUP BY). Volume = sum of weight × reps for completed working sets,
 * converted to lb (2.20462 = LB_PER_KG in src/domain/format.ts).
 */
export function historyQuery() {
  return db
    .select({
      id: workouts.id,
      startedAt: workouts.startedAt,
      finishedAt: workouts.finishedAt,
      routineName: routines.name,
      setCount: sql<number>`count(${sets.id})`,
      volumeLb: sql<number>`coalesce(sum(
        case when ${sets.isWarmup} = 0 then
          ${sets.weight} * ${sets.reps} * (case ${sets.weightUnit} when 'kg' then 2.20462 else 1 end)
        end), 0)`,
    })
    .from(workouts)
    .leftJoin(routines, eq(workouts.routineId, routines.id))
    .leftJoin(sets, eq(sets.workoutId, workouts.id))
    .where(isNotNull(workouts.finishedAt))
    .groupBy(workouts.id)
    .orderBy(desc(workouts.startedAt));
}
