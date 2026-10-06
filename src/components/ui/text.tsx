// Adapted from react-native-reusables' Text: shadcn variants replaced with the
// iOS type scale and color tokens from docs/HANDOFF.md §3.
import { Slot } from '@rn-primitives/slot';
import * as React from 'react';
import { Text as RNText, type Role } from 'react-native';

import { cn } from '@/lib/utils';

const VARIANTS = {
  largeTitle: 'text-largeTitle',
  title2: 'text-title2',
  title3: 'text-title3',
  headline: 'text-headline',
  body: 'text-body',
  subheadline: 'text-subheadline',
  footnote: 'text-footnote',
  caption: 'text-caption',
} as const;

const TONES = {
  primary: 'text-label',
  secondary: 'text-label-secondary',
  tertiary: 'text-label-tertiary',
  accent: 'text-accent',
  onAccent: 'text-on-accent',
  warning: 'text-warning',
} as const;

type TextVariant = keyof typeof VARIANTS;
type TextTone = keyof typeof TONES;

// Screen readers announce titles as headings.
const ROLE: Partial<Record<TextVariant, Role>> = {
  largeTitle: 'heading',
  title2: 'heading',
  title3: 'heading',
};

// React Native has no CSS cascade: a <Text> inside a <View> never inherits
// color or font from the View. Components like Button use this context to
// pass text classes down to whatever <AppText> ends up inside them.
const TextClassContext = React.createContext<string | undefined>(undefined);

type AppTextProps = React.ComponentProps<typeof RNText> & {
  variant?: TextVariant;
  tone?: TextTone;
  /** Tabular numbers: equal-width digits so columns of weights/reps line up. */
  numeric?: boolean;
  /** Render the child element instead, merging these text props into it. */
  asChild?: boolean;
};

function AppText({ className, asChild = false, variant, tone, numeric, ...props }: AppTextProps) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot : RNText;
  return (
    <Component
      // Later classes win (cn uses tailwind-merge), so precedence is:
      // defaults < classes from a parent (context) < explicit props < className.
      className={cn(
        VARIANTS.body,
        TONES.primary,
        textClass,
        variant && VARIANTS[variant],
        tone && TONES[tone],
        numeric && 'tabular-nums',
        className,
      )}
      role={variant ? ROLE[variant] : undefined}
      {...props}
    />
  );
}

export { AppText, TextClassContext };
export type { AppTextProps, TextTone, TextVariant };
