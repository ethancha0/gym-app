import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { View } from 'react-native';

import { Screen } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle } from '@/components/ui/check-circle';
import { Chip } from '@/components/ui/chip';
import { GroupedList, ListRow } from '@/components/ui/grouped-list';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { NumberField } from '@/components/ui/number-field';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Switch } from '@/components/ui/switch';
import { AppText, type TextVariant } from '@/components/ui/text';

// Dev-only screen that shows every component in every state, so we can check
// the design system on a real phone (and at large Dynamic Type sizes).
// Reached from Settings → Developer → Component Gallery.

const METRICS = ['Est. 1RM', 'Volume', 'Best Set'] as const;

const TYPE_SCALE: TextVariant[] = [
  'largeTitle',
  'title2',
  'title3',
  'headline',
  'body',
  'subheadline',
  'footnote',
  'caption',
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-3">
      <AppText variant="title3">{title}</AppText>
      {children}
    </View>
  );
}

export default function GalleryScreen() {
  const [warmups, setWarmups] = useState(true);
  const [notes, setNotes] = useState(false);
  const [metric, setMetric] = useState<(typeof METRICS)[number]>('Est. 1RM');
  const [setDone, setSetDone] = useState(true);
  const [weight, setWeight] = useState('190');
  const [reps, setReps] = useState('');
  const [plates, setPlates] = useState(false);

  return (
    <Screen contentContainerClassName="gap-8">
      <Section title="Type scale">
        {TYPE_SCALE.map((variant) => (
          <AppText key={variant} variant={variant}>
            {variant}
          </AppText>
        ))}
        <AppText tone="secondary">secondary tone</AppText>
        <AppText tone="tertiary">tertiary tone</AppText>
        <AppText tone="accent">accent tone</AppText>
        <AppText tone="warning">warning tone</AppText>
        {/* San Francisco already uses equal-width digits by default, so `numeric`
            looks the same here; it documents intent and guards against other fonts. */}
        <View>
          <AppText numeric>111.1 lb</AppText>
          <AppText numeric>888.8 lb</AppText>
        </View>
      </Section>

      <Section title="Buttons">
        <Button>
          <AppText>Start Workout</AppText>
        </Button>
        <Button variant="secondary">
          <AppText>Start Empty Workout</AppText>
        </Button>
        <Card className="gap-3">
          <AppText variant="footnote" tone="secondary">
            Secondary on a card (onSurface)
          </AppText>
          <Button variant="secondary" onSurface>
            <AppText>Dismiss</AppText>
          </Button>
        </Card>
        <View className="flex-row items-center gap-4">
          <Button variant="plain">
            <Icon name="plus" size={15} className="text-accent" />
            <AppText>Add Set</AppText>
          </Button>
          <Button size="compact">
            <AppText>Finish</AppText>
          </Button>
          <Button disabled>
            <AppText>Disabled</AppText>
          </Button>
        </View>
        <View className="flex-row items-center">
          <IconButton icon="plus" accessibilityLabel="Add routine" />
          <IconButton icon="ellipsis.circle" accessibilityLabel="Options" />
          <IconButton icon="mic.fill" accessibilityLabel="Dictate" />
        </View>
      </Section>

      <Section title="Card">
        <Card className="gap-1">
          <AppText variant="footnote" tone="secondary">
            UP NEXT
          </AppText>
          <AppText variant="title2">Push Day A</AppText>
          <AppText variant="subheadline" tone="secondary">
            6 exercises · ~55 min
          </AppText>
        </Card>
      </Section>

      <Section title="Grouped list">
        <GroupedList header="Current program" footer="Rows with a subtitle grow taller.">
          <ListRow
            title="Push Day A"
            subtitle="Bench, OHP, Incline DB, Dips"
            value="Mon"
            chevron
            onPress={() => {}}
            leading={<View className="h-2 w-2 rounded-full bg-accent" />}
          />
          <ListRow
            title="Pull Day A"
            subtitle="Rows, Pull-ups, Curls"
            value="Wed"
            chevron
            onPress={() => {}}
          />
          <ListRow title="Default rest" value="2:00" chevron onPress={() => {}} />
        </GroupedList>
        <GroupedList header="Include">
          <ListRow
            title="Warm-up sets"
            trailing={
              <Switch
                value={warmups}
                onValueChange={setWarmups}
                accessibilityLabel="Warm-up sets"
              />
            }
          />
          <ListRow
            title="Notes"
            trailing={<Switch value={notes} onValueChange={setNotes} accessibilityLabel="Notes" />}
          />
        </GroupedList>
      </Section>
      <Section title="Set row pieces">
        <View className="flex-row items-center gap-3 rounded-input bg-completed-row px-2 py-1">
          <AppText variant="headline" numeric className="w-6 text-center">
            1
          </AppText>
          <AppText tone="tertiary" numeric className="flex-1">
            185 × 8
          </AppText>
          <NumberField
            kind="weight"
            value={weight}
            onChangeText={setWeight}
            accessibilityLabel="Weight"
          />
          <NumberField
            kind="reps"
            value={reps}
            onChangeText={setReps}
            placeholder="8"
            accessibilityLabel="Reps"
          />
          <CheckCircle
            checked={setDone}
            onToggle={() => setSetDone((v) => !v)}
            accessibilityLabel="Complete set 1"
          />
        </View>
      </Section>

      <Section title="Chips">
        <View className="flex-row flex-wrap gap-2">
          <Chip label="45 × 10" />
          <Chip label="95 × 5" />
          <Chip label="135 × 3" />
          <Chip label="160 × 1" />
        </View>
        <View className="flex-row gap-2">
          <Chip label="Show plates" selected={plates} onPress={() => setPlates((v) => !v)} />
        </View>
      </Section>

      <Section title="Progress">
        <ProgressBar value={84 / 120} />
        <ProgressBar value={0.35} tone="warning" />
      </Section>

      <Section title="Segmented control">
        <SegmentedControl
          options={METRICS}
          value={metric}
          onChange={setMetric}
          accessibilityLabel="Chart metric"
        />
        <AppText variant="subheadline" tone="secondary">
          Selected: {metric}
        </AppText>
      </Section>

      <Section title="Bottom sheet">
        <Button variant="secondary" onPress={() => router.push('/gallery-sheet')}>
          <AppText>Open sheet</AppText>
        </Button>
      </Section>
    </Screen>
  );
}
