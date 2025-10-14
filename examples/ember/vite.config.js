import { ember, extensions } from '@embroider/vite';

import { babel } from '@rollup/plugin-babel';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  plugins: [
    ember({
      // Only include tests in test mode
      ...(mode === 'test' && { test: true })
    }),
    babel({
      babelHelpers: 'inline',
      extensions
    })
  ]
}));
