// Adapted from react-native-reusables' Button: variants rewritten for the
// iOS look in docs/HANDOFF.md §3 (primary / secondary / plain).
import { cva, type VariantProps } from 'class-variance-authority';
import { Pressable } from 'react-native';

import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

// `active:` maps to Pressable's pressed state (there is no :hover on touch).
const buttonVariants = cva('flex-row items-center justify-center gap-2 active:opacity-70', {
  variants: {
    variant: {
      primary: 'bg-accent',
      secondary: 'bg-surface-raised',
      plain: '',
    },
    size: {
      default: 'min-h-[50px] rounded-button px-5',
      // Pill-shaped, e.g. the "Finish" button in the nav bar.
      compact: 'min-h-[34px] rounded-full px-4',
    },
    // Gray buttons sitting on a card need one step lighter to stand out.
    onSurface: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [{ variant: 'secondary', onSurface: true, className: 'bg-surface-high' }],
  defaultVariants: {
    variant: 'primary',
    size: 'default',
    onSurface: false,
  },
});

const buttonTextVariants = cva('text-headline', {
  variants: {
    variant: {
      primary: 'text-on-accent',
      secondary: 'text-label',
      plain: 'text-accent font-normal',
    },
    size: {
      default: '',
      compact: 'text-subheadline font-semibold',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
});

// Extends the touch area of the 34pt compact button to the 44pt minimum
// without changing how it looks.
const COMPACT_HIT_SLOP = { top: 5, bottom: 5, left: 5, right: 5 };

type ButtonProps = React.ComponentProps<typeof Pressable> & VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, onSurface, hitSlop, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(
          buttonVariants({ variant, size, onSurface }),
          props.disabled && 'opacity-40',
          className,
        )}
        role="button"
        hitSlop={hitSlop ?? (size === 'compact' ? COMPACT_HIT_SLOP : undefined)}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
