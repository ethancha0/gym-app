import { create } from 'zustand';

import type { Equipment, WeightUnit } from '@/domain/exercise';
import { formatWeight, parseReps, parseWeight } from '@/domain/format';
import {
  addExerciseToWorkout,
  addSet,
  deleteSet,
  discardWorkout,
  finishWorkout,
  getPreviousSets,
  getWorkoutWithSets,
  updateSet,
} from '@/db/repositories/workouts';

// In-memory working copy of the workout that's open on screen.
//
// Where state lives:
// - SQLite is the source of truth. Every *committed* change is written there
//   right away, so killing the app loses nothing.
// - This store holds what the screen needs to render fast, including
//   half-typed values ("18" on the way to "185") that aren't saved yet.
// - Components subscribe with selectors (`useActiveWorkout(s => s.sets[id])`),
//   so typing in one cell re-renders only that row, not the whole workout.

export type SetDraft = {
  id: number;
  exerciseOrder: number;
  // Text as typed; parsed into numbers when saved.
  weight: string;
  reps: string;
  weightUnit: WeightUnit;
  completed: boolean;
};

export type PreviousSet = { weight: number | null; reps: number | null; weightUnit: WeightUnit };

export type WorkoutExercise = {
  exerciseOrder: number;
  exerciseId: number;
  name: string;
  equipment: Equipment;
  setIds: number[];
  previous: PreviousSet[];
};

type State = {
  workoutId: number | null;
  startedAt: Date | null;
  title: string;
  exercises: WorkoutExercise[];
  sets: Record<number, SetDraft>;
};

type Actions = {
  /** Loads a workout from the database into the store. */
  load: (workoutId: number) => Promise<void>;
  /** Updates a typed value in memory only (no database write). */
  setField: (setId: number, field: 'weight' | 'reps', text: string) => void;
  /** Saves a set's typed values to the database (call when editing ends). */
  commitSet: (setId: number) => Promise<void>;
  /**
   * Checks a set off (or un-checks it). Empty fields are filled from the
   * Previous column first. Returns false if there's no rep count to log.
   */
  toggleComplete: (setId: number) => Promise<boolean>;
  addSet: (exerciseOrder: number) => Promise<void>;
  removeSet: (setId: number) => Promise<void>;
  addExercise: (exerciseId: number) => Promise<void>;
  /** Returns whether the workout was saved to history (false = nothing completed). */
  finish: () => Promise<boolean>;
  discard: () => Promise<void>;
};

const initialState: State = {
  workoutId: null,
  startedAt: null,
  title: '',
  exercises: [],
  sets: {},
};

export const useActiveWorkout = create<State & Actions>()((set, get) => ({
  ...initialState,

  load: async (workoutId) => {
    const workout = await getWorkoutWithSets(workoutId);
    if (!workout) {
      set(initialState);
      return;
    }

    const exercises: WorkoutExercise[] = [];
    const drafts: Record<number, SetDraft> = {};
    for (const s of workout.sets) {
      let group = exercises.find((e) => e.exerciseOrder === s.exerciseOrder);
      if (!group) {
        group = {
          exerciseOrder: s.exerciseOrder,
          exerciseId: s.exerciseId,
          name: s.exercise.name,
          equipment: s.exercise.equipment,
          setIds: [],
          previous: [],
        };
        exercises.push(group);
      }
      group.setIds.push(s.id);
      drafts[s.id] = {
        id: s.id,
        exerciseOrder: s.exerciseOrder,
        weight: s.weight == null ? '' : formatWeight(s.weight),
        reps: s.reps == null ? '' : String(s.reps),
        weightUnit: s.weightUnit,
        completed: s.completedAt != null,
      };
    }

    // Look up last session's sets for each exercise (the Previous column).
    await Promise.all(
      exercises.map(async (e) => {
        e.previous = await getPreviousSets(e.exerciseId, workoutId);
      }),
    );

    set({
      workoutId,
      startedAt: workout.startedAt,
      title: workout.routine?.name ?? 'Workout',
      exercises,
      sets: drafts,
    });
  },

  setField: (setId, field, text) =>
    // Spread to create new objects: Zustand (like React state) detects
    // changes by reference, so mutating in place wouldn't re-render.
    set((s) => ({ sets: { ...s.sets, [setId]: { ...s.sets[setId], [field]: text } } })),

  commitSet: async (setId) => {
    const draft = get().sets[setId];
    if (!draft) return;
    await updateSet(setId, { weight: parseWeight(draft.weight), reps: parseReps(draft.reps) });
  },

  toggleComplete: async (setId) => {
    const { sets: drafts, exercises } = get();
    const draft = drafts[setId];
    if (!draft) return false;

    if (draft.completed) {
      set((s) => ({ sets: { ...s.sets, [setId]: { ...draft, completed: false } } }));
      await updateSet(setId, { completedAt: null });
      return true;
    }

    // Fill empty fields from the matching Previous set, like a pre-filled form.
    const group = exercises.find((e) => e.exerciseOrder === draft.exerciseOrder);
    const prev = group?.previous[group.setIds.indexOf(setId)];
    const weightText = draft.weight || (prev?.weight != null ? formatWeight(prev.weight) : '');
    const repsText = draft.reps || (prev?.reps != null ? String(prev.reps) : '');
    const reps = parseReps(repsText);
    if (reps == null) return false;

    set((s) => ({
      sets: {
        ...s.sets,
        [setId]: { ...draft, weight: weightText, reps: repsText, completed: true },
      },
    }));
    await updateSet(setId, {
      weight: parseWeight(weightText),
      reps,
      completedAt: new Date(),
    });
    return true;
  },

  addSet: async (exerciseOrder) => {
    const { workoutId, exercises } = get();
    const group = exercises.find((e) => e.exerciseOrder === exerciseOrder);
    if (workoutId == null || !group) return;
    const id = await addSet(workoutId, group.exerciseId, exerciseOrder);
    set((s) => ({
      exercises: s.exercises.map((e) =>
        e.exerciseOrder === exerciseOrder ? { ...e, setIds: [...e.setIds, id] } : e,
      ),
      sets: {
        ...s.sets,
        [id]: { id, exerciseOrder, weight: '', reps: '', weightUnit: 'lb', completed: false },
      },
    }));
  },

  removeSet: async (setId) => {
    await deleteSet(setId);
    set((s) => {
      const { [setId]: _removed, ...rest } = s.sets;
      return {
        sets: rest,
        exercises: s.exercises
          .map((e) => ({ ...e, setIds: e.setIds.filter((id) => id !== setId) }))
          .filter((e) => e.setIds.length > 0),
      };
    });
  },

  addExercise: async (exerciseId) => {
    const { workoutId, load } = get();
    if (workoutId == null) return;
    await addExerciseToWorkout(workoutId, exerciseId);
    await load(workoutId);
  },

  finish: async () => {
    const { workoutId } = get();
    if (workoutId == null) return false;
    const saved = await finishWorkout(workoutId);
    set(initialState);
    return saved;
  },

  discard: async () => {
    const { workoutId } = get();
    if (workoutId != null) await discardWorkout(workoutId);
    set(initialState);
  },
}));
