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

/** 'front_delts' → 'Front delts': a display label for a muscle or equipment value. */
export function labelFor(value: Muscle | Equipment): string {
  const words = value.replaceAll('_', ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * Slug for an exercise the user creates: "Cable Y-Raise" → "custom-cable-y-raise".
 * The prefix keeps it from ever colliding with a seed slug added later.
 */
export function customExerciseSlug(name: string): string {
  const kebab = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `custom-${kebab || 'exercise'}`;
}
