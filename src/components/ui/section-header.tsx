import { AppText } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type SectionHeaderProps = { title: string; className?: string };

/**
 * iOS inset-grouped section header: small uppercase gray label above a card.
 * Indented 16pt so it lines up with the text inside the card, not its edge.
 */
export function SectionHeader({ title, className }: SectionHeaderProps) {
  return (
    <AppText
      variant="footnote"
      tone="secondary"
      className={cn('px-4 pb-1.5 uppercase', className)}
      role="heading"
    >
      {title}
    </AppText>
  );
}
