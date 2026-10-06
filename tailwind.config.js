const { colors, typography, radii } = require('./src/theme/tokens');

// Turn a typography token into Tailwind's fontSize tuple, so a single class
// (e.g. `text-headline`) sets size, line height, and weight together.
const fontSize = Object.fromEntries(
  Object.entries(typography).map(([name, [size, lineHeight, fontWeight]]) => [
    name,
    [`${size}px`, { lineHeight: `${lineHeight}px`, fontWeight }],
  ]),
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind only generates classes it finds in these files.
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Class names → tokens (docs/HANDOFF.md §3):
      //   bg-background, bg-surface, bg-surface-raised, bg-surface-high,
      //   border-separator, bg-accent / text-accent, text-on-accent,
      //   bg-completed-row, text-warning, bg-switch-off
      //   text-label (textPrimary), text-label-secondary, text-label-tertiary
      colors: {
        background: colors.background,
        surface: {
          DEFAULT: colors.surface,
          raised: colors.surfaceRaised,
          high: colors.surfaceHigh,
        },
        separator: colors.separator,
        label: {
          DEFAULT: colors.textPrimary,
          secondary: colors.textSecondary,
          tertiary: colors.textTertiary,
        },
        accent: colors.accent,
        'on-accent': colors.onAccent,
        'completed-row': colors.completedRow,
        warning: colors.warning,
        'switch-off': colors.switchOff,
      },
      fontSize,
      borderRadius: {
        input: `${radii.input}px`,
        card: `${radii.card}px`,
        button: `${radii.button}px`,
        sheet: `${radii.sheet}px`,
      },
    },
  },
  plugins: [],
};
