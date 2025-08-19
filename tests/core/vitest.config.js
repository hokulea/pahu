import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
// https://vitest.dev/config/
// https://vitest.dev/guide/browser/config.html
export default defineConfig({
  test: {
    typecheck: {
      enabled: true
    },
    setupFiles: ['vitest-browser-html', './-setup.ts'],
    // open: true,
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
      testerHtmlPath: 'index.html',
      instances: [
        // { browser: 'firefox' }
        { browser: 'chromium' },
        { browser: 'webkit' }
      ]
    }
  }
});
