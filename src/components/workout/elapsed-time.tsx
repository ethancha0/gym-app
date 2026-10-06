import { useEffect, useState } from 'react';

import { AppText } from '@/components/ui/text';
import { formatElapsed } from '@/domain/format';

/**
 * Live "12:34" timer. It's computed from the saved start time on every tick
 * (now − startedAt) instead of counting ticks: JS timers pause while the app
 * is in the background, so a tick counter would fall behind.
 */
export function ElapsedTime({ startedAt }: { startedAt: Date }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <AppText variant="headline" numeric>
      {formatElapsed(now - startedAt.getTime())}
    </AppText>
  );
}
