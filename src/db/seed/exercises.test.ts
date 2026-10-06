import { EQUIPMENT, MUSCLES } from '@/domain/exercise';

import { SEED_EXERCISES } from './exercises';

describe('seed exercises', () => {
  it('has roughly 80 lifts', () => {
    expect(SEED_EXERCISES.length).toBeGreaterThanOrEqual(75);
  });

  it('has unique slugs (the seed matches existing rows by slug)', () => {
    const slugs = SEED_EXERCISES.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('has unique names', () => {
    const names = SEED_EXERCISES.map((e) => e.name.toLowerCase());
    expect(new Set(names).size).toBe(names.length);
  });

  it('uses kebab-case slugs', () => {
    for (const { slug } of SEED_EXERCISES) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  // SQLite stores these as plain text, so nothing at the database level
  // would catch a typo like 'tricep'. TypeScript does at compile time;
  // this guards the data at runtime too.
  it('uses only known muscles and equipment', () => {
    for (const e of SEED_EXERCISES) {
      expect(EQUIPMENT).toContain(e.equipment);
      expect(MUSCLES).toContain(e.primaryMuscle);
      for (const m of e.secondaryMuscles) expect(MUSCLES).toContain(m);
    }
  });

  it('never lists the primary muscle as a secondary one', () => {
    for (const e of SEED_EXERCISES) {
      expect(e.secondaryMuscles).not.toContain(e.primaryMuscle);
    }
  });
});
