import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from './schema';

// Opens (or creates) `gym.db`, a single file in the app's private storage on
// the phone. It survives app restarts and updates, and is deleted only when
// the app is uninstalled. Opening is synchronous, so `db` is ready at import time.
//
// enableChangeListener: SQLite notifies us after every write, which is what
// lets `useLiveQuery` re-render screens when data changes.
const sqlite = openDatabaseSync('gym.db', { enableChangeListener: true });

// PRAGMAs are SQLite settings. They're per connection, so they run on every launch.
// - WAL (write-ahead log): reads don't wait for writes, so it's faster
//   (recommended by the expo-sqlite docs).
// - foreign_keys: SQLite ignores FOREIGN KEY rules (cascade, restrict)
//   unless this is turned on.
sqlite.execSync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

/** Typed Drizzle client. Passing `schema` enables `db.query.<table>` relational queries. */
export const db = drizzle(sqlite, { schema });
