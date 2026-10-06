import { customExerciseSlug, labelFor } from './exercise';

describe('labelFor', () => {
  it('turns a stored value into a sentence-case label', () => {
    expect(labelFor('front_delts')).toBe('Front delts');
    expect(labelFor('chest')).toBe('Chest');
  });
});

describe('customExerciseSlug', () => {
  it('kebab-cases the name behind a custom- prefix', () => {
    expect(customExerciseSlug('Cable Y-Raise')).toBe('custom-cable-y-raise');
  });

  it('drops punctuation and extra spaces', () => {
    expect(customExerciseSlug('  Seal Row (chest-supported)! ')).toBe(
      'custom-seal-row-chest-supported',
    );
  });

  it('still produces a slug when the name has no letters or digits', () => {
    expect(customExerciseSlug('🔥')).toBe('custom-exercise');
  });
});
