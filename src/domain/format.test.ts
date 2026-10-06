import {
  formatDuration,
  formatElapsed,
  formatVolume,
  formatWeight,
  parseReps,
  parseWeight,
  toLb,
} from './format';

describe('parseWeight', () => {
  it('parses whole and decimal weights', () => {
    expect(parseWeight('185')).toBe(185);
    expect(parseWeight('102.5')).toBe(102.5);
  });
  it('accepts a comma decimal separator', () => {
    expect(parseWeight('102,5')).toBe(102.5);
  });
  it('returns null for empty or invalid input', () => {
    expect(parseWeight('')).toBeNull();
    expect(parseWeight('  ')).toBeNull();
    expect(parseWeight('abc')).toBeNull();
    expect(parseWeight('-5')).toBeNull();
  });
});

describe('parseReps', () => {
  it('parses whole numbers only', () => {
    expect(parseReps('8')).toBe(8);
    expect(parseReps('0')).toBe(0);
    expect(parseReps('8.5')).toBeNull();
    expect(parseReps('')).toBeNull();
  });
});

describe('toLb', () => {
  it('leaves lb alone and converts kg', () => {
    expect(toLb(185, 'lb')).toBe(185);
    expect(toLb(100, 'kg')).toBeCloseTo(220.462);
  });
});

describe('formatting', () => {
  it('formats weights with at most one decimal', () => {
    expect(formatWeight(185)).toBe('185');
    expect(formatWeight(102.5)).toBe('102.5');
    expect(formatWeight(83.91459)).toBe('83.9');
  });
  it('formats volume with thousands separators', () => {
    expect(formatVolume(12450.4)).toBe('12,450');
  });
  it('formats the elapsed timer', () => {
    expect(formatElapsed(0)).toBe('0:00');
    expect(formatElapsed(65_000)).toBe('1:05');
    expect(formatElapsed(3_725_000)).toBe('1:02:05');
  });
  it('formats workout durations', () => {
    expect(formatDuration(3_480_000)).toBe('58 min');
    expect(formatDuration(4_500_000)).toBe('1 h 15 min');
    expect(formatDuration(7_200_000)).toBe('2 h');
    expect(formatDuration(10_000)).toBe('1 min');
  });
});
