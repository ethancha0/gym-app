// Design tokens from docs/HANDOFF.md §3: the single source of truth.
//
// This is a plain CommonJS .js file (not .ts) because tailwind.config.js
// runs in Node and `require`s it. TypeScript code can still import it
// (`allowJs` is on in Expo's tsconfig) for the few places that need a raw
// color instead of a className: navigation theme, native Switch, icon tints.

const colors = {
  background: '#000000',
  surface: '#1C1C1E',
  surfaceRaised: '#2C2C2E',
  surfaceHigh: '#3A3A3C',
  separator: '#38383A',
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#636366',
  accent: '#AD9FB8',
  onAccent: '#1C1A1F',
  completedRow: '#232126',
  warning: '#E8C27A',
  switchOff: '#39393D',
};

// iOS text styles: [fontSize, lineHeight, fontWeight]. Line heights follow
// Apple's defaults at the standard Dynamic Type size.
const typography = {
  largeTitle: [34, 41, '700'],
  title2: [22, 28, '700'],
  title3: [20, 25, '600'],
  headline: [17, 22, '600'],
  body: [17, 22, '400'],
  subheadline: [15, 20, '400'],
  footnote: [13, 18, '400'],
  caption: [11, 13, '400'],
};

const radii = {
  input: 8,
  card: 12,
  button: 12,
  sheet: 14,
};

module.exports = { colors, typography, radii };
