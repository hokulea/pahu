import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['./tests/core'],
    coverage: {
      enabled: true,
      // include: ['src/**/*.ts'],
      provider: 'istanbul',
      reporter: ['text', 'html', 'lcov', 'json']
    }
  }
});
