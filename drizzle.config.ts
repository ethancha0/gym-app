import { defineConfig } from 'drizzle-kit';

// Used only by `npm run db:generate` on your Mac (drizzle-kit), never by the app.
// It diffs src/db/schema.ts against the previous migrations and writes the
// SQL for the next one into src/db/migrations/.
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'sqlite',
  driver: 'expo',
});
