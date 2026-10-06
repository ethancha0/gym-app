// The database schema: the single source of truth for every table.
//
// Each column is written as `kind('sql_name', options)`. Drizzle uses this file
// twice: drizzle-kit reads it on your Mac to generate migration SQL
// (src/db/migrations/), and the app imports it to build typed queries.
//
// After editing this file, run `npm run db:generate` to create a new migration.
// Never edit an existing migration: phones that already ran it won't run it again.
import { relations } from 'drizzle-orm';
import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import {
  EQUIPMENT,
  PROGRESSION_RULES,
  WEIGHT_UNITS,
  MUSCLES,
  type Muscle,
} from '@/domain/exercise';

// SQLite has no boolean or date types. Drizzle stores booleans as 0/1
// integers and dates as integer milliseconds, and converts them back to
// `boolean` and `Date` when reading.
const id = () => integer('id').primaryKey({ autoIncrement: true });
const createdAt = () =>
  integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date());

export const exercises = sqliteTable('exercises', {
  id: id(),
  // Stable text key (e.g. 'barbell-bench-press'). Lets the seed run safely
  // more than once and lets CSV import (Milestone 7) match exercises by name.
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  // `enum` here is a TypeScript-only check; SQLite stores plain text.
  equipment: text('equipment', { enum: EQUIPMENT }).notNull(),
  primaryMuscle: text('primary_muscle', { enum: MUSCLES }).notNull(),
  // JSON text column, e.g. '["triceps","front_delts"]', typed as Muscle[].
  secondaryMuscles: text('secondary_muscles', { mode: 'json' })
    .$type<Muscle[]>()
    .notNull()
    .default([]),
  isCustom: integer('is_custom', { mode: 'boolean' }).notNull().default(false),
});

export const routines = sqliteTable('routines', {
  id: id(),
  name: text('name').notNull(),
  programName: text('program_name'),
  position: integer('position').notNull().default(0),
  notes: text('notes'),
  createdAt: createdAt(),
});

export const routineExercises = sqliteTable(
  'routine_exercises',
  {
    id: id(),
    // onDelete 'cascade': deleting a routine deletes its exercise rows too.
    routineId: integer('routine_id')
      .notNull()
      .references(() => routines.id, { onDelete: 'cascade' }),
    // 'restrict': an exercise can't be deleted while a routine uses it.
    exerciseId: integer('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'restrict' }),
    position: integer('position').notNull(),
    targetSets: integer('target_sets').notNull().default(3),
    repMin: integer('rep_min').notNull().default(8),
    repMax: integer('rep_max').notNull().default(12),
    restSeconds: integer('rest_seconds').notNull().default(120),
    progressionRule: text('progression_rule', { enum: PROGRESSION_RULES })
      .notNull()
      .default('double'),
    increment: real('increment').notNull().default(5),
    incrementUnit: text('increment_unit', { enum: WEIGHT_UNITS }).notNull().default('lb'),
    warmupsEnabled: integer('warmups_enabled', { mode: 'boolean' }).notNull().default(false),
  },
  // An index is a sorted lookup table SQLite keeps alongside the rows, so
  // "all exercises in routine 3, in order" doesn't scan the whole table.
  (t) => [index('routine_exercises_routine_idx').on(t.routineId, t.position)],
);

export const workouts = sqliteTable('workouts', {
  id: id(),
  // 'set null': deleting a routine keeps its past workouts in history.
  routineId: integer('routine_id').references(() => routines.id, { onDelete: 'set null' }),
  startedAt: integer('started_at', { mode: 'timestamp_ms' }).notNull(),
  // null = still in progress. Milestone 3 uses this to recover a workout
  // if the app is killed mid-session.
  finishedAt: integer('finished_at', { mode: 'timestamp_ms' }),
  notes: text('notes'),
});

export const sets = sqliteTable(
  'sets',
  {
    id: id(),
    workoutId: integer('workout_id')
      .notNull()
      .references(() => workouts.id, { onDelete: 'cascade' }),
    exerciseId: integer('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'restrict' }),
    // Order of the exercise within the workout, then of the set within the exercise.
    exerciseOrder: integer('exercise_order').notNull(),
    setOrder: integer('set_order').notNull(),
    isWarmup: integer('is_warmup', { mode: 'boolean' }).notNull().default(false),
    // Stored exactly as entered, with its unit (null for bodyweight).
    weight: real('weight'),
    weightUnit: text('weight_unit', { enum: WEIGHT_UNITS }).notNull().default('lb'),
    reps: integer('reps'),
    rpe: real('rpe'),
    // null = not checked off yet.
    completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
  },
  (t) => [
    index('sets_workout_idx').on(t.workoutId),
    // Speeds up "history for this exercise, newest first" (Previous column, PRs, charts).
    index('sets_exercise_completed_idx').on(t.exerciseId, t.completedAt),
  ],
);

// Relations don't change the database; they tell Drizzle's query API how
// tables connect, so we can load a routine *with* its exercises in one call.
export const routinesRelations = relations(routines, ({ many }) => ({
  exercises: many(routineExercises),
}));

export const routineExercisesRelations = relations(routineExercises, ({ one }) => ({
  routine: one(routines, { fields: [routineExercises.routineId], references: [routines.id] }),
  exercise: one(exercises, { fields: [routineExercises.exerciseId], references: [exercises.id] }),
}));

export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  routine: one(routines, { fields: [workouts.routineId], references: [routines.id] }),
  sets: many(sets),
}));

export const setsRelations = relations(sets, ({ one }) => ({
  workout: one(workouts, { fields: [sets.workoutId], references: [workouts.id] }),
  exercise: one(exercises, { fields: [sets.exerciseId], references: [exercises.id] }),
}));

// Row types inferred from the tables, for use across the app.
export type Exercise = typeof exercises.$inferSelect;
export type Routine = typeof routines.$inferSelect;
export type RoutineExercise = typeof routineExercises.$inferSelect;
export type Workout = typeof workouts.$inferSelect;
export type WorkoutSet = typeof sets.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
