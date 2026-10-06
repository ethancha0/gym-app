// Built-in exercise library (HANDOFF §6: ~80 common lifts).
//
// The slug is the permanent identity of each exercise: never change or reuse
// one, because the seed matches existing rows by slug. Adding a new line here
// adds that exercise on the next app launch; names can be edited freely.
import type { Equipment, Muscle } from '@/domain/exercise';

type SeedExercise = {
  slug: string;
  name: string;
  equipment: Equipment;
  primaryMuscle: Muscle;
  secondaryMuscles: Muscle[];
};

// [slug, name, equipment, primary muscle, secondary muscles]
type Row = [string, string, Equipment, Muscle, Muscle[]];

const ROWS: Row[] = [
  // Chest
  ['barbell-bench-press', 'Bench Press', 'barbell', 'chest', ['triceps', 'front_delts']],
  [
    'incline-barbell-bench-press',
    'Incline Bench Press',
    'barbell',
    'chest',
    ['front_delts', 'triceps'],
  ],
  ['decline-barbell-bench-press', 'Decline Bench Press', 'barbell', 'chest', ['triceps']],
  [
    'close-grip-bench-press',
    'Close-Grip Bench Press',
    'barbell',
    'triceps',
    ['chest', 'front_delts'],
  ],
  ['dumbbell-bench-press', 'Dumbbell Bench Press', 'dumbbell', 'chest', ['triceps', 'front_delts']],
  [
    'incline-dumbbell-press',
    'Incline Dumbbell Press',
    'dumbbell',
    'chest',
    ['front_delts', 'triceps'],
  ],
  ['dumbbell-fly', 'Dumbbell Fly', 'dumbbell', 'chest', []],
  [
    'smith-machine-incline-press',
    'Smith Machine Incline Press',
    'smith_machine',
    'chest',
    ['front_delts', 'triceps'],
  ],
  ['machine-chest-press', 'Machine Chest Press', 'machine', 'chest', ['triceps', 'front_delts']],
  ['pec-deck', 'Pec Deck', 'machine', 'chest', []],
  ['cable-crossover', 'Cable Crossover', 'cable', 'chest', []],
  ['push-up', 'Push-Up', 'bodyweight', 'chest', ['triceps', 'front_delts']],
  ['dip', 'Dip', 'bodyweight', 'chest', ['triceps', 'front_delts']],

  // Back
  [
    'deadlift',
    'Deadlift',
    'barbell',
    'hamstrings',
    ['glutes', 'lower_back', 'upper_back', 'traps', 'forearms'],
  ],
  ['barbell-row', 'Barbell Row', 'barbell', 'upper_back', ['lats', 'rear_delts', 'biceps']],
  ['pendlay-row', 'Pendlay Row', 'barbell', 'upper_back', ['lats', 'rear_delts', 'biceps']],
  ['t-bar-row', 'T-Bar Row', 'barbell', 'upper_back', ['lats', 'biceps']],
  ['dumbbell-row', 'Dumbbell Row', 'dumbbell', 'lats', ['upper_back', 'biceps']],
  [
    'chest-supported-row',
    'Chest-Supported Row',
    'dumbbell',
    'upper_back',
    ['lats', 'rear_delts', 'biceps'],
  ],
  ['seated-cable-row', 'Seated Cable Row', 'cable', 'upper_back', ['lats', 'biceps']],
  ['machine-row', 'Machine Row', 'machine', 'upper_back', ['lats', 'biceps']],
  ['lat-pulldown', 'Lat Pulldown', 'cable', 'lats', ['biceps', 'upper_back']],
  ['close-grip-lat-pulldown', 'Close-Grip Lat Pulldown', 'cable', 'lats', ['biceps']],
  ['straight-arm-pulldown', 'Straight-Arm Pulldown', 'cable', 'lats', []],
  ['pull-up', 'Pull-Up', 'bodyweight', 'lats', ['biceps', 'upper_back']],
  ['chin-up', 'Chin-Up', 'bodyweight', 'lats', ['biceps']],
  ['rack-pull', 'Rack Pull', 'barbell', 'upper_back', ['traps', 'glutes', 'lower_back']],
  ['back-extension', 'Back Extension', 'bodyweight', 'lower_back', ['glutes', 'hamstrings']],

  // Shoulders and traps
  ['overhead-press', 'Overhead Press', 'barbell', 'front_delts', ['side_delts', 'triceps']],
  [
    'seated-dumbbell-shoulder-press',
    'Seated Dumbbell Shoulder Press',
    'dumbbell',
    'front_delts',
    ['side_delts', 'triceps'],
  ],
  ['arnold-press', 'Arnold Press', 'dumbbell', 'front_delts', ['side_delts', 'triceps']],
  [
    'machine-shoulder-press',
    'Machine Shoulder Press',
    'machine',
    'front_delts',
    ['side_delts', 'triceps'],
  ],
  ['dumbbell-lateral-raise', 'Dumbbell Lateral Raise', 'dumbbell', 'side_delts', []],
  ['cable-lateral-raise', 'Cable Lateral Raise', 'cable', 'side_delts', []],
  ['machine-lateral-raise', 'Machine Lateral Raise', 'machine', 'side_delts', []],
  ['dumbbell-front-raise', 'Dumbbell Front Raise', 'dumbbell', 'front_delts', []],
  ['reverse-pec-deck', 'Reverse Pec Deck', 'machine', 'rear_delts', ['upper_back']],
  ['face-pull', 'Face Pull', 'cable', 'rear_delts', ['upper_back', 'traps']],
  ['dumbbell-rear-delt-fly', 'Dumbbell Rear Delt Fly', 'dumbbell', 'rear_delts', ['upper_back']],
  ['barbell-shrug', 'Barbell Shrug', 'barbell', 'traps', ['forearms']],
  ['dumbbell-shrug', 'Dumbbell Shrug', 'dumbbell', 'traps', ['forearms']],
  ['upright-row', 'Upright Row', 'ez_bar', 'side_delts', ['traps']],

  // Arms
  ['barbell-curl', 'Barbell Curl', 'barbell', 'biceps', ['forearms']],
  ['ez-bar-curl', 'EZ-Bar Curl', 'ez_bar', 'biceps', ['forearms']],
  ['dumbbell-curl', 'Dumbbell Curl', 'dumbbell', 'biceps', ['forearms']],
  ['hammer-curl', 'Hammer Curl', 'dumbbell', 'biceps', ['forearms']],
  ['incline-dumbbell-curl', 'Incline Dumbbell Curl', 'dumbbell', 'biceps', []],
  ['preacher-curl', 'Preacher Curl', 'ez_bar', 'biceps', []],
  ['cable-curl', 'Cable Curl', 'cable', 'biceps', ['forearms']],
  ['tricep-pushdown', 'Tricep Pushdown', 'cable', 'triceps', []],
  ['overhead-cable-tricep-extension', 'Overhead Cable Tricep Extension', 'cable', 'triceps', []],
  ['skull-crusher', 'Skull Crusher', 'ez_bar', 'triceps', []],
  [
    'overhead-dumbbell-tricep-extension',
    'Overhead Dumbbell Tricep Extension',
    'dumbbell',
    'triceps',
    [],
  ],
  ['wrist-curl', 'Wrist Curl', 'dumbbell', 'forearms', []],

  // Legs
  ['back-squat', 'Back Squat', 'barbell', 'quads', ['glutes', 'adductors', 'lower_back']],
  ['front-squat', 'Front Squat', 'barbell', 'quads', ['glutes', 'upper_back']],
  ['hack-squat', 'Hack Squat', 'machine', 'quads', ['glutes']],
  ['leg-press', 'Leg Press', 'machine', 'quads', ['glutes', 'adductors']],
  ['goblet-squat', 'Goblet Squat', 'dumbbell', 'quads', ['glutes']],
  ['bulgarian-split-squat', 'Bulgarian Split Squat', 'dumbbell', 'quads', ['glutes', 'adductors']],
  ['walking-lunge', 'Walking Lunge', 'dumbbell', 'quads', ['glutes']],
  ['leg-extension', 'Leg Extension', 'machine', 'quads', []],
  ['romanian-deadlift', 'Romanian Deadlift', 'barbell', 'hamstrings', ['glutes', 'lower_back']],
  [
    'dumbbell-romanian-deadlift',
    'Dumbbell Romanian Deadlift',
    'dumbbell',
    'hamstrings',
    ['glutes'],
  ],
  ['stiff-leg-deadlift', 'Stiff-Leg Deadlift', 'barbell', 'hamstrings', ['glutes', 'lower_back']],
  [
    'sumo-deadlift',
    'Sumo Deadlift',
    'barbell',
    'glutes',
    ['quads', 'adductors', 'hamstrings', 'lower_back'],
  ],
  [
    'trap-bar-deadlift',
    'Trap Bar Deadlift',
    'trap_bar',
    'quads',
    ['glutes', 'hamstrings', 'traps'],
  ],
  ['good-morning', 'Good Morning', 'barbell', 'hamstrings', ['lower_back', 'glutes']],
  ['lying-leg-curl', 'Lying Leg Curl', 'machine', 'hamstrings', []],
  ['seated-leg-curl', 'Seated Leg Curl', 'machine', 'hamstrings', []],
  ['hip-thrust', 'Hip Thrust', 'barbell', 'glutes', ['hamstrings']],
  ['cable-pull-through', 'Cable Pull-Through', 'cable', 'glutes', ['hamstrings']],
  ['hip-adduction-machine', 'Hip Adduction Machine', 'machine', 'adductors', []],
  ['standing-calf-raise', 'Standing Calf Raise', 'machine', 'calves', []],
  ['seated-calf-raise', 'Seated Calf Raise', 'machine', 'calves', []],

  // Core
  ['plank', 'Plank', 'bodyweight', 'abs', []],
  ['hanging-leg-raise', 'Hanging Leg Raise', 'bodyweight', 'abs', ['forearms']],
  ['cable-crunch', 'Cable Crunch', 'cable', 'abs', []],
  ['ab-wheel-rollout', 'Ab Wheel Rollout', 'bodyweight', 'abs', ['lats']],
  ['crunch', 'Crunch', 'bodyweight', 'abs', []],
  ['kettlebell-swing', 'Kettlebell Swing', 'kettlebell', 'glutes', ['hamstrings', 'lower_back']],
];

export const SEED_EXERCISES: SeedExercise[] = ROWS.map(
  ([slug, name, equipment, primaryMuscle, secondaryMuscles]) => ({
    slug,
    name,
    equipment,
    primaryMuscle,
    secondaryMuscles,
  }),
);
