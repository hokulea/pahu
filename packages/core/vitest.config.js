import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    typecheck: {
      enabled: true
    },
    setupFiles: ['vitest-browser-html', './tests/-setup.ts'],
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['text', 'html', ['lcov', { projectRoot: '../../' }], 'json']
    },
    browser: {
      enabled: true,
      headless: true,
      screenshotFailures: false,
      provider: 'playwright',
      testerHtmlPath: 'tests/index.html',
      instances: [
        // { browser: 'firefox' }
        { browser: 'chromium' },
        { browser: 'webkit' }
      ]
    }
  }
});
