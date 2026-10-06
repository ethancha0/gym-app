import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

import { typography } from '@/theme/tokens';

// tailwind-merge resolves conflicts ("p-2 p-4" → "p-4") by class prefix.
// Our custom font sizes share the `text-` prefix with colors, so without
// this it would treat `text-headline` and `text-label` as conflicting and
// drop one of them.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: Object.keys(typography) }],
    },
  },
});

/** Combine classNames: conditional parts via clsx, conflicts resolved by tailwind-merge. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
