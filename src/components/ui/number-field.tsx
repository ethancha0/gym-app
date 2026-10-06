import { TextInput, type TextInputProps } from 'react-native';

import { cn } from '@/lib/utils';
import { colors } from '@/theme/tokens';

type NumberFieldProps = Omit<TextInputProps, 'keyboardType'> & {
  /** Weight allows decimals (e.g. 2.5 lb plates); reps are whole numbers. */
  kind: 'weight' | 'reps';
  /** Inside a sheet the background is one step lighter (surfaceHigh). */
  onSheet?: boolean;
};

/**
 * Weight / reps cell for set rows.
 *
 * Unlike a web <input type="number">, TextInput always holds a string; we
 * parse it when saving (Milestone 3). Note the iOS number pads have no
 * Return key, so dismissing the keyboard is handled at the screen level
 * (tap outside or a toolbar button), which is part of Milestone 3.
 */
export function NumberField({ kind, onSheet = false, className, ...props }: NumberFieldProps) {
  return (
    <TextInput
      keyboardType={kind === 'weight' ? 'decimal-pad' : 'number-pad'}
      // Select the old value on focus so typing replaces it.
      selectTextOnFocus
      // Placeholder color is a prop on TextInput, not a style.
      placeholderTextColor={colors.textTertiary}
      // Let Dynamic Type enlarge the text, but cap it so a narrow cell
      // doesn't overflow at the largest accessibility sizes.
      maxFontSizeMultiplier={1.6}
      className={cn(
        'h-11 min-w-[64px] rounded-input px-2 text-center text-body tabular-nums text-label',
        onSheet ? 'bg-surface-high' : 'bg-surface-raised',
        className,
      )}
      {...props}
    />
  );
}
