import { ember, extensions } from '@embroider/vite';
import { resolve } from 'node:path';

import { babel } from '@rollup/plugin-babel';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    ember(),
    babel({
      babelHelpers: 'inline',
      configFile: resolve(import.meta.dirname, './babel.config.js'),
      extensions
    })
  ]
});
