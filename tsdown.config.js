import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/ember.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true
});
