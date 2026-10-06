// Proves the test toolchain works: Jest runs, TypeScript compiles, and the
// `@/` path alias from tsconfig.json resolves. Real domain tests arrive in Milestone 5.
import { APP_NAME } from '@/domain/constants';

describe('test setup', () => {
  it('runs TypeScript tests and resolves the @/ alias', () => {
    expect(APP_NAME).toBe('gym-app');
  });
});
