// Fixed vocabularies for exercises. Pure TypeScript (no React or database
// imports), so the database schema, the seed data, and the training math
// in Milestone 5 can all share them.

/** Muscles we count weekly sets for (HANDOFF §5, weekly volume by muscle). */
export const MUSCLES = [
  'chest',
  'lats',
  'upper_back',
  'traps',
  'front_delts',
  'side_delts',
  'rear_delts',
  'biceps',
  'triceps',
  'forearms',
  'abs',
  'lower_back',
  'glutes',
  'quads',
  'hamstrings',
  'adductors',
  'calves',
] as const;
export type Muscle = (typeof MUSCLES)[number];

export const EQUIPMENT = [
  'barbell',
  'dumbbell',
  'ez_bar',
  'trap_bar',
  'smith_machine',
  'machine',
  'cable',
  'kettlebell',
  'bodyweight',
  'band',
] as const;
export type Equipment = (typeof EQUIPMENT)[number];

/** Weights are stored exactly as entered, with their unit (decision in LEARNING.md, M2). */
export const WEIGHT_UNITS = ['lb', 'kg'] as const;
export type WeightUnit = (typeof WEIGHT_UNITS)[number];

/** HANDOFF §5: double progression (default) or add reps only (isolation lifts). */
export const PROGRESSION_RULES = ['double', 'reps_first'] as const;
export type ProgressionRule = (typeof PROGRESSION_RULES)[number];
