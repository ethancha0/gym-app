import { cn } from './utils';

describe('cn', () => {
  it('keeps a custom font size and a text color together', () => {
    expect(cn('text-headline', 'text-label')).toBe('text-headline text-label');
  });

  it('lets a later font size override an earlier one', () => {
    expect(cn('text-body', 'text-footnote')).toBe('text-footnote');
  });

  it('lets a later color override an earlier one', () => {
    expect(cn('text-label', 'text-accent')).toBe('text-accent');
  });
});
