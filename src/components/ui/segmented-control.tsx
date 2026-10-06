import { Host, Picker, Text } from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';

type SegmentedControlProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  /** Read by VoiceOver to describe what the control switches. */
  accessibilityLabel: string;
};

/**
 * Apple's native segmented control, rendered by SwiftUI through @expo/ui.
 *
 * <Host> is the boundary between React Native and SwiftUI: outside it,
 * Flexbox lays things out; inside it, SwiftUI does. So no classNames here.
 * The control stretches to the width it's given, and `matchContents.vertical`
 * lets SwiftUI pick its natural height instead of us hard-coding one.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: SegmentedControlProps<T>) {
  return (
    <Host matchContents={{ vertical: true }} colorScheme="dark" style={{ alignSelf: 'stretch' }}>
      <Picker
        modifiers={[pickerStyle('segmented')]}
        label={accessibilityLabel}
        selection={value}
        onSelectionChange={(selection) => onChange(selection as T)}
      >
        {options.map((option) => (
          <Text key={option} modifiers={[tag(option)]}>
            {option}
          </Text>
        ))}
      </Picker>
    </Host>
  );
}
