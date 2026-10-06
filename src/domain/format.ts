// Parsing and formatting for numbers the user types and reads.
// Pure functions: no React, no database. Tested in format.test.ts.
import type { WeightUnit } from './exercise';

export const LB_PER_KG = 2.20462;

/** Converts a weight to lb (used when summing mixed-unit volume). */
export function toLb(weight: number, unit: WeightUnit): number {
  return unit === 'kg' ? weight * LB_PER_KG : weight;
}

/**
 * Parses a weight typed into a decimal-pad field. Accepts a comma as the
 * decimal separator (some regions' keypads show ","). Empty or invalid → null.
 */
export function parseWeight(text: string): number | null {
  const trimmed = text.trim().replace(',', '.');
  if (trimmed === '') return null;
  const value = Number(trimmed);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

/** Parses reps (whole number ≥ 0). Empty or invalid → null. */
export function parseReps(text: string): number | null {
  const trimmed = text.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  return Number(trimmed);
}

/** 185 → "185", 102.5 → "102.5", 83.91459 → "83.9". */
export function formatWeight(weight: number): string {
  return String(Math.round(weight * 10) / 10);
}

/** 12450.4 → "12,450". */
export function formatVolume(volume: number): string {
  return Math.round(volume).toLocaleString('en-US');
}

/** Elapsed timer: 65_000 → "1:05", 3_725_000 → "1:02:05". */
export function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

/** Workout length for lists: 3_480_000 → "58 min", 4_500_000 → "1 h 15 min". */
export function formatDuration(ms: number): string {
  const minutes = Math.max(1, Math.round(ms / 60_000));
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}
